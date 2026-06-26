// Theme Toggle - Initialize ASAP to prevent flash
const initTheme = () => {
    const html = document.documentElement;
    const stored = localStorage.getItem('theme');

    // Determine target initial theme
    let currentTheme = stored;
    if (!currentTheme) {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        html.setAttribute('data-theme', currentTheme);
    } else {
        html.setAttribute('data-theme', currentTheme);
    }

    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');

    const updateAria = (theme) => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        const labelText = `Switch to ${nextTheme} theme`;
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', labelText);
            themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        }
        if (themeToggleMobile) {
            themeToggleMobile.setAttribute('aria-label', labelText);
            themeToggleMobile.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        }
    };

    updateAria(currentTheme);

    const toggleTheme = () => {
        const current = html.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateAria(next);
    };

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

    // Listen for OS theme changes (only if no stored preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const next = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            updateAria(next);
        }
    });
};

initTheme();

// Navbar scroll effect + Active nav highlight
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.navbar-link');
const sections = document.querySelectorAll('section[id]');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scrollspy: highlight active nav link
    let currentSection = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });

    lastScrollTop = scrollTop;
});

// Mobile menu toggle
const navbarToggle = document.getElementById('navbarToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = navbarToggle.querySelector('.menu-icon');
const closeIcon = navbarToggle.querySelector('.close-icon');

navbarToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navbarToggle.setAttribute('aria-expanded', isOpen);
    menuIcon.style.display = isOpen ? 'none' : 'block';
    closeIcon.style.display = isOpen ? 'block' : 'none';
});

// Close mobile menu when clicking a link
const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        navbarToggle.setAttribute('aria-expanded', 'false');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    });
});

// Card selection toggle (experience, hobby, and timeline cards)
document.querySelectorAll('.experience-card, .hobby-card, .timeline-card').forEach(card => {
    card.addEventListener('click', (e) => {
        e.stopPropagation();
        const isSelected = card.classList.contains('selected');
        // Deselect all cards
        document.querySelectorAll('.experience-card.selected, .hobby-card.selected, .timeline-card.selected')
            .forEach(c => c.classList.remove('selected'));
        // Toggle this card
        if (!isSelected) card.classList.add('selected');
    });
});

// Click anywhere else to deselect all cards
document.addEventListener('click', () => {
    document.querySelectorAll('.experience-card.selected, .hobby-card.selected, .timeline-card.selected')
        .forEach(c => c.classList.remove('selected'));
});

