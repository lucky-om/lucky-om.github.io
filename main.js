// ============================================================
//  LuckyVerse.tech v2.0 — main.js
//  Handles: Navbar, Terminal, Counters, Animations, Mobile Menu
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR SCROLL EFFECT ──
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // ── BACK TO TOP ──
  const backToTopBtn = document.getElementById('backToTop');

  // ── HAMBURGER / MOBILE MENU ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileClose?.addEventListener('click', closeMobileMenu);
  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── TERMINAL TYPING ANIMATION ──
  const terminalBody = document.getElementById('terminalBody');
  const terminalLines = [
    { prompt: 'lucky@universe:~$', cmd: 'whoami', output: 'lucky — cybersec student & developer' },
    { prompt: 'lucky@universe:~$', cmd: 'uname -a', output: 'Kali Linux 6.12 x86_64 | Active' },
    { prompt: 'lucky@universe:~$', cmd: 'cat skills.txt', output: 'Python · Burp Suite · Kali · Nmap · Git · JS' },
    { prompt: 'lucky@universe:~$', cmd: 'ls projects/', output: 'CodeArena/  SphereWalk/  JalsaBank/  SoundLux/' },
    { prompt: 'lucky@universe:~$', cmd: 'echo $STATUS', output: '✅ Open to internships & collaborations' },
  ];

  if (terminalBody) {
    let lineIndex = 0;
    let charIndex = 0;
    let isTypingCmd = false;
    let currentLineEl = null;
    let cursorEl = null;

    const TYPING_SPEED = 55;
    const LINE_PAUSE = 900;
    const START_DELAY = 800;

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function typeTerminal() {
      await sleep(START_DELAY);
      for (let i = 0; i < terminalLines.length; i++) {
        const { prompt, cmd, output } = terminalLines[i];

        // Create prompt line
        const lineEl = document.createElement('div');
        lineEl.className = 't-line';
        const promptEl = document.createElement('span');
        promptEl.className = 't-prompt';
        promptEl.textContent = prompt;
        const cmdEl = document.createElement('span');
        cmdEl.className = 't-cmd';
        cursorEl = document.createElement('span');
        cursorEl.className = 't-cursor';
        lineEl.appendChild(promptEl);
        lineEl.appendChild(cmdEl);
        lineEl.appendChild(cursorEl);
        terminalBody.appendChild(lineEl);

        // Type command
        for (let c = 0; c < cmd.length; c++) {
          cmdEl.textContent += cmd[c];
          await sleep(TYPING_SPEED);
        }

        // Remove cursor, show output
        cursorEl.remove();
        await sleep(250);

        const outputEl = document.createElement('div');
        outputEl.className = 't-output';
        outputEl.textContent = '› ' + output;
        terminalBody.appendChild(outputEl);

        await sleep(LINE_PAUSE);
      }

      // Final blinking cursor
      const finalLine = document.createElement('div');
      finalLine.className = 't-line';
      const finalPrompt = document.createElement('span');
      finalPrompt.className = 't-prompt';
      finalPrompt.textContent = 'lucky@universe:~$';
      const finalCursor = document.createElement('span');
      finalCursor.className = 't-cursor';
      finalCursor.style.marginLeft = '8px';
      finalLine.appendChild(finalPrompt);
      finalLine.appendChild(finalCursor);
      terminalBody.appendChild(finalLine);
    }

    typeTerminal();
  }

  // ── ANIMATED COUNTERS ──
  const statEls = document.querySelectorAll('[data-count]');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    statEls.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = Math.floor(current) + suffix;
      }, 16);
    });
  }

  // ── INTERSECTION OBSERVER (fade-up + counters) ──
  const fadeEls = document.querySelectorAll('.fade-up');
  const statsSection = document.querySelector('.stats-strip');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { startCounters(); statsObserver.disconnect(); }
    });
  }, { threshold: 0.3 });

  if (statsSection) statsObserver.observe(statsSection);

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

});
