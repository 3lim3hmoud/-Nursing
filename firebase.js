import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, collection, addDoc, query, where, orderBy, onSnapshot, limit, getDocs, arrayUnion }
  from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getMessaging, getToken, onMessage }
  from "https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL }
  from "https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBJGf-9KbQF-aCi3iH9rDxmF4xxgrpc_UI",
  authDomain: "nursing-hub-bb7e9.firebaseapp.com",
  projectId: "nursing-hub-bb7e9",
  storageBucket: "nursing-hub-bb7e9.firebasestorage.app",
  messagingSenderId: "484923512052",
  appId: "1:484923512052:web:738ee4a6762b5895b93aa1"
};

const fbApp = initializeApp(firebaseConfig);
const auth  = getAuth(fbApp);
const db    = getFirestore(fbApp);
const storage = getStorage(fbApp);
const provider = new GoogleAuthProvider();

/* ─── FCM Messaging ─── */
const VAPID_KEY = 'BGXT7Av6C-wndzNt_C7cbz5uCc_rd-o96WMYsfiVNH46GvajdNHKw3OliVd0JeBrpgylIZa6u_HYAUmOfPxqe0c';
let messaging = null;
try { messaging = getMessaging(fbApp); } catch(e) {}

async function requestFCMToken(uid) {
  if (!messaging) return;
  try {
    // Register the FCM service worker first
    const reg = await navigator.serviceWorker.register('./firebase-messaging-sw.js', { scope: '/' });
    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
    if (token) {
      // Save token to Firestore under students/{uid}
      await setDoc(doc(db, 'students', uid), { fcmToken: token }, { merge: true });
    }
  } catch(e) { console.warn('FCM token error:', e); }
}

// Handle foreground messages (app is open)
if (messaging) {
  onMessage(messaging, (payload) => {
    const notif = {
      id: payload.messageId || Date.now().toString(),
      title: payload.notification?.title || payload.data?.title || '🔔 إشعار جديد',
      body:  payload.notification?.body  || payload.data?.body  || '',
      type:  payload.data?.type || 'info',
      ts: Date.now(),
    };
    if (window.pushNotification) window.pushNotification(notif);
  });
}

let currentUser = null;
/* Flags so any favorite/recent/viewed action taken before Firebase
   confirms the signed-in user still gets synced once it does. */
let pendingFavoritesSync = false;
let pendingRecentSync = false;
let pendingViewedSync = false;

/* ─── Sign In ─── */
window.signInWithGoogle = async function() {
  const btn = document.getElementById('googleSignInBtn');
  btn.disabled = true; btn.textContent = 'Signing in…';
  try {
    await signInWithPopup(auth, provider);
    window.closeAuthModal();
  } catch(e) {
    btn.disabled = false;
    btn.textContent = 'Try again — popup was blocked';
  }
};

/* ─── Sign Out ─── */
window.signOutUser = async function() {
  await signOut(auth);
  document.getElementById('userPopover').classList.remove('open');
  document.getElementById('dashboardPanel').classList.remove('open');
};

/* ─── Auth State ─── */
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  const identityBlock = document.getElementById('popoverIdentityBlock');
  const accountSection = document.getElementById('popoverAccountSection');
  const guestSection = document.getElementById('popoverGuestSection');
  if (user) {
    document.getElementById('signInBtn').style.display = 'none';
    if (identityBlock) identityBlock.style.display = '';
    if (accountSection) accountSection.style.display = '';
    if (guestSection) guestSection.style.display = 'none';
    const name = user.displayName || user.email || '?';
    const initials = name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
    document.getElementById('userInitials').textContent = initials;
    document.getElementById('popoverName').textContent = name;
    document.getElementById('popoverEmail').textContent = user.email || '';
    await syncProgress(user.uid);
    flushPendingSyncs(user.uid);
    updateStats();
    // Request FCM push token and save it
    requestFCMToken(user.uid);
  } else {
    document.getElementById('signInBtn').style.display = '';
    document.getElementById('userInitials').textContent = '?';
    if (identityBlock) identityBlock.style.display = 'none';
    if (accountSection) accountSection.style.display = 'none';
    if (guestSection) guestSection.style.display = '';
  }
});

/* ─── Sync progress localStorage ↔ Firestore ─── */
async function syncProgress(uid) {
  const local = window.getViewedSet ? window.getViewedSet() : new Set();
  const localFavorites = window.getFavoritesMap ? window.getFavoritesMap() : {};
  const localRecents = window.getRecentList ? window.getRecentList() : [];
  const ref = doc(db, 'students', uid);
  try {
    const snap = await (window._getCachedStudent
      ? window._getCachedStudent(getDoc, ref)
      : getDoc(ref));
    if (snap.exists()) {
      const data = snap.data();
      const remote = new Set(data.viewedFiles || []);
      const merged = new Set([...remote, ...local]);

      const remoteFavorites = data.favorites || {};
      const mergedFavorites = { ...remoteFavorites, ...localFavorites };

      const recentsByUrl = new Map();
      [...(data.recentFiles || []), ...localRecents].forEach(m => {
        const existing = recentsByUrl.get(m.url);
        if (!existing || (m.ts || 0) > (existing.ts || 0)) recentsByUrl.set(m.url, m);
      });
      const mergedRecents = [...recentsByUrl.values()]
        .sort((a, b) => (b.ts || 0) - (a.ts || 0))
        .slice(0, 30);

      // Merge fileOpenLog: combine remote + local, keep earliest ts per URL
      const remoteTimesMap = window.fileOpenLogToMap ? window.fileOpenLogToMap(data.fileOpenLog) : {};
      const localTimesMap  = window.getFileOpenTimesMap ? window.getFileOpenTimesMap() : {};
      const mergedTimesMap = { ...remoteTimesMap };
      Object.entries(localTimesMap).forEach(([url, ts]) => {
        if (!mergedTimesMap[url] || ts < mergedTimesMap[url]) mergedTimesMap[url] = ts;
      });
      if (window.saveFileOpenTimesMap) window.saveFileOpenTimesMap(mergedTimesMap);
      const fileOpenLog = window.fileOpenMapToLog ? window.fileOpenMapToLog(mergedTimesMap) : [];

      await updateDoc(ref, {
        viewedFiles: [...merged],
        favorites: mergedFavorites,
        recentFiles: mergedRecents,
        fileOpenLog,
        lastSeen: serverTimestamp(),
        displayName: auth.currentUser.displayName || '',
        email: auth.currentUser.email || '',
      });
      if (window._invalidateStudentCache) window._invalidateStudentCache();
      localStorage.setItem('nurseverse_viewed_files_v1', JSON.stringify([...merged]));
      if (window.saveFavoritesMap) window.saveFavoritesMap(mergedFavorites);
      if (window.saveRecentList) window.saveRecentList(mergedRecents);
      if (window.refreshProgressUI) window.refreshProgressUI();
      if (window.renderDashboardFavorites) window.renderDashboardFavorites();
      if (window.renderDashboardRecents) window.renderDashboardRecents();
      if (window.renderFavoritesView) window.renderFavoritesView();
    } else {
      const initFileOpenLog = window.fileOpenMapToLog ? window.fileOpenMapToLog(window.getFileOpenTimesMap()) : [];
      await setDoc(ref, {
        viewedFiles: [...local],
        favorites: localFavorites,
        recentFiles: localRecents,
        fileOpenLog: initFileOpenLog,
        displayName: auth.currentUser.displayName || '',
        email: auth.currentUser.email || '',
        joinedAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
      });
    }
    document.getElementById('dashSyncStatus').textContent = '✓';
  } catch(e) {
    document.getElementById('dashSyncStatus').textContent = '!';
  }
}

/* ─── Flush actions that happened before auth confirmed ─── */
function flushPendingSyncs(uid) {
  const ref = doc(db, 'students', uid);
  if (pendingViewedSync) {
    const viewed = window.getViewedSet ? [...window.getViewedSet()] : [];
    const fileOpenLog = window.fileOpenMapToLog ? window.fileOpenMapToLog(window.getFileOpenTimesMap()) : [];
    updateDoc(ref, { viewedFiles: viewed, fileOpenLog, lastSeen: serverTimestamp() }).catch(()=>{});
    pendingViewedSync = false;
  }
  if (pendingFavoritesSync) {
    const favorites = window.getFavoritesMap ? window.getFavoritesMap() : {};
    updateDoc(ref, { favorites, lastSeen: serverTimestamp() }).catch(()=>{});
    pendingFavoritesSync = false;
  }
  if (pendingRecentSync) {
    const recentFiles = window.getRecentList ? window.getRecentList() : [];
    updateDoc(ref, { recentFiles, lastSeen: serverTimestamp() }).catch(()=>{});
    pendingRecentSync = false;
  }
}

/* ─── File Open Times — first-open timestamp per file ─── */
/* Stored locally as { [url]: timestampMs } and synced to Firestore
   as fileOpenLog: [{url, ts}] so the admin export can show "opened at". */
