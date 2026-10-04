/**
 * EMARATIS FASHION - MAIN ORCHESTRATOR SCRIPT
 * Coordinates:
 * - 360° Canvas Viewer & Momentum Physics
 * - Dynamic Floating Bubble Hover Effect
 * - Luxury Magnetic Cursor Response
 * - Glassmorphic Navbar Transitions
 * - Silky Scroll Reveals
 * - VIP Client Profile Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Store & State
  window.boutiqueStore = new BoutiqueStore();

  // 2. Initialize 360° Studio Viewer
  window.dressViewer360 = new DressViewer360({
    canvasId: 'viewerCanvas',
    containerId: 'viewerContainer',
    totalFrames: 240,
    framePrefix: 'ezgif-252ce33e2d298fa6-jpg/ezgif-frame-',
    frameExt: '.jpg'
  });

  // 3. Setup Navigation & Glassmorphic Scroll Effect
  setupNavigation();

  // 4. Setup Dynamic Floating Bubble Effect in Navbar
  setupNavHoverBubble();

  // 5. Setup Luxury Goal Nishan Cursor
  setupLuxuryCursor();

  // 6. Setup Silky Keyboard Arrow Navigation (Full-Page/Section Glide)
  setupKeyboardSmoothScroll();

  // 7. Prevent Accidental Text Selection Caret
  preventAccidentalCaret();

  // 8. Setup Silky Scroll Sliding Reveals
  setupScrollReveal();

  // 9. Setup VIP Profile Modal
  setupProfileModal();

  // 10. Setup Accordions
  setupAccordions();

  // 11. Setup Newsletter Subscription
  setupNewsletter();

  // 12. Setup Size Guide Units
  setupSizeGuide();
});

// Navigation Handling & Header Glassmorphism Scroll
function setupNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const navHeader = document.getElementById('mainNavbar');

  // Sticky navbar glass blur & transformation on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      navHeader?.classList.add('scrolled');
    } else {
      navHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenu.classList.contains('hidden');
      if (isExpanded) {
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.querySelector('i')?.classList.replace('fa-bars', 'fa-times');
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.querySelector('i')?.classList.replace('fa-times', 'fa-bars');
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.querySelector('i')?.classList.replace('fa-times', 'fa-bars');
      });
    });
  }

  // Smooth scroll links with offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = 84;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// 3. Dynamic Floating Bubble Hover Effect
function setupNavHoverBubble() {
  const container = document.getElementById('navBubbleContainer');
  const bubble = document.getElementById('navHoverBubble');
  if (!container || !bubble) return;

  const links = container.querySelectorAll('.nav-link-item');

  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const linkRect = link.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const left = linkRect.left - containerRect.left;
      const top = linkRect.top - containerRect.top;
      const width = linkRect.width;
      const height = linkRect.height;

      bubble.style.width = `${width}px`;
      bubble.style.height = `${height}px`;
      bubble.style.left = `${left}px`;
      bubble.style.top = `${top}px`;
      bubble.style.opacity = '1';
      bubble.style.transform = 'scale(1)';
    });
  });

  container.addEventListener('mouseleave', () => {
    bubble.style.opacity = '0';
    bubble.style.transform = 'scale(0.92)';
  });
}

// 5. Luxury Goal Nishan Cursor (100% Pinpoint Accurate, Instant 0ms Latency Tracking)
function setupLuxuryCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // Clean up any legacy dot/aura elements
  document.querySelectorAll('.luxury-cursor-dot, .luxury-cursor-aura').forEach(el => el.remove());

  let cursorRing = document.querySelector('.luxury-cursor-ring');
  if (!cursorRing) {
    cursorRing = document.createElement('div');
    cursorRing.className = 'luxury-cursor-ring';
    document.body.appendChild(cursorRing);
  }

  let mouseX = -100;
  let mouseY = -100;
  let currentScale = 1;
  let targetScale = 1;
  let isCursorVisible = false;

  // Direct instantaneous 1:1 hardware composited coordinate tracking
  // Zero latency, zero dragging lag, 100% accurate pinpoint tracking
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isCursorVisible) {
      cursorRing.style.opacity = '1';
      isCursorVisible = true;
    }

    cursorRing.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${currentScale.toFixed(2)})`;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    cursorRing.style.opacity = '0';
    isCursorVisible = false;
  });

  // Tactile click feedback: quick compression on mousedown
  window.addEventListener('mousedown', () => {
    targetScale = 0.82;
    currentScale = 0.82;
    cursorRing.classList.add('clicking');
    cursorRing.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0.82)`;
  }, { passive: true });

  window.addEventListener('mouseup', () => {
    cursorRing.classList.remove('clicking');
    targetScale = cursorRing.classList.contains('active') ? 1.45 : 1;
    currentScale = targetScale;
    cursorRing.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${currentScale.toFixed(2)})`;
  }, { passive: true });

  // Smooth scale animation loop for hover transitions
  const renderScaleLoop = () => {
    if (isCursorVisible && Math.abs(targetScale - currentScale) > 0.01) {
      currentScale += (targetScale - currentScale) * 0.28;
      cursorRing.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${currentScale.toFixed(2)})`;
    }
    requestAnimationFrame(renderScaleLoop);
  };
  requestAnimationFrame(renderScaleLoop);

  // Dynamic interactive element hover scaling
  document.addEventListener('mouseover', (e) => {
    const interactive = e.target.closest('a, button, select, input, textarea, .interactive-bubble, .lookbook-card, .accordion-header, [data-interactive]');
    if (interactive) {
      targetScale = 1.45;
      cursorRing.classList.add('active');
    }

    const viewer = e.target.closest('#viewerContainer');
    if (viewer) {
      targetScale = 1.3;
      cursorRing.classList.add('drag-mode');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const interactive = e.target.closest('a, button, select, input, textarea, .interactive-bubble, .lookbook-card, .accordion-header, [data-interactive]');
    if (interactive) {
      targetScale = 1;
      cursorRing.classList.remove('active');
    }

    const viewer = e.target.closest('#viewerContainer');
    if (viewer) {
      targetScale = 1;
      cursorRing.classList.remove('drag-mode');
    }
  }, { passive: true });
}

// 6. Silky Section-by-Section Keyboard Arrow Navigation (Glides smoothly from slide to slide)
function setupKeyboardSmoothScroll() {
  let isGliding = false;

  function getSlideTargets() {
    const navHeight = 70;
    const elements = [
      document.getElementById('heroSection'),
      document.getElementById('collection'),
      document.getElementById('craftsmanship'),
      document.getElementById('howToOrder'),
      document.getElementById('blueprint'),
      document.getElementById('mainFooter') || document.querySelector('footer')
    ].filter(Boolean);

    const positions = [0]; // First stop is always top of page (0)

    for (let i = 1; i < elements.length; i++) {
      const el = elements[i];
      const rect = el.getBoundingClientRect();
      const topPos = Math.round(rect.top + window.pageYOffset - navHeight);
      positions.push(Math.max(0, topPos));
    }

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    if (positions[positions.length - 1] > maxScroll) {
      positions[positions.length - 1] = maxScroll;
    }

    // Return unique sorted list of slide stop positions
    return [...new Set(positions)].sort((a, b) => a - b);
  }

  // Velvet Easing Smooth Glide Function (650ms easeInOutCubic)
  function smoothGlideTo(targetY, duration = 650) {
    const startY = window.pageYOffset || window.scrollY;
    const difference = targetY - startY;
    if (Math.abs(difference) < 5) return;

    isGliding = true;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Velvet easeInOutCubic: slow start, smooth acceleration, gentle cinematic deceleration
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, Math.round(startY + difference * ease));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setTimeout(() => { isGliding = false; }, 60);
      }
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('keydown', (e) => {
    // Never hijack arrow keys when user is typing inside forms / inputs!
    if (e.target.closest('input, textarea, select')) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      if (isGliding) return;

      const positions = getSlideTargets();
      const currentY = window.pageYOffset || window.scrollY;

      // Find the first target position strictly ahead of current position by at least 35px
      const nextTarget = positions.find(pos => pos > currentY + 35);

      if (nextTarget !== undefined) {
        smoothGlideTo(nextTarget, 650);
      } else {
        // Already at last landmark, glide to bottom of the page
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        if (currentY < maxScroll - 10) {
          smoothGlideTo(maxScroll, 500);
        }
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (isGliding) return;

      const positions = getSlideTargets();
      const currentY = window.pageYOffset || window.scrollY;

      // Find all target positions strictly behind current position by at least 35px
      const prevPositions = positions.filter(pos => pos < currentY - 35);

      if (prevPositions.length > 0) {
        const prevTarget = prevPositions[prevPositions.length - 1];
        smoothGlideTo(prevTarget, 650);
      } else {
        // At or near top, glide to page start (0)
        if (currentY > 10) {
          smoothGlideTo(0, 500);
        }
      }
    }
  });
}

// 7. Prevent Accidental Text Selection & Caret Insertion on Page Clicks
function preventAccidentalCaret() {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('input, textarea')) {
      window.getSelection()?.removeAllRanges();
    }
  });

  document.addEventListener('selectstart', (e) => {
    if (!e.target.closest('input, textarea')) {
      e.preventDefault();
    }
  });
}

// VIP Client Profile Modal
function setupProfileModal() {
  const modal = document.getElementById('profileModal');
  const openBtns = document.querySelectorAll('[data-open-profile]');
  const closeBtns = document.querySelectorAll('[data-close-profile]');

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!modal) return;
      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
      }, 10);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!modal) return;
      modal.classList.add('opacity-0');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
      }
    });
  }
}

// Silky Scroll Sliding Reveal Effects using Intersection Observer
function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-init');
  
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -70px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

// Accordions Component
function setupAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parentItem = header.closest('.accordion-item');
      const isActive = parentItem.classList.contains('active');

      const container = parentItem.parentElement;
      container.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        parentItem.classList.add('active');
      }
    });
  });
}

// Newsletter Subscription
function setupNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const email = emailInput?.value || '';
      if (email) {
        window.boutiqueStore.showToast(`Invitation sent to ${email}. Welcome to the Emaratis Fashion Inner Circle.`);
        form.reset();
      }
    });
  }
}

// Interactive Size Guide Unit Switcher
function setupSizeGuide() {
  const unitButtons = document.querySelectorAll('[data-size-unit]');
  unitButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      unitButtons.forEach(b => {
        b.classList.remove('bg-[#D4AF37]', 'text-black');
        b.classList.add('text-white/60');
      });

      const target = e.currentTarget;
      target.classList.add('bg-[#D4AF37]', 'text-black');
      target.classList.remove('text-white/60');

      const unit = target.getAttribute('data-size-unit');
      updateSizeTableUnits(unit);
    });
  });
}

function updateSizeTableUnits(unit) {
  document.querySelectorAll('[data-in]').forEach(cell => {
    if (unit === 'cm') {
      cell.textContent = cell.getAttribute('data-cm') + ' cm';
    } else {
      cell.textContent = cell.getAttribute('data-in') + ' "';
    }
  });
}
