// =========================================================================
// CAPTION CONFIGURATION
// Easily edit the captions for the Unplugged cards and gallery images here.
// =========================================================================
const UNPLUGGED_CONFIG = {
  music: {
    cardCaption: "Unwinding with 6 strings. Finding rhythm in chaos.",
    imageCaptions: {
      "Playing Guitar": "Lost in the chords of my favorite acoustic melodies.",
      Guitar: "My trusted six-string companion, always ready for a tune.",
      "Sheet Music":
        "Deciphering sheet music, translating notes into feelings.",
      "Acoustic Guitar Performance":
        "A quiet afternoon session with the acoustic guitar.",
      "Electric Guitar Performance":
        "Plugging in the electric guitar to explore heavier sounds.",
    },
  },
  travel: {
    cardCaption: "Exploring new elevations. Trekking through the Himalayas.",
    imageCaptions: {
      Trekking: "Trekking deep into the heart of the mountains.",
      "Himalayan Sunrise":
        "A breathtaking sunrise lighting up the Himalayan peaks.",
      "Mountain Hiker": "Taking a moment to absorb the vastness of the peaks.",
      "Himalayan View": "Unobstructed views of the majestic Himalayan range.",
      "Mountain Base Camp":
        "Resting at base camp, surrounded by snow-capped giants.",
      "Scenic Valley":
        "Looking down at a scenic valley carved by ancient glaciers.",
      "Suspension Bridge":
        "Crossing a suspension bridge high above a roaring river.",
      "High Elevation Pass":
        "Reaching the highest pass, standing above the clouds.",
    },
  },
  trading: {
    cardCaption: "Analyzing the pulse of the market.",
    imageCaptions: {
      "Trading Setup":
        "Monitoring charts and key metrics on the primary display.",
      "Trading Desk": "A focused look at the multi-screen workspace setup.",
    },
  },
};

const initCardCaptions = () => {
  document
    .querySelectorAll("#unplugged [data-carousel]")
    .forEach((carousel) => {
      const titleEl = carousel.querySelector(".hobby-card-title");
      const captionEl = carousel.querySelector(
        ".hobby-card-caption, .trading-card-caption"
      );
      if (titleEl && captionEl) {
        const key = titleEl.textContent.trim().toLowerCase();
        if (UNPLUGGED_CONFIG[key]) {
          captionEl.textContent = UNPLUGGED_CONFIG[key].cardCaption;
        }
      }
    });
};

// Theme Toggle - Initialize ASAP to prevent flash
const initTheme = () => {
  const html = document.documentElement;
  const stored = localStorage.getItem("theme");

  // Determine target initial theme
  let currentTheme = stored;
  if (!currentTheme) {
    currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    html.setAttribute("data-theme", currentTheme);
  } else {
    html.setAttribute("data-theme", currentTheme);
  }

  const themeToggle = document.getElementById("themeToggle");
  const themeToggleMobile = document.getElementById("themeToggleMobile");

  const updateAria = (theme) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const labelText = `Switch to ${nextTheme} theme`;
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", labelText);
      themeToggle.setAttribute(
        "aria-pressed",
        theme === "dark" ? "true" : "false"
      );
    }
    if (themeToggleMobile) {
      themeToggleMobile.setAttribute("aria-label", labelText);
      themeToggleMobile.setAttribute(
        "aria-pressed",
        theme === "dark" ? "true" : "false"
      );
    }
  };

  updateAria(currentTheme);

  const toggleTheme = () => {
    const current = html.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateAria(next);
  };

  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
  if (themeToggleMobile)
    themeToggleMobile.addEventListener("click", toggleTheme);

  // Listen for OS theme changes (only if no stored preference)
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        const next = e.matches ? "dark" : "light";
        html.setAttribute("data-theme", next);
        updateAria(next);
      }
    });
};

initTheme();

// Navbar scroll effect + Active nav highlight
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".navbar-link");
const sections = document.querySelectorAll("#about, #work, #journey, #connect");
let lastScrollTop = 0;

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;

  if (scrollTop > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Scrollspy: highlight active nav link
  let currentSection = "";

  // Fallback: highlight the last section ('connect') if user has scrolled to the bottom of the page
  const isAtBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 10;

  if (isAtBottom) {
    currentSection = "connect";
  } else {
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
      }
    });
  }

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });

  lastScrollTop = scrollTop;
});

// Mobile menu toggle
const navbarToggle = document.getElementById("navbarToggle");
const mobileMenu = document.getElementById("mobileMenu");
const menuIcon = navbarToggle.querySelector(".menu-icon");
const closeIcon = navbarToggle.querySelector(".close-icon");

navbarToggle.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  navbarToggle.setAttribute("aria-expanded", isOpen);
  menuIcon.style.display = isOpen ? "none" : "block";
  closeIcon.style.display = isOpen ? "block" : "none";
});

// Close mobile menu when clicking a link
const mobileMenuLinks = mobileMenu.querySelectorAll(".mobile-menu-link");
mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    navbarToggle.setAttribute("aria-expanded", "false");
    menuIcon.style.display = "block";
    closeIcon.style.display = "none";
  });
});

// Card selection toggle (experience, hobby, and timeline cards)
document
  .querySelectorAll(".experience-card, .hobby-card, .timeline-card")
  .forEach((card) => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      const isSelected = card.classList.contains("selected");

      // Deselect all cards
      document
        .querySelectorAll(".experience-card, .hobby-card, .timeline-card")
        .forEach((c) => c.classList.remove("selected"));

      if (isSelected) {
        card.classList.add("closed-by-user");
      } else {
        document
          .querySelectorAll(".experience-card, .hobby-card, .timeline-card")
          .forEach((c) => c.classList.remove("closed-by-user"));
        card.classList.add("selected");
      }
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("closed-by-user");
    });
  });

// Click anywhere else to deselect all cards
document.addEventListener("click", () => {
  document
    .querySelectorAll(".experience-card, .hobby-card, .timeline-card")
    .forEach((c) => c.classList.remove("selected", "closed-by-user"));
});

// Update current year in footer
const currentYearEl = document.getElementById("currentYear");
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Hobby Cards Carousel - Auto-cycle every 4 seconds
function initCarousels() {
  const carousels = document.querySelectorAll("[data-carousel]");

  carousels.forEach((carousel) => {
    const images = carousel.querySelectorAll(".hobby-card-image");
    const dots = carousel.querySelectorAll(".carousel-dot");
    let currentIndex = 0;
    let intervalId = null;

    if (images.length <= 1) return;

    function showSlide(index) {
      images.forEach((img, i) => {
        img.classList.toggle("active", i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % images.length;
      showSlide(currentIndex);
    }

    function startAutoCycle() {
      if (!intervalId) {
        intervalId = setInterval(nextSlide, 4000);
      }
    }

    function stopAutoCycle() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    // Start auto cycle initially
    startAutoCycle();

    // Pause auto-rotation on mouse hover & keyboard focus
    carousel.addEventListener("mouseenter", stopAutoCycle);
    carousel.addEventListener("mouseleave", startAutoCycle);
    carousel.addEventListener("focusin", stopAutoCycle);
    carousel.addEventListener("focusout", startAutoCycle);

    // Click and keyboard interaction on dots to navigate
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentIndex = index;
        showSlide(currentIndex);
      });

      // Keyboard navigation (Enter/Space support)
      dot.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          currentIndex = index;
          showSlide(currentIndex);
        }
        if (e.key === " ") {
          e.preventDefault(); // Prevent viewport scrolling
        }
      });

      dot.addEventListener("keyup", (e) => {
        if (e.key === " ") {
          e.preventDefault();
          currentIndex = index;
          showSlide(currentIndex);
        }
      });
    });
  });
}

// Constellation Canvas Animation for Journey Section
const initConstellation = () => {
  const canvas = document.getElementById("journeyCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];

  // Configuration
  const particleCountDesktop = 80;
  const particleCountMobile = 30;
  const particleColor = "#F97316"; // Orange
  const connectionColor = "148, 163, 184"; // Slate Grey (rgb)
  const connectionDistance = 150;

  // Resize handling
  const resize = () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    initParticles();
  };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5; // Slow horizontal drift
      this.vy = (Math.random() - 0.5) * 0.5; // Slow vertical drift
      this.size = Math.random() * 2 + 1; // Size 1-3px
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    }
  }

  const initParticles = () => {
    particles = [];
    const count =
      window.innerWidth < 768 ? particleCountMobile : particleCountDesktop;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
      p.update();
      p.draw();

      // Draw connections
      for (let j = index + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = 0.2 * (1 - distance / connectionDistance);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${connectionColor}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resize);
  resize();
  animate();
};

const initUnpluggedGallery = () => {
  const modal = document.getElementById("unpluggedGallery");
  if (!modal) return;

  const stage = document.getElementById("galleryStage");
  const imageFrame = document.getElementById("galleryImageFrame");
  const imageEl = document.getElementById("galleryImage");
  const titleEl = document.getElementById("galleryTitle");
  const categoryEl = document.getElementById("galleryCategory");
  const associationEl = document.getElementById("galleryAssociation");
  const captionEl = document.getElementById("galleryCaption");
  const counterEl = document.getElementById("galleryCounter");
  const closeBtn = document.getElementById("galleryCloseBtn");
  const prevBtn = document.getElementById("galleryPrevBtn");
  const nextBtn = document.getElementById("galleryNextBtn");

  if (
    !stage ||
    !imageFrame ||
    !imageEl ||
    !titleEl ||
    !categoryEl ||
    !associationEl ||
    !captionEl ||
    !counterEl ||
    !closeBtn ||
    !prevBtn ||
    !nextBtn
  )
    return;

  let galleryImages = [];
  let galleryTitle = "Gallery";
  let currentIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchLastX = 0;
  let touchLastY = 0;
  let initialPinchDistance = 0;
  let initialPinchScale = 1;
  let lastTapTime = 0;
  let tapTimer = null;
  let lastFocusedElement = null;
  let previousBodyOverflow = "";
  let isPointerDragging = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let pointerOriginX = 0;
  let pointerOriginY = 0;
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let suppressNextOutsideClick = false;

  const prefersTouchUI = () => window.matchMedia("(hover: none)").matches;

  const formatCounter = () => {
    const current = String(currentIndex + 1).padStart(2, "0");
    const total = String(galleryImages.length).padStart(2, "0");
    return `${current} / ${total}`;
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const updateImageTransform = () => {
    if (
      scale <= 1.01 &&
      Math.abs(translateX) < 0.5 &&
      Math.abs(translateY) < 0.5
    ) {
      imageEl.style.transform = "";
    } else {
      imageEl.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
    }
    imageFrame.classList.toggle("is-zoomed", scale > 1.01);
    modal.classList.toggle("is-zoomed", scale > 1.01);
  };

  const resetZoom = () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateImageTransform();
  };

  const setControlsVisible = (isVisible) => {
    modal.classList.toggle("controls-hidden", !isVisible);
  };

  const toggleControls = () => {
    if (!prefersTouchUI() || scale > 1.01) return;
    setControlsVisible(modal.classList.contains("controls-hidden"));
  };

  const suppressOutsideClickOnce = () => {
    suppressNextOutsideClick = true;
    window.setTimeout(() => {
      suppressNextOutsideClick = false;
    }, 450);
  };

  const returnToUnpluggedSection = () => {
    const unpluggedSection = document.getElementById("unplugged");
    if (!unpluggedSection) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    unpluggedSection.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const preloadAdjacentImages = () => {
    if (!galleryImages.length) return;
    [currentIndex - 1, currentIndex + 1].forEach((index) => {
      const item =
        galleryImages[(index + galleryImages.length) % galleryImages.length];
      if (!item?.src) return;
      const preload = new Image();
      preload.src = item.src;
    });
  };

  const renderGallery = (direction = 0) => {
    const item = galleryImages[currentIndex];
    if (!item) return;

    resetZoom();
    imageFrame.classList.remove("is-loaded");
    imageFrame.style.setProperty("--gallery-shift", `${direction * 18}px`);

    imageEl.onload = () => {
      requestAnimationFrame(() => imageFrame.classList.add("is-loaded"));
    };
    imageEl.src = item.src;
    imageEl.alt = item.alt;
    if (imageEl.complete) {
      requestAnimationFrame(() => imageFrame.classList.add("is-loaded"));
    }

    titleEl.textContent = item.alt;
    categoryEl.textContent = galleryTitle;
    associationEl.textContent = `Unplugged / ${galleryTitle}`;

    // Load custom image caption from configuration if available
    const categoryKey = galleryTitle.toLowerCase();
    const config = UNPLUGGED_CONFIG[categoryKey];
    const altText = item.alt;
    if (config && config.imageCaptions && config.imageCaptions[altText]) {
      captionEl.textContent = config.imageCaptions[altText];
    } else {
      captionEl.textContent = `From the ${galleryTitle} collection.`;
    }
    counterEl.textContent = formatCounter();
    const hasMultipleImages = galleryImages.length > 1;
    prevBtn.hidden = !hasMultipleImages;
    nextBtn.hidden = !hasMultipleImages;
    prevBtn.setAttribute("aria-label", `Previous image in ${galleryTitle}`);
    nextBtn.setAttribute("aria-label", `Next image in ${galleryTitle}`);
    preloadAdjacentImages();
  };

  const showImage = (nextIndex) => {
    if (!galleryImages.length) return;
    const direction = nextIndex > currentIndex ? 1 : -1;
    currentIndex = (nextIndex + galleryImages.length) % galleryImages.length;
    setControlsVisible(true);
    renderGallery(direction);
  };

  const closeGallery = ({ returnToUnplugged = false } = {}) => {
    if (!modal.open) return;
    clearTimeout(tapTimer);
    modal.classList.remove("active");
    setControlsVisible(true);
    resetZoom();
    setTimeout(() => {
      if (modal.open) {
        modal.close();
      }
      document.body.style.overflow = previousBodyOverflow;
      imageEl.removeAttribute("src");
      imageFrame.classList.remove("is-loaded");
      if (returnToUnplugged) {
        lastFocusedElement?.focus?.({ preventScroll: true });
        returnToUnpluggedSection();
      } else {
        lastFocusedElement?.focus?.();
      }
    }, 220);
  };

  const openGallery = (carousel, startIndex, triggerElement) => {
    const images = [...carousel.querySelectorAll(".hobby-card-image")];
    if (!images.length) return;

    galleryImages = images.map((img) => ({
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt") || "Gallery image",
    }));
    galleryTitle =
      carousel.querySelector(".hobby-card-title")?.textContent?.trim() ||
      "Unplugged";
    currentIndex = startIndex;
    lastFocusedElement = triggerElement || document.activeElement;
    previousBodyOverflow = document.body.style.overflow;
    setControlsVisible(true);
    renderGallery();

    if (!modal.open) {
      modal.showModal();
    }
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      modal.classList.add("active");
      closeBtn.focus();
    });
  };

  document
    .querySelectorAll("#unplugged [data-carousel]")
    .forEach((carousel) => {
      const imageArea = carousel.querySelector(".carousel-images");
      const images = [...carousel.querySelectorAll(".hobby-card-image")];
      if (!imageArea || !images.length) return;

      imageArea.setAttribute("role", "button");
      imageArea.setAttribute("tabindex", "0");
      imageArea.setAttribute(
        "aria-label",
        `Open ${
          carousel.querySelector(".hobby-card-title")?.textContent?.trim() ||
          "Unplugged"
        } gallery`
      );

      const openFromActiveImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const activeIndex = Math.max(
          images.findIndex((img) => img.classList.contains("active")),
          0
        );
        openGallery(carousel, activeIndex, imageArea);
      };

      imageArea.addEventListener("click", openFromActiveImage);
      imageArea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          openFromActiveImage(e);
        }
      });
    });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeGallery({ returnToUnplugged: true });
  });

  modal.addEventListener("click", (e) => {
    if (suppressNextOutsideClick) {
      suppressNextOutsideClick = false;
      return;
    }
    if (e.target.closest(".gallery-nav-btn")) return;
    if (e.target.closest(".gallery-image, .gallery-meta-panel")) return;
    closeGallery({ returnToUnplugged: true });
  });

  stage.addEventListener("dblclick", (e) => {
    if (prefersTouchUI()) return;
    if (e.target.closest("button")) return;
    e.preventDefault();
    if (scale > 1.01) {
      resetZoom();
      setControlsVisible(true);
    } else {
      scale = 2;
      translateX = 0;
      translateY = 0;
      setControlsVisible(false);
      updateImageTransform();
    }
  });

  modal.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeGallery();
  });

  modal.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      showImage(currentIndex - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      showImage(currentIndex + 1);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      closeGallery();
    }
  });

  stage.addEventListener(
    "touchstart",
    (e) => {
      clearTimeout(tapTimer);
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
      touchLastX = touchStartX;
      touchLastY = touchStartY;

      if (e.touches.length === 2) {
        initialPinchDistance = getTouchDistance(e.touches);
        initialPinchScale = scale;
      }
    },
    { passive: true }
  );

  stage.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        suppressOutsideClickOnce();
        const nextScale =
          initialPinchScale *
          (getTouchDistance(e.touches) / initialPinchDistance);
        scale = clamp(nextScale, 1, 3.4);
        setControlsVisible(scale <= 1.01);
        updateImageTransform();
        return;
      }

      if (scale <= 1.01 || e.touches.length !== 1) return;
      e.preventDefault();
      suppressOutsideClickOnce();
      const nextX = e.touches[0].clientX;
      const nextY = e.touches[0].clientY;
      translateX += nextX - touchLastX;
      translateY += nextY - touchLastY;
      touchLastX = nextX;
      touchLastY = nextY;
      updateImageTransform();
    },
    { passive: false }
  );

  stage.addEventListener(
    "touchend",
    (e) => {
      if (scale > 1 && scale < 1.08) {
        resetZoom();
        setControlsVisible(true);
        return;
      }

      if (scale > 1.01) return;

      const swipeDistance = touchStartX - e.changedTouches[0].clientX;
      const verticalDistance = Math.abs(
        touchStartY - e.changedTouches[0].clientY
      );
      if (Math.abs(swipeDistance) > 56 && verticalDistance < 70) {
        suppressOutsideClickOnce();
        showImage(currentIndex + (swipeDistance > 0 ? 1 : -1));
        return;
      }

      if (Math.abs(swipeDistance) > 12 || verticalDistance > 12) {
        suppressOutsideClickOnce();
        return;
      }

      const now = Date.now();
      if (now - lastTapTime < 280) {
        clearTimeout(tapTimer);
        lastTapTime = 0;
        scale = 2;
        translateX = 0;
        translateY = 0;
        setControlsVisible(false);
        updateImageTransform();
        return;
      }

      lastTapTime = now;
      tapTimer = setTimeout(toggleControls, 220);
    },
    { passive: true }
  );

  imageFrame.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch" || scale <= 1.01) return;
    e.preventDefault();
    isPointerDragging = true;
    pointerStartX = e.clientX;
    pointerStartY = e.clientY;
    pointerOriginX = translateX;
    pointerOriginY = translateY;
    imageFrame.setPointerCapture(e.pointerId);
    imageFrame.classList.add("is-dragging");
  });

  imageFrame.addEventListener("pointermove", (e) => {
    if (!isPointerDragging) return;
    translateX = pointerOriginX + e.clientX - pointerStartX;
    translateY = pointerOriginY + e.clientY - pointerStartY;
    updateImageTransform();
  });

  const endPointerDrag = (e) => {
    if (!isPointerDragging) return;
    isPointerDragging = false;
    imageFrame.classList.remove("is-dragging");
    if (imageFrame.hasPointerCapture(e.pointerId)) {
      imageFrame.releasePointerCapture(e.pointerId);
    }
  };

  imageFrame.addEventListener("pointerup", endPointerDrag);
  imageFrame.addEventListener("pointercancel", endPointerDrag);
};