const FILE_OPEN_TIMES_KEY = 'nurseverse_file_open_times_v1';
window.getFileOpenTimesMap = function() {
  try { return JSON.parse(localStorage.getItem(FILE_OPEN_TIMES_KEY) || '{}'); } catch(e) { return {}; }
};
window.saveFileOpenTimesMap = function(map) {
  try { localStorage.setItem(FILE_OPEN_TIMES_KEY, JSON.stringify(map)); } catch(e) {}
};
/* [{url, ts}] Firestore array  →  {url: ms} plain map */
window.fileOpenLogToMap = function(arr) {
  const map = {};
  if (!Array.isArray(arr)) return map;
  arr.forEach(entry => {
    if (!entry || !entry.url) return;
    const ms = entry.ts?.toMillis ? entry.ts.toMillis()
              : (typeof entry.ts === 'number' ? entry.ts : 0);
    if (!map[entry.url] || ms < map[entry.url]) map[entry.url] = ms;
  });
  return map;
};
/* {url: ms} map  →  [{url, ts}] array for Firestore */
window.fileOpenMapToLog = function(map) {
  return Object.entries(map || {}).map(([url, ts]) => ({ url, ts }));
};

/* ─── Intercept markFileViewed / toggleFavorite / trackRecent ─── */
/* Wrapped in a function called immediately so the original functions on
   window are guaranteed to be set (this module script now lives inside
   <body>, after the non-module scripts that define them). */
function installInterceptors() {
  const _orig = window.markFileViewed;
  window.markFileViewed = function(url, linkEl) {
    if (_orig) _orig(url, linkEl);
    // Record first-open timestamp locally (only on first visit)
    const times = window.getFileOpenTimesMap();
    if (!times[url]) {
      times[url] = Date.now();
      window.saveFileOpenTimesMap(times);
    }
    if (currentUser) {
      const viewed = window.getViewedSet ? [...window.getViewedSet()] : [];
      const fileOpenLog = window.fileOpenMapToLog(window.getFileOpenTimesMap());
      const ref = doc(db, 'students', currentUser.uid);
      updateDoc(ref, { viewedFiles: viewed, lastSeen: serverTimestamp(), fileOpenLog }).catch(()=>{});
      updateStats();
    } else { pendingViewedSync = true; }
  };

  const _origToggleFavorite = window.toggleFavorite;
  window.toggleFavorite = function(metaJson, btnEl) {
    if (_origToggleFavorite) _origToggleFavorite(metaJson, btnEl);
    if (currentUser) {
      const favorites = window.getFavoritesMap ? window.getFavoritesMap() : {};
      const ref = doc(db, 'students', currentUser.uid);
      updateDoc(ref, { favorites, lastSeen: serverTimestamp() }).catch(()=>{});
    } else { pendingFavoritesSync = true; }
  };

  const _origTrackRecent = window.trackRecent;
  window.trackRecent = function(metaJson) {
    if (_origTrackRecent) _origTrackRecent(metaJson);
    if (currentUser) {
      const recentFiles = window.getRecentList ? window.getRecentList() : [];
      const ref = doc(db, 'students', currentUser.uid);
      updateDoc(ref, { recentFiles, lastSeen: serverTimestamp() }).catch(()=>{});
    } else { pendingRecentSync = true; }
  };
}
installInterceptors();

/* ─── Stats ─── */
function updateStats() {
  const viewed = window.getViewedSet ? window.getViewedSet() : new Set();
  let total = 0;
  if (window.years) {
    Object.keys(window.years).forEach(yk => {
      ['term1','term2'].forEach(term => {
        (window.years[yk].terms[term] || []).forEach(s => {
          Object.values(s.files || {}).forEach(arr => { total += arr.length; });
        });
      });
    });
  }
  if (window.practicalSubjects) {
    Object.keys(window.practicalSubjects).forEach(yk => {
      ['term1','term2'].forEach(term => {
        ((window.practicalSubjects[yk] || {})[term] || []).forEach(s => {
          Object.values(s.files || {}).forEach(arr => { total += arr.length; });
        });
      });
    });
  }
  const pct = total ? Math.round((viewed.size / total) * 100) : 0;

  document.getElementById('popoverFilesCount').textContent = viewed.size;
  document.getElementById('popoverPctCount').textContent   = pct + '%';
  document.getElementById('dashFilesOpened').textContent   = viewed.size;
  document.getElementById('dashOverallPct').textContent    = pct + '%';

  if (currentUser) {
    const name = currentUser.displayName || 'Student';
    document.getElementById('dashName').textContent  = name;
    document.getElementById('dashEmail').textContent = currentUser.email || '';
    document.getElementById('dashAvatar').textContent =
      name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
  }

  // per-year bars
  if (window.years && window.practicalSubjects && window.subjectProgress) {
    const yData = [
      { key:'y1', label:'First Year',  icon:'🟢' },
      { key:'y2', label:'Second Year', icon:'🔵' },
      { key:'y3', label:'Third Year',  icon:'🟠' },
    ];
    document.getElementById('dashYearProgress').innerHTML = yData.map(y => {
      let seen=0, tot=0;
      ['term1','term2'].forEach(term => {
        (window.years[y.key].terms[term]||[]).forEach(s => {
          const p = window.subjectProgress(s, `files/${y.key}/${term}/${s.slug}`);
          seen+=p.seen; tot+=p.total;
        });
        ((window.practicalSubjects[y.key]||{})[term]||[]).forEach(s => {
          const p = window.subjectProgress(s, `files/${y.key}/practical/${term}/${s.slug}`);
          seen+=p.seen; tot+=p.total;
        });
      });
      const p = tot ? Math.round((seen/tot)*100) : 0;
      return `<div class="dash-progress-item">
        <span class="dash-progress-icon">${y.icon}</span>
        <div class="dash-progress-info">
          <div class="dash-progress-name">${y.label}</div>
          <div class="dash-progress-bar-wrap"><div class="dash-progress-bar" style="width:${p}%"></div></div>
        </div>
        <span class="dash-progress-pct">${p}%</span>
      </div>`;
    }).join('');
  }
}
window._authUpdateStats = updateStats;

/* ══════════════════════ NOTIFICATIONS (Firestore) ══════════════════════ */

const ADMIN_EMAIL = 'kimoali426@gmail.com';
window.ADMIN_EMAIL_REF = ADMIN_EMAIL;

/* Listen for new notifications — shows global ones + ones targeted to this user.
   Split into two queries (instead of one unfiltered query + client-side filtering)
   so Firestore rules can actually enforce, on the server, that a user only ever
   receives notifications meant for everyone or for them specifically.
   NOTE: orderBy is intentionally omitted here — where(targetUid) + orderBy(ts)
   on two different fields requires a composite index in Firestore, and without
   that index the query silently fails (no error visible without DevTools open,
   notifications simply never arrive). We sort client-side instead, which needs
   no index at all. */
function startNotifListener(uid) {
  function handleSnap(snap) {
    const docs = snap.docChanges().filter(c => c.type === 'added').map(c => c.doc);
    docs.sort((a, b) => {
      const ta = a.data().ts?.toMillis ? a.data().ts.toMillis() : 0;
      const tb = b.data().ts?.toMillis ? b.data().ts.toMillis() : 0;
      return ta - tb; // oldest first, so they push in chronological order
    });
    docs.forEach(d => {
      const data = d.data();
      const notif = {
        id: d.id,
        title: data.title || '',
        body: data.body || '',
        type: data.type || 'info',
        ts: data.ts?.toMillis ? data.ts.toMillis() : Date.now(),
      };
      if (window.pushNotification) window.pushNotification(notif);
    });
  }
  const qGlobal = query(collection(db, 'notifications'), where('targetUid', '==', null), limit(50));
  const qMine = query(collection(db, 'notifications'), where('targetUid', '==', uid), limit(50));
  onSnapshot(qGlobal, handleSnap);
  onSnapshot(qMine, handleSnap);
}

/* Admin: send notification — targetUid=null means send to everyone */
window._sendAdminNotifToFirestore = async function({ title, body, type, targetUid }) {
  await addDoc(collection(db, 'notifications'), {
    title, body, type,
    targetUid: targetUid || null,
    ts: serverTimestamp(),
    sentBy: auth.currentUser?.email || '',
  });
};

/* Admin: load all registered students */
window._loadStudentsList = async function() {
  try {
    const snap = await (window._getCachedStudentsList
      ? window._getCachedStudentsList(getDocs, collection(db, 'students'))
      : getDocs(collection(db, 'students')));
    const students = [];
    snap.forEach(d => {
      const data = d.data();
      students.push({ uid: d.id, displayName: data.displayName||'', email: data.email||'' });
    });
    students.sort((a,b) => (a.displayName||'').localeCompare(b.displayName||''));
    window.allStudents = students;
    const countEl = document.getElementById('studentsCount');
    if (countEl) countEl.textContent = students.length;
    if (window.renderStudentsListIn) {
      window.renderStudentsListIn('adminStudentsList', students, true);
      window.renderStudentsListIn('adminAllStudentsList', students, false);
    }
  } catch(e) { console.error('load students failed', e); }
};

/* ══════════════════════ AI CONTROL (Firestore) ══════════════════════
   config/ai_settings        → { enabled, dailyLimit, maintenanceMessage }
   ai_usage/{uid}_{YYYY-MM-DD} → { uid, name, email, date, count, exceeded, exceededAt }
   Checked server-side (Firestore) rather than localStorage so a student
   can't bypass the limit by clearing browser storage. */

const AI_SETTINGS_DOC = () => doc(db, 'config', 'ai_settings');

function _todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

/* cached locally after first load so every AI message doesn't refetch settings */
window._aiSettingsCache = null;

