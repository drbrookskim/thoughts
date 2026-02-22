document.addEventListener('DOMContentLoaded', () => {
    console.log('TradeFlow Marketing Page Loaded');

    // Initialize Lucide Icons
    lucide.createIcons();

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            // Simple toggle for now - in a real app we'd toggle a class on the nav container
            // For this MVP, we might need to add styles for the open state if we want it functional
            console.log('Mobile menu clicked');
            alert('Mobile menu toggle would go here in full implementation');
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to elements we want to animate
    const animateElements = document.querySelectorAll('.feature-card, .pricing-card, .hero-content, .section-header');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Handle the "visible" class via a new style rule injection or inline styles
    // For simplicity, we'll use a MutationObserver or just add a global style for .visible
    // But since we can't easily edit CSS from JS without being messy, let's just use inline styles in the observer
    // Actually, let's add the class and define it in CSS or just do it here:

    // Override the observer callback to set styles directly for simplicity
    const directObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                directObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => directObserver.observe(el));
});