// Initialize carousels and constellation when DOM is ready
initCardCaptions();
initCarousels();
initUnpluggedGallery();
initConstellation();

// Waving Flag Animation for Hero Section
const initHeroFlag = () => {
  const canvas = document.getElementById("heroFlagCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Settings
  const pixelRatio = window.devicePixelRatio || 1;
  // Display size matches CSS
  const displayWidth = 72;
  const displayHeight = 90;

  // Set actual canvas size (high DPI support)
  canvas.width = displayWidth * pixelRatio;
  canvas.height = displayHeight * pixelRatio;

  // Wave Physics
  let time = 0;
  const waveSpeed = 0.064;
  const waveFrequency = 0.1; // Increased for smaller size
  const waveAmplitude = 3 * pixelRatio;

  // 1. CREATE OFFSCREEN CANVAS (The Static Texture)
  const bufferCanvas = document.createElement("canvas");
  const bufferCtx = bufferCanvas.getContext("2d");
  bufferCanvas.width = canvas.width;
  bufferCanvas.height = canvas.height;

  // Colors
  const CRIMSON = "#DC143C";
  const BLUE = "#003893";
  const WHITE = "#FFFFFF";

  function drawStaticFlag(ctx, w, h) {
    // Clear
    ctx.clearRect(0, 0, w, h);

    // Scale for drawing coordinates (assuming 100x120 coordinate space for ease)
    ctx.save();
    const scaleX = w / 100;
    const scaleY = h / 120;
    ctx.scale(scaleX, scaleY);

    // --- BORDER (Blue) ---
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = BLUE;
    ctx.lineJoin = "round";
    ctx.fillStyle = CRIMSON;

    // Geometry points (Simplified double triangle)
    // Start top-left
    ctx.moveTo(5, 5);
    // Top triangle right
    ctx.lineTo(80, 45);
    // Top triangle bottom-inner
    ctx.lineTo(35, 45);
    // Bottom triangle right
    ctx.lineTo(80, 95);
    // Bottom triangle bottom
    ctx.lineTo(5, 95);
    // Close loop
    ctx.lineTo(5, 5);

    ctx.fill();
    ctx.stroke();

    // --- MOON (Top Triangle) ---
    ctx.fillStyle = WHITE;
    ctx.beginPath();
    // Crescent
    ctx.arc(25, 30, 8, 0, Math.PI * 2);
    ctx.fill();
    // Cutout for crescent effect (red circle over white)
    ctx.fillStyle = CRIMSON;
    ctx.beginPath();
    ctx.arc(25, 26, 6, 0, Math.PI * 2);
    ctx.fill();

    // --- SUN (Bottom Triangle) ---
    ctx.fillStyle = WHITE;
    ctx.beginPath();
    // Sun body
    ctx.arc(25, 75, 7, 0, Math.PI * 2);
    ctx.fill();

    // Sun rays (simple lines)
    ctx.strokeStyle = WHITE;
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      const angle = (i / 12) * Math.PI * 2;
      ctx.moveTo(25 + Math.cos(angle) * 8, 75 + Math.sin(angle) * 8);
      ctx.lineTo(25 + Math.cos(angle) * 11, 75 + Math.sin(angle) * 11);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw the static flag once to buffer
  drawStaticFlag(bufferCtx, bufferCanvas.width, bufferCanvas.height);

  // 2. ANIMATION LOOP
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Loop through every vertical slice of the buffer
    for (let x = 0; x < canvas.width; x++) {
      // Calculate wave offset
      // dampener: left side (pole) moves less
      const dampener = x / canvas.width;
      const yOffset =
        Math.sin(x * waveFrequency - time) * (waveAmplitude * dampener);

      // Draw Slice
      ctx.drawImage(
        bufferCanvas,
        x,
        0,
        1,
        bufferCanvas.height, // Source slice
        x,
        yOffset,
        1,
        bufferCanvas.height // Dest slice
      );
    }

    time += waveSpeed;
    requestAnimationFrame(animate);
  }

  // Start
  animate();
};

initHeroFlag();

// Dynamics Timeline Line Sizing (Connect the dots exactly)
const adjustTimelineLine = () => {
  const line = document.querySelector(".timeline-line");
  const dots = document.querySelectorAll(".timeline-dot");

  if (!line || dots.length < 2) return;

  const firstDot = dots[0];
  const lastDot = dots[dots.length - 1];

  const container = line.parentElement;
  // Assuming line is direct child of the relative wrapper

  const containerRect = container.getBoundingClientRect();
  const firstDotRect = firstDot.getBoundingClientRect();
  const lastDotRect = lastDot.getBoundingClientRect();

  // Calculate relative top positions (center of dots)
  // dot center = dot top + height/2
  const firstDotCenter =
    firstDotRect.top + firstDotRect.height / 2 - containerRect.top;
  const lastDotCenter =
    lastDotRect.top + lastDotRect.height / 2 - containerRect.top;

  const height = lastDotCenter - firstDotCenter;

  line.style.top = `${firstDotCenter}px`;
  line.style.height = `${height}px`;
};

// Run on load and resize
window.addEventListener("load", adjustTimelineLine);
window.addEventListener("resize", adjustTimelineLine);
// Also run immediately in case
adjustTimelineLine();

// PDF Viewer Modal
const initPdfViewer = () => {
  const viewCvBtn = document.getElementById("viewCvBtn");
  const pdfModal = document.getElementById("pdfModal");
  const pdfCloseBtn = document.getElementById("pdfCloseBtn");
  const pdfFrame = document.getElementById("pdfFrame");

  if (!viewCvBtn || !pdfModal || !pdfCloseBtn || !pdfFrame) return;

  const openModal = (e) => {
    // Check if on a mobile viewport, iPad, or tablet device to redirect to cv.html
    const isMobileOrTablet =
      window.innerWidth <= 1024 ||
      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isMobileOrTablet) {
      // Redirect to the CV wrapper page that has a back button
      if (e) e.preventDefault();
      window.location.href = "cv.html";
      return;
    }

    // On desktop, prevent opening the link and show the modal instead
    if (e) e.preventDefault();

    // Lazy-load the PDF only when opening
    if (!pdfFrame.src || pdfFrame.src === window.location.href) {
      pdfFrame.src = "cv.pdf";
    }
    pdfModal.showModal();
    document.body.style.overflow = "hidden";

    // Add active class on next frame to trigger CSS transitions smoothly
    requestAnimationFrame(() => {
      pdfModal.classList.add("active");
    });
  };

  const closeModal = () => {
    pdfModal.classList.remove("active");
    document.body.style.overflow = "";

    // Wait for CSS transitions (0.35s / 350ms) before calling close()
    setTimeout(() => {
      pdfModal.close();
    }, 350);
  };

  viewCvBtn.addEventListener("click", openModal);
  pdfCloseBtn.addEventListener("click", closeModal);

  // Close on clicking backdrop
  pdfModal.addEventListener("click", (e) => {
    if (e.target === pdfModal) {
      closeModal();
    }
  });

  // Handle Esc key smooth exit animation by intercepting dialog cancel event
  pdfModal.addEventListener("cancel", (e) => {
    e.preventDefault(); // Prevent instant browser close
    closeModal();
  });
};

initPdfViewer();

