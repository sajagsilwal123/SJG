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
const sections = document.querySelectorAll('#about, #story, #journey, #work, #connect');
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

    // Fallback: highlight the last section ('connect') if user has scrolled to the bottom of the page
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10;

    if (isAtBottom) {
        currentSection = 'connect';
    } else {
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
    }

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
        document.querySelectorAll('.experience-card, .hobby-card, .timeline-card')
            .forEach(c => c.classList.remove('selected'));

        if (isSelected) {
            card.classList.add('closed-by-user');
        } else {
            document.querySelectorAll('.experience-card, .hobby-card, .timeline-card')
                .forEach(c => c.classList.remove('closed-by-user'));
            card.classList.add('selected');
        }
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('closed-by-user');
    });
});

// Click anywhere else to deselect all cards
document.addEventListener('click', () => {
    document.querySelectorAll('.experience-card, .hobby-card, .timeline-card')
        .forEach(c => c.classList.remove('selected', 'closed-by-user'));
});

// Update current year in footer
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

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

    const openModal = (e) => {
        // Check if on a mobile viewport, iPad, or tablet device to redirect to cv.html
        const isMobileOrTablet = window.innerWidth <= 1024 ||
            (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        if (isMobileOrTablet) {
            // Redirect to the CV wrapper page that has a back button
            if (e) e.preventDefault();
            window.location.href = 'cv.html';
            return;
        }

        // On desktop, prevent opening the link and show the modal instead
        if (e) e.preventDefault();

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

    // Create typed output
    const typedOutput = document.createElement('span');
    typedOutput.className = 'typed-output';

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


// =============================================
// SELECTED WORK — PROJECT DATA
// =============================================
// Edit this array to add, remove, or reorder projects.
// Cards are rendered dynamically from this data.

const PROJECTS = [
    {
        title: 'BasukiMS',
        headline: 'Leading the Digital Transformation of a 30-Year Transport Business',
        description: 'Led the conception, strategy, and end-to-end execution of BasukiMS, an enterprise-grade fleet management and transport operations platform built to modernize Nepal\'s logistics industry. Defined the product vision, designed the core business workflows, and translated complex operational challenges into scalable digital solutions tailored for transport companies.\n\nArchitected the overall platform, including its multi-tenant infrastructure, security model, permission framework, and modular system architecture. Spearheaded the design of advanced capabilities such as AI-assisted document processing, intelligent compliance monitoring, predictive financial insights, and automated operational workflows while ensuring every feature aligned with real-world transportation business requirements.\n\nContributed extensively as a Backend Engineer, developing core APIs, business logic, database architecture, authentication systems, and infrastructure while maintaining a strong focus on scalability, security, and maintainability.\n\nBeyond engineering, directed product management, project planning, stakeholder communication, legal and regulatory compliance, operational processes, human resource management, client onboarding, and executive decision-making. Coordinated cross-functional teams throughout the product lifecycle, balancing technical excellence with business objectives to successfully transform the platform from an initial concept into a comprehensive enterprise solution.',
        focus: ['Workflow Automation', 'Enterprise Resource Planning', 'Operational Intelligence', 'Platform Architecture'],
        gradient: 'linear-gradient(135deg, #f5576c22 0%, #f093fb22 100%)',
        accentColor: '#f5576c',
    },
    {
        title: 'Dhewaa',
        headline: 'Engineering financial infrastructure through intelligent architecture.',
        description: `As the Lead System Architect and AI Engineering Collaborator, I directed the architectural design and technical specification of Dhewaa, an enterprise financial management platform developed as a pure software engineering experiment to explore the practical limits of AI-assisted product development. The objective was not only to build production-grade software, but also to understand where AI can accelerate engineering and where human architectural reasoning remains indispensable. The platform includes both a cross-platform mobile application built with React Native (Expo) and a modern web application, supported by a scalable Express and PostgreSQL backend.

The system simplifies accounting, lending, document management, and business operations through a comprehensive architecture featuring double-entry accounting, loan management, multi-party settlement optimization, secure document storage, and multi-tenant infrastructure. Every subsystem was designed around enterprise engineering principles with a strong emphasis on modular services, transactional consistency, efficient indexing strategies, security, and horizontal scalability.

A defining aspect of the project was the structured collaboration between multiple AI engineering agents. I orchestrated the responsibilities of specialized AI models while maintaining complete architectural ownership, validating every critical design decision and implementation strategy. Throughout development, the project documented real-world AI engineering challenges—including authentication edge cases, schema migration inconsistencies, SDK compatibility issues, and architectural validation—providing valuable insight into both the strengths and limitations of current AI-assisted software engineering workflows.

The resulting blueprint serves not only as the implementation guide for Dhewaa, but also as a comprehensive case study in AI-assisted enterprise software engineering, demonstrating how intelligent collaboration between humans and AI can dramatically accelerate development while preserving architectural quality, technical rigor, scalability, and production readiness.`,
        focus: [
            'AI-Assisted Engineering',
            'Financial Infrastructure',
            'Cross-Platform Systems',
            'Enterprise Architecture'
        ],
        gradient: 'linear-gradient(135deg, #4facfe22 0%, #00f2fe22 100%)',
        accentColor: '#4facfe',
    },
    {
        title: 'Aroma Ecosystem',
        headline: "Where E-commerce Meets Intelligent Operations",
        description: `As Co-founder and CEO of Iruka Technologies, I led the conception, strategy, and execution of the Aroma Ecosystem, an enterprise commerce platform designed to modernize how brands, merchants, warehouses, and logistics partners operate together. Rather than building another marketplace, the objective was to create a unified operational ecosystem that transforms fragmented manual processes into scalable, data driven commerce.

I designed the proof of concept (POC) for Nexus, Aroma's warehouse and order automation platform, serving as the operational backbone of the ecosystem. The platform manages the complete commerce lifecycle, from vendor onboarding, procurement, inventory management, and warehouse operations to quality control, order fulfillment, reverse logistics, and biweekly vendor settlements. To strengthen trust across the marketplace, I introduced the Quality Control Unit (QCU), standardized SKU management, and established structured operational workflows that ensure product authenticity, consistency, and efficiency.

Built for scale, the ecosystem supports centralized inventory management, real time Inventory Health Status monitoring, automated replenishment workflows, multi vendor warehouse operations, and flexible 1P and 2P fulfillment models. By integrating inventory, warehousing, finance, fulfillment, and logistics into a single platform, Aroma enables merchants to transition from fragmented social commerce to professional e commerce with significantly improved operational visibility and efficiency.

Alongside product development, I led finance, regulatory compliance, business development, marketing strategy, and executive decision making to ensure the platform evolved alongside the business it was built to support. I also collaborated with third party logistics partners, including Pathao Parcel and PickNDrop Nepal, to establish dependable nationwide fulfillment and last mile delivery operations that extended the ecosystem beyond software into real world commerce.

After nearly three years of continuous development and refinement, Aroma matured into a comprehensive commerce ecosystem ready for market launch. Although I stepped away from the project to pursue my master's degree, it remains one of my most significant experiences in product leadership, enterprise systems, operational excellence, and building technology that solves complex business challenges at scale.`,
        focus: [
            'Commerce Ecosystem',
            'Warehouse Automation',
            'Supply Chain Operations',
            'Multi Vendor Commerce',
            'Business Strategy',
            'Operational Excellence'
        ],
        gradient: 'linear-gradient(135deg, #667eea22 0%, #764ba222 100%)',
        accentColor: '#667eea',
    },
    {
        title: 'Leo MD 325 CMS',
        headline: 'Simplifying organizational operations through centralized digital workflows.',
        description: 'Developed a management platform that unified administrative processes, payment tracking, approvals, and organizational coordination into one reliable operational workspace, replacing disconnected manual processes with streamlined collaboration.',
        focus: ['Workflow Optimization', 'Organizational Management', 'Access Control', 'Operational Automation'],
        gradient: 'linear-gradient(135deg, #10b98122 0%, #a8edea22 100%)',
        accentColor: '#10b981',
    },
    {
        title: 'NepseBot',
        headline: 'Converting fragmented market information into reliable investment intelligence.',
        description: 'Built an automated market intelligence system that continuously transforms scattered public financial information into structured datasets, enabling faster analysis while eliminating repetitive manual collection.',
        focus: ['Data Engineering', 'Market Intelligence', 'Automation Systems', 'Information Processing'],
        gradient: 'linear-gradient(135deg, #f9731622 0%, #ffecd222 100%)',
        accentColor: '#f97316',
    },
    {
        title: 'Scholarr LMS',
        headline: 'Bridging academic management with everyday productivity.',
        description: 'Created a learning platform that connects educational workflows, assignments, progress tracking, and daily task organization into one collaborative environment, helping institutions operate more efficiently while improving the student learning experience.',
        focus: ['Learning Platforms', 'Academic Workflows', 'Secure Platform Design', 'Task Orchestration'],
        gradient: 'linear-gradient(135deg, #6366f122 0%, #c3cfe222 100%)',
        accentColor: '#6366f1',
    },
];

// =============================================
// =============================================
// SELECTED WORK — RENDER CARDS
// =============================================
const initSelectedWork = () => {
    const stack = document.getElementById('workStack');
    if (!stack) return;

    PROJECTS.forEach((project, index) => {
        const num = String(index + 1).padStart(2, '0');
        const isLongDesc = project.description.length > 250;

        const card = document.createElement('article');
        card.className = 'work-card';
        card.setAttribute('data-work-index', index);

        card.innerHTML = `
            <div class="work-card-content">
                <div class="work-card-header-row">
                    <span class="work-card-number">${num}</span>
                    <h3 class="work-card-title">${project.title}</h3>
                </div>
                <p class="work-card-headline">${project.headline}</p>
                <p class="work-card-description${isLongDesc ? ' clamped' : ''}">${project.description}</p>
                ${isLongDesc ? `
                    <button type="button" class="work-card-view-more" aria-label="View more details about ${project.title}">
                        <span>View More</span> <span class="view-more-arrow">↓</span>
                    </button>
                ` : ''}
                <div class="work-card-focus">
                    ${project.focus.map(tag => `<span class="work-focus-pill">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        // Attach event listener to trigger popup details modal
        if (isLongDesc) {
            const btn = card.querySelector('.work-card-view-more');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.openWorkModal) {
                        window.openWorkModal(project, num);
                    }
                });
            }
        }

        stack.appendChild(card);
    });
};

