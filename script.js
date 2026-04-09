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
                    <div class="registration-success" style="text-align: center; padding: 40px 0;">
                        <div class="success-icon" style="font-size: 4rem; color: #10b981; margin-bottom: 20px;">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <h3 style="margin-bottom: 10px;">Seat Reserved!</h3>
                        <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 24px;">Check your email for the join link. See you on April 4th!</p>
                        <a href="https://chat.whatsapp.com/FTapOJAEEjVHs8Ss1haBBW" target="_blank" class="btn btn-whatsapp" style="background-color: #25D366; color: white; border-radius: 12px; padding: 14px 24px; font-weight: 700; width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3);">
                            <i class="fa-brands fa-whatsapp" style="font-size: 1.5rem;"></i> Join WhatsApp Community
                        </a>
                        <p style="margin-top: 15px; font-size: 0.75rem; color: #94a3b8;">* Required to get session updates & materials</p>
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

    // 5. Video Autoplay & Unmute Logic
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        // Ensure it's muted for autoplay
        heroVideo.muted = true;
        
        // Function to attempt play
        const attemptPlay = () => {
            heroVideo.load(); // Force source reload
            setTimeout(() => {
                heroVideo.play().then(() => {
                    console.log("Video playing automatically");
                }).catch(err => {
                    console.log("Autoplay blocked, waiting for interaction");
                });
            }, 100);
        };

        // Attempt immediately
        attemptPlay();

        // Also attempt on window load
        window.addEventListener('load', attemptPlay);

        // Function to unmute and ensure playing
        const unmuteVideo = () => {
            if (heroVideo.muted) {
                heroVideo.muted = false;
                heroVideo.play().catch(e => console.log("Play failed on unmute", e));
                
                // Remove listeners - we only need to unmute once
                document.removeEventListener('click', unmuteVideo);
                document.removeEventListener('touchstart', unmuteVideo);
                document.removeEventListener('scroll', unmuteVideo);
            }
        };

        // Listen for ANY interaction to unmute
        document.addEventListener('click', unmuteVideo);
        document.addEventListener('touchstart', unmuteVideo);
        document.addEventListener('scroll', unmuteVideo);
    }
});
