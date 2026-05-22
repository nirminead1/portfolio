// Theme: Obsidian — main.js
// Handles particles, scroll animations, and interactive elements

(function() {
  'use strict';



  // ─── Navbar Scroll ───
  const navbar = document.querySelector('.navbar');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    lastScrollY = y;
  }, { passive: true });

  // ─── Mobile Nav ───
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const spans = navToggle.querySelectorAll('span');
      if (navMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // ─── Scroll Reveal ───
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .timeline-item').forEach(el => {
    revealObserver.observe(el);
  });

  // ─── Language Bars ───
  const langObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.lang-fill').forEach(fill => {
          fill.style.width = fill.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.3 });

  const langList = document.querySelector('.lang-list');
  if (langList) langObserver.observe(langList);

  // ─── Skills Tab Switching ───
  const tabs = document.querySelectorAll('.skill-tab');
  const groups = document.querySelectorAll('.skills-group');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      groups.forEach(g => {
        g.style.display = 'none';
        g.style.opacity = '0';
      });
      tab.classList.add('active');

      const target = document.getElementById('skills-' + tab.dataset.tab);
      if (target) {
        target.style.display = target.classList.contains('softskills-grid') ? 'grid' : 'grid';
        // Trigger reflow for animation
        void target.offsetWidth;
        target.style.opacity = '1';
        target.style.transition = 'opacity 0.4s ease';
        // Re-observe reveal children
        target.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('visible');
          void el.offsetWidth;
          el.classList.add('visible');
        });
      }
    });
  });

  // Show first group
  if (groups.length > 0) {
    groups.forEach((g, i) => {
      g.style.display = i === 0 ? 'grid' : 'none';
      g.style.opacity = i === 0 ? '1' : '0';
    });
  }

  // ─── Active Nav on Scroll ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  // ─── Contact Form ───
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Message envoyé !';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      btn.style.color = 'white';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
      }, 3000);
    });
  }

  // ─── Typing Effect ───
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const texts = [
      'Étudiante Ingénieure — INPT Rabat',
      'Systèmes Embarqués & IoT',
      'Développement Web Full-Stack',
      'RFID · FPGA · Traitement du Signal'
    ];
    let tIdx = 0, cIdx = 0, deleting = false;

    function typewrite() {
      const current = texts[tIdx];
      if (!deleting) {
        typingEl.textContent = current.substring(0, cIdx + 1);
        cIdx++;
        if (cIdx === current.length) {
          deleting = true;
          setTimeout(typewrite, 2200);
          return;
        }
      } else {
        typingEl.textContent = current.substring(0, cIdx - 1);
        cIdx--;
        if (cIdx === 0) {
          deleting = false;
          tIdx = (tIdx + 1) % texts.length;
        }
      }
      setTimeout(typewrite, deleting ? 35 : 65);
    }
    setTimeout(typewrite, 800);
  }

  // ─── Smooth Scroll ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
      // Close mobile menu
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  });

  // ─── Counter Animation ───
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.metric-value').forEach(el => {
          const text = el.textContent;
          const match = text.match(/(\d+)/);
          if (match) {
            const target = parseInt(match[1]);
            const suffix = text.replace(match[1], '');
            let count = 0;
            const step = Math.max(1, Math.floor(target / 40));
            const timer = setInterval(() => {
              count += step;
              if (count >= target) {
                count = target;
                clearInterval(timer);
              }
              el.textContent = count + suffix;
            }, 30);
          }
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const metricsSection = document.querySelector('.about-metrics');
  if (metricsSection) counterObserver.observe(metricsSection);

})();