window._getAISettings = async function() {
  if (window._aiSettingsCache) return window._aiSettingsCache;
  try {
    const snap = await getDoc(AI_SETTINGS_DOC());
    const data = snap.exists() ? snap.data() : {};
    window._aiSettingsCache = {
      enabled: data.enabled !== false,          // default: on
      dailyLimit: data.dailyLimit || 30,         // default: 30 msgs/day
      maintenanceMessage: data.maintenanceMessage || 'المساعد الذكي تحت الصيانة دلوقتي، حاول تاني بعد شوية 🙏',
    };
  } catch(e) {
    window._aiSettingsCache = { enabled: true, dailyLimit: 30, maintenanceMessage: 'المساعد الذكي تحت الصيانة دلوقتي، حاول تاني بعد شوية 🙏' };
  }
  return window._aiSettingsCache;
};

/* Admin panel: load current settings into the form */
window._loadAISettings = async function() {
  window._aiSettingsCache = null; // force fresh read for the admin
  const s = await window._getAISettings();
  document.getElementById('aiEnabledToggle').checked = s.enabled;
  document.getElementById('aiDailyLimitInput').value = s.dailyLimit;
  document.getElementById('aiMaintenanceMsgInput').value = s.maintenanceMessage;
  _renderAIStatusPill(s.enabled);
  document.getElementById('aiSettingsLoading').style.display = 'none';
  document.getElementById('aiSettingsContent').style.display = 'block';
  loadAIUsageToday();
};

function _renderAIStatusPill(enabled) {
  const pill = document.getElementById('aiStatusPill');
  if (!pill) return;
  pill.textContent = enabled ? 'شغال ✓' : 'متوقف ⛔';
  pill.className = 'ai-status-pill ' + (enabled ? 'on' : 'off');
}

/* Toggle fires immediately (no need to press "save") so an admin can kill
   the AI fast if something's going wrong, without filling the rest of the form. */
window.onAIEnabledToggle = async function(checked) {
  _renderAIStatusPill(checked);
  try {
    await setDoc(AI_SETTINGS_DOC(), { enabled: checked, updatedAt: serverTimestamp(), updatedBy: auth.currentUser?.email || '' }, { merge: true });
    window._aiSettingsCache = null;
  } catch(e) {
    document.getElementById('aiSettingsSaveStatus').textContent = '⚠️ حصل خطأ، حاول تاني';
  }
};

window.saveAISettings = async function() {
  const btn = document.getElementById('aiSettingsSaveBtn');
  const statusEl = document.getElementById('aiSettingsSaveStatus');
  const limitVal = parseInt(document.getElementById('aiDailyLimitInput').value, 10);
  const msgVal = document.getElementById('aiMaintenanceMsgInput').value.trim();

  if (!limitVal || limitVal < 1) {
    statusEl.textContent = '⚠️ اكتب رقم صحيح للحد اليومي';
    statusEl.style.color = '#c0392b';
    return;
  }
  if (!msgVal) {
    statusEl.textContent = '⚠️ رسالة الصيانة لازم تكون مكتوبة';
    statusEl.style.color = '#c0392b';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'بيتم الحفظ...';
  try {
    await setDoc(AI_SETTINGS_DOC(), {
      enabled: document.getElementById('aiEnabledToggle').checked,
      dailyLimit: limitVal,
      maintenanceMessage: msgVal,
      updatedAt: serverTimestamp(),
      updatedBy: auth.currentUser?.email || '',
    }, { merge: true });
    window._aiSettingsCache = null;
    statusEl.style.color = '#0F6E56';
    statusEl.textContent = '✓ تم حفظ الإعدادات بنجاح';
  } catch(e) {
    statusEl.style.color = '#c0392b';
    statusEl.textContent = '⚠️ حصل خطأ في الحفظ، حاول تاني';
  } finally {
    btn.disabled = false;
    btn.textContent = 'حفظ الإعدادات 💾';
    setTimeout(() => { statusEl.textContent = ''; }, 4000);
  }
};

/* ─── Per-student daily quota check, called before every AI request ───
   Returns { allowed: bool, reason: 'disabled'|'limit'|null, settings } */
window._checkAIQuota = async function() {
  const settings = await window._getAISettings();
  if (!settings.enabled) return { allowed: false, reason: 'disabled', settings };

  const uid = window._currentUserUid;
  if (!uid) return { allowed: true, reason: null, settings }; // not logged in: handled elsewhere in the app

  const usageRef = doc(db, 'ai_usage', `${uid}_${_todayKey()}`);
  try {
    const snap = await getDoc(usageRef);
    const count = snap.exists() ? (snap.data().count || 0) : 0;
    if (count >= settings.dailyLimit) {
      return { allowed: false, reason: 'limit', settings, count };
    }
    return { allowed: true, reason: null, settings, count };
  } catch(e) {
    // fail open on read errors so a Firestore hiccup doesn't block studying
    return { allowed: true, reason: null, settings };
  }
};

/* ─── Record one AI message after it succeeds, and flag the moment the
   student crosses their limit so the admin panel can surface it ─── */
window._recordAIUsage = async function() {
  const uid = window._currentUserUid;
  if (!uid) return;
  const settings = await window._getAISettings();
  const usageRef = doc(db, 'ai_usage', `${uid}_${_todayKey()}`);
  try {
    const snap = await getDoc(usageRef);
    const prevCount = snap.exists() ? (snap.data().count || 0) : 0;
    const newCount = prevCount + 1;
    const justExceeded = newCount >= settings.dailyLimit && prevCount < settings.dailyLimit;

    await setDoc(usageRef, {
      uid,
      name: window._currentUserName || '',
      email: window._currentUserEmail || '',
      date: _todayKey(),
      count: newCount,
      ...(justExceeded ? { exceeded: true, exceededAt: serverTimestamp() } : {}),
      lastMessageAt: serverTimestamp(),
    }, { merge: true });
  } catch(e) { /* non-critical: usage tracking shouldn't block the chat */ }
};

/* ─── Admin panel: today's usage summary + who exceeded their limit ─── */
window.loadAIUsageToday = async function() {
  const listEl = document.getElementById('aiExceededList');
  const msgsTodayEl = document.getElementById('aiStatMsgsToday');
  const exceededCountEl = document.getElementById('aiStatExceededCount');
  if (!listEl) return;
  try {
    const q = query(collection(db, 'ai_usage'), where('date', '==', _todayKey()));
    const snap = await getDocs(q);
    let totalMsgs = 0;
    const exceeded = [];
    snap.forEach(d => {
      const data = d.data();
      totalMsgs += data.count || 0;
      if (data.exceeded) exceeded.push(data);
    });
    exceeded.sort((a,b) => (b.count||0) - (a.count||0));

    msgsTodayEl.textContent = totalMsgs;
    exceededCountEl.textContent = exceeded.length;

    if (!exceeded.length) {
      listEl.innerHTML = '<p style="font-size:12px;color:rgba(28,43,37,0.4);text-align:center;padding:0.8rem;">لسه محدش خطى الليميت النهاردة 👍</p>';
    } else {
      listEl.innerHTML = exceeded.map(s => `
        <div class="ai-exceeded-item">
          <div>
            <div class="ai-exceeded-name">${(s.name || 'بدون اسم').replace(/</g,'&lt;')}</div>
            <div class="ai-exceeded-email">${(s.email || '').replace(/</g,'&lt;')}</div>
          </div>
          <span class="ai-exceeded-count">${s.count} رسالة</span>
        </div>
      `).join('');
    }
  } catch(e) {
    listEl.innerHTML = '<p style="font-size:12px;color:#c0392b;text-align:center;padding:0.8rem;">⚠️ حصل خطأ في تحميل بيانات الاستخدام</p>';
  }
};

/* ─── Admin stats dashboard: aggregate every student doc into useful numbers ─── */

/* slug -> { name, icon, year, term } lookup, built once from the static catalog */
function _buildSubjectLookup() {
  const map = {};
  if (window.years) {
    Object.keys(window.years).forEach(yk => {
      ['term1','term2'].forEach(term => {
        (window.years[yk].terms[term] || []).forEach(s => {
          let total = 0;
          Object.values(s.files || {}).forEach(arr => { total += arr.length; });
          map[s.slug] = { name: s.name, icon: s.icon || '📘', year: yk, term, total };
        });
      });
    });
  }
  if (window.practicalSubjects) {
    Object.keys(window.practicalSubjects).forEach(yk => {
      ['term1','term2'].forEach(term => {
        ((window.practicalSubjects[yk] || {})[term] || []).forEach(s => {
          let total = 0;
          Object.values(s.files || {}).forEach(arr => { total += arr.length; });
          map[s.slug] = { name: s.name, icon: s.icon || '🧪', year: yk, term, total };
        });
      });
    });
  }
  return map;
}

/* total number of files in the whole catalog (same logic as the per-student updateStats()) */
function _getTotalFilesCount() {
  let total = 0;
  if (window.years) {
    Object.keys(window.years).forEach(yk => {
      ['term1','term2'].forEach(term => {
        (window.years[yk].terms[term] || []).forEach(s => {
          Object.values(s.files || {}).forEach(arr => { total += arr.length; });
        });
      });
    });
  }
  if (window.practicalSubjects) {
    Object.keys(window.practicalSubjects).forEach(yk => {
      ['term1','term2'].forEach(term => {
        ((window.practicalSubjects[yk] || {})[term] || []).forEach(s => {
          Object.values(s.files || {}).forEach(arr => { total += arr.length; });
        });
      });
    });
  }
  return total;
}

/* extracts the subject slug out of a stored file URL like "files/y2/term1/adult-1/lecture/foo.pdf" */
function _slugFromFileUrl(url) {
  const parts = String(url || '').split('/').filter(Boolean);
  // parts[0] === 'files', parts[1] = year, parts[2] = term, parts[3] = slug
  return parts.length >= 4 ? parts[3] : null;
}

window._loadAdminStats = async function() {
  try {
    const snap = await (window._getCachedStudentsList
      ? window._getCachedStudentsList(getDocs, collection(db, 'students'))
      : getDocs(collection(db, 'students')));
    const totalFiles = _getTotalFilesCount();
    const subjectLookup = _buildSubjectLookup();
    const subjectOpenCounts = {}; // slug -> count of (student, file) opens

    let totalStudents = 0;
    let progressSum = 0;
    let activeThisWeek = 0;
    let totalOpens = 0;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    // per-year aggregation: { y1: { seen: 0, total: 0 }, ... }
    const yearAgg = { y1: { seen: 0, total: 0 }, y2: { seen: 0, total: 0 }, y3: { seen: 0, total: 0 } };

    snap.forEach(d => {
      const data = d.data();
      totalStudents++;
      const viewed = Array.isArray(data.viewedFiles) ? data.viewedFiles : [];
      totalOpens += viewed.length;
      if (totalFiles) progressSum += (viewed.length / totalFiles) * 100;

      const lastSeenMs = data.lastSeen?.toMillis ? data.lastSeen.toMillis() : 0;
      if (lastSeenMs && lastSeenMs >= weekAgo) activeThisWeek++;

      viewed.forEach(url => {
        const slug = _slugFromFileUrl(url);
        if (!slug) return;
        subjectOpenCounts[slug] = (subjectOpenCounts[slug] || 0) + 1;
        const info = subjectLookup[slug];
        if (info && yearAgg[info.year]) yearAgg[info.year].seen++;
      });
    });

    // year totals come straight from the catalog (independent of any student data)
    Object.keys(subjectLookup).forEach(slug => {
      const info = subjectLookup[slug];
      if (yearAgg[info.year]) yearAgg[info.year].total += info.total;
    });

    const avgProgress = totalStudents ? Math.round(progressSum / totalStudents) : 0;

    const topSubjects = Object.entries(subjectOpenCounts)
      .map(([slug, count]) => ({ slug, count, info: subjectLookup[slug] }))
      .filter(x => x.info)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    if (window._renderAdminStats) {
      window._renderAdminStats({ totalStudents, avgProgress, activeThisWeek, totalOpens, topSubjects, yearAgg });
    }
  } catch (e) {
    console.error('load admin stats failed', e);
    const loadingEl = document.getElementById('adminStatsLoading');
    if (loadingEl) loadingEl.textContent = 'حصل خطأ في تحميل الإحصائيات — حاول تاني.';
  }
};

/* Lazily loads the SheetJS library (only admins ever trigger this, so we don't
   make every visitor download ~900KB they'll never use). */
function _ensureXlsxLibLoaded() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('تعذّر تحميل مكتبة الإكسل — تأكد من اتصالك بالإنترنت'));
    document.head.appendChild(script);
  });
}

