(function () {
    'use strict';

    let recaptchaWidgetId;

    window.onSubmit = function (token) {
        const form = document.getElementById('contact-form');
        const submitBtn = document.getElementById('submit-btn');
        const captchaError = document.querySelector('.captcha-error');

        captchaError.style.display = 'none';

        const templateParams = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            messaggio: document.getElementById('messaggio').value,
            'g-recaptcha-response': token
        };

        submitBtn.disabled = true;
        submitBtn.textContent = 'Invio in corso...';

        emailjs.send('service_70gb2ek', 'contact_form', templateParams)
            .then(response => {
                form.reset();
                grecaptcha.reset(recaptchaWidgetId);

                const toast = document.querySelector('.send-success');
                toast.classList.remove('send-success--hide');
                setTimeout(() => {
                    toast.classList.add('send-success--hide');
                }, 3000);
            })
            .catch(e => {
                const errorMsg = document.querySelector('.send-error');
                errorMsg.style.display = 'block';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Invia';
            });
    }

    // Simple card animations
    function animateElements() {
        const elements = document.querySelectorAll('.service-card, .benefit-item');
        elements.forEach(function (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50 && !element.classList.contains('visible')) {
                element.classList.add('visible');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize animations
    const animatedElements = document.querySelectorAll('.service-card, .benefit-item');
    animatedElements.forEach(function (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Animate on scroll and initial load
    window.addEventListener('scroll', animateElements);
    setTimeout(animateElements, 500);

    emailjs.init({
        publicKey: "F-IT-D-eYxmtUxIU3",
    });
    const emailInput = document.getElementById('email');
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    emailInput.addEventListener('input', validateEmail);

    function validateEmail() {
        if (!emailPattern.test(emailInput.value)) {
            emailInput.setCustomValidity('Inserisci un indirizzo email completo (es. nome@dominio.com)');
            emailInput.reportValidity();
            return false;
        }

        emailInput.setCustomValidity('');
        return true;
    }

    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault();

        if (!validateEmail()) return

        if (!this.checkValidity()) {
            this.reportValidity();
            return;
        }

        grecaptcha.execute();
    });

    const footerYear = document.querySelector(".footer-year");
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    const calendlyBtn = document.querySelector('.hero__cta > .btn--calendly');
    const stickyBtn = document.querySelector('.sticky__cta > .btn--calendly');
    const contactsSection = document.querySelector('#contact');

    let calendlyVisible = true;

    function updateStickyBtnVisibility() {
        const btnRect = stickyBtn.getBoundingClientRect();
        const sectionRect = contactsSection.getBoundingClientRect();

        const overlap = !(
            btnRect.bottom < sectionRect.top ||
            btnRect.top > sectionRect.bottom ||
            btnRect.right < sectionRect.left ||
            btnRect.left > sectionRect.right
        );

        if (!calendlyVisible && !overlap) {
            stickyBtn.style.opacity = '1';
            stickyBtn.style.visibility = 'visible';
        } else {
            stickyBtn.style.opacity = '0';
            stickyBtn.style.visibility = 'hidden';
        }
    }

    const calendlyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            calendlyVisible = entry.isIntersecting;
            updateStickyBtnVisibility();
        });
    });
    calendlyObserver.observe(calendlyBtn);

    function onScrollOrResize() {
        updateStickyBtnVisibility();
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    updateStickyBtnVisibility();

})();