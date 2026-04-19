/* ════════════════════════════════════════
   BOT NHẬP LIỆU — script.js v6.0
════════════════════════════════════════ */

// ── TRACK USER GESTURE ──────────────────
let userHasInteracted = false;
const markInteracted = () => { userHasInteracted = true; };
['click','touchstart','keydown','scroll','mousemove'].forEach(ev => {
  document.addEventListener(ev, markInteracted, { once: true, passive: true });
});

// ── SCROLL REVEAL ────────────────────────
// Mỗi element có class .reveal sẽ fade-in khi scroll vào
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


// ── NAV ─────────────────────────────────
const sitenav  = document.getElementById('sitenav');
const hamburger= document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  sitenav.classList.toggle('scrolled', window.scrollY > 20);
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) cur = s.id;
  });
  navLinks && navLinks.querySelectorAll('a').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur)
  );
}, { passive: true });

hamburger && hamburger.addEventListener('click', () =>
  navLinks.classList.toggle('open')
);
navLinks && navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ── SMOOTH SCROLL ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── VIDEO AUTOPLAY (với tiếng sau gesture) ──
function setupVideoAutoplay(videoId, overlayId, unmuteBarId) {
  const video    = document.getElementById(videoId);
  const overlay  = document.getElementById(overlayId);
  const unmuteBar= unmuteBarId ? document.getElementById(unmuteBarId) : null;
  if (!video) return;

  function hideOverlay() {
    if (overlay) {
      overlay.classList.add('hidden');
      setTimeout(() => { overlay.style.display = 'none'; }, 400);
    }
  }
  function showOverlay() {
    if (overlay) { overlay.style.display = 'flex'; setTimeout(() => overlay.classList.remove('hidden'), 10); }
    if (unmuteBar) unmuteBar.classList.remove('show');
  }

  function tryPlayWithSound() {
    video.muted = false;
    return video.play().then(() => {
      if (unmuteBar) unmuteBar.classList.remove('show');
    }).catch(() => {
      // Nếu browser chặn → fallback muted
      video.muted = true;
      return video.play().then(() => {
        // Hiện nút bật tiếng
        if (unmuteBar) unmuteBar.classList.add('show');
      });
    });
  }

  // Unmute bar click
  if (unmuteBar) {
    unmuteBar.addEventListener('click', () => {
      video.muted = false;
      unmuteBar.classList.remove('show');
      if (video.paused) video.play();
    });
  }

  // Click overlay → play với tiếng
  if (overlay) {
    overlay.addEventListener('click', () => {
      video.muted = false;
      video.play().catch(() => { video.muted = true; video.play(); });
      hideOverlay();
    });
  }

  video.addEventListener('pause', () => { if (!video.ended) showOverlay(); });
  video.addEventListener('ended', showOverlay);

  // IntersectionObserver – autoplay khi scroll vào
  let hasPlayedOnce = false;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio >= 0.4) {
        if (!hasPlayedOnce) {
          hasPlayedOnce = true;
          // Thử phát có tiếng nếu user đã tương tác
          if (userHasInteracted) {
            tryPlayWithSound().then(() => hideOverlay());
          } else {
            // Chờ gesture rồi phát — hoặc phát muted ngay
            video.muted = true;
            video.play().then(() => {
              hideOverlay();
              if (unmuteBar) unmuteBar.classList.add('show');
              // Sau khi user click bất kỳ đâu → tự unmute
              document.addEventListener('click', function unmuteLater() {
                video.muted = false;
                if (unmuteBar) unmuteBar.classList.remove('show');
                document.removeEventListener('click', unmuteLater);
              }, { once: true });
            }).catch(() => {});
          }
        }
      } else {
        // Ra ngoài viewport → dừng
        if (!video.paused && !video.ended) {
          video.pause();
          showOverlay();
          hasPlayedOnce = false; // cho phép tự phát lại lần sau
        }
      }
    });
  }, { threshold: [0.4] });

  obs.observe(video);
}

setupVideoAutoplay('tvc-player', 'tvc-overlay', 'tvc-unmute');
setupVideoAutoplay('bv-player',  'bv-overlay',  null);

