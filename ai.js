   AI NURSING CHAT — Groq (OpenAI-compatible) + Subject Context
   ════════════════════════════════════════════ */
(function () {

  /* المفتاح بقى مخفي في Cloudflare Worker، الموقع بيكلم الـ Worker بس */
  const GROQ_URL = 'https://nurseverse-ai.kimoali426.workers.dev';

  let aiOpen    = false;
  let aiLoading = false;
  let aiHistory = [];   /* { role:'user'|'assistant', content:string }[] */

  /* ── DOM helpers ── */
  const $  = id => document.getElementById(id);
  const el = (tag, cls, html) => { const d = document.createElement(tag); if(cls) d.className=cls; if(html) d.innerHTML=html; return d; };

  /* ── Get current subject / year context from page state ── */
  function getPageContext() {
    try {
      const subjectView = document.getElementById('subjectView');
      if (subjectView && subjectView.classList.contains('active')) {
        const title = document.getElementById('subjectTitle');
        const desc  = document.getElementById('subjectDesc');
        if (title && title.textContent) {
          return {
            type: 'subject',
            name: title.textContent.trim(),
            desc: desc ? desc.textContent.trim() : '',
          };
        }
      }
      if (typeof currentYear !== 'undefined' && typeof years !== 'undefined') {
        const y = years[currentYear];
        const yearView = document.getElementById('yearView');
        if (y && yearView && yearView.classList.contains('active')) {
          return { type: 'year', name: y.title, desc: y.desc || '' };
        }
      }
    } catch(e) {}
    return null;
  }

  /* ── Get current subject's data object (slug, files, etc) ── */
  function getCurrentSubjectObj() {
    try {
      if (typeof currentYear === 'undefined' || typeof currentTerm === 'undefined' || typeof years === 'undefined') return null;
      const subjectView = document.getElementById('subjectView');
      if (!subjectView || !subjectView.classList.contains('active')) return null;
      const subjectTitle = document.getElementById('subjectTitle');
      if (!subjectTitle) return null;
      const name = subjectTitle.textContent.trim();
      const subjects = years[currentYear]?.terms[currentTerm] || [];
      return subjects.find(x => x.name === name) || null;
    } catch(e) { return null; }
  }

  /* ── Fetch real lecture text (.txt extracted from PDFs) for the open subject ──
     نتائج كل مادة بتتخزن في الكاش عشان مانكررش الـ fetch في كل رسالة */
  const lectureTextCache = {};
  const MAX_CHARS_PER_LECTURE = 1400;   // حد أقصى لكل محاضرة عشان نوفر التوكينز
  const MAX_TOTAL_CHARS       = 6000;   // حد أقصى لمجموع محتوى المادة كله

  async function getSubjectLectureTexts() {
    const s = getCurrentSubjectObj();
    if (!s) return '';

    if (lectureTextCache[s.slug] !== undefined) return lectureTextCache[s.slug];

    const basePath = `files/${currentYear}/${currentTerm}/${s.slug}`;
    const lectures = (s.files?.lectures || []);
    let combined = '';

    for (const f of lectures) {
      if (combined.length >= MAX_TOTAL_CHARS) break;
      const txtFile = f.file.replace(/\.pdf$/i, '.txt');
      const url = `${basePath}/lectures/${txtFile}`;
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        let text = await res.text();
        text = text.slice(0, MAX_CHARS_PER_LECTURE);
        combined += `\n\n--- ${f.title} ---\n${text}`;
      } catch (e) { /* الملف مش موجود لسه، تخطّاه عادي */ }
    }

    combined = combined.slice(0, MAX_TOTAL_CHARS);
    lectureTextCache[s.slug] = combined;
    return combined;
  }

  /* ── Get lecture titles from current open subject ── */
  function getLectureTitles() {
    try {
      if (typeof currentYear === 'undefined' || typeof currentTerm === 'undefined' || typeof years === 'undefined') return [];
      const subjectView = document.getElementById('subjectView');
      if (!subjectView || !subjectView.classList.contains('active')) return [];
      const subjectTitle = document.getElementById('subjectTitle');
      if (!subjectTitle) return [];
      const name = subjectTitle.textContent.trim();
      const subjects = years[currentYear]?.terms[currentTerm] || [];
      const s = subjects.find(x => x.name === name);
      if (!s) return [];
      const lectures   = (s.files?.lectures   || []).map(f => f.title);
      const summaries  = (s.files?.summaries  || []).map(f => f.title);
      const mcq        = (s.files?.mcq        || []).map(f => f.title);
      const flashcards = (s.files?.flashcards || []).map(f => f.title);
      return { lectures, summaries, mcq, flashcards };
    } catch(e) { return {}; }
  }

  /* ── Update context bar ── */
  function updateContextBar() {
    const ctx = getPageContext();
    if (ctx) {
      $('aiContextLabel').textContent = ctx.name;
      $('aiContextBar').classList.add('show');
    } else {
      $('aiContextBar').classList.remove('show');
    }
    return ctx;
  }

  /* ── Build system prompt ── */
  async function buildSystemPrompt() {
    const ctx    = getPageContext();
    const files  = getLectureTitles();

    let contextBlock = '';
    if (ctx && ctx.type === 'subject') {
      contextBlock = `
الطالب دلوقتي بيدرس مادة: "${ctx.name}"
وصف المادة: ${ctx.desc}
`;
      if (files.lectures && files.lectures.length) {
        contextBlock += `\nالمحاضرات المتاحة في المادة:\n- ${files.lectures.join('\n- ')}`;
      }
      if (files.summaries && files.summaries.length) {
        contextBlock += `\n\nالملخصات المتاحة:\n- ${files.summaries.join('\n- ')}`;
      }
      if (files.mcq && files.mcq.length) {
        contextBlock += `\n\nأسئلة MCQ المتاحة:\n- ${files.mcq.join('\n- ')}`;
      }

      /* ── محتوى المحاضرات الفعلي (مستخرج بـ OCR من PDF) ── */
      const lectureText = await getSubjectLectureTexts();
      if (lectureText) {
        contextBlock += `\n\nمحتوى حقيقي من المحاضرات (نص مستخرج، ممكن فيه أخطاء OCR بسيطة، استخدمه عشان تجاوب بدقة بناءً على المحتوى الفعلي):${lectureText}`;
      }

      contextBlock += `\n\nلما الطالب يسأل سؤال عام، افترض إنه عن المادة دي وعن موضوعاتها. لو سألك عن موضوع من المحاضرات دي، استخدم المحتوى الفعلي المذكور فوق لو موجود، واشرحه بالتفصيل.`;
    } else if (ctx && ctx.type === 'year') {
      contextBlock = `\nالطالب في ${ctx.name}. ساعده في مواد السنة دي.`;
    }

    return `أنت مساعد تمريض ذكي اسمك "Nurse AI" مخصص لطلبة كلية التمريض في مصر.

قواعدك الأساسية:
- رد دايماً بنفس لغة السؤال: عربي مع عربي، إنجليزي مع إنجليزي.
- لو السؤال خليط، رد بالعربي.
- ركز على المحتوى الطبي والتمريضي العلمي الدقيق.
- استخدم نقاط مرتبة وبولد للعناوين المهمة.
- لو طلب MCQ: اعمل سؤال واضح مع 4 خيارات (A-D) واكشف الإجابة الصح بعد ما تحددها.
- لو طلب شرح محاضرة: اشرح محتواها بالتفصيل بناءً على اسمها وموضوعها.
- لو طلب ملخص: لخص الموضوع في نقاط واضحة.
- كن ودود وشجع الطالب دايماً.
- لا تخرج عن نطاق التمريض والطب والعلوم الصحية.
${contextBlock}`;
  }

  /* ── Render markdown-ish text to HTML ── */
  function mdToHtml(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const lines = text.split('\n');
    let out = '', inList = false;
    lines.forEach(line => {
      const bullet = line.match(/^[\-\*•]\s+(.*)/);
      const num    = line.match(/^\d+\.\s+(.*)/);
      if (bullet || num) {
        if (!inList) { out += '<ul>'; inList = true; }
        out += `<li>${(bullet||num)[1]}</li>`;
      } else {
        if (inList) { out += '</ul>'; inList = false; }
        if (line.trim()) out += `<p>${line}</p>`;
      }
    });
    if (inList) out += '</ul>';
    return out || `<p>${text}</p>`;
  }

  /* ── Append a message bubble ── */
  function appendMsg(role, html) {
    const msgs = $('aiMessages');
    const div  = el('div', `ai-msg ${role === 'model' ? 'bot' : 'user'}`, html);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  /* ── Call Groq API — with streaming ── */
  async function callGemini(userText) {
    aiHistory.push({ role: 'user', content: userText });

    const body = {
      messages: [
        { role: 'system', content: await buildSystemPrompt() },
        ...aiHistory.slice(-16)
      ],
      max_tokens: 1024,
      temperature: 0.7,
      stream: true,
    };

    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }

    /* ── Streaming render ── */
    const msgs = $('aiMessages');
    const bubble = el('div', 'ai-msg bot streaming');
    const content = el('div', 'ai-msg-content');
    bubble.appendChild(content);
    msgs.appendChild(bubble);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let rawAccumulated = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        rawAccumulated += chunk;
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullText += delta;
              content.innerHTML = mdToHtml(fullText);
              msgs.scrollTop = msgs.scrollHeight;
            }
          } catch(e) { /* partial chunk */ }
        }
      }
    } catch(streamErr) {
      /* stream ended or network issue — use what we got */
    }

    /* If SSE parsing produced nothing, the worker likely returned a plain
       (non-streaming) JSON body instead of SSE. Parse the raw text we
       already accumulated — do NOT call res.json() again, the body
       stream has already been consumed by the reader above. */
    if (!fullText && rawAccumulated) {
      try {
        const fallback = JSON.parse(rawAccumulated);
        fullText = fallback.choices?.[0]?.message?.content
                || fallback.choices?.[0]?.delta?.content
                || fallback.content
                || '';
      } catch(e) {
        /* not JSON either — last resort: show raw text if it looks like content */
        fullText = rawAccumulated.trim();
      }
      if (fullText) content.innerHTML = mdToHtml(fullText);
    }

    if (!fullText) {
      fullText = 'حصل خطأ في الاتصال بالمساعد الذكي، حاول تاني بعد لحظات. 🙏';
      content.innerHTML = mdToHtml(fullText);
    }

    /* Add copy button to finished bubble */
    bubble.classList.remove('streaming');
    const copyBtn = el('button', 'ai-msg-copy', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>');
    copyBtn.title = 'نسخ';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(fullText).then(() => {
        copyBtn.innerHTML = '✓';
        setTimeout(() => { copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'; }, 1500);
      });
    };
    bubble.appendChild(copyBtn);

    aiHistory.push({ role: 'assistant', content: fullText });
    return fullText;
  }

  /* ── Send message ── */
  window.aiSendMessage = async function(override) {
    if (aiLoading) return;
    const input = $('aiInput');
    const text  = (override || input.value).trim();
    if (!text) return;

    // ── Server-side check: AI on/off + daily quota (Firestore-backed, can't be bypassed by clearing localStorage) ──
    if (window._checkAIQuota) {
      const quota = await window._checkAIQuota();
      if (!quota.allowed) {
        if (quota.reason === 'disabled') {
          appendMsg('model', `<p>🛠️ ${quota.settings.maintenanceMessage}</p>`);
        } else if (quota.reason === 'limit') {
          appendMsg('model', `<p>⏳ خلصت عدد الرسايل المسموح بيها النهاردة (${quota.settings.dailyLimit} رسالة). حاول تاني بكرة 🙏</p>`);
        }
        if (!aiOpen) $('aiFabBadge').classList.add('show');
        return;
      }
    }

    input.value = '';
    aiAutoResize(input);
    $('aiSendBtn').disabled = true;
    aiLoading = true;
    $('aiQuickPrompts').style.display = 'none';

    appendMsg('user', `<p>${text.replace(/</g,'&lt;')}</p>`);
    updateContextBar();

    const typing = $('aiTyping');
    typing.classList.add('show');
    $('aiMessages').scrollTop = $('aiMessages').scrollHeight;

    try {
      await callGemini(text); /* streaming: bubble appended inside callGemini */
      typing.classList.remove('show');
      if (!aiOpen) $('aiFabBadge').classList.add('show');
      if (window._recordAIUsage) window._recordAIUsage();
    } catch(e) {
      typing.classList.remove('show');
      const msg = e.message.includes('Invalid API Key') || e.message.includes('401')
        ? '⚠️ الـ API Key مش صح. اتأكد إنك حطيت الـ Key الصح في الكود.'
        : `⚠️ حصل خطأ: ${e.message}`;
      appendMsg('model', `<p>${msg}</p>`);
    } finally {
      aiLoading = false;
      $('aiSendBtn').disabled = false;
      input.focus();
    }
  };

  window.aiSendQuick = txt => window.aiSendMessage(txt);

  /* ── Toggle panel ── */
  window.toggleAIChat = function() {
    aiOpen = !aiOpen;
    $('aiChatPanel').classList.toggle('open', aiOpen);
    $('aiFab').classList.toggle('open', aiOpen);
    if (aiOpen) {
      $('aiFabBadge').classList.remove('show');
      updateContextBar();
      setTimeout(() => $('aiInput').focus(), 300);
    }
  };

  /* ── Clear chat ── */
  window.aiClearChat = function() {
    aiHistory = [];
    $('aiMessages').innerHTML = '';
    $('aiQuickPrompts').style.display = 'flex';
    showWelcome();
  };

  /* ── Auto-resize textarea ── */
  window.aiAutoResize = function(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  };

  /* ── Enter = send, Shift+Enter = newline ── */
  window.aiHandleKey = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); window.aiSendMessage(); }
  };

  /* ── Welcome message ── */
  function showWelcome() {
    const ctx = getPageContext();
    const subjectLine = ctx
      ? `<br><span style="font-size:12px;color:#0F6E56;font-weight:600;">📚 شايف إنك بتدرس: ${ctx.name}</span>`
      : '';
    appendMsg('model',
      `<p>👋 أهلاً! أنا مساعدك في التمريض.</p>
       <p>اسألني أي سؤال، اطلب شرح محاضرة، MCQ، أو ملخص.${subjectLine}</p>
       <p style="font-size:11.5px;color:rgba(14,28,22,0.5);margin-top:6px;">I also answer in English — just ask!</p>`
    );
  }

  /* ── Hook into page navigation to update context ── */
  const _origOpenSubject = window.openSubject;
  if (typeof _origOpenSubject === 'function') {
    window.openSubject = function(...args) {
      _origOpenSubject.apply(this, args);
      setTimeout(updateContextBar, 150);
    };
  }
  const _origGoHome = window.goHome;
  if (typeof _origGoHome === 'function') {
    window.goHome = function(...args) {
      _origGoHome.apply(this, args);
      setTimeout(updateContextBar, 150);
    };
  }
  const _origOpenYear = window.openYear;
  if (typeof _origOpenYear === 'function') {
    window.openYear = function(...args) {
      _origOpenYear.apply(this, args);
      setTimeout(updateContextBar, 150);
    };
  }

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showWelcome);
  } else {
    showWelcome();
  }

})();