/* Admin: export every registered student's profile + progress into an .xlsx file */
window._exportStudentsToExcel = async function() {
  const btn = document.getElementById('exportStudentsBtn');
  const originalLabel = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = '⏳ جاري التجهيز...'; }
  try {
    await _ensureXlsxLibLoaded();
    const totalFiles = _getTotalFilesCount();
    const snap = await getDocs(collection(db, 'students'));
    const rows = [];
    snap.forEach(d => {
      const data = d.data();
      const viewedCount = Array.isArray(data.viewedFiles) ? data.viewedFiles.length : 0;
      const pct = totalFiles ? Math.round((viewedCount / totalFiles) * 100) : 0;
      const joined = data.joinedAt?.toDate ? data.joinedAt.toDate() : null;
      const lastSeen = data.lastSeen?.toDate ? data.lastSeen.toDate() : null;
      rows.push({
        'الاسم': data.displayName || '',
        'الإيميل': data.email || '',
        'عدد الملفات المفتوحة': viewedCount,
        'نسبة التقدم %': pct,
        'تاريخ التسجيل': joined ? joined.toLocaleDateString('ar-EG') : '',
        'آخر ظهور': lastSeen ? lastSeen.toLocaleString('ar-EG') : '',
      });
    });
    rows.sort((a, b) => a['الاسم'].localeCompare(b['الاسم']));

    const ws = window.XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [{ wch: 24 }, { wch: 28 }, { wch: 18 }, { wch: 14 }, { wch: 16 }, { wch: 20 }];
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, 'الطلبة');
    const dateStamp = new Date().toISOString().slice(0, 10);
    window.XLSX.writeFile(wb, `students-${dateStamp}.xlsx`);
  } catch (e) {
    console.error('export students failed', e);
    alert('حصل خطأ في تصدير البيانات: ' + (e && e.message ? e.message : e));
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = originalLabel || '📤 تصدير لإكسل'; }
  }
};
function exportStudentsToExcel() { window._exportStudentsToExcel(); }
window.exportStudentsToExcel = exportStudentsToExcel;

/* Admin: export detailed 3-sheet analytics workbook from the stats dashboard */
window._exportDetailedStatsToExcel = async function() {
  const btn = document.getElementById('exportDetailedBtn');
  const origHTML = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> جاري التجهيز...';
  }
  try {
    await _ensureXlsxLibLoaded();
    const totalFiles = _getTotalFilesCount();
    const subjectLookup = _buildSubjectLookup();
    const snap = await getDocs(collection(db, 'students'));

    const summaryRows   = [];   // Sheet 1: one row per student
    const subjectStats  = {};   // slug -> { students: Set, filesCount: 0 }
    const detailRows    = [];   // Sheet 3: one row per (student × file)
    const totalStudents = snap.size || 1;

    snap.forEach(d => {
      const data = d.data();
      const viewed  = Array.isArray(data.viewedFiles) ? data.viewedFiles : [];
      const cnt     = viewed.length;
      const pct     = totalFiles ? Math.round((cnt / totalFiles) * 100) : 0;
      const joined  = data.joinedAt?.toDate  ? data.joinedAt.toDate()  : null;
      const lastSeen= data.lastSeen?.toDate  ? data.lastSeen.toDate()  : null;

      // Build URL → first-open-timestamp map from Firestore fileOpenLog
      const openTimesMap = window.fileOpenLogToMap ? window.fileOpenLogToMap(data.fileOpenLog) : {};

      // per-year/term file counts for this student
      const byYear = { y1: 0, y2: 0, y3: 0 };

      viewed.forEach(url => {
        // URL pattern: files/{year}/{term}/{slug}/{type}/{filename}
        const parts = String(url || '').split('/').filter(Boolean);
        const year     = parts[1] || '';
        const term     = parts[2] || '';
        const slug     = parts[3] || '';
        const fileType = parts[4] || '';
        let   filename = parts.slice(5).join('/');
        try { filename = decodeURIComponent(filename); } catch(e) {}

        if (byYear[year] !== undefined) byYear[year]++;

        // aggregate for subject stats sheet
        if (slug) {
          if (!subjectStats[slug]) subjectStats[slug] = { students: new Set(), filesCount: 0 };
          subjectStats[slug].students.add(data.email || d.id);
          subjectStats[slug].filesCount++;
        }

        const subj = subjectLookup[slug] || {};
        const yearLabel = year === 'y1' ? 'الأولى' : year === 'y2' ? 'الثانية' : year === 'y3' ? 'الثالثة' : year;
        const termLabel = term === 'term1' ? 'الأول' : term === 'term2' ? 'الثاني' : term;
        const typeLabel = { lecture: 'محاضرة', summary: 'ملخص', quiz: 'كويز', practical: 'تطبيقي', book: 'كتاب' }[fileType] || fileType;

        // First-open timestamp for this specific file
        const openedAtMs = openTimesMap[url];
        const openedAt   = openedAtMs ? new Date(openedAtMs).toLocaleString('ar-EG') : '—';

        detailRows.push({
          'الطالب':      data.displayName || data.email || '',
          'الإيميل':     data.email       || '',
          'المادة':      subj.name        || slug || '—',
          'السنة':       yearLabel,
          'الترم':       termLabel,
          'نوع الملف':   typeLabel,
          'اسم الملف':   filename         || url,
          'تاريخ أول فتح': openedAt,
        });
      });

      summaryRows.push({
        'الاسم':                    data.displayName || '',
        'الإيميل':                   data.email       || '',
        'إجمالي الملفات المفتوحة':   cnt,
        'نسبة التقدم الكلي %':       pct,
        'ملفات السنة الأولى':        byYear.y1,
        'ملفات السنة الثانية':       byYear.y2,
        'ملفات السنة الثالثة':       byYear.y3,
        'تاريخ التسجيل':             joined   ? joined.toLocaleDateString('ar-EG')   : '',
        'آخر نشاط':                  lastSeen ? lastSeen.toLocaleString('ar-EG')      : '',
      });
    });

    // sort summary by most files opened (desc)
    summaryRows.sort((a, b) => b['إجمالي الملفات المفتوحة'] - a['إجمالي الملفات المفتوحة']);

    // sort details by student name then subject
    detailRows.sort((a, b) => {
      const nc = a['الطالب'].localeCompare(b['الطالب']);
      return nc !== 0 ? nc : a['المادة'].localeCompare(b['المادة']);
    });

    // build subject stats rows
    const subjectRows = Object.entries(subjectStats).map(([slug, st]) => {
      const subj  = subjectLookup[slug] || {};
      const total = subj.total || 0;
      const yearLabel = subj.year === 'y1' ? 'الأولى' : subj.year === 'y2' ? 'الثانية' : subj.year === 'y3' ? 'الثالثة' : (subj.year || '');
      const termLabel = subj.term === 'term1' ? 'الأول' : subj.term === 'term2' ? 'الثاني' : (subj.term || '');
      return {
        'المادة':                         subj.name || slug,
        'السنة':                          yearLabel,
        'الترم':                          termLabel,
        'عدد الطلبة اللي فتحوها':         st.students.size,
        'إجمالي مرات فتح ملفاتها':        st.filesCount,
        'إجمالي ملفات المادة':            total,
        'نسبة إقبال الطلبة %':            totalStudents ? Math.round((st.students.size / totalStudents) * 100) : 0,
      };
    }).sort((a, b) => b['عدد الطلبة اللي فتحوها'] - a['عدد الطلبة اللي فتحوها']);

    // ── build workbook ──
    const wb = window.XLSX.utils.book_new();

    const ws1 = window.XLSX.utils.json_to_sheet(summaryRows);
    ws1['!cols'] = [
      { wch: 26 }, { wch: 30 }, { wch: 22 }, { wch: 18 },
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 24 }
    ];
    window.XLSX.utils.book_append_sheet(wb, ws1, 'ملخص الطلبة');

    const ws2 = window.XLSX.utils.json_to_sheet(subjectRows);
    ws2['!cols'] = [
      { wch: 30 }, { wch: 12 }, { wch: 10 },
      { wch: 22 }, { wch: 24 }, { wch: 20 }, { wch: 18 }
    ];
    window.XLSX.utils.book_append_sheet(wb, ws2, 'اكتر المواد بتتفتح');

    const ws3 = window.XLSX.utils.json_to_sheet(detailRows);
    ws3['!cols'] = [
      { wch: 26 }, { wch: 30 }, { wch: 28 },
      { wch: 12 }, { wch: 10 }, { wch: 14 }, { wch: 40 }, { wch: 22 }
    ];
    window.XLSX.utils.book_append_sheet(wb, ws3, 'تفاصيل الملفات');

    const dateStamp = new Date().toISOString().slice(0, 10);
    window.XLSX.writeFile(wb, `nursing-hub-stats-${dateStamp}.xlsx`);

  } catch (e) {
    console.error('detailed export failed', e);
    alert('حصل خطأ في التصدير: ' + (e && e.message ? e.message : e));
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = origHTML; }
  }
};
function exportDetailedStatsToExcel() { window._exportDetailedStatsToExcel(); }
window.exportDetailedStatsToExcel = exportDetailedStatsToExcel;