// =============================================
// TYPED TEXT ANIMATION
// =============================================
const initTypedText = () => {
  const subtitle = document.querySelector(".hero-subtitle");
  if (!subtitle) return;

  // Skip animation for reduced-motion users
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return; // Keep the static HTML as-is
  if (window.matchMedia("(max-width: 767px)").matches) return;

  // The full subtitle as segments with optional color
  const segments = [
    { text: "Building Tech. ", color: "" },
    { text: "Analyzing Markets.", color: "var(--color-emerald-500)" },
    { text: "\n", color: "" }, // line break
    { text: "Mentoring Minds. ", color: "var(--color-rose-500)" },
    { text: "Creating Impact.", color: "var(--color-orange-500)" },
  ];

  // Flatten segments into a character array with color info
  const chars = [];
  segments.forEach((seg) => {
    for (const ch of seg.text) {
      chars.push({ ch, color: seg.color });
    }
  });

  subtitle.classList.add("typing-active");

  // Create typed output
  const typedOutput = document.createElement("span");
  typedOutput.className = "typed-output";

  subtitle.appendChild(typedOutput);

  const typeSpeed = 90;
  const deleteSpeed = 25;
  const pauseAfterType = 2200;
  const pauseAfterDelete = 400;
  const totalCycles = 1;
  let currentCycle = 0;
  let charIndex = 0;
  let isDeleting = false;

  const buildHTML = (upTo) => {
    let html = "";
    let currentColor = null;
    for (let i = 0; i < upTo; i++) {
      const { ch, color } = chars[i];
      if (ch === "\n") {
        if (currentColor) {
          html += "</span>";
          currentColor = null;
        }
        html += "<br>";
        continue;
      }
      if (color !== (currentColor || "")) {
        if (currentColor) html += "</span>";
        if (color) html += `<span style="color: ${color}">`;
        currentColor = color || null;
      }
      html += ch;
    }
    if (currentColor) html += "</span>";
    return html;
  };

  const tick = () => {
    if (!isDeleting) {
      charIndex++;
      typedOutput.innerHTML = buildHTML(charIndex);

      if (charIndex === chars.length) {
        currentCycle++;
        if (currentCycle >= totalCycles) {
          return;
        }
        // Pause then start deleting
        setTimeout(() => {
          isDeleting = true;
          tick();
        }, pauseAfterType);
        return;
      }
      setTimeout(tick, typeSpeed + Math.random() * 25);
    } else {
      charIndex--;
      typedOutput.innerHTML = buildHTML(charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        setTimeout(tick, pauseAfterDelete);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  };

  setTimeout(tick, 600);
};

initTypedText();

// =============================================
// ABOUT & STORY (TABS / ACCORDION) CONTROLLERS
// =============================================
const initAboutBioToggle = () => {
  const aboutBioBtn = document.getElementById("aboutBioBtn");
  const aboutBioExpandable = document.getElementById("aboutBioExpandable");

  if (!aboutBioBtn || !aboutBioExpandable) return;

  aboutBioBtn.addEventListener("click", () => {
    const isExpanded = aboutBioExpandable.classList.toggle("expanded");
    aboutBioBtn.classList.toggle("expanded", isExpanded);
    aboutBioBtn.setAttribute("aria-expanded", isExpanded ? "true" : "false");

    const textSpan = aboutBioBtn.querySelector("span");
    if (textSpan) {
      textSpan.textContent = isExpanded ? "View Less" : "View More";
    }
  });
};

const initAboutTabs = () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  if (tabButtons.length === 0) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all tab buttons
      tabButtons.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");

      // Hide all panels
      tabPanels.forEach((panel) => panel.classList.remove("active"));

      // Show target panel
      const tabName = btn.getAttribute("data-tab");
      const targetPanel = document.getElementById(`panel-${tabName}`);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
};

initAboutBioToggle();
initAboutTabs();

// =============================================
// TESTIMONIALS CAROUSEL
// Data lives in src/constants/testimonials.js so the UI stays API/CMS-ready.
// =============================================
const initTestimonials = () => {
  const carousel = document.getElementById("testimonialsCarousel");
  const track = document.getElementById("testimonialsTrack");
  const indicators = document.getElementById("testimonialsIndicators");
  const status = document.getElementById("testimonialsStatus");
  if (!carousel || !track || !indicators || !status) return;

  const testimonials = Array.isArray(window.TESTIMONIALS)
    ? window.TESTIMONIALS
    : [];
  const previous = carousel.querySelector(".testimonials-prev");
  const next = carousel.querySelector(".testimonials-next");
  const viewport = carousel.querySelector(".testimonials-viewport");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let position = 0;
  let visibleCount = 1;
  let pauseAutoplay = false;
  let autoplayTimer;
  let dragStartX = null;

  const initialsFor = (name) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const createCard = (testimonial, isClone = false) => {
    const card = createElement("article", "testimonial-card");
    if (testimonial.featured) card.classList.add("is-featured");
    if (isClone) card.setAttribute("aria-hidden", "true");
    
    // Add pointer cursor since card is clickable
    card.style.cursor = "pointer";
    
    // Bind click to open testimonial modal
    card.addEventListener("click", () => {
      openTestimonialModal(testimonial);
    });

    const person = createElement("div", "testimonial-person");
    const avatar = createElement("div", "testimonial-avatar");
    const fallback = createElement("span", "testimonial-avatar-fallback", initialsFor(testimonial.name));
    avatar.appendChild(fallback);
    if (testimonial.image) {
      const image = document.createElement("img");
      image.className = "testimonial-avatar-image";
      image.src = testimonial.image;
      image.alt = `Photo of ${testimonial.name}, ${testimonial.role} at ${testimonial.organization}`;
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => image.remove());
      avatar.appendChild(image);
    }
    person.appendChild(avatar);

    const personCopy = createElement("div", "testimonial-person-copy");
    personCopy.append(
      createElement("h3", "testimonial-name", testimonial.name),
      createElement("p", "testimonial-role", testimonial.role),
      createElement("p", "testimonial-organization", testimonial.organization)
    );
    person.appendChild(personCopy);

    const meta = createElement("div", "testimonial-meta");
    meta.append(
      createElement("span", "testimonial-category", testimonial.category)
    );

    const quote = createElement("p", "testimonial-quote", `“${testimonial.testimonial}”`);
    const footer = createElement("footer", "testimonial-footer");
    footer.appendChild(createElement("span", "testimonial-country", testimonial.country || ""));
    
    // Professional Links Configuration
    const socialConfigs = [
      { key: "linkedin", label: "LinkedIn", icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>' },
      { key: "companyWebsite", label: "Company", icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>' },
      { key: "personalWebsite", label: "Website", icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>' },
      { key: "github", label: "GitHub", icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>' }
    ];

    const activeLinks = socialConfigs.filter(config => testimonial[config.key]);

    if (activeLinks.length > 0) {
      const linksContainer = createElement("div", "testimonial-social-links");
      
      activeLinks.forEach(config => {
        const link = document.createElement("a");
        link.className = "testimonial-social-link";
        link.href = testimonial[config.key];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", `View ${testimonial.name}'s ${config.label} Profile`);
        
        // Structure: Icon + Label + Arrow
        link.innerHTML = `
          ${config.icon}
          <span>${config.label}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
        `;
        
        // Prevent click from bubbling up and opening the modal
        link.addEventListener("click", (e) => e.stopPropagation());
        
        linksContainer.appendChild(link);
      });
      
      footer.appendChild(linksContainer);
    }
    card.append(person, meta, quote, footer);
    return card;
  };
  
  // Testimonial Modal Logic
  const testimonialModal = document.getElementById("testimonialModal");
  const testimonialModalAvatar = document.getElementById("testimonialModalAvatar");
  const testimonialModalName = document.getElementById("testimonialModalName");
  const testimonialModalRole = document.getElementById("testimonialModalRole");
  const testimonialModalOrg = document.getElementById("testimonialModalOrg");
  const testimonialModalQuote = document.getElementById("testimonialModalQuote");
  const closeTestimonialModalBtn = document.getElementById("testimonialModalCloseBtn");

  const openTestimonialModal = (testimonial) => {
    // Populate data
    testimonialModalName.textContent = testimonial.name;
    testimonialModalRole.textContent = testimonial.role;
    testimonialModalOrg.textContent = testimonial.organization;
    testimonialModalQuote.textContent = `“${testimonial.testimonial}”`;
    
    // Avatar
    testimonialModalAvatar.replaceChildren();
    const fallback = createElement("span", "testimonial-avatar-fallback", initialsFor(testimonial.name));
    testimonialModalAvatar.appendChild(fallback);
    if (testimonial.image) {
      const image = document.createElement("img");
      image.className = "testimonial-avatar-image";
      image.src = testimonial.image;
      image.alt = `Photo of ${testimonial.name}, ${testimonial.role} at ${testimonial.organization}`;
      image.addEventListener("error", () => image.remove());
      testimonialModalAvatar.appendChild(image);
    }

    // Open Modal
    testimonialModal.showModal();
    // Use requestAnimationFrame for transition
    requestAnimationFrame(() => {
      testimonialModal.classList.add("active");
    });
    document.body.style.overflow = "hidden";
  };

  const closeTestimonialModal = () => {
    testimonialModal.classList.remove("active");
    // Wait for transition before closing
    setTimeout(() => {
      testimonialModal.close();
      document.body.style.overflow = "";
    }, 350);
  };

  if (closeTestimonialModalBtn) {
    closeTestimonialModalBtn.addEventListener("click", closeTestimonialModal);
  }
  
  if (testimonialModal) {
    testimonialModal.addEventListener("click", (e) => {
      if (e.target === testimonialModal) {
        closeTestimonialModal();
      }
    });
    testimonialModal.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeTestimonialModal();
    });
  }

  const getVisibleCount = () => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const setReveal = () => {
    document.querySelectorAll(".testimonial-reveal").forEach((element) => {
      element.classList.add("is-visible");
    });
  };

  if (!testimonials.length) {
    carousel.classList.add("is-empty");
    track.appendChild(createElement("p", "testimonials-empty", "Recommendations coming soon."));
    setReveal();
    return;
  }

  const updateCards = () => {
    [...track.children].forEach((card) => card.classList.remove("is-active"));
    const activeCard = track.children[position + Math.floor(visibleCount / 2)];
    if (activeCard) activeCard.classList.add("is-active");
  };

  const updateIndicators = () => {
    [...indicators.children].forEach((indicator, index) => {
      const isActive = index === activeIndex;
      indicator.setAttribute("aria-selected", isActive ? "true" : "false");
      indicator.tabIndex = isActive ? 0 : -1;
    });
    status.textContent = `Recommendation ${activeIndex + 1} of ${testimonials.length}`;
  };

  const checkBounds = () => {
    if (position <= 0) {
      position += testimonials.length;
      moveTrack(false);
    } else if (position >= testimonials.length + visibleCount) {
      position -= testimonials.length;
      moveTrack(false);
    }
  };

  const moveTrack = (animate = true) => {
    const activeCard = track.children[position];
    if (!activeCard) return;
    
    const shouldAnimate = animate && !reducedMotion;
    track.style.transition = shouldAnimate ? "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)" : "none";
    track.style.transform = `translate3d(-${activeCard.offsetLeft}px, 0, 0)`;
    
    updateCards();
    updateIndicators();

    if (!shouldAnimate) {
      checkBounds();
    }
  };

  const build = () => {
    visibleCount = getVisibleCount();
    track.replaceChildren();
    const leading = testimonials.slice(-visibleCount);
    const trailing = testimonials.slice(0, visibleCount);
    leading.forEach((item) => track.appendChild(createCard(item, true)));
    testimonials.forEach((item) => track.appendChild(createCard(item)));
    trailing.forEach((item) => track.appendChild(createCard(item, true)));
    position = visibleCount + activeIndex;

    indicators.replaceChildren();
    testimonials.forEach((item, index) => {
      const indicator = createElement("button", "testimonial-indicator");
      indicator.type = "button";
      indicator.setAttribute("role", "tab");
      indicator.setAttribute("aria-label", `Show recommendation from ${item.name}`);
      indicator.addEventListener("click", () => {
        activeIndex = index;
        position = visibleCount + activeIndex;
        moveTrack();
      });
      indicators.appendChild(indicator);
    });
    requestAnimationFrame(() => moveTrack(false));
  };

  const changeSlide = (direction) => {
    const newPosition = position + direction;
    if (newPosition < 0 || newPosition >= track.children.length) return;
    
    position = newPosition;
    activeIndex = (activeIndex + direction + testimonials.length) % testimonials.length;
    moveTrack();
  };

  track.addEventListener("transitionend", checkBounds);

  previous.addEventListener("click", () => changeSlide(-1));
  next.addEventListener("click", () => changeSlide(1));
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") changeSlide(-1);
    if (event.key === "ArrowRight") changeSlide(1);
  });
  viewport.addEventListener("pointerdown", (event) => {
    dragStartX = event.clientX;
    pauseAutoplay = true;
  });
  viewport.addEventListener("pointerup", (event) => {
    if (dragStartX === null) return;
    const distance = event.clientX - dragStartX;
    if (Math.abs(distance) > 40) changeSlide(distance > 0 ? -1 : 1);
    dragStartX = null;
    pauseAutoplay = false;
  });
  viewport.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 18) return;
    event.preventDefault();
    changeSlide(event.deltaX > 0 ? 1 : -1);
  }, { passive: false });
  carousel.addEventListener("mouseenter", () => { pauseAutoplay = true; });
  carousel.addEventListener("mouseleave", () => { pauseAutoplay = false; });
  carousel.addEventListener("focusin", () => { pauseAutoplay = true; });
  carousel.addEventListener("focusout", () => { pauseAutoplay = false; });
  window.addEventListener("resize", () => {
    const nextVisibleCount = getVisibleCount();
    if (nextVisibleCount !== visibleCount) build();
    else requestAnimationFrame(() => moveTrack(false));
  });

  if (!reducedMotion && testimonials.length > 1) {
    autoplayTimer = window.setInterval(() => {
      if (!pauseAutoplay) changeSlide(1);
    }, 6200);
  }
  void autoplayTimer;
  build();

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setReveal();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealObserver.observe(carousel);
};

initTestimonials();

// =============================================
// RICH TEXT PARSER — formatRichText()
// =============================================
// Converts lightweight inline markup tokens into semantic HTML.
// Supported syntax:
//   **bold**          → <strong>
//   ==highlight==     → <span class="rt-highlight">
//   `inline code`     → <code class="rt-code">
//   *italic*          → <em>
//   - bullet list     → <ul><li>
//   1. numbered list  → <ol><li>
//   > Type: text      → callout block (Insight, Note, Warning)
//   Double newline    → new paragraph
//   Single newline    → <br> (within paragraph)
//
// Security: All raw text is HTML-escaped before token parsing.
// No external dependencies. Pure JavaScript. Static-deploy safe.
// =============================================

const formatRichText = (text) => {
  if (!text || typeof text !== "string") return "";

  // Step 1: Escape HTML entities to prevent injection
  const escapeHTML = (str) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  // Step 2: Inline token parser (applied to already-escaped text)
  const parseInline = (str) => {
    // Order matters: bold (**) before italic (*) to avoid conflicts
    return (
      str
        // Bold: **text**
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        // Highlight: ==text==
        .replace(/==(.+?)==/g, '<span class="rt-highlight">$1</span>')
        // Inline code: `text`
        .replace(/`([^`]+)`/g, '<code class="rt-code">$1</code>')
        // Italic: *text* (must not match already-consumed ** pairs)
        .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    );
  };

  // Step 3: Escape the full text
  const escaped = escapeHTML(text);

  // Step 4: Split into blocks by double newline
  const blocks = escaped.split(/\n\n+/);

  // Step 5: Process each block
  const rendered = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      // --- Callout block: starts with &gt; (escaped ">") ---
      // Supports: > Insight: ..., > Note: ..., > Warning: ...
      if (trimmed.startsWith("&gt;")) {
        const calloutContent = trimmed.replace(/^&gt;\s*/, "");
        const calloutMatch = calloutContent.match(
          /^(Insight|Note|Warning|Tip|Important):\s*([\s\S]*)/i
        );
        if (calloutMatch) {
          const type = calloutMatch[1].toLowerCase();
          const body = parseInline(calloutMatch[2].replace(/\n/g, "<br>"));
          return `<div class="rt-callout rt-callout-${type}"><div class="rt-callout-label">${calloutMatch[1]}</div><div class="rt-callout-body">${body}</div></div>`;
        }
        // Plain blockquote without a type label
        const body = parseInline(calloutContent.replace(/\n/g, "<br>"));
        return `<div class="rt-callout"><div class="rt-callout-body">${body}</div></div>`;
      }

      // --- Bullet list: lines starting with "- " ---
      const bulletLines = trimmed.split("\n");
      if (bulletLines.every((line) => /^-\s+/.test(line.trim()))) {
        const items = bulletLines
          .map(
            (line) =>
              `<li>${parseInline(line.trim().replace(/^-\s+/, ""))}</li>`
          )
          .join("");
        return `<ul class="rt-ul">${items}</ul>`;
      }

      // --- Numbered list: lines starting with "1. ", "2. ", etc. ---
      if (bulletLines.every((line) => /^\d+\.\s+/.test(line.trim()))) {
        const items = bulletLines
          .map(
            (line) =>
              `<li>${parseInline(line.trim().replace(/^\d+\.\s+/, ""))}</li>`
          )
          .join("");
        return `<ol class="rt-ol">${items}</ol>`;
      }

      // --- Regular paragraph ---
      const content = parseInline(trimmed.replace(/\n/g, "<br>"));
      return `<p class="rt-paragraph">${content}</p>`;
    })
    .filter(Boolean);

  return rendered.join("");
};

const getProjectIconSvg = (type) => {
  const attrs =
    'xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"';
  const icons = {
    monitor: `<svg ${attrs} aria-hidden="true"><rect width="18" height="12" x="3" y="4" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/></svg>`,
    phone: `<svg ${attrs} aria-hidden="true"><rect width="12" height="20" x="6" y="2" rx="2"/><path d="M11 18h2"/></svg>`,
    server: `<svg ${attrs} aria-hidden="true"><rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/></svg>`,
    database: `<svg ${attrs} aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>`,
    check: `<svg ${attrs} aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`,
    sparkle: `<svg ${attrs} aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
    diamond: `<svg ${attrs} aria-hidden="true"><path d="m12 3 9 9-9 9-9-9 9-9Z"/></svg>`,
    dot: `<svg ${attrs} aria-hidden="true"><circle cx="12" cy="12" r="3"/></svg>`,
  };
  return icons[type] || icons.monitor;
};

