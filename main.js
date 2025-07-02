import { reviews } from './reviews.js';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    const scrollHandler = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    // Throttle scroll event for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                scrollHandler();
                scrollTimeout = null;
            }, 100);
        }
    });

    // --- Mobile Menu ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        const isExpanded = mobileMenu.classList.toggle('hidden');
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
    });

    // --- Smooth Scrolling & Mobile Menu Close ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- Review Carousel ---
    const reviewContainer = document.getElementById('review-container');
    const dotsContainer = document.getElementById('review-dots');
    const nextBtn = document.getElementById('next-review');
    const prevBtn = document.getElementById('prev-review');
    const carouselElement = document.getElementById('review-carousel');
    let currentReviewIndex = 0;
    let autoPlayInterval;

    function updateCarousel() {
        if(!reviewContainer) return;
        reviewContainer.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
        
        const dots = dotsContainer.children;
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === currentReviewIndex);
        });
    }

    function showNextReview() {
        currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        updateCarousel();
    }
    
    function startAutoPlay() {
        stopAutoPlay(); // Prevent multiple intervals
        autoPlayInterval = setInterval(showNextReview, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function renderReviews() {
        if(!reviewContainer || !dotsContainer) return;

        reviewContainer.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="review-card-content">
                    <p class="review-text">${review.text}</p>
                    <p class="review-author">- ${review.author}</p>
                </div>
            </div>
        `).join('');

        dotsContainer.innerHTML = reviews.map((_, index) => 
            `<button class="review-dot" aria-label="후기 ${index + 1} 보기"></button>`
        ).join('');
        
        dotsContainer.querySelectorAll('.review-dot').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentReviewIndex = index;
                updateCarousel();
                startAutoPlay(); // Reset timer on manual navigation
            });
        });

        updateCarousel();
        startAutoPlay();
    }
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        showNextReview();
        startAutoPlay();
    });
    if (prevBtn) prevBtn.addEventListener('click', () => {
        currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
        updateCarousel();
        startAutoPlay();
    });
    if (carouselElement) {
        carouselElement.addEventListener('mouseenter', stopAutoPlay);
        carouselElement.addEventListener('mouseleave', startAutoPlay);
    }

    renderReviews();

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
});