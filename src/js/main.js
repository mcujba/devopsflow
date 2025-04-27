// Contact Form Handling
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get reCAPTCHA response
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                alert('Please complete the reCAPTCHA verification');
                return;
            }

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                company: document.getElementById('company').value,
                message: document.getElementById('message').value,
                'g-recaptcha-response': recaptchaResponse
            };

            try {
                // Send form data to server
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                    grecaptcha.reset();
                } else {
                    throw new Error(data.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error sending message. Please try again later.');
            }
        });
    }

    // Smooth scrolling for navigation links
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
});