const getPlatformIconSvg = (platform) => {
  const lower = platform.toLowerCase();
  if (
    lower.includes("mobile") ||
    lower.includes("react native") ||
    lower.includes("ios") ||
    lower.includes("android")
  ) {
    return getProjectIconSvg("phone");
  }
  if (
    lower.includes("api") ||
    lower.includes("backend") ||
    lower.includes("microservice") ||
    lower.includes("server") ||
    lower.includes("scraping") ||
    lower.includes("script") ||
    lower.includes("console")
  ) {
    return getProjectIconSvg("server");
  }
  if (
    lower.includes("db") ||
    lower.includes("database") ||
    lower.includes("postgres") ||
    lower.includes("sql") ||
    lower.includes("mongo") ||
    lower.includes("redis") ||
    lower.includes("cluster") ||
    lower.includes("caching") ||
    lower.includes("storage")
  ) {
    return getProjectIconSvg("database");
  }
  return getProjectIconSvg("monitor");
};

// Plain-text stripper for clamped card previews (strips all markup tokens)
const stripRichTokens = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/==(.+?)==/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "$1")
    .replace(/^>\s*(Insight|Note|Warning|Tip|Important):\s*/gim, "")
    .replace(/^[-]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\n\n+/g, " ")
    .replace(/\n/g, " ");
};

