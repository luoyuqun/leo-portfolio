/* ========================================
   Leo Portfolio - Main JavaScript
   ======================================== */

// ===== Theme Toggle (Dark/Light Mode) =====
(function() {
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  
  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Default is dark, only switch to light if explicitly set
  if (savedTheme === 'light') {
    html.setAttribute('data-theme', 'light');
  }
  
  function updateToggleIcon() {
    if (!themeToggle) return;
    const isLight = html.getAttribute('data-theme') === 'light';
    themeToggle.innerHTML = isLight 
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  }
  
  updateToggleIcon();
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const isLight = html.getAttribute('data-theme') === 'light';
      if (isLight) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
      updateToggleIcon();
    });
  }
})();

// ===== Mobile Menu Toggle =====
(function() {
  const menuBtn = document.querySelector('.menu-btn');
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuLinks = document.querySelectorAll('.menu__links a');
  
  function toggleMenu() {
    document.body.classList.toggle('menu-open');
    const expanded = document.body.classList.contains('menu-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', expanded);
    if (menuOverlay) menuOverlay.setAttribute('aria-hidden', !expanded);
  }
  
  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    if (menuOverlay) menuOverlay.setAttribute('aria-hidden', 'true');
  }
  
  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }
  
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }
  
  menuLinks.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });
  
  // Close menu with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
})();

// ===== Navbar Scroll Effect =====
(function() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  let ticking = false;
  
  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });
  
  updateNavbar();
})();

// ===== Back to Top Button =====
(function() {
  const backToTop = document.querySelector('.back-to-top');
  if (!backToTop) return;
  
  let ticking = false;
  
  function updateBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateBackToTop);
      ticking = true;
    }
  }, { passive: true });
  
  backToTop.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  updateBackToTop();
})();

// ===== Beijing Time =====
(function() {
  function updateBeijingTime() {
    const now = new Date();
    const beijingTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
    const hours = String(beijingTime.getHours()).padStart(2, '0');
    const minutes = String(beijingTime.getMinutes()).padStart(2, '0');
    const timeStr = hours + ':' + minutes;
    
    const timeEls = document.querySelectorAll('[data-beijing-time]');
    timeEls.forEach(function(el) {
      el.textContent = timeStr;
    });
  }
  
  updateBeijingTime();
  setInterval(updateBeijingTime, 30000);
})();

// ===== Smooth scroll for anchor links =====
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#main') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();

// ===== Scroll Reveal (Intersection Observer) =====
(function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all reveal elements
  var revealSelectors = '.reveal, .reveal-stagger, .service-card, .work-card, .tech-item, .stat-card, .timeline-item, .process-item, .blog-item, .skill-category, .case-nav__item, .case-body__section, .case-gallery__item';
  
  document.querySelectorAll(revealSelectors).forEach(function(el) {
    // Only add reveal class if it doesn't already have animation classes
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-stagger')) {
      el.classList.add('reveal');
    }
    observer.observe(el);
  });
  
  // Fallback for browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(revealSelectors).forEach(function(el) {
      el.classList.add('is-visible');
    });
  }
})();

// ===== Number Count-Up Animation =====
(function() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easeOut * target);
      
      el.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    
    requestAnimationFrame(update);
  }
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(function(counter) {
    observer.observe(counter);
  });
  
  // Fallback
  if (!('IntersectionObserver' in window)) {
    counters.forEach(function(counter) {
      counter.textContent = counter.getAttribute('data-count');
    });
  }
})();

// ===== Cursor Follower (Desktop only) =====
(function() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var cursor = document.createElement('div');
  cursor.className = 'cursor-follower';
  document.body.appendChild(cursor);

  // Inner dot element for layered effect
  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  var mouseX = -100, mouseY = -100;
  var cursorX = -100, cursorY = -100;
  var dotX = -100, dotY = -100;
  var isVisible = false;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dotX = mouseX;
    dotY = mouseY;

    if (!isVisible) {
      isVisible = true;
      cursor.classList.add('is-visible');
      dot.classList.add('is-visible');
    }
  });

  document.addEventListener('mouseleave', function() {
    isVisible = false;
    cursor.classList.remove('is-visible');
    dot.classList.remove('is-visible');
  });

  // Hide on touch devices
  document.addEventListener('touchstart', function() {
    cursor.style.display = 'none';
    dot.style.display = 'none';
  });

  function animate() {
    // Outer ring - smooth follow with lerp
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;

    // Use translate3d for GPU acceleration (no layout reflow)
    cursor.style.transform = 'translate3d(' + (cursorX - 16) + 'px, ' + (cursorY - 16) + 'px, 0)';
    dot.style.transform = 'translate3d(' + (dotX - 3) + 'px, ' + (dotY - 3) + 'px, 0)';

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // Hover effect on interactive elements
  var hoverSelectors = 'a, button, .work-card, .service-card, .tech-item, .filter-tab, .skill-pill, .blog-item, .case-nav__item, .btn, input, textarea, select';

  document.querySelectorAll(hoverSelectors).forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      cursor.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', function() {
      cursor.classList.remove('is-hover');
    });
  });

  // Click animation
  document.addEventListener('mousedown', function() {
    cursor.classList.add('is-click');
  });
  document.addEventListener('mouseup', function() {
    cursor.classList.remove('is-click');
  });
})();

// ===== Work Filter Tabs =====
(function() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const workCards = document.querySelectorAll('.work-card[data-category]');
  
  if (!filterTabs.length || !workCards.length) return;
  
  filterTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      const category = this.getAttribute('data-filter');
      
      // Update active tab
      filterTabs.forEach(function(t) { t.classList.remove('is-active'); });
      this.classList.add('is-active');
      
      // Filter cards
      workCards.forEach(function(card) {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          // Staggered fade in
          setTimeout(function() {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// ===== Hero Parallax Effect =====
(function() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const orbs = hero.querySelectorAll('.hero__orb');
  if (!orbs.length) return;
  
  let ticking = false;
  let mouseX = 0.5;
  let mouseY = 0.5;
  
  hero.addEventListener('mousemove', function(e) {
    const rect = hero.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width;
    mouseY = (e.clientY - rect.top) / rect.height;
    
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
  
  function updateParallax() {
    orbs.forEach(function(orb, index) {
      const speed = (index + 1) * 15;
      const x = (mouseX - 0.5) * speed;
      const y = (mouseY - 0.5) * speed;
      orb.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    });
    ticking = false;
  }
})();

// ===== Stagger Children Animation Helper =====
(function() {
  // Add reveal-stagger to grids that need it
  const staggerContainers = document.querySelectorAll('.services-grid, .work-grid, .tech-grid, .stats-grid, .skills-categories');
  staggerContainers.forEach(function(container) {
    if (!container.classList.contains('reveal-stagger')) {
      container.classList.add('reveal-stagger');
    }
  });
})();
