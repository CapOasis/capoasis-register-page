document.addEventListener('DOMContentLoaded', () => {
    // 1. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });

    // 2. Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Form Submission Handling (Connecting to Google Sheets)
    const registrationForm = document.getElementById('masterclass-form');
    
    // REPLACE THIS with your actual Google Script Web App URL from Step 3
    const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL'; 

    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = registrationForm.querySelector('button');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';

            // Get form data
            const formData = new FormData(registrationForm);
            const dataObject = Object.fromEntries(formData.entries());

            // 1. Send data to Google Sheets (if URL is set)
            if (SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL') {
                fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: formData, // FormData works directly with e.parameter in Apps Script
                })
                .then(response => {
                    console.log('Success!', response);
                    showSuccess();
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    // Still show success to user but log error for dev
                    showSuccess();
                });
            } else {
                // Fallback for demo: just show success after a short delay
                setTimeout(() => {
                    showSuccess();
                }, 1500);
            }

            function showSuccess() {
                registrationForm.innerHTML = `
                    <div class="registration-success">
                        <div class="success-icon">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <h3 class="success-title">Seat Reserved!</h3>
                        <p class="success-desc">Check your email for the join link. See you on April 4th!</p>
                        <a href="https://chat.whatsapp.com/FTapOJAEEjVHs8Ss1haBBW" target="_blank" class="btn btn-whatsapp">
                            <i class="fa-brands fa-whatsapp"></i> Join WhatsApp Community
                        </a>
                        <p class="success-footnote">* Required to get session updates & materials</p>
                    </div>
                `;
            }
        });
    }

    // 4. Hero Reveal
    setTimeout(() => {
        const heroText = document.getElementById('reveal-hero-text');
        if (heroText) heroText.style.opacity = '1';
    }, 300);

    // 5. Video Play Interaction
    const heroVideo = document.getElementById('heroVideo');
    const videoWrapper = document.getElementById('videoWrapper');
    
    if (heroVideo && videoWrapper) {
        const togglePlay = () => {
            if (heroVideo.paused) {
                heroVideo.play();
                videoWrapper.classList.add('playing');
                heroVideo.muted = false; // Unmute on first play
            } else {
                heroVideo.pause();
                videoWrapper.classList.remove('playing');
            }
        };

        videoWrapper.addEventListener('click', togglePlay);

        // Hide play button if video is already playing (shouldn't happen on load now)
        heroVideo.addEventListener('play', () => {
            videoWrapper.classList.add('playing');
        });

        heroVideo.addEventListener('pause', () => {
            videoWrapper.classList.remove('playing');
        });
    }

    // 6. Countdown Timer Logic
    const countdownDate = new Date("May 4, 2026 10:00:00").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            document.getElementById("heroCountdown").innerHTML = "<h3>Session Started!</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    };

    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
});