// =============================================
// SELECTED WORK — PROJECT DATA
// ===========================// Edit this array to add, remove, or reorder projects.
// Cards are rendered dynamically from this data.
const PROJECTS = [
  {
    title: "BasukiMS",
    headline:
      "Leading the Digital Transformation of a 30-Year Transport Legacy.",
    categories: ["Logistics & Enterprise", "AI & Automation", "SaaS Platforms"],
    overview:
      "Led the conception, strategy, and end-to-end execution of **BasukiMS**, an ==enterprise-grade fleet management and transport operations SaaS platform== built to modernize Nepal's logistics industry. The platform features **GatiAI**, a proprietary AI system powered by **Qwen**, to automate complex operational workflows. Defined the product vision, designed the core business workflows, and translated complex operational challenges into scalable digital solutions tailored for transport companies.\n\n> Insight: Modernizing a legacy, offline-first industry required bridging manual operational trust with real-world automated guardrails.",
    sections: [
      {
        label: "BUSINESS CONTEXT & PROBLEM",
        title: "Legacy Logistics Inefficiencies",
        content:
          "Nepal's logistics sector has traditionally operated on fragmented, manual, paper-based workflows with minimal transparency. Dispatch decisions were made based on ad-hoc phone calls, compliance verification for driver licenses and vehicle registration (bluebooks) was highly error-prone, and fuel fraud or cost leakages were rampant. Basuki Transport needed a digital operating system to centralize operations, secure compliance, and prevent financial leakages across their fleet.",
      },
      {
        label: "SOLUTION & TECH STACK",
        title: "Multi-Tenant Fleet Resource Engine",
        content:
          "We designed and built BasukiMS, a multi-tenant fleet resource engine. The tech stack comprises a React web interface, an Express API gateway, a PostgreSQL database, and integrated third-party SMS, payment gateways, and geolocation telemetry. GatiAI integrates Qwen LLMs to perform automated document verification, extracting driver licenses and permit details directly to prevent compliance failures.",
      },
      {
        label: "ARCHITECTURE",
        title: "Modular System Architecture",
        content:
          "Designed and engineered the overall platform, including its **multi-tenant infrastructure**, **security model**, **permission framework**, and **modular system architecture**. Designed the systems to handle high-throughput telemetry, real-time dispatch operations, and complex nested user privilege mapping.",
      },
      {
        label: "ENGINEERING DECISIONS",
        title: "Core Backend Ingestion Pipeline",
        content:
          "A major engineering challenge was processing high-frequency geolocation telemetry streams from fleet vehicles without overloading the database. We built a telemetry ingestion pipeline that buffers location data before performing batch operations. Additionally, to handle nested administrative privileges across multiple offices, we implemented a custom Role-Based Access Control (RBAC) engine that handles granular permissions dynamically. Contributed extensively as a Backend Engineer, developing core APIs, business logic, database architecture, authentication systems, and infrastructure while maintaining a strong focus on scalability, security, and maintainability. Led the integration of third-party SMS, payment gateways, and geolocation telemetry processing.",
      },
      {
        label: "INTELLIGENT SYSTEMS",
        title: "Operational Automation",
        content:
          "Spearheaded the design of advanced capabilities, including **GatiAI**—the platform's proprietary AI system powered by **Qwen**:\n\n- **AI-assisted document processing** for automated license and permit verification\n- **Intelligent compliance monitoring** to prevent regulatory violations\n- **Predictive financial insights** for fleet fuel and maintenance costs\n- **Automated dispatch workflows** based on vehicle proximity",
      },
      {
        label: "RESULTS & IMPACT",
        title: "Measurable Operational Optimization",
        content:
          "BasukiMS successfully transitioned Basuki Transport's operations from manual ledgers to an automated, auditable system. The implementation resulted in a 40% reduction in document verification time, eliminated manual dispatch errors, and provided real-time visibility into fuel consumption and operational margins. The core lesson was that technology must align with operational realities on the ground, requiring intuitive mobile-friendly designs for terminal staff. Directed product management, project planning, stakeholder communication, legal and regulatory compliance, operational processes, human resource management, client onboarding, and executive decision-making. Coordinated cross-functional teams throughout the product lifecycle, balancing technical excellence with business objectives to successfully transform the platform from an initial concept into a comprehensive enterprise solution.",
      },
    ],
    focus: [
      "Workflow Automation",
      "Enterprise Resource Planning",
      "Operational Intelligence",
      "Platform Architecture",
    ],
    platform: [
      "Web Application (React)",
      "Express API Backend",
      "PostgreSQL Database",
      "Geolocation Tracking API",
    ],
    coreSystems: [
      "Multi-Tenant Fleet Engine",
      "Automated Operational Workflows",
      "Document Verification Pipeline",
      "Dynamic Financial Reporting",
    ],
    aiCollaboration: [
      "GatiAI (Proprietary AI Integration)",
      "Qwen AI Models Integration",
      "AI-Assisted Document Processing",
    ],
    gradient: "linear-gradient(135deg, #f5576c22 0%, #f093fb22 100%)",
    accentColor: "#f5576c",
    status: "Production",
    projectLinks: [
      {
        label: "Company Website",
        display: "www.basukitransport.com",
        href: "https://www.basukitransport.com",
      },
      {
        label: "Management System",
        display: "ms.basukitransport.com",
        href: "https://ms.basukitransport.com",
      },
    ],
    architectureDiagram: [
      "React Web App",
      "Express Backend",
      "PostgreSQL Database",
      "SMS & Payment APIs",
      "Telemetry Processing",
    ],
  },
  {
    title: "Dhewaa",
    headline:
      "An experimental project to test the limits of AI in software development.",
    categories: ["FinTech", "AI & Automation", "SaaS Platforms"],
    overview:
      "As a **Backend & Product Engineer** and **AI Engineering Collaborator**, I led the design and implementation of **Dhewaa**, an ==enterprise financial management platform== developed as a *pure software engineering experiment* to explore the practical limits of AI-assisted product development. The objective was not only to build production-grade software, but also to understand where AI can accelerate engineering and where human engineering reasoning remains indispensable. The platform includes both a cross-platform mobile application built with React Native (Expo) and a modern web application, supported by a scalable Express and PostgreSQL backend.\n\n> Note: This architecture blueprint serves as a case study demonstrating how multiple AI models can be orchestrated under strict human validation.",
    sections: [
      {
        label: "BUSINESS CONTEXT & PROBLEM",
        title: "Autonomous Financial Engineering",
        content:
          "Managing financial transactions, loan amortization schedules, and ledger reconciliation usually requires slow, manual bookkeeping or fragmented platforms. We wanted to design a highly scalable, single-ledger double-entry system that could reconcile multi-party debts automatically while testing the efficacy of autonomous AI coding agents in writing mathematically sound financial logic under human supervision.",
      },
      {
        label: "SOLUTION & TECH STACK",
        title: "Structured Financial Operations",
        content:
          "The platform features a double-entry accounting engine ensuring strict mathematical balance, a loan management scheduler, a multi-party settlement optimizer, and an encrypted document vault. Built on Express and PostgreSQL, with React Native (Expo) and React web frontends, the system relies on structured schema design, transaction isolation levels, and automated reconciliation routines.",
      },
      {
        label: "FINANCIAL ENGINE",
        title: "Double-Entry Accounting & Systems",
        content:
          "The system simplifies accounting, lending, document management, and business operations through a comprehensive architecture featuring:\n\n- **Double-entry accounting engine** ensuring strict mathematical balance\n- **Loan management & amortization scheduler**\n- **Multi-party settlement optimizer** to minimize transactions\n- **Secure document vault** with end-to-end encryption\n- **Multi-tenant database routing**\n\nEvery subsystem was designed around enterprise engineering principles with a strong emphasis on modular services, transactional consistency, efficient indexing strategies, security, and horizontal scalability.",
      },
      {
        label: "CHALLENGES & DECISIONS",
        title: "Ensuring Ledger Integrity",
        content:
          "Ensuring transactional consistency in multi-party settlements was the biggest challenge. A single database failure mid-transaction could corrupt ledger balances. We implemented database-level transactions with strict serialized isolation and built an automated audit log that tracks every debit and credit entry. In AI collaboration, we experienced authentication edge cases and schema migration inconsistencies which required human intervention to enforce architectural integrity.",
      },
      {
        label: "AI COLLABORATION",
        title: "Human Architectural Validation",
        content:
          "A defining aspect of the project was the structured collaboration between multiple AI engineering agents. I orchestrated the responsibilities of specialized AI models while maintaining complete architectural ownership, validating every critical design decision and implementation strategy.\n\nThroughout development, the project documented real-world AI engineering challenges—including authentication edge cases, schema migration inconsistencies, SDK compatibility issues, and architectural validation—providing valuable insight into both the strengths and limitations of current AI-assisted software engineering workflows.",
      },
      {
        label: "RESULTS & IMPACT",
        title: "Blueprint for Enterprise Ready Systems",
        content:
          "The project successfully proved that while AI agents can write boilerplate and optimize complex query algorithms (e.g., Dijkstra's for debt settlement), humans must remain the core architects. Dhewaa resulted in a production-ready financial blueprint that reconciles transactions with zero mathematical drift, demonstrating a 3x development speedup through structured AI orchestration. The resulting blueprint serves not only as the implementation guide for Dhewaa, but also as a comprehensive case study in AI-assisted enterprise software engineering, demonstrating how intelligent collaboration between humans and AI can dramatically accelerate development while preserving architectural quality, technical rigor, scalability, and production readiness.",
      },
    ],
    focus: [
      "AI-Assisted Engineering",
      "Financial Infrastructure",
      "Cross-Platform Systems",
      "Platform Engineering",
    ],
    platform: [
      "Mobile App (React Native/Expo)",
      "Web Application (React)",
      "Express API Gateway",
      "PostgreSQL Database",
    ],
    coreSystems: [
      "Double Entry Accounting",
      "Loan Ledger Engine",
      "Settlement Optimization",
      "Encrypted Document Vault",
      "Multi-Tenancy Routing",
    ],
    aiCollaboration: [
      "Antigravity Agent Orchestration",
      "Claude Code Generation",
      "Gemini Reasoning Engine",
    ],
    gradient: "linear-gradient(135deg, #4facfe22 0%, #00f2fe22 100%)",
    accentColor: "#4facfe",
    status: "Case Study / Specification",
    architectureDiagram: [
      "React Native / React",
      "Express API Gateway",
      "PostgreSQL Database",
      "Encrypted Document Vault",
    ],
  },
  {
    title: "Aroma Ecosystem",
    headline: "Where E-commerce Meets Intelligent Operations",
    categories: ["Logistics & Enterprise", "SaaS Platforms"],
    overview:
      "As Co-founder and CEO of Iruka Technologies, I led the conception, strategy, and execution of the **Aroma Ecosystem**, an ==enterprise commerce platform== designed to modernize how brands, merchants, warehouses, and logistics partners operate together. Rather than building another marketplace, the objective was to create a unified operational ecosystem that transforms fragmented manual processes into scalable, data-driven commerce.",
    sections: [
      {
        label: "BUSINESS CONTEXT & PROBLEM",
        title: "Fulfillment & Inventory Bottlenecks",
        content:
          "Nepal's e-commerce landscape is plagued by high return-to-origin (RTO) rates, slow fulfillment times, and manual inventory tracking between merchant stores and physical warehouses. Merchants lacked real-time visibility into stock health, leading to over-selling or deadstock, while logistics processes were entirely disconnected from ordering platforms.",
      },
      {
        label: "SOLUTION & TECH STACK",
        title: "Integrated Supply Chain Platform",
        content:
          "We designed the **Nexus** warehouse automation core and replenishment system, integrating inventory, fulfillment, and transport. Built on a Node.js microservices backend, Redis cache clusters, and PostgreSQL, the platform connects directly with nationwide delivery partners like Pathao and PickNDrop to automate shipping label generation, quality control unit verification, and automatic payouts.",
      },
      {
        label: "WAREHOUSE AUTOMATION",
        title: "Nexus: The Operational Core",
        content:
          "I designed the proof of concept (POC) for **Nexus**, Aroma's warehouse and order automation platform, serving as the operational backbone of the ecosystem. The platform manages the complete commerce lifecycle:\n\n- Vendor onboarding & procurement\n- Real-time inventory management\n- Warehouse operations & order fulfillment\n- Quality control unit verification\n- Biweekly automatic vendor settlements\n\nTo strengthen trust across the marketplace, I introduced the **Quality Control Unit (QCU)**, standardized SKU management, and established structured operational workflows that ensure product authenticity, consistency, and efficiency.",
      },
      {
        label: "CHALLENGES & DECISIONS",
        title: "Concurrent Locking & Telemetry",
        content:
          "Managing concurrent inventory lockouts during high-traffic flash sales was a critical bottleneck. We resolved this by implementing Redis-based lockouts and queue-based order processing to prevent stock overselling. We also introduced the Quality Control Unit (QCU) verification workflow to validate items physically at the warehouse gate before they entered fulfillment channels. Collaborated with third party logistics partners, including `Pathao Parcel` and `PickNDrop Nepal`, to establish dependable nationwide fulfillment and last mile delivery operations that extended the ecosystem beyond software into real world commerce.",
      },
      {
        label: "RESULTS & IMPACT",
        title: "Product Growth & Vision",
        content:
          "The Aroma Ecosystem grew from a conceptual design to a launch-ready platform. Merchants utilizing the pilot warehouse integrations experienced a 25% reduction in fulfillment cycles and an 18% drop in RTO rates due to QCU checks. The project underscored that automating digital workflows is only half the battle; software must seamlessly synchronize with physical logistics. Led finance, regulatory compliance, business development, marketing strategy, and executive decision making to ensure the platform evolved alongside the business it was built to support. After nearly three years of continuous development and refinement, Aroma matured into a commerce ecosystem ready for market launch. Although I stepped away from the project to pursue my master's degree, it remains one of my most significant experiences in product leadership, enterprise systems, operational excellence, and building technology that solves complex business challenges at scale.",
      },
    ],
    focus: [
      "Commerce Ecosystem",
      "Warehouse Automation",
      "Supply Chain Operations",
      "Multi Vendor Commerce",
      "Business Strategy",
      "Operational Excellence",
    ],
    platform: [
      "Multi-Merchant Web Portal",
      "Node.js Microservices",
      "Redis Caching Server",
      "PostgreSQL Cluster",
    ],
    coreSystems: [
      "Inventory Health Monitor",
      "Automated Replenishment Engine",
      "Vendor Settlement System",
      "QCU Quality Verification",
    ],
    gradient: "linear-gradient(135deg, #667eea22 0%, #764ba222 100%)",
    accentColor: "#667eea",
    status: "Completed / Ready for Launch",
    architectureDiagram: [
      "Multi-Merchant Web Portal",
      "Node.js Microservices",
      "Redis Caching",
      "PostgreSQL Cluster",
    ],
  },
  {
    title: "Leo Multiple District 325 CMS",
    headline:
      "Building the digital operating system for Nepal’s largest Leo organization.",
    categories: ["SaaS Platforms"],
    overview: `As the **Product Owner**, I led the product strategy, feature planning, and system design for **Leo Multiple District 325 Nepal's** centralized digital platform. The objective was to replace fragmented administrative processes with a unified ecosystem that enables national leadership, district executives, local clubs, and members to operate through a single source of truth. By aligning organizational workflows with modern digital experiences, the platform establishes a scalable foundation for governance, collaboration, communication, and long-term institutional growth.`,
    sections: [
      {
        label: "BUSINESS CONTEXT & PROBLEM",
        title: "Administrative Fragmentation",
        content:
          "With 15 districts, hundreds of clubs, and thousands of members across Nepal, Leo Multiple District 325 struggled with manual administrative reporting, lack of centralized membership databases, and slow communication. Managing events, volunteer tracking, and leadership transition records relied heavily on physical paperwork and message threads.",
      },
      {
        label: "SOLUTION & TECH STACK",
        title: "Centralized Administrative Hub",
        content:
          "We built a centralized membership database, administrative CMS, and impact reporting system. The platform standardizes organizational workflows while preserving district-level autonomy, enabling leadership to manage nationwide operations through a consistent web portal. Key features include club directories, event schedulers, and public blog posting.",
      },
      {
        label: "PRODUCT STRATEGY",
        title: "Designing a Unified Organizational Ecosystem",
        content: `Defined the product vision, business requirements, user journeys, and information architecture for a platform capable of serving the complex hierarchy of **15 districts**, hundreds of clubs, and thousands of members. Planned a centralized ecosystem that standardizes organizational workflows while preserving district-level autonomy, enabling leadership to manage nationwide operations through a consistent and scalable digital experience.`,
      },
      {
        label: "CHALLENGES & DECISIONS",
        title: "User Accessibility & Role Hierarchies",
        content:
          "Designing an intuitive system that could be used by club officers of varying technical literacy was a major challenge. We solved this by developing simple forms with automated PDF report generators, turning complex activity data into structured administrative reports in a single click. We also built role hierarchy mapping to allow district officers to oversee local club details. Collaborated closely with designers, engineers, and organizational stakeholders to translate operational challenges into structured product requirements and implementation roadmaps.",
      },
      {
        label: "RESULTS & IMPACT",
        title: "Reduced Administrative Overhead",
        content:
          "The platform is currently in production, acting as the digital backbone for Nepal's largest Leo organization. It has digitized records for thousands of members and automated monthly activity reporting, reducing administrative overhead by 60%. The core lesson was that user experience is key when deploying software to non-technical community organizations. Prioritized usability, scalability, and maintainability throughout the planning process, ensuring the platform could continue evolving as the organization's long-term digital infrastructure while supporting future modules, analytics, and nationwide operational growth.",
      },
    ],
    focus: [
      "Product Strategy",
      "Information Architecture",
      "Workflow Design",
      "Organizational Digitalization",
    ],
    platform: [
      "Centralized Web Platform",
      "Administrative CMS",
      "Membership Management",
      "Content Management",
    ],
    coreSystems: [
      "District Management",
      "Membership Directory",
      "Event Management",
      "Impact Reporting",
      "Content Publishing",
    ],
    gradient: "linear-gradient(135deg, #10b98122 0%, #a8edea22 100%)",
    accentColor: "#10b981",
    status: "Production",
    projectLinks: [
      {
        label: "Live Website",
        display: "leomultiple325.com",
        href: "https://leomultiple325.com/",
      },
    ],
    architectureDiagram: [
      "Public Web Portal",
      "Administrative CMS",
      "District Management",
      "Membership System",
      "Content Publishing",
    ],
  },
  {
    title: "NepseBot",
    headline:
      "Converting fragmented market information into reliable investment intelligence.",
    categories: ["FinTech", "AI & Automation", "Research"],
    overview:
      "Built an automated market intelligence system that continuously transforms scattered public financial information into structured datasets, enabling faster analysis while eliminating repetitive manual collection.",
    sections: [
      {
        label: "BUSINESS CONTEXT & PROBLEM",
        title: "Scattered Market Information",
        content:
          "Analyzing Nepal's stock market (NEPSE) requires tracking floorsheets, price indices, broker transactions, and dividend announcements. Historically, this data was scattered across slow governmental portals, forcing analysts to manually copy records daily, leading to delay and errors in quantitative strategies.",
      },
      {
        label: "SOLUTION & TECH STACK",
        title: "Automated CLI Scraping Engine",
        content:
          "Developed NepseBot, an automated CLI data pipeline. Using Python scraping engines, cron scheduling, and an automated data parser, the system aggregates transaction records and outputs them into a query-optimized database structure. Tech stack includes Python, SQLite/PostgreSQL, and shell script scheduling.",
      },
      {
        label: "CHALLENGES & DECISIONS",
        title: "Data Ingestion Resilience",
        content:
          "The primary challenge was the unreliability of public NEPSE servers, which often fail or return incomplete data during peak trading hours. We designed a resilient scraping workflow with exponential backoff, rate limiting, and integrity checking to ensure that any dropped connections were retried and data holes were backfilled automatically.",
      },
      {
        label: "RESULTS & IMPACT",
        title: "Dataset Acceleration & Backtesting",
        content:
          "NepseBot operates as a fully automated data feeder. It has compiled chronological transaction datasets containing millions of rows, reducing manual data collection overhead to zero. This automated intelligence pipeline now enables near-instant queries for backtesting quantitative stock strategies.",
      },
    ],
    focus: [
      "Data Engineering",
      "Market Intelligence",
      "Automation Systems",
      "Information Processing",
    ],
    platform: [
      "CLI Application Console",
      "Python Scraping Scripts",
      "Cron Job Scheduler",
    ],
    coreSystems: [
      "Automated Web Scrapers",
      "Floorsheet Data Parser",
      "Chronological Pipeline",
    ],
    gradient: "linear-gradient(135deg, #f9731622 0%, #ffecd222 100%)",
    accentColor: "#f97316",
    status: "Completed / Automated",
    architectureDiagram: [
      "CLI Application Console",
      "Python Scraping Scripts",
      "Cron Job Scheduler",
      "Market Database",
    ],
  },
  {
    title: "Scholarr LMS",
    headline: "Bridging academic management with everyday productivity.",
    categories: ["EdTech", "SaaS Platforms"],
    overview:
      "Created a learning platform that connects educational workflows, assignments, progress tracking, and daily task organization into one collaborative environment, helping institutions operate more efficiently while improving the student learning experience.",
    sections: [
      {
        label: "BUSINESS CONTEXT & PROBLEM",
        title: "Academic Coordination Barriers",
        content:
          "Traditional learning systems are often clunky and focus purely on grading rather than assisting students in managing their daily workloads. Students struggle to balance assignments, class schedules, and personal studies, while instructors lack visibility into students' current task load and progress metrics.",
      },
      {
        label: "SOLUTION & TECH STACK",
        title: "Productivity-Led Learning System",
        content:
          "We designed Scholarr LMS, a productivity-focused learning platform. The tech stack comprises a React web application, Node.js API services, and a MongoDB database. The platform features task orchestration, JWT session security, course timeline scheduling, and performance analytics cards.",
      },
      {
        label: "CHALLENGES & DECISIONS",
        title: "Grade Privacy & Token Auths",
        content:
          "To ensure high security for academic grades and private student records, we engineered a secure token-based authentication mechanism using JSON Web Tokens (JWT) stored in HTTP-only cookies, combined with strict database-level query isolation to prevent cross-tenant access. We also designed a calendar aggregation module that merges course deadlines with personal tasks.",
      },
      {
        label: "RESULTS & IMPACT",
        title: "Improved Deadlines & Progress Audits",
        content:
          "Scholarr LMS successfully centralized academic workflows. The platform demonstrated a measurable improvement in assignment submission rates and enabled teachers to identify struggling students early using progress trackers. The project highlighted the value of integrating productivity tools directly into learning systems.",
      },
    ],
    focus: [
      "Learning Platforms",
      "Academic Workflows",
      "Secure Platform Design",
      "Task Orchestration",
    ],
    platform: [
      "React Web Application",
      "Node.js API Service",
      "MongoDB Storage Cluster",
    ],
    coreSystems: [
      "JSON Web Token Auth",
      "Syllabus Course Scheduler",
      "Task Progress Analytics",
    ],
    gradient: "linear-gradient(135deg, #6366f122 0%, #c3cfe222 100%)",
    accentColor: "#6366f1",
    status: "Completed",
    architectureDiagram: [
      "React Web Application",
      "Node.js API Service",
      "MongoDB Storage Cluster",
      "JWT Auth",
    ],
  },
];

// =============================================
// SELECTED WORK — RENDER CARDS
// =============================================
const initSelectedWork = () => {
  const stack = document.getElementById("workStack");
  if (!stack) return;

  PROJECTS.forEach((project, index) => {
    const num = String(index + 1).padStart(2, "0");

    const card = document.createElement("article");
    card.className = "work-card";
    card.setAttribute("data-work-index", index);
    card.style.cursor = "pointer"; // Make it clear the whole card is clickable

    card.innerHTML = `
            <div class="work-card-content">
                <div class="work-card-header-row">
                    <span class="work-card-number">${num}</span>
                    <h3 class="work-card-title">${project.title}</h3>
                </div>
                <p class="work-card-headline">${project.headline}</p>
                <p class="work-card-description clamped">${stripRichTokens(
                  project.overview
                )}</p>
                <button type="button" class="work-card-view-more" aria-label="View details for ${
                  project.title
                }">
                    <span>View details</span> <span class="view-more-arrow">→</span>
                </button>
                <div class="work-card-focus">
                    ${project.focus
                      .map(
                        (tag) => `<span class="work-focus-pill">${tag}</span>`
                      )
                      .join("")}
                </div>
            </div>
        `;

    // Attach event listener to trigger popup details modal on the entire card
    card.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.openWorkModal) {
        window.openWorkModal(project, num);
      }
    });

    stack.appendChild(card);
  });
};

