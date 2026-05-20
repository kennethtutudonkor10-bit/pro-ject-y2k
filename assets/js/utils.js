/* ===================== */
/* DOM Utilities */
/* ===================== */

/**
 * Query selector wrapper
 */
const $ = (selector, parent = document) => {
  return parent.querySelector(selector);
};

/**
 * Query selector all wrapper
 */
const $$ = (selector, parent = document) => {
  return [...parent.querySelectorAll(selector)];
};

/**
 * Create element with classes and attributes
 */
const createElement = (tag, classes = '', attributes = {}) => {
  const element = document.createElement(tag);
  if (classes) element.className = classes;
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};

/**
 * Add class to elements
 */
const addClass = (elements, className) => {
  const els = Array.isArray(elements) ? elements : [elements];
  els.forEach(el => el.classList.add(className));
};

/**
 * Remove class from elements
 */
const removeClass = (elements, className) => {
  const els = Array.isArray(elements) ? elements : [elements];
  els.forEach(el => el.classList.remove(className));
};

/**
 * Toggle class on elements
 */
const toggleClass = (elements, className) => {
  const els = Array.isArray(elements) ? elements : [elements];
  els.forEach(el => el.classList.toggle(className));
};

/**
 * Check if element has class
 */
const hasClass = (element, className) => {
  return element.classList.contains(className);
};

/* ===================== */
/* Event Utilities */
/* ===================== */

/**
 * Add event listener
 */
const on = (elements, event, callback) => {
  const els = Array.isArray(elements) ? elements : [elements];
  els.forEach(el => el.addEventListener(event, callback));
};

/**
 * Remove event listener
 */
const off = (elements, event, callback) => {
  const els = Array.isArray(elements) ? elements : [elements];
  els.forEach(el => el.removeEventListener(event, callback));
};

/**
 * One-time event listener
 */
const once = (element, event, callback) => {
  element.addEventListener(event, callback, { once: true });
};

/**
 * Delegate event listener
 */
const delegate = (parent, selector, event, callback) => {
  parent.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      callback.call(target, e);
    }
  });
};

/* ===================== */
/* Form Utilities */
/* ===================== */

/**
 * Validate email
 */
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate required field
 */
const validateRequired = (value) => {
  return value.trim().length > 0;
};

/**
 * Validate field length
 */
const validateLength = (value, min, max) => {
  return value.length >= min && value.length <= max;
};

/**
 * Get form data as object
 */
const getFormData = (form) => {
  const formData = new FormData(form);
  return Object.fromEntries(formData);
};

/**
 * Clear form
 */
const clearForm = (form) => {
  form.reset();
  $$('input, textarea', form).forEach(field => {
    field.value = '';
    removeClass(field, 'is-invalid');
  });
};

/**
 * Set form errors
 */
const setFormError = (form, errors) => {
  $$('[data-error]', form).forEach(el => el.textContent = '');
  Object.entries(errors).forEach(([field, message]) => {
    const input = $(`[name="${field}"]`, form);
    if (input) {
      addClass(input, 'is-invalid');
      const errorEl = $(`[data-error="${field}"]`, form);
      if (errorEl) errorEl.textContent = message;
    }
  });
};

/* ===================== */
/* Local Storage Utilities */
/* ===================== */

/**
 * Set item in storage
 */
const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

/**
 * Get item from storage
 */
const getStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Storage error:', e);
    return defaultValue;
  }
};

/**
 * Remove item from storage
 */
const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Storage error:', e);
  }
};

/**
 * Clear all storage
 */
const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (e) {
    console.error('Storage error:', e);
  }
};

/* ===================== */
/* Animation Utilities */
/* ===================== */

/**
 * Fade in element
 */
const fadeIn = (element, duration = 300) => {
  element.style.opacity = '0';
  element.style.display = 'block';
  let opacity = 0;
  const step = 1 / (duration / 10);
  
  const interval = setInterval(() => {
    opacity += step;
    if (opacity >= 1) {
      element.style.opacity = '1';
      clearInterval(interval);
    } else {
      element.style.opacity = opacity;
    }
  }, 10);
};

/**
 * Fade out element
 */
const fadeOut = (element, duration = 300) => {
  let opacity = 1;
  const step = 1 / (duration / 10);
  
  const interval = setInterval(() => {
    opacity -= step;
    if (opacity <= 0) {
      element.style.display = 'none';
      element.style.opacity = '0';
      clearInterval(interval);
    } else {
      element.style.opacity = opacity;
    }
  }, 10);
};

/**
 * Slide element
 */
const slideDown = (element) => {
  element.style.display = 'block';
  const height = element.scrollHeight;
  element.style.maxHeight = height + 'px';
};

const slideUp = (element) => {
  element.style.maxHeight = '0';
  setTimeout(() => {
    element.style.display = 'none';
  }, 300);
};

/* ===================== */
/* HTTP Utilities */
/* ===================== */

/**
 * Make fetch request
 */
const request = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
};

/**
 * GET request
 */
const get = (url, options = {}) => {
  return request(url, { method: 'GET', ...options });
};

/**
 * POST request
 */
const post = (url, data, options = {}) => {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * PUT request
 */
const put = (url, data, options = {}) => {
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * DELETE request
 */
const deleteRequest = (url, options = {}) => {
  return request(url, { method: 'DELETE', ...options });
};

/* ===================== */
/* Utility Hooks */
/* ===================== */

/**
 * Initialize on DOM ready
 */
const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

/**
 * Log with style
 */
const log = (message, style = 'color: #007bff; font-weight: bold;') => {
  console.log(`%c${message}`, style);
};

export {
  $, $$, createElement, addClass, removeClass, toggleClass, hasClass,
  on, off, once, delegate,
  validateEmail, validateRequired, validateLength, getFormData, clearForm, setFormError,
  setStorage, getStorage, removeStorage, clearStorage,
  fadeIn, fadeOut, slideDown, slideUp,
  request, get, post, put, deleteRequest,
  ready, log
};
