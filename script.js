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
        headline: 'Leading the Digital Transformation of a 30-Year Transport Legacy.',
        overview: 'Led the conception, strategy, and end-to-end execution of BasukiMS, an enterprise-grade fleet management and transport operations platform built to modernize Nepal\'s logistics industry. Defined the product vision, designed the core business workflows, and translated complex operational challenges into scalable digital solutions tailored for transport companies.',
        sections: [
            {
                label: 'ARCHITECTURE',
                title: 'Modular System Architecture',
                content: 'Architected the overall platform, including its multi-tenant infrastructure, security model, permission framework, and modular system architecture. Designed the systems to handle high-throughput telemetry, real-time dispatch operations, and complex nested user privilege mapping.'
            },
            {
                label: 'ENGINEERING DECISIONS',
                title: 'Core Backend Development',
                content: 'Contributed extensively as a Backend Engineer, developing core APIs, business logic, database architecture, authentication systems, and infrastructure while maintaining a strong focus on scalability, security, and maintainability. Led the integration of third-party SMS, payment gateways, and geolocation telemetry processing.'
            },
            {
                label: 'INTELLIGENT SYSTEMS',
                title: 'Operational Automation',
                content: 'Spearheaded the design of advanced capabilities such as AI-assisted document processing, intelligent compliance monitoring, predictive financial insights, and automated operational workflows while ensuring every feature aligned with real-world transportation business requirements.'
            },
            {
                label: 'LEADERSHIP & EXECUTION',
                title: 'Vision to Delivery',
                content: 'Beyond engineering, directed product management, project planning, stakeholder communication, legal and regulatory compliance, operational processes, human resource management, client onboarding, and executive decision-making. Coordinated cross-functional teams throughout the product lifecycle, balancing technical excellence with business objectives to successfully transform the platform from an initial concept into a comprehensive enterprise solution.'
            }
        ],
        focus: ['Workflow Automation', 'Enterprise Resource Planning', 'Operational Intelligence', 'Platform Architecture'],
        platform: ['Web Application (React)', 'Express API Backend', 'PostgreSQL Database', 'Geolocation Tracking API'],
        coreSystems: ['Multi-Tenant Fleet Engine', 'Automated Operational Workflows', 'Document Verification Pipeline', 'Dynamic Financial Reporting'],
        aiCollaboration: ['Gemini API integration', 'AI-Assisted Document Processing', 'Human Architectural Validation'],
        gradient: 'linear-gradient(135deg, #f5576c22 0%, #f093fb22 100%)',
        accentColor: '#f5576c',
        status: 'Production',
        architectureDiagram: ['React Web App', 'Express Backend', 'PostgreSQL Database', 'SMS & Payment APIs', 'Telemetry Processing'],
    },
    {
        title: 'Dhewaa',
        headline: 'Engineering financial infrastructure through intelligent architecture.',
        overview: 'As the Lead System Architect and AI Engineering Collaborator, I directed the architectural design and technical specification of Dhewaa, an enterprise financial management platform developed as a pure software engineering experiment to explore the practical limits of AI-assisted product development. The objective was not only to build production-grade software, but also to understand where AI can accelerate engineering and where human architectural reasoning remains indispensable. The platform includes both a cross-platform mobile application built with React Native (Expo) and a modern web application, supported by a scalable Express and PostgreSQL backend.',
        sections: [
            {
                label: 'FINANCIAL ENGINE',
                title: 'Double-Entry Accounting & Systems',
                content: 'The system simplifies accounting, lending, document management, and business operations through a comprehensive architecture featuring double-entry accounting, loan management, multi-party settlement optimization, secure document storage, and multi-tenant infrastructure. Every subsystem was designed around enterprise engineering principles with a strong emphasis on modular services, transactional consistency, efficient indexing strategies, security, and horizontal scalability.'
            },
            {
                label: 'AI COLLABORATION',
                title: 'Human Architectural Validation',
                content: 'A defining aspect of the project was the structured collaboration between multiple AI engineering agents. I orchestrated the responsibilities of specialized AI models while maintaining complete architectural ownership, validating every critical design decision and implementation strategy. Throughout development, the project documented real-world AI engineering challenges—including authentication edge cases, schema migration inconsistencies, SDK compatibility issues, and architectural validation—providing valuable insight into both the strengths and limitations of current AI-assisted software engineering workflows.'
            },
            {
                label: 'LESSONS LEARNED',
                title: 'Blueprint for Enterprise Ready Systems',
                content: 'The resulting blueprint serves not only as the implementation guide for Dhewaa, but also as a comprehensive case study in AI-assisted enterprise software engineering, demonstrating how intelligent collaboration between humans and AI can dramatically accelerate development while preserving architectural quality, technical rigor, scalability, and production readiness.'
            }
        ],
        focus: ['AI-Assisted Engineering', 'Financial Infrastructure', 'Cross-Platform Systems', 'Enterprise Architecture'],
        platform: ['Mobile App (React Native/Expo)', 'Web Application (React)', 'Express API Gateway', 'PostgreSQL Database'],
        coreSystems: ['Double Entry Accounting', 'Loan Ledger Engine', 'Settlement Optimization', 'Encrypted Document Vault', 'Multi-Tenancy Routing'],
        aiCollaboration: ['Antigravity Agent Orchestration', 'Claude Code Generation', 'Gemini Reasoning Engine', 'Human Validation Framework'],
        gradient: 'linear-gradient(135deg, #4facfe22 0%, #00f2fe22 100%)',
        accentColor: '#4facfe',
        status: 'Case Study / Specification',
        architectureDiagram: ['React Native / React', 'Express API Gateway', 'PostgreSQL Database', 'Encrypted Document Vault', 'Authentication (JWT)'],
    },
    {
        title: 'Aroma Ecosystem',
        headline: 'Where E-commerce Meets Intelligent Operations',
        overview: 'As Co-founder and CEO of Iruka Technologies, I led the conception, strategy, and execution of the Aroma Ecosystem, an enterprise commerce platform designed to modernize how brands, merchants, warehouses, and logistics partners operate together. Rather than building another marketplace, the objective was to create a unified operational ecosystem that transforms fragmented manual processes into scalable, data driven commerce.',
        sections: [
            {
                label: 'WAREHOUSE AUTOMATION',
                title: 'Nexus: The Operational Core',
                content: 'I designed the proof of concept (POC) for Nexus, Aroma\'s warehouse and order automation platform, serving as the operational backbone of the ecosystem. The platform manages the complete commerce lifecycle, from vendor onboarding, procurement, inventory management, and warehouse operations to quality control, order fulfillment, reverse logistics, and biweekly vendor settlements. To strengthen trust across the marketplace, I introduced the Quality Control Unit (QCU), standardized SKU management, and established structured operational workflows that ensure product authenticity, consistency, and efficiency.'
            },
            {
                label: 'SCALABLE LOGISTICS',
                title: 'Nationwide Fulfillment Integrations',
                content: 'Built for scale, the ecosystem supports centralized inventory management, real time Inventory Health Status monitoring, automated replenishment workflows, multi vendor warehouse operations, and flexible 1P and 2P fulfillment models. By integrating inventory, warehousing, finance, fulfillment, and logistics into a single platform, Aroma enables merchants to transition from fragmented social commerce to professional e commerce with significantly improved operational visibility and efficiency.\n\nI also collaborated with third party logistics partners, including Pathao Parcel and PickNDrop Nepal, to establish dependable nationwide fulfillment and last mile delivery operations that extended the ecosystem beyond software into real world commerce.'
            },
            {
                label: 'EXECUTIVE LEADERSHIP',
                title: 'Product Growth & Vision',
                content: 'Alongside product development, I led finance, regulatory compliance, business development, marketing strategy, and executive decision making to ensure the platform evolved alongside the business it was built to support. After nearly three years of continuous development and refinement, Aroma matured into a comprehensive commerce ecosystem ready for market launch. Although I stepped away from the project to pursue my master\'s degree, it remains one of my most significant experiences in product leadership, enterprise systems, operational excellence, and building technology that solves complex business challenges at scale.'
            }
        ],
        focus: ['Commerce Ecosystem', 'Warehouse Automation', 'Supply Chain Operations', 'Multi Vendor Commerce', 'Business Strategy', 'Operational Excellence'],
        platform: ['Multi-Merchant Web Portal', 'Node.js Microservices', 'Redis Caching Server', 'PostgreSQL Cluster'],
        coreSystems: ['Inventory Health Monitor', 'Automated Replenishment Engine', 'Vendor Settlement System', 'QCU Quality Verification'],
        aiCollaboration: ['Human Architectural Direction'],
        gradient: 'linear-gradient(135deg, #667eea22 0%, #764ba222 100%)',
        accentColor: '#667eea',
        status: 'Completed / Ready for Launch',
        architectureDiagram: ['Multi-Merchant Web Portal', 'Node.js Microservices', 'Redis Caching', 'PostgreSQL Cluster'],
    },
    {
        title: 'Leo MD 325 CMS',
        headline: 'Centralized Administrative Workflows and Payment Platforms',
        overview: 'Developed a management platform that unified administrative processes, payment tracking, approvals, and organizational coordination into one reliable operational workspace, replacing disconnected manual processes with streamlined collaboration.',
        sections: [
            {
                label: 'WORKFLOW AUTOMATION',
                title: 'Centralized Operations Hub',
                content: 'Streamlined administrative workflows for community leaders by introducing automated approval cycles, secure document management, and centralized team workspaces. This reduced overhead and improved task tracking across regional clubs.'
            },
            {
                label: 'PAYMENT TRACKING',
                title: 'Secure Financial Tracking',
                content: 'Implemented secure transaction logging, automated billing status updates, and digital payment tracking to ensure clear visibility into club financial records while preserving strict authorization levels.'
            }
        ],
        focus: ['Workflow Optimization', 'Access Control', 'Organizational Management', 'Operational Automation'],
        platform: ['React Web Portal', 'Express Backend Server', 'PostgreSQL Database'],
        coreSystems: ['Payment Approvals Engine', 'Secure RBAC Access Control', 'Member Workspace Directory'],
        aiCollaboration: ['Human Architectural Validation'],
        gradient: 'linear-gradient(135deg, #10b98122 0%, #a8edea22 100%)',
        accentColor: '#10b981',
        status: 'Completed',
        architectureDiagram: ['React Web Portal', 'Express Backend Server', 'PostgreSQL Database'],
    },
    {
        title: 'NepseBot',
        headline: 'Converting fragmented market information into reliable investment intelligence.',
        overview: 'Built an automated market intelligence system that continuously transforms scattered public financial information into structured datasets, enabling faster analysis while eliminating repetitive manual collection.',
        sections: [
            {
                label: 'DATA ENGINEERING',
                title: 'Live Data Pipeline & Gathering',
                content: 'Designed robust scrapers that parse live floorsheets, daily transaction logs, historical price indexes, and dividend records from public web resources, processing unstructured data streams into query-ready data storage.'
            },
            {
                label: 'INFORMATION PROCESSING',
                title: 'Analytical Data Storage',
                content: 'Aggregated historical market statistics and structured them into chronological databases. This enabled quantitative analyst tools to query trends, track stock behaviors, and generate market insights with minimal latency.'
            }
        ],
        focus: ['Data Engineering', 'Market Intelligence', 'Automation Systems', 'Information Processing'],
        platform: ['CLI Application Console', 'Python Scraping Scripts', 'Cron Job Scheduler'],
        coreSystems: ['Automated Web Scrapers', 'Floorsheet Data Parser', 'Chronological Pipeline'],
        aiCollaboration: ['Human-Led Optimization'],
        gradient: 'linear-gradient(135deg, #f9731622 0%, #ffecd222 100%)',
        accentColor: '#f97316',
        status: 'Completed / Automated',
        architectureDiagram: ['CLI Application Console', 'Python Scraping Scripts', 'Cron Job Scheduler', 'Market Database'],
    },
    {
        title: 'Scholarr LMS',
        headline: 'Bridging academic management with everyday productivity.',
        overview: 'Created a learning platform that connects educational workflows, assignments, progress tracking, and daily task organization into one collaborative environment, helping institutions operate more efficiently while improving the student learning experience.',
        sections: [
            {
                label: 'ACADEMIC WORKFLOWS',
                title: 'Syllabus & Task Orchestration',
                content: 'Unified student calendar items, course timelines, and assignments into a cohesive task tracker that helps students manage workloads while giving educators real-time progress oversight.'
            },
            {
                label: 'SECURE PLATFORM DESIGN',
                title: 'Session Security & Routing',
                content: 'Implemented secure user registration, session management, and encrypted token auth protocols to guarantee privacy, data isolation, and secure storage of academic grades and student records.'
            }
        ],
        focus: ['Learning Platforms', 'Academic Workflows', 'Secure Platform Design', 'Task Orchestration'],
        platform: ['React Web Application', 'Node.js API Service', 'MongoDB Storage Cluster'],
        coreSystems: ['JSON Web Token Auth', 'Syllabus Course Scheduler', 'Task Progress Analytics'],
        aiCollaboration: ['Human-Led Design'],
        gradient: 'linear-gradient(135deg, #6366f122 0%, #c3cfe222 100%)',
        accentColor: '#6366f1',
        status: 'Completed',
        architectureDiagram: ['React Web Application', 'Node.js API Service', 'MongoDB Storage Cluster', 'JWT Auth'],
    },
];