// =============================================
// SELECTED WORK — DETAIL MODAL MANAGEMENT
// =============================================
const initWorkModal = () => {
    const modal = document.getElementById('workModal');
    const closeBtn = document.getElementById('workModalCloseBtn');
    if (!modal || !closeBtn) return;

    // Global hook for cards to trigger
    window.openWorkModal = (project, num) => {
        document.getElementById('workModalNum').textContent = num;
        document.getElementById('workModalTitle').textContent = project.title;
        document.getElementById('workModalHeadline').textContent = project.headline;
        const descContainer = document.getElementById('workModalDesc');
        descContainer.innerHTML = project.description
            .split('\n\n')
            .map(para => `<p style="margin-bottom: var(--spacing-4); line-height: 1.7;">${para.replace(/\n/g, '<br>')}</p>`)
            .join('');

        // Apply brand variables directly to custom modal style property
        modal.style.setProperty('--project-accent', project.accentColor);
        modal.style.setProperty('--project-gradient', project.gradient);

        const focusContainer = document.getElementById('workModalFocus');
        focusContainer.innerHTML = project.focus.map(tag => `<span class="work-focus-pill">${tag}</span>`).join('');

        modal.showModal();
        // Add active class on next frame for transition
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden'; // Lock scroll
    };

    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.close();
            document.body.style.overflow = ''; // Unlock scroll
        }, 300);
    };

    closeBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle escape key cancel animation
    modal.addEventListener('cancel', (e) => {
        e.preventDefault();
        closeModal();
    });
};

initSelectedWork();
initWorkModal();