// =============================================
// SELECTED WORK — DETAIL MODAL MANAGEMENT
// =============================================
const initWorkModal = () => {
  const modal = document.getElementById("workModal");
  if (!modal) return;
  modal.setAttribute("tabindex", "-1");

  const renderProjectLinks = (project) => {
    if (!project.projectLinks?.length) return "";

    return project.projectLinks
      .map(
        (link) => `
            <a class="project-link-item" href="${link.href}" target="_blank" rel="noopener noreferrer" aria-label="Open ${link.label} for ${project.title}">
                <span class="project-link-meta">
                    <span class="project-link-label">${link.label}</span>
                    <span class="project-link-url">${link.display}</span>
                </span>
                <span class="project-link-arrow" aria-hidden="true">↗</span>
            </a>
        `
      )
      .join("");
  };

  const renderProjectLinksCard = (
    project,
    cardClass,
    titleClass,
    title = "Project Links"
  ) => {
    const links = renderProjectLinks(project);
    if (!links) return "";

    return `
            <div class="${cardClass} project-links-card">
                <div class="${titleClass}">${title}</div>
                <div class="project-links-list">${links}</div>
            </div>
        `;
  };

  const setModalViewportHeight = () => {
    const viewportHeight = Math.round(
      window.visualViewport?.height ||
        window.innerHeight ||
        document.documentElement.clientHeight
    );
    modal.style.setProperty("--modal-viewport-height", `${viewportHeight}px`);
  };

  const syncOpenModalViewport = () => {
    if (modal.open || modal.classList.contains("active")) {
      setModalViewportHeight();
    }
  };

  window.addEventListener("resize", syncOpenModalViewport);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", syncOpenModalViewport);
    window.visualViewport.addEventListener("scroll", syncOpenModalViewport);
  }

  const navigateToProject = (targetProj, targetNum) => {
    const content = modal.querySelector(".project-modal");
    if (content) {
      content.style.opacity = "0";
      content.style.transform = "translateY(10px)";
      content.style.transition = "opacity 200ms ease, transform 200ms ease";
    }

    setTimeout(() => {
      window.openWorkModal(targetProj, targetNum);
      const newContent = modal.querySelector(".project-modal");
      if (newContent) {
        newContent.scrollTop = 0;
        // Also reset inner scroll containers
        const innerMobile = newContent.querySelector(
          ".project-modal-mobile-content"
        );
        const innerTablet = newContent.querySelector(
          ".project-modal-tablet-scroll"
        );
        if (innerMobile) innerMobile.scrollTop = 0;
        if (innerTablet) innerTablet.scrollTop = 0;

        newContent.style.opacity = "0";
        newContent.style.transform = "translateY(-10px)";
        requestAnimationFrame(() => {
          newContent.style.transition =
            "opacity 250ms cubic-bezier(0.16, 1, 0.3, 1), transform 250ms cubic-bezier(0.16, 1, 0.3, 1)";
          newContent.style.opacity = "1";
          newContent.style.transform = "translateY(0) translateX(0)";
        });
      }
    }, 200);
  };

  const renderMobileModal = (project, num) => {
    const currentIndex = PROJECTS.findIndex((p) => p.title === project.title);
    const prevProject =
      PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
    const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
    const prevNum = String(
      ((currentIndex - 1 + PROJECTS.length) % PROJECTS.length) + 1
    ).padStart(2, "0");
    const nextNum = String(((currentIndex + 1) % PROJECTS.length) + 1).padStart(
      2,
      "0"
    );

    modal.innerHTML = `
            <div class="project-modal mobile-version">
                <div class="project-modal-mobile-header">
                    <button class="mobile-header-back-btn" id="mobileBackBtn" aria-label="Go back">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <span class="project-modal-mobile-header-title" id="mobileHeaderTitle">${
                      project.title
                    }</span>
                    <button class="mobile-header-share-btn" id="mobileShareBtn" aria-label="Share case study">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                    </button>
                </div>
                <div class="project-modal-mobile-content">
                    <div class="mobile-hero-section">
                        <div class="mobile-hero-num">${num}</div>
                        <h1 class="mobile-hero-title">${project.title}</h1>
                        <p class="mobile-hero-headline">${project.headline}</p>
                        <div class="mobile-hero-summary">${formatRichText(
                          project.overview
                        )}</div>
                        
                        <div class="mobile-hero-focus-chips">
                            ${project.focus
                              .map(
                                (chip) =>
                                  `<span class="mobile-focus-chip">${chip}</span>`
                              )
                              .join("")}
                        </div>
                        ${renderProjectLinksCard(
                          project,
                          "mobile-project-links-card",
                          "mobile-section-label",
                          "Project Links"
                        )}
                    </div>
                    
                    <div class="mobile-divider"></div>

                    ${
                      project.platform
                        ? `
                        <div class="mobile-detail-section">
                            <span class="mobile-section-label">PLATFORM</span>
                            <h2 class="mobile-section-heading">Target Environment</h2>
                            <div class="mobile-platform-cards">
                                ${project.platform
                                  .map((plat) => {
                                    const icon = getPlatformIconSvg(plat);
                                    return `
                                        <div class="mobile-platform-card">
                                            <span class="plat-icon">${icon}</span>
                                            <span class="plat-text">${plat}</span>
                                        </div>
                                    `;
                                  })
                                  .join("")}
                            </div>
                        </div>
                    `
                        : ""
                    }

                    ${project.sections
                      .map(
                        (sec) => `
                        <div class="mobile-detail-section">
                            <span class="mobile-section-label">${
                              sec.label
                            }</span>
                            <h2 class="mobile-section-heading">${sec.title}</h2>
                            <div class="mobile-section-body">${formatRichText(
                              sec.content
                            )}</div>
                        </div>
                    `
                      )
                      .join("")}

                    ${
                      project.architectureDiagram
                        ? `
                        <div class="mobile-detail-section">
                            <span class="mobile-section-label">ARCHITECTURE</span>
                            <h2 class="mobile-section-heading">System Topology</h2>
                            <div class="mobile-architecture-diagram">
                                ${project.architectureDiagram
                                  .map(
                                    (node, index) => `
                                    <div class="arch-node-container">
                                        <div class="arch-node">${node}</div>
                                        ${
                                          index <
                                          project.architectureDiagram.length - 1
                                            ? `
                                            <div class="arch-arrow">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                                            </div>
                                        `
                                            : ""
                                        }
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        </div>
                    `
                        : ""
                    }

                    ${
                      project.coreSystems
                        ? `
                        <div class="mobile-detail-section">
                            <span class="mobile-section-label">CORE SUBSYSTEMS</span>
                            <h2 class="mobile-section-heading">Key Capabilities</h2>
                            <div class="mobile-feature-grid">
                                ${project.coreSystems
                                  .map(
                                    (sys) => `
                                    <div class="mobile-feature-card">
                                        <div class="mobile-feature-icon" style="color: var(--project-accent)">${getProjectIconSvg(
                                          "check"
                                        )}</div>
                                        <span class="mobile-feature-text">${sys}</span>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        </div>
                    `
                        : ""
                    }

                    ${
                      project.aiCollaboration &&
                      project.aiCollaboration.length > 0
                        ? `
                        <div class="mobile-detail-section">
                            <span class="mobile-section-label">AI COLLABORATION</span>
                            <h2 class="mobile-section-heading">Intelligent Tooling</h2>
                            <div class="mobile-feature-grid">
                                ${project.aiCollaboration
                                  .map(
                                    (collab) => `
                                    <div class="mobile-feature-card">
                                        <div class="mobile-feature-icon" style="color: var(--project-accent)">${getProjectIconSvg(
                                          "sparkle"
                                        )}</div>
                                        <span class="mobile-feature-text">${collab}</span>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        </div>
                    `
                        : ""
                    }

                    <div class="mobile-footer-section">
                        <div class="mobile-project-status">
                            <span class="status-label">Project Status</span>
                            <span class="status-badge">${project.status}</span>
                        </div>
                        <div class="mobile-footer-nav">
                            <button class="footer-nav-btn prev-project-btn" id="mobilePrevBtn" aria-label="Previous project">
                                <span class="nav-arrow">←</span>
                                <div class="nav-project-info">
                                    <span class="nav-label">PREVIOUS</span>
                                    <span class="nav-title">${
                                      prevProject.title
                                    }</span>
                                </div>
                            </button>
                            <button class="footer-nav-btn next-project-btn" id="mobileNextBtn" aria-label="Next project">
                                <div class="nav-project-info align-right">
                                    <span class="nav-label">NEXT</span>
                                    <span class="nav-title">${
                                      nextProject.title
                                    }</span>
                                </div>
                                <span class="nav-arrow">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Bind mobile scroll actions
    const scrollContainer = modal.querySelector(
      ".project-modal-mobile-content"
    );
    const header = modal.querySelector(".project-modal-mobile-header");
    const headerTitle = modal.querySelector("#mobileHeaderTitle");

    if (scrollContainer && header && headerTitle) {
      scrollContainer.addEventListener("scroll", () => {
        const scrollTop = scrollContainer.scrollTop;
        if (scrollTop > 80) {
          header.classList.add("scrolled");
          const opacity = Math.min((scrollTop - 80) / 80, 1);
          headerTitle.style.opacity = opacity;
          headerTitle.style.transform = `translateY(${Math.max(
            10 - opacity * 10,
            0
          )}px)`;
        } else {
          header.classList.remove("scrolled");
          headerTitle.style.opacity = "0";
          headerTitle.style.transform = "translateY(10px)";
        }
      });
    }

    // Defer all button listeners by one animation frame to prevent
    // the touch-event that opened the modal from ghost-firing immediately
    requestAnimationFrame(() => {
      // Back action
      const backBtn = modal.querySelector("#mobileBackBtn");
      if (backBtn) backBtn.addEventListener("click", closeModal);

      // Share action
      const shareBtn = modal.querySelector("#mobileShareBtn");
      if (shareBtn) {
        shareBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const shareData = {
            title: `${project.title} - Sajag Silwal Portfolio`,
            text: `${project.title}: ${project.headline}`,
            url: window.location.href,
          };
          try {
            if (navigator.share) {
              await navigator.share(shareData);
            } else {
              await navigator.clipboard.writeText(window.location.href);
              const originalHTML = shareBtn.innerHTML;
              shareBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
              shareBtn.classList.add("copied");
              setTimeout(() => {
                shareBtn.innerHTML = originalHTML;
                shareBtn.classList.remove("copied");
              }, 2000);
            }
          } catch (err) {
            console.error("Error sharing:", err);
          }
        });
      }

      // Navigation actions
      const prevBtn = modal.querySelector("#mobilePrevBtn");
      if (prevBtn)
        prevBtn.addEventListener("click", () =>
          navigateToProject(prevProject, prevNum)
        );

      const nextBtn = modal.querySelector("#mobileNextBtn");
      if (nextBtn)
        nextBtn.addEventListener("click", () =>
          navigateToProject(nextProject, nextNum)
        );
    });
  };

  const renderTabletModal = (project, num) => {
    const currentIndex = PROJECTS.findIndex((p) => p.title === project.title);
    const prevProject =
      PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
    const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
    const prevNum = String(
      ((currentIndex - 1 + PROJECTS.length) % PROJECTS.length) + 1
    ).padStart(2, "0");
    const nextNum = String(((currentIndex + 1) % PROJECTS.length) + 1).padStart(
      2,
      "0"
    );

    modal.innerHTML = `
            <div class="project-modal tablet-version">
                <div class="project-modal-tablet-header">
                    <div class="tablet-header-left">
                        <span class="tablet-header-num">${num}</span>
                        <span class="project-modal-tablet-header-title" id="tabletHeaderTitle">${
                          project.title
                        }</span>
                    </div>
                    <button type="button" class="project-modal-close tablet-close-btn" id="tabletCloseBtn" aria-label="Close details">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
                
                <div class="project-modal-tablet-scroll">
                    <div class="tablet-hero-section">
                        <div class="tablet-hero-num">${num}</div>
                        <h1 class="tablet-hero-title">${project.title}</h1>
                        <p class="tablet-hero-headline">${project.headline}</p>
                        <div class="tablet-hero-summary">${formatRichText(
                          project.overview
                        )}</div>
                        
                        <div class="tablet-hero-focus-chips">
                            ${project.focus
                              .map(
                                (chip) =>
                                  `<span class="tablet-focus-chip">${chip}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                    
                    <div class="tablet-grid-layout">
                        <!-- Left Column (60% on landscape, stacked on portrait) -->
                        <div class="tablet-left-column">
                            ${project.sections
                              .map(
                                (sec) => `
                                <div class="tablet-detail-section">
                                    <span class="tablet-section-label">${
                                      sec.label
                                    }</span>
                                    <h2 class="tablet-section-heading">${
                                      sec.title
                                    }</h2>
                                    <div class="tablet-section-body">${formatRichText(
                                      sec.content
                                    )}</div>
                                </div>
                            `
                              )
                              .join("")}
                            
                            ${
                              project.architectureDiagram
                                ? `
                                <div class="tablet-detail-section">
                                    <span class="tablet-section-label">ARCHITECTURE</span>
                                    <h2 class="tablet-section-heading">System Topology</h2>
                                    <div class="tablet-architecture-diagram">
                                        ${project.architectureDiagram
                                          .map(
                                            (node, index) => `
                                            <div class="tablet-arch-node-container">
                                                <div class="tablet-arch-node">${node}</div>
                                                ${
                                                  index <
                                                  project.architectureDiagram
                                                    .length -
                                                    1
                                                    ? `
                                                    <div class="tablet-arch-arrow">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                                                    </div>
                                                `
                                                    : ""
                                                }
                                            </div>
                                        `
                                          )
                                          .join("")}
                                    </div>
                                </div>
                            `
                                : ""
                            }
                        </div>
                        
                        <!-- Right Column (40% on landscape, stacked on portrait) -->
                        <div class="tablet-right-column">
                            ${
                              project.platform
                                ? `
                                <div class="tablet-info-card">
                                    <div class="tablet-info-card-title">Platform</div>
                                    <div class="tablet-info-card-list">
                                        ${project.platform
                                          .map((plat) => {
                                            const icon =
                                              getPlatformIconSvg(plat);
                                            return `
                                                <div class="tablet-info-item">
                                                    <span class="tablet-info-icon">${icon}</span>
                                                    <span class="tablet-info-text">${plat}</span>
                                                </div>
                                            `;
                                          })
                                          .join("")}
                                    </div>
                                </div>
                            `
                                : ""
                            }

                            ${
                              project.coreSystems
                                ? `
                                <div class="tablet-info-card">
                                    <div class="tablet-info-card-title">Core Systems</div>
                                    <div class="tablet-info-card-list">
                                        ${project.coreSystems
                                          .map(
                                            (sys) => `
                                            <div class="tablet-info-item">
                                                <span class="tablet-info-icon" style="color: var(--project-accent);">${getProjectIconSvg(
                                                  "check"
                                                )}</span>
                                                <span class="tablet-info-text">${sys}</span>
                                            </div>
                                        `
                                          )
                                          .join("")}
                                    </div>
                                </div>
                            `
                                : ""
                            }

                            ${
                              project.aiCollaboration &&
                              project.aiCollaboration.length > 0
                                ? `
                                <div class="tablet-info-card">
                                    <div class="tablet-info-card-title">AI Collaboration</div>
                                    <div class="tablet-info-card-list">
                                        ${project.aiCollaboration
                                          .map(
                                            (collab) => `
                                            <div class="tablet-info-item">
                                                <span class="tablet-info-icon" style="color: var(--project-accent);">${getProjectIconSvg(
                                                  "sparkle"
                                                )}</span>
                                                <span class="tablet-info-text">${collab}</span>
                                            </div>
                                        `
                                          )
                                          .join("")}
                                    </div>
                                </div>
                            `
                                : ""
                            }

                            <div class="tablet-info-card tablet-status-card">
                                <div class="tablet-info-card-title">Project Status</div>
                                <div class="tablet-status-badge" style="background: var(--project-gradient);">
                                    ${project.status}
                                </div>
                            </div>

                            ${renderProjectLinksCard(
                              project,
                              "tablet-info-card",
                              "tablet-info-card-title"
                            )}
                        </div>
                    </div>

                    <div class="tablet-footer-section">
                        <div class="tablet-footer-nav">
                            <button class="tablet-footer-nav-btn prev-btn" id="tabletPrevBtn" aria-label="Previous project">
                                <span class="tablet-nav-arrow">←</span>
                                <div class="tablet-nav-project-info">
                                    <span class="tablet-nav-label">PREVIOUS</span>
                                    <span class="tablet-nav-title">${
                                      prevProject.title
                                    }</span>
                                </div>
                            </button>
                            <button class="tablet-footer-nav-btn next-btn" id="tabletNextBtn" aria-label="Next project">
                                <div class="tablet-nav-project-info align-right">
                                    <span class="tablet-nav-label">NEXT</span>
                                    <span class="tablet-nav-title">${
                                      nextProject.title
                                    }</span>
                                </div>
                                <span class="tablet-nav-arrow">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Bind scroll header animations
    const scrollContainer = modal.querySelector(".project-modal-tablet-scroll");
    const header = modal.querySelector(".project-modal-tablet-header");
    const headerTitle = modal.querySelector("#tabletHeaderTitle");

    if (scrollContainer && header && headerTitle) {
      scrollContainer.addEventListener("scroll", () => {
        const scrollTop = scrollContainer.scrollTop;
        if (scrollTop > 80) {
          header.classList.add("scrolled");
          const opacity = Math.min((scrollTop - 80) / 80, 1);
          headerTitle.style.opacity = opacity;
          headerTitle.style.transform = `translateY(${Math.max(
            8 - opacity * 8,
            0
          )}px)`;
        } else {
          header.classList.remove("scrolled");
          headerTitle.style.opacity = "0";
          headerTitle.style.transform = "translateY(8px)";
        }
      });
    }

    // Close action
    const closeBtn = modal.querySelector("#tabletCloseBtn");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    // Footer buttons navigation
    const prevBtn = modal.querySelector("#tabletPrevBtn");
    if (prevBtn)
      prevBtn.addEventListener("click", () =>
        navigateToProject(prevProject, prevNum)
      );

    const nextBtn = modal.querySelector("#tabletNextBtn");
    if (nextBtn)
      nextBtn.addEventListener("click", () =>
        navigateToProject(nextProject, nextNum)
      );

    // Swipe gestures navigation
    const container = modal.querySelector(".project-modal.tablet-version");
    if (container) {
      let touchStartX = 0;
      let touchEndX = 0;

      container.addEventListener(
        "touchstart",
        (e) => {
          touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );

      container.addEventListener(
        "touchend",
        (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const swipeDistance = touchStartX - touchEndX;

          if (swipeDistance > 100) {
            navigateToProject(nextProject, nextNum);
          } else if (swipeDistance < -100) {
            navigateToProject(prevProject, prevNum);
          }
        },
        { passive: true }
      );
    }
  };

  const renderDesktopModal = (project, num) => {
    const currentIndex = PROJECTS.findIndex((p) => p.title === project.title);
    const prevProject =
      PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
    const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
    const prevNum = String(
      ((currentIndex - 1 + PROJECTS.length) % PROJECTS.length) + 1
    ).padStart(2, "0");
    const nextNum = String(((currentIndex + 1) % PROJECTS.length) + 1).padStart(
      2,
      "0"
    );

    modal.innerHTML = `
            <div class="project-modal">
                <div class="project-modal-header">
                    <div class="project-modal-header-left">
                        <span class="project-modal-num" id="workModalNum">${num}</span>
                        <h3 class="project-modal-title" id="workModalTitle">${
                          project.title
                        }</h3>
                    </div>
                    <button type="button" class="project-modal-close" id="workModalCloseBtn" aria-label="Close details">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
                <div class="project-modal-body">
                    <p class="project-modal-headline" id="workModalHeadline">${
                      project.headline
                    }</p>
                    <div class="project-modal-content-grid">
                        <div class="project-modal-left-col" id="workModalLeftCol">
                            <div class="project-modal-overview-section">
                                <div class="project-modal-overview-text">${formatRichText(
                                  project.overview
                                )}</div>
                            </div>
                            ${project.sections
                              .map(
                                (section) => `
                                <div class="project-modal-detail-section">
                                    <span class="project-modal-section-label">${
                                      section.label
                                    }</span>
                                    <h4 class="project-modal-section-title">${
                                      section.title
                                    }</h4>
                                    <div class="project-modal-section-content">${formatRichText(
                                      section.content
                                    )}</div>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                        <div class="project-modal-right-col" id="workModalRightCol">
                            <div class="project-modal-info-card project-modal-status-card">
                                <div class="project-modal-info-card-title">Project Status</div>
                                <div class="project-modal-status-badge" style="background: var(--project-gradient); border-color: var(--project-accent);">
                                    ${project.status}
                                </div>
                            </div>
                            ${renderProjectLinksCard(
                              project,
                              "project-modal-info-card",
                              "project-modal-info-card-title"
                            )}
                            ${
                              project.architectureDiagram
                                ? `
                                <div class="project-modal-info-card project-modal-topology-card">
                                    <div class="project-modal-info-card-title">System Topology</div>
                                    <div class="project-modal-architecture-diagram">
                                        ${project.architectureDiagram
                                          .map(
                                            (node, index) => `
                                            <div class="project-arch-node-container">
                                                <div class="project-arch-node">${node}</div>
                                                ${
                                                  index <
                                                  project.architectureDiagram
                                                    .length -
                                                    1
                                                    ? `
                                                    <div class="project-arch-arrow" aria-hidden="true">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                            <path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>
                                                        </svg>
                                                    </div>
                                                `
                                                    : ""
                                                }
                                            </div>
                                        `
                                          )
                                          .join("")}
                                    </div>
                                </div>
                            `
                                : ""
                            }
                            ${
                              project.focus
                                ? `
                                <div class="project-modal-info-card">
                                    <div class="project-modal-info-card-title">Engineering Focus</div>
                                    <div class="project-modal-info-card-list">
                                        ${project.focus
                                          .map(
                                            (item) => `
                                            <div class="info-card-item">
                                                <span class="bullet" style="color: var(--project-accent);">${getProjectIconSvg(
                                                  "diamond"
                                                )}</span>
                                                <span class="text">${item}</span>
                                            </div>
                                        `
                                          )
                                          .join("")}
                                    </div>
                                </div>
                            `
                                : ""
                            }
                            ${
                              project.platform
                                ? `
                                <div class="project-modal-info-card">
                                    <div class="project-modal-info-card-title">Platform & Core Infrastructure</div>
                                    <div class="project-modal-info-card-list">
                                        ${project.platform
                                          .map(
                                            (item) => `
                                            <div class="info-card-item">
                                                <span class="bullet" style="color: var(--project-accent);">${getProjectIconSvg(
                                                  "check"
                                                )}</span>
                                                <span class="text">${item}</span>
                                            </div>
                                        `
                                          )
                                          .join("")}
                                    </div>
                                </div>
                            `
                                : ""
                            }
                            ${
                              project.coreSystems
                                ? `
                                <div class="project-modal-info-card">
                                    <div class="project-modal-info-card-title">Core Subsystems</div>
                                    <div class="project-modal-info-card-list">
                                        ${project.coreSystems
                                          .map(
                                            (item) => `
                                            <div class="info-card-item">
                                                <span class="bullet" style="color: var(--project-accent);">${getProjectIconSvg(
                                                  "dot"
                                                )}</span>
                                                <span class="text">${item}</span>
                                            </div>
                                        `
                                          )
                                          .join("")}
                                    </div>
                                </div>
                            `
                                : ""
                            }
                            ${
                              project.aiCollaboration &&
                              project.aiCollaboration.length > 0
                                ? `
                                <div class="project-modal-info-card">
                                    <div class="project-modal-info-card-title">AI Collaboration Tools</div>
                                    <div class="project-modal-info-card-list">
                                        ${project.aiCollaboration
                                          .map(
                                            (item) => `
                                            <div class="info-card-item">
                                                <span class="bullet" style="color: var(--project-accent);">${getProjectIconSvg(
                                                  "sparkle"
                                                )}</span>
                                                <span class="text">${item}</span>
                                            </div>
                                        `
                                          )
                                          .join("")}
                                    </div>
                                </div>
                            `
                                : ""
                            }
                        </div>
                    </div>
                    <div class="project-modal-footer-nav">
                        <button class="project-modal-footer-nav-btn prev-btn" id="desktopPrevBtn" aria-label="Previous project">
                            <span class="project-nav-arrow">←</span>
                            <div class="project-nav-project-info">
                                <span class="project-nav-label">PREVIOUS</span>
                                <span class="project-nav-title">${
                                  prevProject.title
                                }</span>
                            </div>
                        </button>
                        <button class="project-modal-footer-nav-btn next-btn" id="desktopNextBtn" aria-label="Next project">
                            <div class="project-nav-project-info align-right">
                                <span class="project-nav-label">NEXT</span>
                                <span class="project-nav-title">${
                                  nextProject.title
                                }</span>
                            </div>
                            <span class="project-nav-arrow">→</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

    const closeBtn = modal.querySelector("#workModalCloseBtn");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    const prevBtn = modal.querySelector("#desktopPrevBtn");
    if (prevBtn)
      prevBtn.addEventListener("click", () =>
        navigateToProject(prevProject, prevNum)
      );

    const nextBtn = modal.querySelector("#desktopNextBtn");
    if (nextBtn)
      nextBtn.addEventListener("click", () =>
        navigateToProject(nextProject, nextNum)
      );
  };

  window.openWorkModal = (project, num) => {
    setModalViewportHeight();
    modal.style.setProperty("--project-accent", project.accentColor);
    modal.style.setProperty("--project-gradient", project.gradient);

    const width = window.innerWidth;
    if (width < 768) {
      renderMobileModal(project, num);
    } else if (width >= 768 && width <= 1199) {
      renderTabletModal(project, num);
    } else {
      renderDesktopModal(project, num);
    }

    if (!modal.open) {
      modal.showModal();
    }
    modal.focus({ preventScroll: true });

    // Immediately reset scroll on all internal scroll containers
    // to prevent browser autofocus from scrolling content down
    const mobileContent = modal.querySelector(".project-modal-mobile-content");
    const tabletScroll = modal.querySelector(".project-modal-tablet-scroll");
    const mobileContainer = modal.querySelector(
      ".project-modal.mobile-version"
    );
    modal.scrollTop = 0;
    if (mobileContent) mobileContent.scrollTop = 0;
    if (tabletScroll) tabletScroll.scrollTop = 0;
    if (mobileContainer) mobileContainer.scrollTop = 0;

    setTimeout(() => {
      modal.classList.add("active");
      document.body.classList.remove(
        "body-modal-open",
        "body-modal-open-tablet"
      );
      if (window.innerWidth < 768) {
        document.body.classList.add("body-modal-open");
      } else if (window.innerWidth >= 768 && window.innerWidth <= 1199) {
        document.body.classList.add("body-modal-open-tablet");
      }

      // Double-ensure scroll reset after animation starts
      modal.scrollTop = 0;
      if (mobileContent) mobileContent.scrollTop = 0;
      if (tabletScroll) tabletScroll.scrollTop = 0;
    }, 10);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.classList.remove("body-modal-open", "body-modal-open-tablet");
    setTimeout(() => {
      modal.close();
      document.body.style.overflow = "";
    }, 350);
  };

  modal.addEventListener("click", (e) => {
    if (e.target === modal && window.innerWidth >= 768) {
      closeModal();
    }
  });

  // Handle escape key cancel animation
  modal.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeModal();
  });
};