// =============================================
// SELECTED WORK — RENDER CARDS
// =============================================
const initSelectedWork = () => {
    const stack = document.getElementById('workStack');
    if (!stack) return;

    PROJECTS.forEach((project, index) => {
        const num = String(index + 1).padStart(2, '0');

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
                <p class="work-card-description clamped">${project.overview}</p>
                <button type="button" class="work-card-view-more" aria-label="View details for ${project.title}">
                    <span>View details</span> <span class="view-more-arrow">→</span>
                </button>
                <div class="work-card-focus">
                    ${project.focus.map(tag => `<span class="work-focus-pill">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        // Attach event listener to trigger popup details modal
        const btn = card.querySelector('.work-card-view-more');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.openWorkModal) {
                    window.openWorkModal(project, num);
                }
            });
        }

        stack.appendChild(card);
    });
};

// =============================================
// SELECTED WORK — DETAIL MODAL MANAGEMENT
// =============================================
const initWorkModal = () => {
    const modal = document.getElementById('workModal');
    if (!modal) return;

    const navigateToProject = (targetProj, targetNum) => {
        const content = modal.querySelector('.project-modal');
        if (content) {
            content.style.opacity = '0';
            content.style.transform = window.innerWidth <= 1199 ? 'translateX(20px)' : 'translateY(10px)';
            content.style.transition = 'opacity 200ms ease, transform 200ms ease';
        }

        setTimeout(() => {
            window.openWorkModal(targetProj, targetNum);
            const newContent = modal.querySelector('.project-modal');
            if (newContent) {
                newContent.scrollTop = 0;
                newContent.style.opacity = '0';
                newContent.style.transform = window.innerWidth <= 1199 ? 'translateX(-20px)' : 'translateY(-10px)';
                requestAnimationFrame(() => {
                    newContent.style.transition = 'opacity 250ms cubic-bezier(0.16, 1, 0.3, 1), transform 250ms cubic-bezier(0.16, 1, 0.3, 1)';
                    newContent.style.opacity = '1';
                    newContent.style.transform = 'translateY(0) translateX(0)';
                });
            }
        }, 200);
    };

    const renderMobileModal = (project, num) => {
        const currentIndex = PROJECTS.findIndex(p => p.title === project.title);
        const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
        const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
        const prevNum = String(((currentIndex - 1 + PROJECTS.length) % PROJECTS.length) + 1).padStart(2, '0');
        const nextNum = String(((currentIndex + 1) % PROJECTS.length) + 1).padStart(2, '0');

        modal.innerHTML = `
            <div class="project-modal mobile-version">
                <div class="project-modal-mobile-header">
                    <button class="mobile-header-back-btn" id="mobileBackBtn" aria-label="Go back">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        <span>Back</span>
                    </button>
                    <span class="project-modal-mobile-header-title" id="mobileHeaderTitle">${project.title}</span>
                    <button class="mobile-header-share-btn" id="mobileShareBtn" aria-label="Share case study">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        <span>Share</span>
                    </button>
                </div>
                <div class="project-modal-mobile-content">
                    <div class="mobile-hero-section">
                        <div class="mobile-hero-num">${num}</div>
                        <h1 class="mobile-hero-title">${project.title}</h1>
                        <p class="mobile-hero-headline">${project.headline}</p>
                        <p class="mobile-hero-summary">${project.overview.replace(/\n/g, '<br>')}</p>
                        
                        <div class="mobile-hero-focus-chips">
                            ${project.focus.map(chip => `<span class="mobile-focus-chip">${chip}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="mobile-divider"></div>

                    ${project.platform ? `
                        <div class="mobile-detail-section">
                            <span class="mobile-section-label">PLATFORM</span>
                            <h2 class="mobile-section-heading">Target Environment</h2>
                            <div class="mobile-platform-cards">
                                ${project.platform.map(plat => {
            let emoji = '💻';
            const lowerPlat = plat.toLowerCase();
            if (lowerPlat.includes('mobile') || lowerPlat.includes('react native') || lowerPlat.includes('ios') || lowerPlat.includes('android')) {
                emoji = '📱';
            } else if (lowerPlat.includes('api') || lowerPlat.includes('backend') || lowerPlat.includes('microservice') || lowerPlat.includes('server') || lowerPlat.includes('scraping') || lowerPlat.includes('script') || lowerPlat.includes('console')) {
                emoji = '⚙️';
            } else if (lowerPlat.includes('db') || lowerPlat.includes('database') || lowerPlat.includes('postgres') || lowerPlat.includes('sql') || lowerPlat.includes('mongo') || lowerPlat.includes('redis') || lowerPlat.includes('cluster') || lowerPlat.includes('caching') || lowerPlat.includes('storage')) {
                emoji = '🗄️';
            }
            return `
                                        <div class="mobile-platform-card">
                                            <span class="plat-emoji">${emoji}</span>
                                            <span class="plat-text">${plat}</span>
                                        </div>
                                    `;
        }).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${project.sections.map(sec => `
                        <div class="mobile-detail-section">
                            <span class="mobile-section-label">${sec.label}</span>
                            <h2 class="mobile-section-heading">${sec.title}</h2>
                            <p class="mobile-section-body">${sec.content.replace(/\n/g, '<br>')}</p>
                        </div>
                    `).join('')}

                    ${project.architectureDiagram ? `
                        <div class="mobile-detail-section">
                            <span class="mobile-section-label">ARCHITECTURE</span>
                            <h2 class="mobile-section-heading">System Topology</h2>
                            <div class="mobile-architecture-diagram">
                                ${project.architectureDiagram.map((node, index) => `
                                    <div class="arch-node-container">
                                        <div class="arch-node">${node}</div>
                                        ${index < project.architectureDiagram.length - 1 ? `
                                            <div class="arch-arrow">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                                            </div>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${project.coreSystems ? `
                        <div class="mobile-detail-section">
                            <span class="mobile-section-label">CORE SUBSYSTEMS</span>
                            <h2 class="mobile-section-heading">Key Capabilities</h2>
                            <div class="mobile-feature-grid">
                                ${project.coreSystems.map(sys => `
                                    <div class="mobile-feature-card">
                                        <div class="mobile-feature-icon" style="color: var(--project-accent)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                        </div>
                                        <span class="mobile-feature-text">${sys}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${project.aiCollaboration ? `
                        <div class="mobile-detail-section">
                            <span class="mobile-section-label">AI COLLABORATION</span>
                            <h2 class="mobile-section-heading">Intelligent Tooling</h2>
                            <div class="mobile-feature-grid">
                                ${project.aiCollaboration.map(collab => `
                                    <div class="mobile-feature-card">
                                        <div class="mobile-feature-icon" style="color: var(--project-accent)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/></svg>
                                        </div>
                                        <span class="mobile-feature-text">${collab}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div class="mobile-footer-section">
                        <div class="mobile-project-status">
                            <span class="status-label">Project Status</span>
                            <span class="status-badge" style="background: var(--project-gradient); border-color: var(--project-accent);">${project.status}</span>
                        </div>
                        <div class="mobile-footer-nav">
                            <button class="footer-nav-btn prev-project-btn" id="mobilePrevBtn" aria-label="Previous project">
                                <span class="nav-arrow">←</span>
                                <div class="nav-project-info">
                                    <span class="nav-label">PREVIOUS</span>
                                    <span class="nav-title">${prevProject.title}</span>
                                </div>
                            </button>
                            <button class="footer-nav-btn next-project-btn" id="mobileNextBtn" aria-label="Next project">
                                <div class="nav-project-info align-right">
                                    <span class="nav-label">NEXT</span>
                                    <span class="nav-title">${nextProject.title}</span>
                                </div>
                                <span class="nav-arrow">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind mobile scroll actions
        const scrollContainer = modal.querySelector('.project-modal.mobile-version');
        const header = modal.querySelector('.project-modal-mobile-header');
        const headerTitle = modal.querySelector('#mobileHeaderTitle');

        if (scrollContainer && header && headerTitle) {
            scrollContainer.addEventListener('scroll', () => {
                const scrollTop = scrollContainer.scrollTop;
                if (scrollTop > 80) {
                    header.classList.add('scrolled');
                    const opacity = Math.min((scrollTop - 80) / 80, 1);
                    headerTitle.style.opacity = opacity;
                    headerTitle.style.transform = `translateY(${Math.max(10 - opacity * 10, 0)}px)`;
                } else {
                    header.classList.remove('scrolled');
                    headerTitle.style.opacity = '0';
                    headerTitle.style.transform = 'translateY(10px)';
                }
            });
        }

        // Back action
        const backBtn = modal.querySelector('#mobileBackBtn');
        if (backBtn) backBtn.addEventListener('click', closeModal);

        // Share action
        const shareBtn = modal.querySelector('#mobileShareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const shareData = {
                    title: `${project.title} - Sajag Silwal Portfolio`,
                    text: `${project.title}: ${project.headline}`,
                    url: window.location.href
                };
                try {
                    if (navigator.share) {
                        await navigator.share(shareData);
                    } else {
                        await navigator.clipboard.writeText(window.location.href);
                        const span = shareBtn.querySelector('span');
                        if (span) {
                            const originalText = span.textContent;
                            span.textContent = 'Copied!';
                            setTimeout(() => {
                                span.textContent = originalText;
                            }, 2000);
                        }
                    }
                } catch (err) {
                    console.error('Error sharing:', err);
                }
            });
        }

        // Navigation actions
        const prevBtn = modal.querySelector('#mobilePrevBtn');
        if (prevBtn) prevBtn.addEventListener('click', () => navigateToProject(prevProject, prevNum));

        const nextBtn = modal.querySelector('#mobileNextBtn');
        if (nextBtn) nextBtn.addEventListener('click', () => navigateToProject(nextProject, nextNum));
    };

    const renderTabletModal = (project, num) => {
        const currentIndex = PROJECTS.findIndex(p => p.title === project.title);
        const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
        const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
        const prevNum = String(((currentIndex - 1 + PROJECTS.length) % PROJECTS.length) + 1).padStart(2, '0');
        const nextNum = String(((currentIndex + 1) % PROJECTS.length) + 1).padStart(2, '0');

        modal.innerHTML = `
            <div class="project-modal tablet-version">
                <div class="project-modal-tablet-header">
                    <div class="tablet-header-left">
                        <span class="tablet-header-num">${num}</span>
                        <span class="project-modal-tablet-header-title" id="tabletHeaderTitle">${project.title}</span>
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
                        <p class="tablet-hero-summary">${project.overview.replace(/\n/g, '<br>')}</p>
                        
                        <div class="tablet-hero-focus-chips">
                            ${project.focus.map(chip => `<span class="tablet-focus-chip">${chip}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="tablet-grid-layout">
                        <!-- Left Column (60% on landscape, stacked on portrait) -->
                        <div class="tablet-left-column">
                            ${project.sections.map(sec => `
                                <div class="tablet-detail-section">
                                    <span class="tablet-section-label">${sec.label}</span>
                                    <h2 class="tablet-section-heading">${sec.title}</h2>
                                    <p class="tablet-section-body">${sec.content.replace(/\n/g, '<br>')}</p>
                                </div>
                            `).join('')}
                            
                            ${project.architectureDiagram ? `
                                <div class="tablet-detail-section">
                                    <span class="tablet-section-label">ARCHITECTURE</span>
                                    <h2 class="tablet-section-heading">System Topology</h2>
                                    <div class="tablet-architecture-diagram">
                                        ${project.architectureDiagram.map((node, index) => `
                                            <div class="tablet-arch-node-container">
                                                <div class="tablet-arch-node">${node}</div>
                                                ${index < project.architectureDiagram.length - 1 ? `
                                                    <div class="tablet-arch-arrow">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        
                        <!-- Right Column (40% on landscape, stacked on portrait) -->
                        <div class="tablet-right-column">
                            ${project.platform ? `
                                <div class="tablet-info-card">
                                    <div class="tablet-info-card-title">Platform</div>
                                    <div class="tablet-info-card-list">
                                        ${project.platform.map(plat => {
                                            let emoji = '💻';
                                            const lowerPlat = plat.toLowerCase();
                                            if (lowerPlat.includes('mobile') || lowerPlat.includes('react native') || lowerPlat.includes('ios') || lowerPlat.includes('android')) {
                                                emoji = '📱';
                                            } else if (lowerPlat.includes('api') || lowerPlat.includes('backend') || lowerPlat.includes('microservice') || lowerPlat.includes('server') || lowerPlat.includes('scraping') || lowerPlat.includes('script') || lowerPlat.includes('console')) {
                                                emoji = '⚙️';
                                            } else if (lowerPlat.includes('db') || lowerPlat.includes('database') || lowerPlat.includes('postgres') || lowerPlat.includes('sql') || lowerPlat.includes('mongo') || lowerPlat.includes('redis') || lowerPlat.includes('cluster') || lowerPlat.includes('caching') || lowerPlat.includes('storage')) {
                                                emoji = '🗄️';
                                            }
                                            return `
                                                <div class="tablet-info-item">
                                                    <span class="tablet-info-icon">${emoji}</span>
                                                    <span class="tablet-info-text">${plat}</span>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            ${project.coreSystems ? `
                                <div class="tablet-info-card">
                                    <div class="tablet-info-card-title">Core Systems</div>
                                    <div class="tablet-info-card-list">
                                        ${project.coreSystems.map(sys => `
                                            <div class="tablet-info-item">
                                                <span class="tablet-info-icon" style="color: var(--project-accent);">✓</span>
                                                <span class="tablet-info-text">${sys}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            ${project.aiCollaboration ? `
                                <div class="tablet-info-card">
                                    <div class="tablet-info-card-title">AI Collaboration</div>
                                    <div class="tablet-info-card-list">
                                        ${project.aiCollaboration.map(collab => `
                                            <div class="tablet-info-item">
                                                <span class="tablet-info-icon" style="color: var(--project-accent);">⚡</span>
                                                <span class="tablet-info-text">${collab}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            <div class="tablet-info-card">
                                <div class="tablet-info-card-title">Project Status</div>
                                <div class="tablet-status-badge" style="background: var(--project-gradient); border-color: var(--project-accent);">
                                    ${project.status}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tablet-footer-section">
                        <div class="tablet-footer-nav">
                            <button class="tablet-footer-nav-btn prev-btn" id="tabletPrevBtn" aria-label="Previous project">
                                <span class="tablet-nav-arrow">←</span>
                                <div class="tablet-nav-project-info">
                                    <span class="tablet-nav-label">PREVIOUS</span>
                                    <span class="tablet-nav-title">${prevProject.title}</span>
                                </div>
                            </button>
                            <button class="tablet-footer-nav-btn next-btn" id="tabletNextBtn" aria-label="Next project">
                                <div class="tablet-nav-project-info align-right">
                                    <span class="tablet-nav-label">NEXT</span>
                                    <span class="tablet-nav-title">${nextProject.title}</span>
                                </div>
                                <span class="tablet-nav-arrow">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind scroll header animations
        const scrollContainer = modal.querySelector('.project-modal-tablet-scroll');
        const header = modal.querySelector('.project-modal-tablet-header');
        const headerTitle = modal.querySelector('#tabletHeaderTitle');

        if (scrollContainer && header && headerTitle) {
            scrollContainer.addEventListener('scroll', () => {
                const scrollTop = scrollContainer.scrollTop;
                if (scrollTop > 80) {
                    header.classList.add('scrolled');
                    const opacity = Math.min((scrollTop - 80) / 80, 1);
                    headerTitle.style.opacity = opacity;
                    headerTitle.style.transform = `translateY(${Math.max(8 - opacity * 8, 0)}px)`;
                } else {
                    header.classList.remove('scrolled');
                    headerTitle.style.opacity = '0';
                    headerTitle.style.transform = 'translateY(8px)';
                }
            });
        }

        // Close action
        const closeBtn = modal.querySelector('#tabletCloseBtn');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        // Footer buttons navigation
        const prevBtn = modal.querySelector('#tabletPrevBtn');
        if (prevBtn) prevBtn.addEventListener('click', () => navigateToProject(prevProject, prevNum));

        const nextBtn = modal.querySelector('#tabletNextBtn');
        if (nextBtn) nextBtn.addEventListener('click', () => navigateToProject(nextProject, nextNum));

        // Swipe gestures navigation
        const container = modal.querySelector('.project-modal.tablet-version');
        if (container) {
            let touchStartX = 0;
            let touchEndX = 0;

            container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeDistance = touchStartX - touchEndX;

                if (swipeDistance > 100) {
                    navigateToProject(nextProject, nextNum);
                } else if (swipeDistance < -100) {
                    navigateToProject(prevProject, prevNum);
                }
            }, { passive: true });
        }
    };

    const renderDesktopModal = (project, num) => {
        modal.innerHTML = `
            <div class="project-modal">
                <div class="project-modal-header">
                    <div class="project-modal-header-left">
                        <span class="project-modal-num" id="workModalNum">${num}</span>
                        <h3 class="project-modal-title" id="workModalTitle">${project.title}</h3>
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
                    <p class="project-modal-headline" id="workModalHeadline">${project.headline}</p>
                    <div class="project-modal-content-grid">
                        <div class="project-modal-left-col" id="workModalLeftCol">
                            <div class="project-modal-overview-section">
                                <p class="project-modal-overview-text">${project.overview}</p>
                            </div>
                            ${project.sections.map(section => `
                                <div class="project-modal-detail-section">
                                    <span class="project-modal-section-label">${section.label}</span>
                                    <h4 class="project-modal-section-title">${section.title}</h4>
                                    <p class="project-modal-section-content">${section.content.replace(/\n/g, '<br>')}</p>
                                </div>
                            `).join('')}
                        </div>
                        <div class="project-modal-right-col" id="workModalRightCol">
                            ${project.focus ? `
                                <div class="project-modal-info-card">
                                    <div class="project-modal-info-card-title">Engineering Focus</div>
                                    <div class="project-modal-info-card-list">
                                        ${project.focus.map(item => `
                                            <div class="info-card-item">
                                                <span class="bullet" style="color: var(--project-accent);">◆</span>
                                                <span class="text">${item}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            ${project.platform ? `
                                <div class="project-modal-info-card">
                                    <div class="project-modal-info-card-title">Platform & Core Infrastructure</div>
                                    <div class="project-modal-info-card-list">
                                        ${project.platform.map(item => `
                                            <div class="info-card-item">
                                                <span class="bullet" style="color: var(--project-accent);">✓</span>
                                                <span class="text">${item}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            ${project.coreSystems ? `
                                <div class="project-modal-info-card">
                                    <div class="project-modal-info-card-title">Core Subsystems</div>
                                    <div class="project-modal-info-card-list">
                                        ${project.coreSystems.map(item => `
                                            <div class="info-card-item">
                                                <span class="bullet" style="color: var(--project-accent);">•</span>
                                                <span class="text">${item}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            ${project.aiCollaboration ? `
                                <div class="project-modal-info-card">
                                    <div class="project-modal-info-card-title">AI Collaboration Tools</div>
                                    <div class="project-modal-info-card-list">
                                        ${project.aiCollaboration.map(item => `
                                            <div class="info-card-item">
                                                <span class="bullet" style="color: var(--project-accent);">⚡</span>
                                                <span class="text">${item}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const closeBtn = modal.querySelector('#workModalCloseBtn');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
    };

    window.openWorkModal = (project, num) => {
        modal.style.setProperty('--project-accent', project.accentColor);
        modal.style.setProperty('--project-gradient', project.gradient);

        const width = window.innerWidth;
        if (width < 768) {
            renderMobileModal(project, num);
        } else if (width >= 768 && width <= 1199) {
            renderTabletModal(project, num);
        } else {
            renderDesktopModal(project, num);
        }

        modal.showModal();

        setTimeout(() => {
            modal.classList.add('active');
            if (window.innerWidth < 768) {
                document.body.classList.add('body-modal-open');
            } else if (window.innerWidth >= 768 && window.innerWidth <= 1199) {
                document.body.classList.add('body-modal-open-tablet');
            }
        }, 10);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        const width = window.innerWidth;
        if (width < 768) {
            document.body.classList.remove('body-modal-open');
        } else if (width >= 768 && width <= 1199) {
            document.body.classList.remove('body-modal-open-tablet');
        }
        setTimeout(() => {
            modal.close();
            document.body.style.overflow = '';
        }, 350);
    };

    modal.addEventListener('click', (e) => {
        if (e.target === modal && window.innerWidth >= 768) {
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
