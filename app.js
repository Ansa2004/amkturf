// ==================== AMK Indoor Turf – Main JS (Patch v2) ====================
(function () {
  // -------------------- Init helpers --------------------
  function initApp() {
    initMobileMenu();
    initSmoothScrolling();
    initScrollEffects();
    initScrollReveal();
    preloadImages();
    console.log('AMK Indoor Turf JS initialised');
  }

  // Run initApp based on readyState
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // -------------------- Mobile Menu --------------------
  function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      toggleHamburgerAnim(navToggle, navMenu.classList.contains('active'));
    });

    // Close on link click (for mobile)
    navMenu.addEventListener('click', e => {
      if (e.target.classList.contains('nav-link')) {
        navMenu.classList.remove('active');
        toggleHamburgerAnim(navToggle, false);
      }
    });

    // Click outside closes menu
    document.addEventListener('click', e => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        toggleHamburgerAnim(navToggle, false);
      }
    });
  }

  function toggleHamburgerAnim(buttonEl, isActive) {
    const bars = buttonEl.querySelectorAll('span');
    if (!bars.length) return;
    if (isActive) {
      bars[0].style.transform = 'rotate(45deg) translateY(7px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    } else {
      bars.forEach(b => {
        b.style.transform = 'none';
        b.style.opacity = '1';
      });
    }
  }

  // -------------------- Smooth Scrolling --------------------
  function initSmoothScrolling() {
    const anchorSelectors = 'a[href^="#"]';
    const internalLinks = document.querySelectorAll(anchorSelectors);

    internalLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href.length === 1) return; // Skip "#"
      link.addEventListener('click', e => {
        // Only handle if link is on same page
        if (location.pathname === link.pathname && location.hostname === link.hostname) {
          e.preventDefault();
          const targetId = href;
          const targetEl = document.querySelector(targetId);
          if (!targetEl) return;
          const navbarHeight = document.getElementById('navbar').offsetHeight;
          const offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 10;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
    });
  }

  // -------------------- Active Link & Navbar Shadow --------------------
  function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function onScroll() {
      const scrollY = window.pageYOffset;
      const navbarHeight = navbar.offsetHeight;

      // Navbar shadow
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Update active link
      let currentSectionId = '';
      sections.forEach(sec => {
        const secTop = sec.offsetTop - navbarHeight - 60;
        const secBottom = secTop + sec.offsetHeight;
        if (scrollY >= secTop && scrollY < secBottom) {
          currentSectionId = sec.id;
        }
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
      });
    }

    onScroll();
    window.addEventListener('scroll', throttle(onScroll, 150));
  }

  // -------------------- Scroll Reveal --------------------
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.section-reveal');
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('revealed'));
      return;
    }
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  }

  // -------------------- Utilities --------------------
  function throttle(fn, limit) {
    let inThrottle;
    return function () {
      if (!inThrottle) {
        fn.apply(this, arguments);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Preload hero & critical images
  function preloadImages() {
    const sources = [
      'https://pplx-res.cloudinary.com/image/upload/v1753442698/pplx_project_search_images/e78e86d7f2166edac10bf27d6e63c6c75df0e3af.jpg',
      'https://pplx-res.cloudinary.com/image/upload/v1749965383/pplx_project_search_images/f0d03956bbb5481f9111b948191f4d43748cee87.jpg'
    ];
    sources.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
})();