/* Show admin tools only to the admin user */
let _myConvUnsub = null;
onAuthStateChanged(auth, (user) => {
  const adminWrap = document.getElementById('adminPopoverSection');
  if (adminWrap) {
    adminWrap.style.display = (user && user.email === ADMIN_EMAIL) ? 'block' : 'none';
  }
  if (user) {
    window._currentUserUid = user.uid;
    window._currentUserName = user.displayName || user.email || '?';
    window._currentUserEmail = user.email || '';
    startNotifListener(user.uid);
    listenForMyConversationPreview(user.uid);
    if (user.email === ADMIN_EMAIL) { listenAllConversations(); listenPendingGroupsCount(); }
  } else {
    window._currentUserEmail = '';
    window._unreadChatCount = 0;
    if (window.updateAvatarMsgBadge) window.updateAvatarMsgBadge();
  }
});

/* ══════════════════════ CHAT / CONVERSATIONS (Firestore) ══════════════════════ */
/* Data model:
   conversations/{studentUid}         -> { studentName, studentEmail, lastMessage, lastTs,
                                            unreadByAdmin, unreadByStudent }
   conversations/{studentUid}/messages/{id} -> { text, sender: 'student'|'admin', ts }          */

/* Student: get a live preview (badge/last message) for the notif-panel entry, even before
   the chat view itself is opened. */
function listenForMyConversationPreview(uid) {
  const ref = doc(db, 'conversations', uid);
  onSnapshot(ref, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    if (window.updateMyChatPreview) {
      window.updateMyChatPreview(data.lastMessage || '', data.unreadByStudent ? 1 : 0);
    }
  });
}

/* Student: open a live listener on my own messages thread */
window._listenMyConversation = function(callback) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  if (_myConvUnsub) _myConvUnsub();
  const q = query(collection(db, 'conversations', uid, 'messages'), orderBy('ts', 'asc'), limit(200));
  _myConvUnsub = onSnapshot(q, (snap) => {
    const messages = [];
    snap.forEach(d => {
      const m = d.data();
      messages.push({ id: d.id, text: m.text, sender: m.sender, ts: m.ts?.toMillis ? m.ts.toMillis() : Date.now() });
    });
    callback(messages);
  });
};

/* Student: send a message — creates the conversation doc if it doesn't exist yet */
window._sendMyMessage = async function(text) {
  const user = auth.currentUser;
  if (!user) return;
  const ref = doc(db, 'conversations', user.uid);
  await setDoc(ref, {
    studentName: user.displayName || user.email || '?',
    studentEmail: user.email || '',
    lastMessage: text,
    lastTs: serverTimestamp(),
    unreadByAdmin: true,
    unreadByStudent: false,
  }, { merge: true });
  await addDoc(collection(db, 'conversations', user.uid, 'messages'), {
    text, sender: 'student', ts: serverTimestamp(),
  });
};

/* Student: mark conversation as read on my side (e.g. when opening the chat) */
window._markMyChatRead = async function() {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  try { await updateDoc(doc(db, 'conversations', uid), { unreadByStudent: false }); } catch(e) {}
};

/* Admin: live list of all conversations, newest first */
function listenAllConversations() {
  const q = query(collection(db, 'conversations'), orderBy('lastTs', 'desc'), limit(100));
  onSnapshot(q, (snap) => {
    const list = [];
    snap.forEach(d => {
      const c = d.data();
      list.push({
        uid: d.id,
        studentName: c.studentName || '',
        studentEmail: c.studentEmail || '',
        lastMessage: c.lastMessage || '',
        lastTs: c.lastTs?.toMillis ? c.lastTs.toMillis() : 0,
        unreadByAdmin: !!c.unreadByAdmin,
      });
    });
    if (window.renderConversationsList) window.renderConversationsList(list);
  });
}

/* Admin: open one conversation's messages, live */
let _adminConvUnsub = null;
window._listenAdminConversation = function(uid, callback) {
  if (_adminConvUnsub) _adminConvUnsub();
  const q = query(collection(db, 'conversations', uid, 'messages'), orderBy('ts', 'asc'), limit(200));
  _adminConvUnsub = onSnapshot(q, (snap) => {
    const messages = [];
    snap.forEach(d => {
      const m = d.data();
      messages.push({ id: d.id, text: m.text, sender: m.sender, ts: m.ts?.toMillis ? m.ts.toMillis() : Date.now() });
    });
    callback(messages);
  });
};
window._stopAdminConversationListener = function() {
  if (_adminConvUnsub) { _adminConvUnsub(); _adminConvUnsub = null; }
};

/* Admin: send a message into a student's conversation */
window._sendAdminChatMessage = async function(uid, text) {
  await updateDoc(doc(db, 'conversations', uid), {
    lastMessage: text,
    lastTs: serverTimestamp(),
    unreadByStudent: true,
    unreadByAdmin: false,
  });
  await addDoc(collection(db, 'conversations', uid, 'messages'), {
    text, sender: 'admin', ts: serverTimestamp(),
  });
};

/* Admin: mark a conversation as read on my side (when I open it) */
window._markConversationReadByAdmin = async function(uid) {
  try { await updateDoc(doc(db, 'conversations', uid), { unreadByAdmin: false }); } catch(e) {}
};

/* Shared helper: after a message is deleted, refresh the parent conversation doc's
   lastMessage/lastTs so previews (notif panel, admin list) don't keep showing
   text that no longer exists. If no messages remain, clears the preview fields. */
async function _refreshConversationPreview(uid) {
  try {
    const q = query(collection(db, 'conversations', uid, 'messages'), orderBy('ts', 'desc'), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) {
      await updateDoc(doc(db, 'conversations', uid), { lastMessage: '', lastTs: serverTimestamp() });
    } else {
      const last = snap.docs[0].data();
      await updateDoc(doc(db, 'conversations', uid), {
        lastMessage: last.text || '',
        lastTs: last.ts || serverTimestamp(),
      });
    }
  } catch (e) { /* non-critical — preview will just lag until next message */ }
}

/* Student: delete one of MY OWN messages */
window._deleteMyMessage = async function(msgId) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await deleteDoc(doc(db, 'conversations', uid, 'messages', msgId));
  await _refreshConversationPreview(uid);
};

/* Admin: delete any message in any conversation */
window._deleteAdminMessage = async function(uid, msgId) {
  await deleteDoc(doc(db, 'conversations', uid, 'messages', msgId));
  await _refreshConversationPreview(uid);
};