// ── COUNTER ANIMATION (dramatic roll) ────
// Slow, dramatic, dễ đọc từng số
function animateCounter(el) {
  if (el.dataset.done) return;
  el.dataset.done = '1';

  const target  = parseInt(el.dataset.target || el.textContent) || 0;
  const suffix  = el.dataset.suffix || '';
  const dur     = 2600; // 2.6 giây — đủ chậm để cảm nhận
  const start   = performance.now();

  // easeOutExpo — nhanh lúc đầu, chậm lại cuối
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  let prevVal = -1;
  function step(now) {
    const pct  = Math.min((now - start) / dur, 1);
    const ease = easeOutExpo(pct);
    const val  = Math.round(ease * target);

    if (val !== prevVal) {
      el.textContent = val.toLocaleString('vi-VN') + suffix;
      // Thêm hiệu ứng nhấp mỗi lần số thay đổi
      el.classList.remove('counter-pop');
      void el.offsetWidth; // reflow
      el.classList.add('counter-pop');
      prevVal = val;
    }

    if (pct < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) animateCounter(entry.target);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

// ── COUNTDOWN TIMER (15 phút — persist đúng khi out/vào lại) ──
(function() {
  const pad = n => String(n).padStart(2, '0');
  const key = 'cd_end_v2';
  const DURATION = 15 * 60 * 1000; // 15 phút
  const now = Date.now();
  let endTime = parseInt(localStorage.getItem(key) || '0');
  // Nếu chưa có hoặc đã hết từ lâu (> 1 ngày) → tạo mới
  if (!endTime || endTime < now - 86400000) {
    endTime = now + DURATION;
    localStorage.setItem(key, endTime);
  }

  function tick() {
    const diff = Math.max(0, endTime - Date.now());
    if (diff <= 0) {
      // Reset 15 phút khi hết
      endTime = Date.now() + DURATION;
      localStorage.setItem(key, endTime);
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const $h = document.getElementById('cd-h');
    const $m = document.getElementById('cd-m');
    const $s = document.getElementById('cd-s');
    if($h) $h.textContent = pad(h);
    if($m) $m.textContent = pad(m);
    if($s) $s.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
})();

// ── LEAD FORM ────────────────────────────
const formEl  = document.getElementById('lead-form-el');
const formOk  = document.getElementById('form-ok');
const formBtn = document.getElementById('form-btn');

function isValidPhone(v) {
  return /^(0[3-9]\d{8})$/.test(v.replace(/[\s\-]/g, ''));
}

formEl && formEl.addEventListener('submit', async function(e) {
  e.preventDefault();
  const name  = document.getElementById('f-name');
  const phone = document.getElementById('f-phone');
  const biz   = document.getElementById('f-biz');
  const en    = document.getElementById('err-name');
  const ep    = document.getElementById('err-phone');
  const eb    = document.getElementById('err-biz');
  let ok = true;

  [en, ep, eb].forEach(el => { if(el) el.textContent = ''; });
  [name, phone, biz].forEach(el => el.classList.remove('error'));

  if (!name.value.trim()) { en.textContent = 'Vui lòng nhập họ tên'; name.classList.add('error'); ok = false; }
  if (!isValidPhone(phone.value)) { ep.textContent = 'Số điện thoại không hợp lệ (10 số)'; phone.classList.add('error'); ok = false; }
  if (!biz.value) { eb.textContent = 'Vui lòng chọn ngành'; biz.classList.add('error'); ok = false; }
  if (!ok) return;

  if (formBtn) {
    formBtn.querySelector('.btn-txt').style.display = 'none';
    formBtn.querySelector('.btn-load').style.display = 'block';
    formBtn.disabled = true;
  }

  const urlP = new URLSearchParams(window.location.search);
  const payload = {
    name:         name.value.trim(),
    phone:        phone.value.replace(/\D/g, ''),
    business:     biz.value,
    utm_source:   urlP.get('utm_source')   || 'direct',
    utm_medium:   urlP.get('utm_medium')   || '',
    utm_campaign: urlP.get('utm_campaign') || '',
    submitted_at: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
  };

  const SHEET_URL = window.SHEET_URL = 'https://script.google.com/macros/s/AKfycbxwXuLVGlNGXwFjgTlE6a_cRXySCWBxGy-Lne_W8_fJrmda0rd_1KYK7WfVGD_-qwhI/exec';
  try {
    if (SHEET_URL) {
      await fetch(SHEET_URL, {
        method:'POST', mode:'no-cors',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload),
      });
    }
  } catch(_) {}

  formEl.style.display = 'none';
  if (formOk) formOk.style.display = 'block';

  if (typeof gtag !== 'undefined') {
    gtag('event', 'lead_submit', { event_category:'form', event_label:payload.business });
  }
});

// ── FAQ ACCORDION ────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      const a = b.nextElementSibling;
      if (a) a.classList.remove('open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      const a = btn.nextElementSibling;
      if (a) a.classList.add('open');
    }
  });
});

// ── EXIT INTENT ──────────────────────────
let exitShown = false;
const exitOverlay = document.getElementById('exit-overlay');
const exitClose   = document.getElementById('exit-close');

document.addEventListener('mouseleave', e => {
  if (e.clientY <= 0 && !exitShown && window.scrollY > 400 && !sessionStorage.getItem('exit_shown')) {
    if (exitOverlay) exitOverlay.style.display = 'flex';
    exitShown = true;
    sessionStorage.setItem('exit_shown','1');
  }
});

let lastSY = 0;
window.addEventListener('scroll', () => {
  const cur = window.scrollY;
  if (!exitShown && cur > document.documentElement.scrollHeight * 0.45 && cur < lastSY - 120 && !sessionStorage.getItem('exit_shown')) {
    if (exitOverlay) exitOverlay.style.display = 'flex';
    exitShown = true;
    sessionStorage.setItem('exit_shown','1');
  }
  lastSY = cur;
}, { passive: true });

exitClose && exitClose.addEventListener('click', () => {
  if (exitOverlay) exitOverlay.style.display = 'none';
});
exitOverlay && exitOverlay.addEventListener('click', e => {
  if (e.target === exitOverlay) exitOverlay.style.display = 'none';
});

const exitForm = document.getElementById('exit-form');
exitForm && exitForm.addEventListener('submit', e => {
  e.preventDefault();
  if (exitOverlay) exitOverlay.style.display = 'none';
});

// ── FLOATING ZALO ────────────────────────
setTimeout(() => {
  const fz = document.getElementById('float-zalo');
  if (fz) fz.classList.add('visible');
}, 5000);