const initWorkFilters = () => {
  const filtersContainer = document.getElementById("workFilters");
  if (!filtersContainer) return;

  const filterBtns = filtersContainer.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".work-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from all buttons
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });

      // Add active class to clicked button
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      const filterValue = btn.getAttribute("data-filter");

      cards.forEach((card) => {
        const index = parseInt(card.getAttribute("data-work-index"), 10);
        const project = PROJECTS[index];

        // Check if project has the target category
        const isMatch =
          filterValue === "all" ||
          (project.categories && project.categories.includes(filterValue));

        if (isMatch) {
          card.style.display = "";
          // Allow small delay for CSS transition to trigger
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          });
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          // Hide after transition completes
          setTimeout(() => {
            // Double check if the active filter hasn't changed since starting hide transition
            const activeBtn =
              filtersContainer.querySelector(".filter-btn.active");
            const activeFilter = activeBtn
              ? activeBtn.getAttribute("data-filter")
              : "all";
            if (
              activeFilter === filterValue ||
              (activeFilter !== "all" &&
                !project.categories.includes(activeFilter))
            ) {
              card.style.display = "none";
            }
          }, 280);
        }
      });
    });
  });
};

initSelectedWork();
initWorkModal();
initWorkFilters();

// =============================================
// LANGUAGES SECTION — Scroll Reveal Observer
// =============================================
(() => {
  const langCards = document.querySelectorAll(".lang-premium-card");
  if (!langCards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // After the staggered animation completes, remove the stagger delay
          // so hover transitions are snappy
          const delay = parseFloat(
            getComputedStyle(entry.target).getPropertyValue("--delay") || "0"
          );
          setTimeout(() => {
            entry.target.classList.add("visible-fully");
          }, delay + 650); // animation duration (600ms) + small buffer

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  langCards.forEach((card) => observer.observe(card));
})();

// =============================================
// PORTFOLIO CONTACT FORM INTEGRATION (ANTI-SPAM SYSTEM)
// =============================================
const initContactForm = () => {
  const contactModal = document.getElementById("contactModal");
  const closeContactModalBtn = document.getElementById("closeContactModalBtn");
  const contactForm = document.getElementById("contactForm");
  const contactFormError = document.getElementById("contactFormError");
  const contactSubmitBtn = document.getElementById("contactSubmitBtn");
  const triggers = document.querySelectorAll(".message-me-trigger");

  if (!contactModal) return;

  // Anti-Spam Behavioral & Timers State
  let openedAt = 0;
  let mouseMoved = false;
  let mouseMoveCount = 0;
  let keyboardKeyPressCount = 0;
  let pasteEventsCount = 0;
  let scrollActivityDetected = false;
  const focusedFields = new Set();
  const requiredFields = ["contactFullName", "contactEmail", "contactSubject", "contactMessage"];
  const interactedFields = new Set();

  // Helper to generate a unique cyrb53 canvas fingerprint
  const getBrowserFingerprint = () => {
    try {
      const components = [
        navigator.userAgent,
        navigator.language,
        window.screen.width + "x" + window.screen.height,
        window.screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.platform,
        navigator.hardwareConcurrency || "unknown",
        (() => {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return "no-canvas-context";
            ctx.textBaseline = "top";
            ctx.font = "14px Arial";
            ctx.fillStyle = "#f60";
            ctx.fillRect(10, 10, 100, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("Sajag Portfolio, AntiSpam V2.0!", 2, 2);
            return canvas.toDataURL();
          } catch (e) {
            return "canvas-error";
          }
        })()
      ];
      const str = components.join("|||");
      
      // cyrb53 hash function (stable, anonymous identifier)
      let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
      for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334903);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      return ((h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0"));
    } catch (err) {
      console.error("Fingerprinting error:", err);
      return "fallback-" + Math.random().toString(36).substring(2, 15);
    }
  };

  // Open / Close Modal Logic
  const openContactModal = () => {
    contactModal.showModal();
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      contactModal.classList.add("active");
    });
    
    // Set opened timestamp
    openedAt = Date.now();
    
    // Reset interaction trackers
    mouseMoved = false;
    mouseMoveCount = 0;
    keyboardKeyPressCount = 0;
    pasteEventsCount = 0;
    scrollActivityDetected = false;
    focusedFields.clear();
    interactedFields.clear();

    if (contactForm) {
      contactForm.reset();
      const fields = contactForm.querySelectorAll("input, textarea");
      fields.forEach(field => {
        field.classList.remove("invalid-field");
      });
    }
    
    if (contactFormError) {
      contactFormError.style.display = "none";
      contactFormError.textContent = "";
    }

    // 24 hours client-side lock check
    let hasLock = false;
    const lastSentStr = localStorage.getItem("basuki_last_contact_sent_at");
    if (lastSentStr) {
      const lastSentTime = parseInt(lastSentStr, 10);
      const hoursLimit = 24;
      const timeRemaining = lastSentTime + (hoursLimit * 60 * 60 * 1000) - Date.now();
      if (timeRemaining > 0) {
        hasLock = true;
        const hoursLeft = Math.ceil(timeRemaining / (60 * 60 * 1000));
        showError(`You have already sent a message. Please wait ${hoursLeft} hours before sending another.`);
        if (contactSubmitBtn) {
          contactSubmitBtn.disabled = true;
        }
      }
    }

    if (!hasLock && contactSubmitBtn) {
      contactSubmitBtn.disabled = false;
    }
    
    if (window.turnstile) {
      try {
        window.turnstile.reset("#turnstileWidget");
      } catch (e) {
        console.warn("Turnstile reset failed:", e);
      }
    }
  };

  const closeContactModal = () => {
    contactModal.classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(() => {
      contactModal.close();
    }, 350);
  };

  // Attach Open Triggers
  triggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openContactModal();
    });
  });

  if (closeContactModalBtn) {
    closeContactModalBtn.addEventListener("click", closeContactModal);
  }

  contactModal.addEventListener("click", (e) => {
    if (e.target === contactModal) {
      closeContactModal();
    }
  });

  contactModal.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeContactModal();
  });

  // Track human interaction metrics
  const onFormMouseMove = () => {
    mouseMoved = true;
    mouseMoveCount++;
    if (mouseMoveCount > 250 && contactForm) {
      contactForm.removeEventListener("mousemove", onFormMouseMove);
    }
  };

  if (contactForm) {
    contactForm.addEventListener("mousemove", onFormMouseMove);
    
    contactForm.addEventListener("keypress", () => {
      keyboardKeyPressCount++;
    });

    contactForm.addEventListener("paste", () => {
      pasteEventsCount++;
    });

    const modalBody = contactModal.querySelector(".contact-modal-body");
    if (modalBody) {
      modalBody.addEventListener("scroll", () => {
        scrollActivityDetected = true;
      }, { passive: true });
    }

    const fields = contactForm.querySelectorAll("input, textarea");
    fields.forEach(field => {
      field.addEventListener("focus", () => {
        focusedFields.add(field.id);
        if (requiredFields.includes(field.id)) {
          interactedFields.add(field.id);
        }
        field.classList.remove("invalid-field");
      });
    });
  }

  // Helper to visually invalidate form fields
  const highlightInvalid = (elementId) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.classList.add("invalid-field");
    }
  };

  // Submit flow
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Clear previous error displays
      if (contactFormError) {
        contactFormError.style.display = "none";
        contactFormError.textContent = "";
      }

      // 24 hours client-side lock check
      const lastSentStr = localStorage.getItem("basuki_last_contact_sent_at");
      if (lastSentStr) {
        const lastSentTime = parseInt(lastSentStr, 10);
        const hoursLimit = 24;
        const timeRemaining = lastSentTime + (hoursLimit * 60 * 60 * 1000) - Date.now();
        if (timeRemaining > 0) {
          const hoursLeft = Math.ceil(timeRemaining / (60 * 60 * 1000));
          showError(`Please wait ${hoursLeft} hours before sending another message.`);
          return;
        }
      }

      const fields = contactForm.querySelectorAll("input, textarea");
      fields.forEach(field => field.classList.remove("invalid-field"));

      // Get values
      const fullNameEl = document.getElementById("contactFullName");
      const emailEl = document.getElementById("contactEmail");
      const companyEl = document.getElementById("contactCompany");
      const phoneEl = document.getElementById("contactPhone");
      const subjectEl = document.getElementById("contactSubject");
      const messageEl = document.getElementById("contactMessage");

      const fullName = fullNameEl ? fullNameEl.value.trim() : "";
      const email = emailEl ? emailEl.value.trim() : "";
      const company = companyEl ? companyEl.value.trim() : "";
      const phone = phoneEl ? phoneEl.value.trim() : "";
      const subject = subjectEl ? subjectEl.value.trim() : "";
      const message = messageEl ? messageEl.value.trim() : "";

      // Client Validations
      if (!fullName || fullName.length < 2 || fullName.length > 100) {
        showError("Full Name is required and must be between 2 and 100 characters.");
        highlightInvalid("contactFullName");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showError("Please enter a valid email address.");
        highlightInvalid("contactEmail");
        return;
      }

      if (company && company.length > 100) {
        showError("Company name must not exceed 100 characters.");
        highlightInvalid("contactCompany");
        return;
      }

      if (phone && phone.length > 25) {
        showError("Phone number must not exceed 25 characters.");
        highlightInvalid("contactPhone");
        return;
      }

      if (!subject || subject.length < 5 || subject.length > 150) {
        showError("Subject is required and must be between 5 and 150 characters.");
        highlightInvalid("contactSubject");
        return;
      }

      if (!message || message.length < 20 || message.length > 3000) {
        showError("Message is required and must be between 20 and 3000 characters.");
        highlightInvalid("contactMessage");
        return;
      }

      // Immediately set UI button status to loading and disable to prevent accidental duplicates
      setLoading(true);

      // Pick up the Turnstile token if the widget has already auto-verified
      let turnstileToken = "";
      if (window.turnstile) {
        try {
          turnstileToken = window.turnstile.getResponse("#turnstileWidget") || "";
        } catch (e) {
          console.warn("Turnstile getResponse failed:", e);
        }
      }

      submitFormData(turnstileToken);
    });
  }

  // Compile payload and submit POST request to BasukiMS backend API
  const submitFormData = async (turnstileToken) => {
    // Honeypot inputs check
    const websiteTrapVal = document.getElementById("contactFormWebsiteTrap")?.value || "";
    const companyWebsiteVal = document.getElementById("contactFormCompanyWebsite")?.value || "";
    const faxNumberVal = document.getElementById("contactFormFaxNumber")?.value || "";
    const middleNameVal = document.getElementById("contactFormMiddleName")?.value || "";

    const fullName = document.getElementById("contactFullName")?.value.trim() || "";
    const email = document.getElementById("contactEmail")?.value.trim() || "";
    const company = document.getElementById("contactCompany")?.value.trim() || "";
    const phone = document.getElementById("contactPhone")?.value.trim() || "";
    const subject = document.getElementById("contactSubject")?.value.trim() || "";
    const message = document.getElementById("contactMessage")?.value.trim() || "";

    // Calculate interaction metrics & timing
    const timeOnForm = Date.now() - openedAt;
    const humanInteractionMetrics = {
      mouseMoved,
      mouseMoveCount,
      keyboardKeyPressCount,
      fieldsFocusedCount: focusedFields.size,
      scrollActivityDetected,
      pasteEventsCount,
      interactedWithAllRequired: requiredFields.every(id => interactedFields.has(id))
    };

    // Calculate metadata
    const browserMetadata = {
      language: navigator.language || "unknown",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      colorDepth: window.screen.colorDepth || 0,
      platform: navigator.platform || "unknown",
      userAgent: navigator.userAgent || "unknown",
      viewportSize: `${window.innerWidth}x${window.innerHeight}`
    };

    // Generate stable client fingerprint
    const browserFingerprint = getBrowserFingerprint();

    const securityMetadata = {
      browserFingerprint,
      timeOnForm,
      browserMetadata,
      humanInteractionMetrics
    };

    try {
      const response = await fetch("https://api.basukitransport.com/api/v1/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          company: company || undefined,
          phone: phone || undefined,
          subject,
          message,
          turnstileToken,
          website_trap: websiteTrapVal,
          companyWebsite: companyWebsiteVal,
          faxNumber: faxNumberVal,
          middleName: middleNameVal,
          securityMetadata
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send message.");
      }

      // Store timestamp of successful message submission (24 hours lock)
      localStorage.setItem("basuki_last_contact_sent_at", Date.now().toString());

      showToast(data.message || "Your message has been sent successfully.", "success");
      closeContactModal();
    } catch (err) {
      const errorMsg = (err && err.message && err.message.toLowerCase().includes("fetch"))
        ? "Failed to connect to the server. Please check your connection and try again."
        : (err.message || "Failed to connect to the server. Please try again later.");
      showError(errorMsg);
    } finally {
      setLoading(false);
      if (window.turnstile) {
        try {
          window.turnstile.reset("#turnstileWidget");
        } catch (e) {}
      }
    }
  };

  const showError = (msg) => {
    if (contactFormError) {
      contactFormError.textContent = msg;
      contactFormError.style.display = "block";
    }
  };

  const setLoading = (loading) => {
    if (!contactSubmitBtn) return;
    const btnText = contactSubmitBtn.querySelector("span");
    const btnIcon = contactSubmitBtn.querySelector("svg");

    if (loading) {
      contactSubmitBtn.disabled = true;
      if (btnText) btnText.textContent = "Sending...";
      let spinner = contactSubmitBtn.querySelector(".spinner");
      if (!spinner) {
        spinner = document.createElement("span");
        spinner.className = "spinner";
        contactSubmitBtn.appendChild(spinner);
      }
      spinner.style.display = "inline-block";
      if (btnIcon) btnIcon.style.display = "none";
    } else {
      contactSubmitBtn.disabled = false;
      if (btnText) btnText.textContent = "Send Message";
      const spinner = contactSubmitBtn.querySelector(".spinner");
      if (spinner) spinner.style.display = "none";
      if (btnIcon) btnIcon.style.display = "inline-block";
    }
  };

  const showToast = (message, type) => {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.style.position = "fixed";
      container.style.top = "2rem";
      container.style.right = "2rem";
      container.style.zIndex = "10005";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "0.5rem";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.style.background =
      type === "success" ? "var(--color-emerald-600)" : "var(--color-rose-600)";
    toast.style.color = "#ffffff";
    toast.style.padding = "1rem 1.5rem";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.3)";
    toast.style.fontFamily = "sans-serif";
    toast.style.fontSize = "14px";
    toast.style.fontWeight = "500";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "0.75rem";
    toast.style.animation = "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards";

    const icon = type === "success" ? "✓" : "⚠️";
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);

    if (!document.getElementById("toastAnimationStyles")) {
      const style = document.createElement("style");
      style.id = "toastAnimationStyles";
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards";
      if (!document.getElementById("toastOutAnimationStyles")) {
        const style = document.createElement("style");
        style.id = "toastOutAnimationStyles";
        style.textContent = `
          @keyframes slideOut {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(-20px); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };
};

initContactForm();

// ==========================================
// Hero Image Parallax (Mobile Orbit & Desktop)
// ==========================================
function initHeroParallax() {
  const heroSection = document.querySelector('.hero');
  const heroImageContainer = document.querySelector('.hero-image-container');
  
  if (!heroSection || !heroImageContainer) return;

  // Variables to store current and target offsets for smooth interpolation (LERP)
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrameId = null;

  // Render loop for smooth parallax interpolation
  function renderParallax() {
    // LERP (Linear Interpolation) for smoothness
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    // Apply multiplier bounds for each layer
    const normalizedX = currentX;
    const normalizedY = currentY;

    // Update CSS variables for each layer
    // We apply these to the container so all child orbits and images can read them
    heroImageContainer.style.setProperty('--px-outer', `${normalizedX * 2.5}px`);
    heroImageContainer.style.setProperty('--py-outer', `${normalizedY * 2.5}px`);
    
    heroImageContainer.style.setProperty('--px-inner', `${normalizedX * 4.5}px`);
    heroImageContainer.style.setProperty('--py-inner', `${normalizedY * 4.5}px`);
    
    heroImageContainer.style.setProperty('--px-img', `${normalizedX * 1.5}px`);
    heroImageContainer.style.setProperty('--py-img', `${normalizedY * 1.5}px`);

    animationFrameId = requestAnimationFrame(renderParallax);
  }

  // Start the render loop
  renderParallax();

  // Desktop Mouse Parallax (for testing interactions generically)
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalize to range [-1, 1]
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);
    
    // Limit maximum shift
    targetX = Math.max(-1, Math.min(1, mouseX));
    targetY = Math.max(-1, Math.min(1, mouseY));
  });

  heroSection.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  // Mobile Device Tilt Parallax (DeviceOrientation)
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (event) => {
      const beta = event.beta; // Front-to-back tilt in degrees
      const gamma = event.gamma; // Left-to-right tilt in degrees

      if (beta === null || gamma === null) return;
      
      // Calculate normalized tilts based on typical holding angles (roughly 45 degrees tilt)
      const normalizedBeta = (beta - 45) / 45; 
      const normalizedGamma = gamma / 45;

      targetX = Math.max(-1, Math.min(1, normalizedGamma));
      targetY = Math.max(-1, Math.min(1, normalizedBeta));
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroParallax);
} else {
  initHeroParallax();
}