/* ══════════════════════ STUDY GROUPS (Firestore) ══════════════════════ */
/* Data model:
   groups/{groupId} -> {
     name, description,
     createdByUid, createdByName, createdByEmail,
     members: [email,...],             // active members (lowercased emails)
     status: 'pending'|'active'|'rejected'|'closed',
     createdAt
   }
   groups/{groupId}/messages/{id} -> {
     type: 'text'|'image'|'video'|'file',
     text,                              // for type='text', or caption for media
     fileUrl, fileName, fileSize,       // for type='image'|'video'|'file'
     senderUid, senderName, ts
   }
   groupInvites/{inviteId} -> {
     groupId, groupName,
     invitedEmail,                      // lowercased
     invitedByUid, invitedByName,
     status: 'pending'|'accepted'|'declined',
     createdAt
   }
   NOTE (admin visibility): the admin is intentionally never added to a
   group's `members` array, so admin never appears in chat/member lists.
   Admin access to all groups/messages happens via the separate admin
   panel queries below (admin reads via its own UI, not as a member). */

const ADMIN_EMAIL_LC = () => (window.ADMIN_EMAIL_REF || '').toLowerCase();

let _myGroupsUnsub = null;
let _myInvitesUnsub = null;
let _groupChatUnsub = null;
let _currentGroupId = null;
let _pendingGroupFile = null; // { file, kind: 'image'|'video'|'file' }

