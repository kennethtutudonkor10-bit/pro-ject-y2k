/* ===================== */
/* Initialize Application */
/* ===================== */

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  console.log('Application initialized');
  setupFormHandling();
  setupScrollAnimations();
  setupNavigationScroll();
}

/* ===================== */
/* Form Handling */
/* ===================== */

function setupFormHandling() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Validate form
  const errors = validateContactForm(data);
  if (Object.keys(errors).length > 0) {
    displayFormError('Please fix the errors below.');
    return;
  }

  try {
    // Simulate API call
    showLoadingState(form);
    
    // In production, replace with actual API endpoint
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    displayFormSuccess('Message sent successfully! We\'ll get back to you soon.');
    form.reset();
    hideLoadingState(form);
  } catch (error) {
    console.error('Form submission error:', error);
    displayFormError('Error sending message. Please try again.');
    hideLoadingState(form);
  }
}

function validateContactForm(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return errors;
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function showLoadingState(form) {
  const button = form.querySelector('button[type="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Sending...';
  }
}

function hideLoadingState(form) {
  const button = form.querySelector('button[type="submit"]');
  if (button) {
    button.disabled = false;
    button.textContent = 'Send Message';
  }
}

function displayFormSuccess(message) {
  const messageEl = document.getElementById('formMessage');
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.style.display = 'block';
    messageEl.style.color = '#90EE90';
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  }
}

function displayFormError(message) {
  const messageEl = document.getElementById('formMessage');
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.style.display = 'block';
    messageEl.style.color = '#ff6b6b';
  }
}

/* ===================== */
/* Scroll Animations */
/* ===================== */

function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
}

/* ===================== */
/* Navigation Scroll */
/* ===================== */

function setupNavigationScroll() {
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Update active nav link on scroll
  window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ===================== */
/* Utility Functions */
/* ===================== */

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

/**
 * Throttle function calls
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Debounce function calls
 */
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get scroll percentage
 */
function getScrollPercentage() {
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  return (window.scrollY / windowHeight) * 100;
}

/**
 * Detect device type
 */
function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/* ===================== */
/* Event Listeners */
/* ===================== */

// Handle window resize
window.addEventListener('resize', debounce(() => {
  console.log('Device type:', getDeviceType());
}, 250));

// Handle scroll
window.addEventListener('scroll', throttle(() => {
  const percentage = getScrollPercentage();
  // You can use this for progress indicators, etc.
}, 100));

// Export utilities for global use
window.appUtils = {
  smoothScrollTo,
  throttle,
  debounce,
  isInViewport,
  getScrollPercentage,
  getDeviceType,
  isValidEmail
};
