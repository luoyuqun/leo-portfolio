// ===== Menu Toggle =====
(function() {
  const menuBtn = document.querySelector('.menu-btn');
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuLinks = document.querySelectorAll('.menu__links a');
  
  function toggleMenu() {
    document.body.classList.toggle('menu-open');
  }
  
  function closeMenu() {
    document.body.classList.remove('menu-open');
  }
  
  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }
  
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }
  
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Show menu button on scroll (for desktop with small screens)
  const menuBtnWrap = document.querySelector('.menu-btn-wrap');
  if (menuBtnWrap) {
    function checkScroll() {
      if (window.scrollY > 200) {
        menuBtnWrap.classList.add('is-visible');
      } else {
        if (!document.body.classList.contains('menu-open')) {
          menuBtnWrap.classList.remove('is-visible');
        }
      }
    }
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }
  
  // Close menu with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
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

// ===== Gallery drag scroll (desktop) =====
(function() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  
  const track = gallery.querySelector('.gallery__track');
  if (!track) return;
  
  // Pause animation on hover
  gallery.addEventListener('mouseenter', function() {
    track.style.animationPlayState = 'paused';
  });
  gallery.addEventListener('mouseleave', function() {
    track.style.animationPlayState = 'running';
  });
  
  // Drag scroll
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  
  gallery.addEventListener('mousedown', function(e) {
    isDragging = true;
    gallery.classList.add('is-dragging');
    startX = e.pageX - gallery.offsetLeft;
    scrollLeft = gallery.scrollLeft;
    track.style.animation = 'none';
  });
  
  gallery.addEventListener('mouseleave', function() {
    if (isDragging) {
      isDragging = false;
      gallery.classList.remove('is-dragging');
    }
  });
  
  gallery.addEventListener('mouseup', function() {
    isDragging = false;
    gallery.classList.remove('is-dragging');
  });
  
  gallery.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - gallery.offsetLeft;
    const walk = (x - startX) * 1.5;
    gallery.scrollLeft = scrollLeft - walk;
  });
})();

// ===== Topbar scroll blur effect =====
(function() {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;
  
  let ticking = false;
  
  function updateTopbar() {
    if (window.scrollY > 50) {
      topbar.classList.add('is-scrolled');
    } else {
      topbar.classList.remove('is-scrolled');
    }
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateTopbar);
      ticking = true;
    }
  }, { passive: true });
  
  updateTopbar();
})();

// ===== Hero title character animation =====
(function() {
  const titles = document.querySelectorAll('[data-animate-chars]');
  if (!titles.length) return;
  
  titles.forEach(function(title) {
    const lines = title.querySelectorAll('span');
    let charIndex = 0;
    
    lines.forEach(function(line, lineIdx) {
      const text = line.textContent;
      line.textContent = '';
      line.style.display = 'block';
      
      for (let i = 0; i < text.length; i++) {
        const char = document.createElement('span');
        char.className = 'char';
        if (text[i] === ' ') {
          char.classList.add('space');
          char.innerHTML = '&nbsp;';
        } else {
          char.textContent = text[i];
        }
        char.style.animationDelay = (charIndex * 0.04 + lineIdx * 0.1) + 's';
        line.appendChild(char);
        charIndex++;
      }
    });
  });
})();

// ===== Scroll Reveal (Intersection Observer) =====
(function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
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
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger').forEach(function(el) {
    observer.observe(el);
  });
  
  // Also observe skill bars
  document.querySelectorAll('.skill-bar').forEach(function(el) {
    observer.observe(el);
  });
  
  // Fallback for browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger, .skill-bar').forEach(function(el) {
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

// ===== 3D Tilt Effect for Gallery Cards =====
(function() {
  const cards = document.querySelectorAll('.gallery__card');
  if (!cards.length) return;
  
  // Check if device supports hover
  if (!window.matchMedia('(hover: hover)').matches) return;
  
  cards.forEach(function(card) {
    const media = card.querySelector('.gallery__media');
    if (!media) return;
    
    let rafId = null;
    
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -6;
      const rotateY = (x - centerX) / centerX * 6;
      
      // Mouse position for glow effect (percentage)
      const mouseX = (x / rect.width * 100) + '%';
      const mouseY = (y / rect.height * 100) + '%';
      
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function() {
        media.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-12px) scale(1.02)';
        media.style.setProperty('--mouse-x', mouseX);
        media.style.setProperty('--mouse-y', mouseY);
      });
    });
    
    card.addEventListener('mouseleave', function() {
      if (rafId) cancelAnimationFrame(rafId);
      media.style.transform = '';
    });
  });
})();

