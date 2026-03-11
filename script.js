/* ============================================
   WEDDING INVITATION — SCRIPT.JS
============================================ */

// ---- AOS INIT ----
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  // Start countdown immediately
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Scroll handlers
  window.addEventListener('scroll', handleScroll);
});

// ============================================
// SLIDE ANIMATION — BIDIRECTIONAL (repeat)
// Animasi berjalan setiap kali elemen masuk
// viewport, baik scroll ke bawah maupun atas.
// ============================================
let slideObserver = null;

function initSlideAnimations() {
  if (slideObserver) slideObserver.disconnect();

  const slideEls = document.querySelectorAll('[data-slide]');
  if (!slideEls.length) return;

  // Step 1: set semua elemen ke state tersembunyi
  slideEls.forEach(el => {
    el.classList.remove('slide-ready', 'slide-visible');
    el.classList.add('slide-init');
  });

  // Step 2: tunggu 2 frame agar browser paint state tersembunyi dulu,
  // lalu aktifkan transisi
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      slideEls.forEach(el => el.classList.add('slide-ready'));

      // Step 3: observe — masuk viewport → slide in, keluar → reset
      slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const el = entry.target;
          if (entry.isIntersecting) {
            // Elemen masuk viewport → jalankan animasi slide in
            el.classList.add('slide-visible');
          } else {
            // Elemen keluar viewport → reset agar bisa animasi lagi
            el.classList.remove('slide-visible');
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      });

      // Tidak pakai unobserve agar observer tetap aktif
      slideEls.forEach(el => slideObserver.observe(el));
    });
  });
}

// ============================================
// COVER — OPEN INVITATION
// ============================================
function openInvitation() {
  const cover = document.getElementById('cover');
  const main = document.getElementById('mainContent');

  cover.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  cover.style.opacity = '0';
  cover.style.transform = 'scale(1.05)';

  setTimeout(() => {
    cover.style.display = 'none';
    main.classList.remove('hidden');
    main.style.opacity = '0';
    main.style.transition = 'opacity 0.6s ease';
    setTimeout(() => {
      main.style.opacity = '1';
      AOS.refresh();
      initSlideAnimations(); // start slide observer after content is visible
      tryPlayMusic();
    }, 50);
  }, 800);
}

// ============================================
// NAVBAR
// ============================================
const navbar = document.getElementById('navbar');

function handleScroll() {
  // Navbar scroll effect
  if (navbar) {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Back to top button
  const btn = document.getElementById('backToTop');
  if (btn) {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }
}

// Mobile Menu
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}

if (mobileClose) {
  mobileClose.addEventListener('click', closeMobileMenu);
}

function closeMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (mobileMenu && mobileMenu.classList.contains('open')) {
    if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
      closeMobileMenu();
    }
  }
});

// ============================================
// BACK TO TOP
// ============================================
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// SMOOTH SCROLL for nav links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================
// COUNTDOWN TIMER
// ============================================
function updateCountdown() {
  const weddingDate = new Date('2026-04-15T08:00:00');
  const now = new Date();
  const diff = weddingDate - now;

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl) return;

  if (diff <= 0) {
    daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  animateNumber(daysEl, days);
  animateNumber(hoursEl, hours);
  animateNumber(minutesEl, minutes);
  animateNumber(secondsEl, seconds);
}

function animateNumber(element, value) {
  const padded = String(value).padStart(2, '0');
  if (element.textContent !== padded) {
    element.style.transform = 'translateY(-6px)';
    element.style.opacity = '0.5';
    element.style.transition = 'all 0.25s ease';
    setTimeout(() => {
      element.textContent = padded;
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
    }, 150);
  }
}

