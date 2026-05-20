/* ===================== */
/* String Utilities */
/* ===================== */

/**
 * Capitalize string
 */
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Uppercase string
 */
const uppercase = (str) => str.toUpperCase();

/**
 * Lowercase string
 */
const lowercase = (str) => str.toLowerCase();

/**
 * Truncate string
 */
const truncate = (str, length = 50, suffix = '...') => {
  return str.length > length ? str.slice(0, length) + suffix : str;
};

/**
 * Reverse string
 */
const reverse = (str) => str.split('').reverse().join('');

/**
 * Repeat string
 */
const repeat = (str, times) => str.repeat(times);

/**
 * Slug string
 */
const slug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/* ===================== */
/* Number Utilities */
/* ===================== */

/**
 * Format number with commas
 */
const formatNumber = (num) => {
  return num.toLocaleString();
};

/**
 * Format currency
 */
const formatCurrency = (num, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(num);
};

/**
 * Round number
 */
const roundTo = (num, decimals = 0) => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Clamp number
 */
const clamp = (num, min, max) => {
  return Math.max(min, Math.min(max, num));
};

/**
 * Random number between min and max
 */
const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* ===================== */
/* Date Utilities */
/* ===================== */

/**
 * Format date
 */
const formatDate = (date, format = 'MM/DD/YYYY') => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year);
};

/**
 * Get relative time
 */
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  
  return formatDate(date);
};

/**
 * Add days to date
 */
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get days between dates
 */
const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/* ===================== */
/* Array Utilities */
/* ===================== */

/**
 * Unique array
 */
const unique = (arr) => {
  return [...new Set(arr)];
};

/**
 * Flatten array
 */
const flatten = (arr) => {
  return arr.reduce((acc, val) => 
    acc.concat(Array.isArray(val) ? flatten(val) : val), []);
};

/**
 * Chunk array
 */
const chunk = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Shuffle array
 */
const shuffle = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Group array by key
 */
const groupBy = (arr, key) => {
  return arr.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

/**
 * Find differences between arrays
 */
const diff = (arr1, arr2) => {
  return arr1.filter(item => !arr2.includes(item));
};

/* ===================== */
/* Object Utilities */
/* ===================== */

/**
 * Merge objects
 */
const merge = (...objects) => {
  return Object.assign({}, ...objects);
};

/**
 * Deep clone object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Get nested value
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
};

/**
 * Set nested value
 */
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((acc, key) => (acc[key] = acc[key] || {}), obj);
  target[lastKey] = value;
  return obj;
};

/**
 * Filter object by keys
 */
const filterObject = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
};

/* ===================== */
/* URL Utilities */
/* ===================== */

/**
 * Get URL parameters
 */
const getURLParams = (url = window.location.href) => {
  const params = new URLSearchParams(new URL(url).search);
  return Object.fromEntries(params);
};

/**
 * Add URL parameter
 */
const addURLParam = (url, key, value) => {
  const urlObj = new URL(url);
  urlObj.searchParams.set(key, value);
  return urlObj.toString();
};

/**
 * Remove URL parameter
 */
const removeURLParam = (url, key) => {
  const urlObj = new URL(url);
  urlObj.searchParams.delete(key);
  return urlObj.toString();
};

/**
 * Check if valid URL
 */
const isValidURL = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

/* ===================== */
/* Color Utilities */
/* ===================== */

/**
 * Convert hex to RGB
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

/**
 * Convert RGB to hex
 */
const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Lighten color
 */
const lighten = (hex, percent) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const { r, g, b } = rgb;
  const f = parseInt('0x' + hex.slice(1), 16);
  return '#' + (0x1000000 + (Math.round((1 + percent) * (f & 0xff))).toString(16).slice(1)).slice(-6);
};

/**
 * Darken color
 */
const darken = (hex, percent) => {
  return lighten(hex, -percent);
};

/* ===================== */
/* Validation Utilities */
/* ===================== */

/**
 * Validate email
 */
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate password strength
 */
const validatePassword = (password) => {
  const strength = {
    score: 0,
    feedback: [],
  };
  
  if (password.length >= 8) strength.score++;
  else strength.feedback.push('At least 8 characters');
  
  if (/[a-z]/.test(password)) strength.score++;
  else strength.feedback.push('Lowercase letters');
  
  if (/[A-Z]/.test(password)) strength.score++;
  else strength.feedback.push('Uppercase letters');
  
  if (/[0-9]/.test(password)) strength.score++;
  else strength.feedback.push('Numbers');
  
  if (/[^a-zA-Z0-9]/.test(password)) strength.score++;
  else strength.feedback.push('Special characters');
  
  return strength;
};

/**
 * Validate phone number
 */
const isValidPhone = (phone) => {
  const regex = /^[\d\s\-\+\(\)]{10,}$/;
  return regex.test(phone.replace(/\D/g, ''));
};

export {
  capitalize, uppercase, lowercase, truncate, reverse, repeat, slug,
  formatNumber, formatCurrency, roundTo, clamp, randomBetween,
  formatDate, timeAgo, addDays, daysBetween,
  unique, flatten, chunk, shuffle, groupBy, diff,
  merge, deepClone, getNestedValue, setNestedValue, filterObject,
  getURLParams, addURLParam, removeURLParam, isValidURL,
  hexToRgb, rgbToHex, lighten, darken,
  isValidEmail, validatePassword, isValidPhone,
};