// ===== Skills Cloud Floating Effect =====
(function() {
  const cloud = document.getElementById('skillsCloud');
  if (!cloud) return;
  
  const tags = cloud.querySelectorAll('[data-skill]');
  if (!tags.length) return;
  
  // Initial random positioning
  function initPositions() {
    const cloudRect = cloud.getBoundingClientRect();
    const cloudWidth = cloudRect.width;
    const cloudHeight = cloudRect.height;
    
    tags.forEach(function(tag, index) {
      const tagRect = tag.getBoundingClientRect();
      const maxX = cloudWidth - tagRect.width - 20;
      const maxY = cloudHeight - tagRect.height - 20;
      
      // Random starting position
      const x = Math.random() * maxX + 10;
      const y = Math.random() * maxY + 10;
      
      tag.style.left = x + 'px';
      tag.style.top = y + 'px';
      
      // Random animation parameters
      tag.dataset.baseX = x;
      tag.dataset.baseY = y;
      tag.dataset.speed = (0.3 + Math.random() * 0.5).toFixed(2);
      tag.dataset.phase = (Math.random() * Math.PI * 2).toFixed(2);
      tag.dataset.radius = (20 + Math.random() * 30).toFixed(2);
    });
  }
  
  // Mouse parallax effect
  let mouseX = 0.5;
  let mouseY = 0.5;
  
  cloud.addEventListener('mousemove', function(e) {
    const rect = cloud.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width;
    mouseY = (e.clientY - rect.top) / rect.height;
  });
  
  cloud.addEventListener('mouseleave', function() {
    mouseX = 0.5;
    mouseY = 0.5;
  });
  
  // Animation loop
  let startTime = performance.now();
  
  function animate(currentTime) {
    const elapsed = (currentTime - startTime) / 1000;
    
    tags.forEach(function(tag) {
      const baseX = parseFloat(tag.dataset.baseX);
      const baseY = parseFloat(tag.dataset.baseY);
      const speed = parseFloat(tag.dataset.speed);
      const phase = parseFloat(tag.dataset.phase);
      const radius = parseFloat(tag.dataset.radius);
      
      // Floating motion
      const floatX = Math.sin(elapsed * speed + phase) * radius;
      const floatY = Math.cos(elapsed * speed * 0.7 + phase * 1.3) * radius * 0.6;
      
      // Mouse parallax (inverted for depth effect)
      const parallaxX = (mouseX - 0.5) * -40 * speed;
      const parallaxY = (mouseY - 0.5) * -30 * speed;
      
      tag.style.transform = 'translate(' + (floatX + parallaxX) + 'px, ' + (floatY + parallaxY) + 'px)';
    });
    
    requestAnimationFrame(animate);
  }
  
  // Initialize after layout is ready
  setTimeout(function() {
    initPositions();
    requestAnimationFrame(animate);
  }, 300);
  
  // Reposition on resize
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initPositions, 250);
  });
})();

// ===== Work row hover preview effect =====
(function() {
  const workRows = document.querySelectorAll('.work-row');
  workRows.forEach(function(row) {
    row.addEventListener('mouseenter', function() {
      this.style.transition = 'all .3s ease';
    });
  });
})();

// ===== Fade in on scroll (legacy - kept for compatibility) =====
(function() {
  // Enhanced version uses .reveal classes above
  // This is kept for backward compatibility with existing pages
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Only observe elements that don't already use the new reveal system
  const legacySelectors = '.service-card, .process-item, .blog-item';
  document.querySelectorAll(legacySelectors).forEach(function(el) {
    if (!el.closest('.reveal') && !el.closest('.reveal-stagger')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      observer.observe(el);
    }
  });
})();
