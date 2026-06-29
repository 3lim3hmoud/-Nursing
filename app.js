(function() {
  const saved = localStorage.getItem('nurseverse_theme') || 'light';
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.background = '#0d1a14';
  }
})();

window.toggleDarkMode = function() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.documentElement.style.background = next === 'dark' ? '#0d1a14' : '';
  localStorage.setItem('nurseverse_theme', next);
  const btn = document.getElementById('darkToggleBtn');
  if (btn) {
    btn.querySelector('.icon-sun').style.display  = next === 'dark'  ? 'none'  : '';
    btn.querySelector('.icon-moon').style.display = next === 'dark'  ? ''      : 'none';
  }
};

/* init icon state on load */
document.addEventListener('DOMContentLoaded', function() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const btn = document.getElementById('darkToggleBtn');
  if (btn && isDark) {
    btn.querySelector('.icon-sun').style.display  = 'none';
    btn.querySelector('.icon-moon').style.display = '';
  }
});

/* ─── Firestore Student Cache (5-min TTL) ─── */
window._studentCache = null;
window._studentCacheTs = 0;
const STUDENT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

window._getCachedStudent = async function(getDocFn, docRef) {
  const now = Date.now();
  if (window._studentCache && (now - window._studentCacheTs) < STUDENT_CACHE_TTL) {
    return window._studentCache;
  }
  const snap = await getDocFn(docRef);
  window._studentCache = snap;
  window._studentCacheTs = now;
  return snap;
};

window._invalidateStudentCache = function() {
  window._studentCache = null;
  window._studentCacheTs = 0;
};

/* Admin full-collection cache (3-min TTL) */
window._studentsListCache = null;
window._studentsListCacheTs = 0;
const STUDENTS_LIST_TTL = 3 * 60 * 1000;

window._getCachedStudentsList = async function(getDocsFn, collRef) {
  const now = Date.now();
  if (window._studentsListCache && (now - window._studentsListCacheTs) < STUDENTS_LIST_TTL) {
    return window._studentsListCache;
  }
  const snap = await getDocsFn(collRef);
  window._studentsListCache = snap;
  window._studentsListCacheTs = now;
  return snap;
};