// ============================================
// UCAPAN FORM
// ============================================
function submitUcapan(e) {
  e.preventDefault();
  
  const nama = document.getElementById('ucapanNama').value.trim();
  const hadir = document.getElementById('ucapanHadir').value;
  const pesan = document.getElementById('ucapanPesan').value.trim();

  if (!nama || !hadir || !pesan) return;

  const hadirMap = {
    hadir: { label: '✓ Hadir', cls: 'hadir' },
    mungkin: { label: '? Mungkin', cls: 'mungkin' },
    tidak: { label: '✗ Tidak Hadir', cls: 'tidak' },
  };

  const initial = nama.charAt(0).toUpperCase();
  const hadirInfo = hadirMap[hadir];

  const card = document.createElement('div');
  card.className = 'ucapan-card';
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.innerHTML = `
    <div class="ucapan-header">
      <div class="ucapan-avatar">${initial}</div>
      <div>
        <p class="ucapan-name">${escapeHTML(nama)}</p>
        <span class="ucapan-hadir ${hadirInfo.cls}">${hadirInfo.label}</span>
      </div>
    </div>
    <p class="ucapan-msg">"${escapeHTML(pesan)}"</p>
  `;

  const list = document.getElementById('ucapanList');
  list.insertBefore(card, list.firstChild);

  requestAnimationFrame(() => {
    card.style.transition = 'all 0.5s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });

  // Reset form
  document.getElementById('ucapanForm').reset();

  // Show success toast
  showToast('Ucapan terkirim! Terima kasih 🙏');
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

// ============================================
// COPY TO CLIPBOARD
// ============================================
function copyText(elementId, btn) {
  const text = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Nomor berhasil disalin!');
  });
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: linear-gradient(135deg, #3D4D3A, #6B8A68);
    color: white;
    padding: 14px 28px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-family: 'Montserrat', sans-serif;
    letter-spacing: 0.05em;
    z-index: 9999;
    opacity: 0;
    transition: all 0.4s ease;
    box-shadow: 0 8px 24px rgba(61,77,58,0.35);
    pointer-events: none;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}

// ============================================
// MUSIC PLAYER (using Web Audio API tone)
// ============================================
let musicPlaying = false;
let audioContext = null;
let musicNodes = [];
let musicInterval = null;

// Simple melody notes (frequencies in Hz) — wedding-ish
const melody = [
  329.63, 329.63, 392.00, 329.63, 349.23, 293.66, // E4 E4 G4 E4 F4 D4
  329.63, 329.63, 392.00, 329.63, 440.00, 392.00, // ...
];
let melodyIdx = 0;

function tryPlayMusic() {
  // Don't auto-play immediately — just show the widget
}

function toggleMusic() {
  if (!musicPlaying) {
    startMusic();
  } else {
    stopMusic();
  }
}

function startMusic() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    musicPlaying = true;
    document.getElementById('musicBtn').classList.add('playing');
    playNextNote();
    musicInterval = setInterval(playNextNote, 600);
  } catch(e) {
    showToast('Audio tidak tersedia di perangkat ini');
  }
}

function playNextNote() {
  if (!audioContext) return;
  const freq = melody[melodyIdx % melody.length];
  melodyIdx++;

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioContext.currentTime);

  gain.gain.setValueAtTime(0, audioContext.currentTime);
  gain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.55);
}

function stopMusic() {
  musicPlaying = false;
  if (musicInterval) clearInterval(musicInterval);
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  const btn = document.getElementById('musicBtn');
  if (btn) btn.classList.remove('playing');
}

// ============================================
// PARTICLES / FLOATING PETALS (subtle)
// ============================================
function createPetals() {
  const cover = document.getElementById('cover');
  if (!cover) return;

  for (let i = 0; i < 12; i++) {
    const petal = document.createElement('div');
    petal.style.cssText = `
      position: absolute;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      background: radial-gradient(circle, rgba(232,213,196,0.8), rgba(201,169,110,0.4));
      border-radius: 50% 0 50% 0;
      left: ${Math.random() * 100}%;
      top: -20px;
      z-index: 1;
      pointer-events: none;
      animation: petalFall ${6 + Math.random() * 8}s linear ${Math.random() * 5}s infinite;
    `;
    cover.appendChild(petal);
  }

  // Add keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes petalFall {
      0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 0.6; }
      100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

createPetals();
