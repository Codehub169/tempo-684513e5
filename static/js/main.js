document.addEventListener('DOMContentLoaded', () => {
    console.log('Cyberpunk Game Hub Main JS Loaded');

    // Active navigation link highlighting
    const navLinks = document.querySelectorAll('header nav ul li a');
    const currentPath = window.location.pathname;
    const homePath = '/'; // Assuming '/' is the home page

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Handle active class for exact matches or for home page specifically
        if (linkPath === currentPath || (currentPath === homePath && linkPath === homePath)) {
            link.classList.add('active');
        }
        // Special case for /play/* pages to keep 'Games' link active
        if (currentPath.startsWith('/play') && linkPath === '/games') {
            link.classList.add('active');
        }
    });

    // Smooth scroll for anchor links (if any are added later)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            try {
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            } catch (error) {
                console.warn('Smooth scroll target not found:', this.getAttribute('href'));
            }
        });
    });

    // Example: Add a subtle animation to feature boxes on visibility (requires Intersection Observer)
    const featureBoxes = document.querySelectorAll('.feature-box');
    if (featureBoxes.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        featureBoxes.forEach(box => {
            box.style.opacity = '0'; // Initially hide
            box.style.transform = 'translateY(20px)'; // Initial offset
            box.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            observer.observe(box);
        });
    }

});
