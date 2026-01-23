// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
});

// Mobile menu toggle
const navbarToggle = document.getElementById('navbarToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = navbarToggle.querySelector('.menu-icon');
const closeIcon = navbarToggle.querySelector('.close-icon');

navbarToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuIcon.style.display = isOpen ? 'none' : 'block';
    closeIcon.style.display = isOpen ? 'block' : 'none';
});

// Close mobile menu when clicking a link
const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    });
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

        // Auto-cycle every 4 seconds
        setInterval(nextSlide, 4000);

        // Click on dots to navigate
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                showSlide(currentIndex);
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