// Update current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hobby Cards Carousel - Auto-cycle every 4 seconds
function initCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('.hobby-card-image');
        const dots = carousel.querySelectorAll('.carousel-dot');
        let currentIndex = 0;
        let intervalId = null;

        if (images.length <= 1) return;

        function showSlide(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
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
        carousel.addEventListener('mouseenter', stopAutoCycle);
        carousel.addEventListener('mouseleave', startAutoCycle);
        carousel.addEventListener('focusin', stopAutoCycle);
        carousel.addEventListener('focusout', startAutoCycle);

        // Click and keyboard interaction on dots to navigate
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                showSlide(currentIndex);
            });

            // Keyboard navigation (Enter/Space support)
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    currentIndex = index;
                    showSlide(currentIndex);
                }
                if (e.key === ' ') {
                    e.preventDefault(); // Prevent viewport scrolling
                }
            });

            dot.addEventListener('keyup', (e) => {
                if (e.key === ' ') {
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
    const canvas = document.getElementById('journeyCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const particleCountDesktop = 80;
    const particleCountMobile = 30;
    const particleColor = '#F97316'; // Orange
    const connectionColor = '148, 163, 184'; // Slate Grey (rgb)
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
        const count = window.innerWidth < 768 ? particleCountMobile : particleCountDesktop;
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

    window.addEventListener('resize', resize);
    resize();
    animate();
};

// Initialize carousels and constellation when DOM is ready
initCarousels();
initConstellation();

// Waving Flag Animation for Hero Section
const initHeroFlag = () => {
    const canvas = document.getElementById('heroFlagCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

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
    const bufferCanvas = document.createElement('canvas');
    const bufferCtx = bufferCanvas.getContext('2d');
    bufferCanvas.width = canvas.width;
    bufferCanvas.height = canvas.height;

    // Colors
    const CRIMSON = '#DC143C';
    const BLUE = '#003893';
    const WHITE = '#FFFFFF';

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
        ctx.lineJoin = 'round';
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
            const yOffset = Math.sin(x * waveFrequency - time) * (waveAmplitude * dampener);

            // Draw Slice
            ctx.drawImage(
                bufferCanvas,
                x, 0, 1, bufferCanvas.height, // Source slice
                x, yOffset, 1, bufferCanvas.height // Dest slice
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
    const line = document.querySelector('.timeline-line');
    const dots = document.querySelectorAll('.timeline-dot');

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
    const firstDotCenter = (firstDotRect.top + firstDotRect.height / 2) - containerRect.top;
    const lastDotCenter = (lastDotRect.top + lastDotRect.height / 2) - containerRect.top;

    const height = lastDotCenter - firstDotCenter;

    line.style.top = `${firstDotCenter}px`;
    line.style.height = `${height}px`;
};

// Run on load and resize
window.addEventListener('load', adjustTimelineLine);
window.addEventListener('resize', adjustTimelineLine);
// Also run immediately in case
adjustTimelineLine();

// PDF Viewer Modal
const initPdfViewer = () => {
    const viewCvBtn = document.getElementById('viewCvBtn');
    const pdfModal = document.getElementById('pdfModal');
    const pdfCloseBtn = document.getElementById('pdfCloseBtn');
    const pdfFrame = document.getElementById('pdfFrame');

    if (!viewCvBtn || !pdfModal) return;

    const openModal = () => {
        // Lazy-load the PDF only when opening
        if (!pdfFrame.src || pdfFrame.src === window.location.href) {
            pdfFrame.src = 'cv.pdf';
        }
        pdfModal.showModal();
        document.body.style.overflow = 'hidden';

        // Add active class on next frame to trigger CSS transitions smoothly
        requestAnimationFrame(() => {
            pdfModal.classList.add('active');
        });
    };

    const closeModal = () => {
        pdfModal.classList.remove('active');
        document.body.style.overflow = '';

        // Wait for CSS transitions (0.35s / 350ms) before calling close()
        setTimeout(() => {
            pdfModal.close();
        }, 350);
    };

    viewCvBtn.addEventListener('click', openModal);
    pdfCloseBtn.addEventListener('click', closeModal);

    // Close on clicking backdrop
    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) {
            closeModal();
        }
    });

    // Handle Esc key smooth exit animation by intercepting dialog cancel event
    pdfModal.addEventListener('cancel', (e) => {
        e.preventDefault(); // Prevent instant browser close
        closeModal();
    });
};

initPdfViewer();

// =============================================
// TYPED TEXT ANIMATION
// =============================================
const initTypedText = () => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    // Skip animation for reduced-motion users
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; // Keep the static HTML as-is

    // The full subtitle as segments with optional color
    const segments = [
        { text: 'Building Tech. ', color: '' },
        { text: 'Analyzing Markets.', color: 'var(--color-emerald-500)' },
        { text: '\n', color: '' }, // line break
        { text: 'Mentoring Minds. ', color: 'var(--color-rose-500)' },
        { text: 'Creating Impact.', color: 'var(--color-orange-500)' },
    ];

    // Flatten segments into a character array with color info
    const chars = [];
    segments.forEach((seg) => {
        for (const ch of seg.text) {
            chars.push({ ch, color: seg.color });
        }
    });

    subtitle.classList.add('typing-active');

    // Create typed output and cursor
    const typedOutput = document.createElement('span');
    typedOutput.className = 'typed-output';
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';

    subtitle.appendChild(typedOutput);
    subtitle.appendChild(cursor);

    const typeSpeed = 90;
    const deleteSpeed = 25;
    const pauseAfterType = 2200;
    const pauseAfterDelete = 400;
    const totalCycles = 1;
    let currentCycle = 0;
    let charIndex = 0;
    let isDeleting = false;

    const buildHTML = (upTo) => {
        let html = '';
        let currentColor = null;
        for (let i = 0; i < upTo; i++) {
            const { ch, color } = chars[i];
            if (ch === '\n') {
                if (currentColor) { html += '</span>'; currentColor = null; }
                html += '<br>';
                continue;
            }
            if (color !== (currentColor || '')) {
                if (currentColor) html += '</span>';
                if (color) html += `<span style="color: ${color}">`;
                currentColor = color || null;
            }
            html += ch;
        }
        if (currentColor) html += '</span>';
        return html;
    };

    const tick = () => {
        if (!isDeleting) {
            charIndex++;
            typedOutput.innerHTML = buildHTML(charIndex);

            if (charIndex === chars.length) {
                currentCycle++;
                if (currentCycle >= totalCycles) {
                    // Final cycle — remove cursor completely
                    setTimeout(() => {
                        cursor.remove();
                    }, 1000);
                    return;
                }
                // Pause then start deleting
                setTimeout(() => { isDeleting = true; tick(); }, pauseAfterType);
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
    const aboutBioBtn = document.getElementById('aboutBioBtn');
    const aboutBioExpandable = document.getElementById('aboutBioExpandable');

    if (!aboutBioBtn || !aboutBioExpandable) return;

    aboutBioBtn.addEventListener('click', () => {
        const isExpanded = aboutBioExpandable.classList.toggle('expanded');
        aboutBioBtn.classList.toggle('expanded', isExpanded);
        aboutBioBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        
        const textSpan = aboutBioBtn.querySelector('span');
        if (textSpan) {
            textSpan.textContent = isExpanded ? 'View Less' : 'View More';
        }
    });
};

const initAboutTabs = () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (tabButtons.length === 0) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tab buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            // Hide all panels
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Show target panel
            const tabName = btn.getAttribute('data-tab');
            const targetPanel = document.getElementById(`panel-${tabName}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
};

initAboutBioToggle();
initAboutTabs();