function parseMemberEmails(raw) {
  const parts = (raw || '').split(/[\n,]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
  const valid = parts.filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  return [...new Set(valid)].filter(e => e !== ADMIN_EMAIL_LC());
}

function openCreateGroupModal() {
  if (!auth.currentUser) {
    closeGroupsPanel();
    document.getElementById('signInBtn').click();
    return;
  }
  document.getElementById('newGroupName').value = '';
  document.getElementById('newGroupDesc').value = '';
  document.getElementById('createGroupStatus').textContent = '';
  document.getElementById('createGroupOverlay').classList.add('open');
}
function closeCreateGroupModal() {
  document.getElementById('createGroupOverlay').classList.remove('open');
}
window.openCreateGroupModal = openCreateGroupModal;
window.closeCreateGroupModal = closeCreateGroupModal;

/* Group creation no longer accepts a member list directly — members are
   added only through the real invite+accept flow below. The creator is
   the sole member at creation time. */
async function submitCreateGroup() {
  const user = auth.currentUser;
  if (!user) { document.getElementById('signInBtn').click(); return; }
  const name = document.getElementById('newGroupName').value.trim();
  const desc = document.getElementById('newGroupDesc').value.trim();
  const statusEl = document.getElementById('createGroupStatus');
  if (!name) { statusEl.style.color = '#c0392b'; statusEl.textContent = 'لازم تكتب اسم للجروب'; return; }
  const creatorEmail = (user.email || '').toLowerCase();

  const btn = document.getElementById('submitGroupBtn');
  btn.disabled = true;
  statusEl.style.color = '';
  statusEl.textContent = 'جاري الإرسال...';
  try {
    await addDoc(collection(db, 'groups'), {
      name, description: desc,
      createdByUid: user.uid,
      createdByName: user.displayName || user.email || '?',
      createdByEmail: creatorEmail,
      members: [creatorEmail],
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    statusEl.style.color = '#1D9E75';
    statusEl.textContent = '✓ تم إرسال الطلب! هيشتغل الجروب لما الأدمن يوافق.';
    if (window._loadMyGroups) window._loadMyGroups();
    setTimeout(closeCreateGroupModal, 1600);
  } catch (e) {
    statusEl.style.color = '#c0392b';
    statusEl.textContent = 'حصل خطأ: ' + (e && e.message ? e.message : e);
  } finally {
    btn.disabled = false;
  }
}
window.submitCreateGroup = submitCreateGroup;

function groupStatusLabel(status) {
  if (status === 'pending') return { text: 'قيد المراجعة', cls: 'group-status-pending' };
  if (status === 'active') return { text: 'نشط', cls: 'group-status-active' };
  if (status === 'closed') return { text: 'مقفول', cls: 'group-status-closed' };
  if (status === 'rejected') return { text: 'مرفوض', cls: 'group-status-rejected' };
  return { text: status, cls: '' };
}

/* Student: live list of groups I'm a member of */
window._loadMyGroups = function() {
  const user = auth.currentUser;
  const listEl = document.getElementById('myGroupsList');
  if (!listEl) return;
  if (!user) {
    listEl.innerHTML = '<p class="dash-fav-empty" style="color:rgba(28,43,37,0.5);">سجّل دخولك الأول عشان تعمل جروب أو تنضم لجروب.</p>';
    return;
  }
  const email = (user.email || '').toLowerCase();
  if (_myGroupsUnsub) _myGroupsUnsub();
  listEl.innerHTML = '<p style="font-size:12px;color:rgba(28,43,37,0.4);text-align:center;padding:1rem;">جاري التحميل...</p>';
  const q = query(collection(db, 'groups'), where('members', 'array-contains', email));
  _myGroupsUnsub = onSnapshot(q, (snap) => {
    const list = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    list.sort((a, b) => (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0) - (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0));
    if (!list.length) {
      listEl.innerHTML = '<p class="dash-fav-empty" style="color:rgba(28,43,37,0.5);">لسه معملتش أو اتضفت لأي جروب. دوس "اعمل جروب جديد"!</p>';
      return;
    }
    listEl.innerHTML = list.map(g => {
      const st = groupStatusLabel(g.status);
      const initial = (g.name || '?').trim()[0] || '?';
      const memberCount = (g.members || []).length;
      return `<div class="group-list-item" onclick="${g.status === 'active' ? `openGroupChat('${g.id}')` : ''}">
        <div class="group-list-row">
          <div class="group-list-icon">${escChat(initial.toUpperCase())}</div>
          <div class="group-list-info">
            <div class="group-list-name">${escChat(g.name)}</div>
            <div class="group-list-sub">${memberCount} عضو</div>
          </div>
          <span class="group-status-badge ${st.cls}">${st.text}</span>
        </div>
      </div>`;
    }).join('');
  });
};

/* Student: live list of invites sent to my email, awaiting my response.
   NOTE: query uses a single where() on invitedEmail only — adding a second
   where() on status needs a composite Firestore index, and without it the
   query fails silently (only visible in DevTools console). We filter
   status === 'pending' client-side instead, which needs no index at all. */
window._loadMyInvites = function() {
  const user = auth.currentUser;
  const sectionEl = document.getElementById('myInvitesSection');
  const listEl = document.getElementById('myInvitesList');
  if (!listEl || !sectionEl) return;
  if (_myInvitesUnsub) _myInvitesUnsub();
  if (!user) { sectionEl.style.display = 'none'; return; }
  const email = (user.email || '').toLowerCase();
  const q = query(collection(db, 'groupInvites'), where('invitedEmail', '==', email));
  _myInvitesUnsub = onSnapshot(q, (snap) => {
    const list = [];
    snap.forEach(d => { if (d.data().status === 'pending') list.push({ id: d.id, ...d.data() }); });
    if (!list.length) { sectionEl.style.display = 'none'; return; }
    sectionEl.style.display = '';
    listEl.innerHTML = list.map(inv => `
      <div class="group-invite-item">
        <div class="group-invite-info">
          <div class="group-invite-name">${escChat(inv.groupName)}</div>
          <div class="group-invite-meta">دعوة من ${escChat(inv.invitedByName || '?')}</div>
        </div>
        <div class="group-invite-actions">
          <button class="group-invite-btn group-invite-accept" onclick="respondToInvite('${inv.id}', true)" title="قبول">✓</button>
          <button class="group-invite-btn group-invite-decline" onclick="respondToInvite('${inv.id}', false)" title="رفض">✕</button>
        </div>
      </div>`).join('');
  });
};

window.respondToInvite = async function(inviteId, accept) {
  const user = auth.currentUser;
  if (!user) return;
  try {
    const invSnap = await getDoc(doc(db, 'groupInvites', inviteId));
    if (!invSnap.exists()) return;
    const inv = invSnap.data();
    if (accept) {
      // مهم: ما نعمل getDoc على groups هنا، لأن المدعو لسه مش عضو
      // ولا صاحب الجروب ولا أدمن، يعني الـ read rule هترفضه فورًا.
      // arrayUnion بيسمح بالتعديل من غير ما نحتاج نقرا الداتا الحالية،
      // وده اللي بيطابق شرط update rule بتاعت groups (إضافة إيميل واحد بس).
      await updateDoc(doc(db, 'groups', inv.groupId), {
        members: arrayUnion(inv.invitedEmail)
      });
      await updateDoc(doc(db, 'groupInvites', inviteId), { status: 'accepted' });
    } else {
      await updateDoc(doc(db, 'groupInvites', inviteId), { status: 'declined' });
    }
    if (window._loadMyGroups) window._loadMyGroups();
  } catch (e) {
    alert('حصل خطأ: ' + (e && e.message ? e.message : e));
  }
};

/* Invite member modal (opened from inside an active group's chat) */
function openInviteMemberModal() {
  if (!_currentGroupId) return;
  document.getElementById('inviteMemberEmail').value = '';
  document.getElementById('inviteMemberStatus').textContent = '';
  document.getElementById('inviteMemberOverlay').classList.add('open');
}
function closeInviteMemberModal() {
  document.getElementById('inviteMemberOverlay').classList.remove('open');
}
window.openInviteMemberModal = openInviteMemberModal;
window.closeInviteMemberModal = closeInviteMemberModal;

async function submitInviteMember() {
  const user = auth.currentUser;
  if (!user || !_currentGroupId) return;
  const emailRaw = document.getElementById('inviteMemberEmail').value.trim().toLowerCase();
  const statusEl = document.getElementById('inviteMemberStatus');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
    statusEl.style.color = '#c0392b'; statusEl.textContent = 'اكتب إيميل صحيح'; return;
  }
  if (emailRaw === ADMIN_EMAIL_LC()) {
    statusEl.style.color = '#c0392b'; statusEl.textContent = 'الإيميل ده غير متاح للدعوة'; return;
  }
  const btn = document.getElementById('submitInviteBtn');
  btn.disabled = true;
  statusEl.style.color = '';
  statusEl.textContent = 'جاري الإرسال...';
  try {
    const gSnap = await getDoc(doc(db, 'groups', _currentGroupId));
    if (!gSnap.exists()) throw new Error('الجروب ده مش موجود');
    const g = gSnap.data();
    if ((g.members || []).includes(emailRaw)) {
      statusEl.style.color = '#c0392b'; statusEl.textContent = 'الزميل ده عضو في الجروب خلاص';
      btn.disabled = false; return;
    }
    // avoid duplicate pending invites — single where() on groupId only
    // (3-field composite where() needs a Firestore index; without it this
    // silently throws and the whole invite flow appears to "do nothing")
    const existingQ = query(collection(db, 'groupInvites'), where('groupId', '==', _currentGroupId));
    const existingSnap = await getDocs(existingQ);
    const hasDuplicate = existingSnap.docs.some(d => {
      const data = d.data();
      return data.invitedEmail === emailRaw && data.status === 'pending';
    });
    if (hasDuplicate) {
      statusEl.style.color = '#c0392b'; statusEl.textContent = 'فيه دعوة منتظرة رد منه خلاص';
      btn.disabled = false; return;
    }
    await addDoc(collection(db, 'groupInvites'), {
      groupId: _currentGroupId, groupName: g.name,
      invitedEmail: emailRaw,
      invitedByUid: user.uid, invitedByName: user.displayName || user.email || '?',
      status: 'pending', createdAt: serverTimestamp(),
    });
    /* TODO: trigger an actual email to emailRaw via the existing Apps
       Script notification endpoint once its URL is provided — the invite
       still shows up inside the app's notifications regardless. */
    statusEl.style.color = '#1D9E75';
    statusEl.textContent = '✓ تم إرسال الدعوة!';
    setTimeout(closeInviteMemberModal, 1400);
  } catch (e) {
    statusEl.style.color = '#c0392b';
    statusEl.textContent = 'حصل خطأ: ' + (e && e.message ? e.message : e);
  } finally {
    btn.disabled = false;
  }
}
window.submitInviteMember = submitInviteMember;

/* Group chat */
function groupFileIcon(fileName) {
  const ext = (fileName || '').split('.').pop().toLowerCase();
  if (ext === 'pdf') return '📄';
  if (['doc','docx'].includes(ext)) return '📝';
  if (['ppt','pptx'].includes(ext)) return '📊';
  return '📎';
}
function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function groupChatBubbleHtml(messages, myUid, canModerate) {
  if (!messages.length) return '<p class="chat-empty">لسه مفيش رسايل. ابعت أول رسالة! 👋</p>';
  return messages.map(m => {
    const fromMe = m.senderUid === myUid;
    const time = new Date(m.ts || Date.now()).toLocaleString('ar-EG', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
    const nameLine = !fromMe ? `<div style="font-size:10.5px;font-weight:700;color:var(--teal-600);margin-bottom:2px;">${escChat(m.senderName || '')}</div>` : '';

    let mediaHtml = '';
    if (m.type === 'image' && m.fileUrl) {
      mediaHtml = `<img class="chat-bubble-media-img" src="${m.fileUrl}" onclick="window.open('${m.fileUrl}','_blank')" loading="lazy">`;
    } else if (m.type === 'video' && m.fileUrl) {
      mediaHtml = `<video class="chat-bubble-media-video" src="${m.fileUrl}" controls preload="metadata"></video>`;
    } else if (m.type === 'file' && m.fileUrl) {
      mediaHtml = `<a class="chat-bubble-file-link" href="${m.fileUrl}" target="_blank" rel="noopener">
        <span class="chat-bubble-file-icon">${groupFileIcon(m.fileName)}</span>
        <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;">${escChat(m.fileName || 'ملف')}<div class="chat-bubble-file-meta">${formatFileSize(m.fileSize)}</div></span>
      </a>`;
    }
    const textHtml = m.text ? escChat(m.text) : '';
    const deleteBtn = canModerate ? `<button class="chat-bubble-delete-btn" onclick="deleteGroupMessage('${m.id}')">حذف 🗑️</button>` : '';

    return `<div class="chat-bubble-row ${fromMe ? 'from-me' : 'from-them'}">
      <div class="chat-bubble-wrap">
        <div class="chat-bubble">${nameLine}${mediaHtml}${textHtml}<div class="chat-bubble-time">${time}</div></div>
        ${deleteBtn}
      </div>
    </div>`;
  }).join('');
}

function openGroupChat(groupId) {
  const user = auth.currentUser;
  if (!user) { document.getElementById('signInBtn').click(); return; }
  closeGroupsPanel();
  _currentGroupId = groupId;
  document.getElementById('groupChatView').classList.add('open');
  const aiFab = document.getElementById('aiFab');
  if (aiFab) aiFab.style.display = 'none';
  const msgsEl = document.getElementById('groupChatMessages');
  msgsEl.innerHTML = '<p style="font-size:12px;color:rgba(28,43,37,0.4);text-align:center;padding:1rem;">جاري التحميل...</p>';

  let canModerate = false;
  getDoc(doc(db, 'groups', groupId)).then((snap) => {
    if (!snap.exists()) return;
    const g = snap.data();
    document.getElementById('groupChatName').textContent = g.name || '—';
    document.getElementById('groupChatSub').textContent = `${(g.members || []).length} عضو`;
    const isOwnerOrAdmin = (g.createdByUid === user.uid || user.email === window.ADMIN_EMAIL_REF);
    canModerate = isOwnerOrAdmin;
    document.getElementById('groupChatCloseBtn').style.display = isOwnerOrAdmin ? 'flex' : 'none';
    document.getElementById('groupChatInviteBtn').style.display = (g.status === 'active') ? 'flex' : 'none';
  });

  if (_groupChatUnsub) _groupChatUnsub();
  const q = query(collection(db, 'groups', groupId, 'messages'), orderBy('ts', 'asc'), limit(300));
  _groupChatUnsub = onSnapshot(q, (snap) => {
    const messages = [];
    snap.forEach(d => {
      const m = d.data();
      messages.push({
        id: d.id, type: m.type || 'text', text: m.text,
        fileUrl: m.fileUrl, fileName: m.fileName, fileSize: m.fileSize,
        senderUid: m.senderUid, senderName: m.senderName,
        ts: m.ts?.toMillis ? m.ts.toMillis() : Date.now(),
      });
    });
    msgsEl.innerHTML = groupChatBubbleHtml(messages, user.uid, canModerate);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  });
}
function closeGroupChat() {
  document.getElementById('groupChatView').classList.remove('open');
  if (_groupChatUnsub) { _groupChatUnsub(); _groupChatUnsub = null; }
  _currentGroupId = null;
  _pendingGroupFile = null;
  document.getElementById('groupUploadPreview').style.display = 'none';
  const aiFab = document.getElementById('aiFab');
  if (aiFab) aiFab.style.display = '';
}
window.openGroupChat = openGroupChat;
window.closeGroupChat = closeGroupChat;

window.deleteGroupMessage = async function(messageId) {
  if (!_currentGroupId) return;
  if (!confirm('تحذف الرسالة دي؟')) return;
  try {
    await deleteDoc(doc(db, 'groups', _currentGroupId, 'messages', messageId));
  } catch (e) {
    alert('حصل خطأ: ' + (e && e.message ? e.message : e));
  }
};

/* ─── file attach / upload ─── */
const GROUP_FILE_MAX_BYTES = 15 * 1024 * 1024; // 15MB cap to protect Storage quota

function handleGroupFileSelect(event) {
  const file = event.target.files[0];
  event.target.value = '';
  if (!file) return;
  if (file.size > GROUP_FILE_MAX_BYTES) {
    alert('الملف أكبر من 15 ميجا، اختار ملف أصغر.');
    return;
  }
  const kind = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file';
  _pendingGroupFile = { file, kind };

  const preview = document.getElementById('groupUploadPreview');
  let thumbHtml = `<div class="group-upload-preview-thumb" style="display:flex;align-items:center;justify-content:center;font-size:18px;">${groupFileIcon(file.name)}</div>`;
  if (kind === 'image') thumbHtml = `<img class="group-upload-preview-thumb" src="${URL.createObjectURL(file)}">`;
  preview.innerHTML = `${thumbHtml}
    <div class="group-upload-preview-name">${escChat(file.name)} <span style="color:rgba(28,43,37,0.45);">(${formatFileSize(file.size)})</span></div>
    <button class="group-upload-preview-cancel" onclick="cancelGroupFileUpload()">✕</button>`;
  preview.style.display = 'flex';
  document.getElementById('groupChatInput').focus();
}
function cancelGroupFileUpload() {
  _pendingGroupFile = null;
  document.getElementById('groupUploadPreview').style.display = 'none';
}
window.handleGroupFileSelect = handleGroupFileSelect;
window.cancelGroupFileUpload = cancelGroupFileUpload;

async function sendGroupChatMessage() {
  const user = auth.currentUser;
  const input = document.getElementById('groupChatInput');
  const text = input.value.trim();
  if (!user || !_currentGroupId) return;
  if (!text && !_pendingGroupFile) return;

  const btn = document.getElementById('groupChatSendBtn');
  const attachBtn = document.getElementById('groupChatAttachBtn');
  const preview = document.getElementById('groupUploadPreview');
  input.disabled = true; btn.disabled = true; attachBtn.disabled = true;

  try {
    if (_pendingGroupFile) {
      const { file, kind } = _pendingGroupFile;
      preview.innerHTML = `<div class="group-upload-progress">⏳ بيترفع...</div>`;
      const path = `groupFiles/${_currentGroupId}/${Date.now()}_${file.name}`;
      const fileRef = storageRef(storage, path);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      await addDoc(collection(db, 'groups', _currentGroupId, 'messages'), {
        type: kind, fileUrl: url, fileName: file.name, fileSize: file.size,
        text: text || '', senderUid: user.uid, senderName: user.displayName || user.email || '?',
        ts: serverTimestamp(),
      });
      _pendingGroupFile = null;
      preview.style.display = 'none';
    } else {
      await addDoc(collection(db, 'groups', _currentGroupId, 'messages'), {
        type: 'text', text, senderUid: user.uid, senderName: user.displayName || user.email || '?', ts: serverTimestamp(),
      });
    }
    input.value = '';
  } catch (e) {
    alert('مش قادر أبعت الرسالة دلوقتي: ' + (e && e.message ? e.message : e));
    if (_pendingGroupFile) preview.style.display = 'flex';
  } finally {
    input.disabled = false; btn.disabled = false; attachBtn.disabled = false; input.focus();
  }
}
window.sendGroupChatMessage = sendGroupChatMessage;

async function closeGroupAsCreator() {
  if (!_currentGroupId) return;
  if (!confirm('تقفل الجروب ده؟ مش هيتقدر يبعت فيه رسايل تاني.')) return;
  try {
    await updateDoc(doc(db, 'groups', _currentGroupId), { status: 'closed' });
    closeGroupChat();
    if (window._loadMyGroups) window._loadMyGroups();
  } catch (e) {
    alert('حصل خطأ: ' + (e && e.message ? e.message : e));
  }
}
window.closeGroupAsCreator = closeGroupAsCreator;

/* Admin: pending-groups badge count */
function listenPendingGroupsCount() {
  const q = query(collection(db, 'groups'), where('status', '==', 'pending'));
  onSnapshot(q, (snap) => {
    const n = snap.size;
    const badge = document.getElementById('adminGroupsBadge');
    if (badge) { badge.style.display = n > 0 ? 'flex' : 'none'; badge.textContent = n > 9 ? '9+' : n; }
  });
}

/* Admin: groups approval panel */
window._loadAdminGroups = function() {
  const pendingEl = document.getElementById('adminPendingGroupsList');
  const activeEl = document.getElementById('adminActiveGroupsList');

  const pendingQ = query(collection(db, 'groups'), where('status', '==', 'pending'));
  onSnapshot(pendingQ, (snap) => {
    const list = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    if (!list.length) {
      pendingEl.innerHTML = '<p style="font-size:12px;color:rgba(28,43,37,0.4);text-align:center;padding:0.6rem;">لا يوجد طلبات حالياً</p>';
      return;
    }
    pendingEl.innerHTML = list.map(g => `
      <div class="group-admin-card">
        <div class="group-admin-card-name">${escChat(g.name)}</div>
        <div class="group-admin-card-meta">
          بواسطة: ${escChat(g.createdByName || g.createdByEmail || '?')}<br>
          الأعضاء: ${escChat((g.members || []).join('، '))}
          ${g.description ? `<br>${escChat(g.description)}` : ''}
        </div>
        <div class="group-admin-card-actions">
          <button class="group-admin-btn group-admin-approve" onclick="approveGroupRequest('${g.id}')">✓ موافقة</button>
          <button class="group-admin-btn group-admin-reject" onclick="rejectGroupRequest('${g.id}')">✕ رفض</button>
        </div>
      </div>`).join('');
  });

  const activeQ = query(collection(db, 'groups'), where('status', '==', 'active'));
  onSnapshot(activeQ, (snap) => {
    const list = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    if (!list.length) {
      activeEl.innerHTML = '<p style="font-size:12px;color:rgba(28,43,37,0.4);text-align:center;padding:0.6rem;">لا يوجد جروبات شغالة حالياً</p>';
      return;
    }
    activeEl.innerHTML = list.map(g => `
      <div class="group-admin-card">
        <div class="group-admin-card-name">${escChat(g.name)}</div>
        <div class="group-admin-card-meta">
          بواسطة: ${escChat(g.createdByName || g.createdByEmail || '?')} · ${(g.members || []).length} عضو
        </div>
        <div class="group-admin-card-actions">
          <button class="group-admin-btn" style="background:var(--teal-50);color:var(--teal-600);" onclick="adminViewGroupChat('${g.id}')">👁️ شاهد المحادثة</button>
          <button class="group-admin-btn group-admin-close" onclick="adminCloseGroup('${g.id}')">🔒 قفل</button>
          <button class="group-admin-btn group-admin-reject" onclick="adminDeleteGroup('${g.id}')">🗑️ حذف نهائي</button>
        </div>
      </div>`).join('');
  });
};

window.approveGroupRequest = async function(id) {
  try { await updateDoc(doc(db, 'groups', id), { status: 'active' }); }
  catch (e) { alert('حصل خطأ: ' + (e && e.message ? e.message : e)); }
};
window.rejectGroupRequest = async function(id) {
  if (!confirm('ترفض الطلب ده؟')) return;
  try { await updateDoc(doc(db, 'groups', id), { status: 'rejected' }); }
  catch (e) { alert('حصل خطأ: ' + (e && e.message ? e.message : e)); }
};
window.adminCloseGroup = async function(id) {
  if (!confirm('تقفل الجروب ده؟')) return;
  try { await updateDoc(doc(db, 'groups', id), { status: 'closed' }); }
  catch (e) { alert('حصل خطأ: ' + (e && e.message ? e.message : e)); }
};

/* Admin: permanently delete a group + all its messages. Storage files
   are left in place (Storage has no client-side recursive delete); they
   become orphaned but harmless — can be cleaned up later via a Cloud
   Function or manually from the Storage console if needed. */
window.adminDeleteGroup = async function(id) {
  if (!confirm('تحذف الجروب ده نهائياً؟ مفيش رجوع بعد كده، وكل الرسايل هتتمسح.')) return;
  try {
    const msgsSnap = await getDocs(collection(db, 'groups', id, 'messages'));
    await Promise.all(msgsSnap.docs.map(d => deleteDoc(d.ref)));
    await deleteDoc(doc(db, 'groups', id));
  } catch (e) {
    alert('حصل خطأ: ' + (e && e.message ? e.message : e));
  }
};

/* Admin: read-only view into any group's chat, without ever joining it
   as a member (admin email is never written to the `members` array, so
   students never see the admin listed). */
window.adminViewGroupChat = function(groupId) {
  closeAdminGroupsPanel();
  _currentGroupId = groupId;
  document.getElementById('groupChatView').classList.add('open');
  document.getElementById('groupChatInputRow').style.display = 'none';
  document.getElementById('groupChatInviteBtn').style.display = 'none';
  const aiFab = document.getElementById('aiFab');
  if (aiFab) aiFab.style.display = 'none';
  const msgsEl = document.getElementById('groupChatMessages');
  msgsEl.innerHTML = '<p style="font-size:12px;color:rgba(28,43,37,0.4);text-align:center;padding:1rem;">جاري التحميل...</p>';

  getDoc(doc(db, 'groups', groupId)).then((snap) => {
    if (!snap.exists()) return;
    const g = snap.data();
    document.getElementById('groupChatName').textContent = g.name || '—';
    document.getElementById('groupChatSub').textContent = `${(g.members || []).length} عضو · معاينة الأدمن`;
    document.getElementById('groupChatCloseBtn').style.display = 'flex';
  });

  if (_groupChatUnsub) _groupChatUnsub();
  const q = query(collection(db, 'groups', groupId, 'messages'), orderBy('ts', 'asc'), limit(300));
  _groupChatUnsub = onSnapshot(q, (snap) => {
    const messages = [];
    snap.forEach(d => {
      const m = d.data();
      messages.push({
        id: d.id, type: m.type || 'text', text: m.text,
        fileUrl: m.fileUrl, fileName: m.fileName, fileSize: m.fileSize,
        senderUid: m.senderUid, senderName: m.senderName,
        ts: m.ts?.toMillis ? m.ts.toMillis() : Date.now(),
      });
    });
    msgsEl.innerHTML = groupChatBubbleHtml(messages, '__admin_preview__', true);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  });
};

/* restore the normal chat view state (input row visible) when closing,
   since adminViewGroupChat hides it */
const _origCloseGroupChat = closeGroupChat;
window.closeGroupChat = function() {
  document.getElementById('groupChatInputRow').style.display = 'flex';
  _origCloseGroupChat();
};

