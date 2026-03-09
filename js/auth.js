// Authentication JavaScript for GovCareAI

// API Configuration - Use the base URL from main.js
const API_BASE_URL = window.API_BASE_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? '' // Empty string means relative URLs for local development
  : 'https://your-backend-domain.com'); // Replace with your actual backend domain

// DOM Elements
const loginForm = document.getElementById('citizen-login-form');
const registerForm = document.getElementById('citizen-register-form');
const adminLoginForm = document.getElementById('admin-login-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');

// Initialize authentication handlers
document.addEventListener('DOMContentLoaded', function() {
  initializeAuthHandlers();
});

// Initialize Authentication Handlers
function initializeAuthHandlers() {
  // Citizen Login Form
  if (loginForm) {
    loginForm.addEventListener('submit', handleCitizenLogin);
  }
  
  // Citizen Registration Form
  if (registerForm) {
    registerForm.addEventListener('submit', handleCitizenRegister);
  }
  
  // Admin Login Form
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', handleAdminLogin);
  }
  
  // Forgot Password Form
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', handleForgotPassword);
  }
}

// Handle Citizen Login
async function handleCitizenLogin(event) {
  event.preventDefault();
  
  // Get form data
  const formData = new FormData(loginForm);
  const gmail = formData.get('gmail');
  const password = formData.get('password');
  
  // Validate form
  if (!gmail || !password) {
    GovCareAI.showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Show loading spinner
  const submitButton = loginForm.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<div class="loading-spinner"></div>';
  submitButton.disabled = true;
  
  try {
    // Make API call to backend
    const response = await fetch(`${API_BASE_URL}/api/auth/login/citizen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ gmail, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', 'citizen');
      localStorage.setItem('userData', JSON.stringify(data.citizen));
      
      GovCareAI.showNotification('Login successful!', 'success');
      
      // Redirect to home page
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      GovCareAI.showNotification(data.message || 'Login failed. Please check your credentials.', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    GovCareAI.showNotification('Login failed. Please check your credentials.', 'error');
  } finally {
    // Restore button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }
}

// Handle Citizen Registration
async function handleCitizenRegister(event) {
  event.preventDefault();
  
  // Get form data
  const formData = new FormData(registerForm);
  const full_name = formData.get('full_name');
  const gmail = formData.get('gmail');
  const phone = formData.get('phone');
  const password = formData.get('password');
  const confirm_password = formData.get('confirm_password');
  
  // Validate form
  if (!full_name || !gmail || !phone || !password || !confirm_password) {
    GovCareAI.showNotification('Please fill in all fields', 'error');
    return;
  }
  
  if (password !== confirm_password) {
    GovCareAI.showNotification('Passwords do not match', 'error');
    return;
  }
  
  // Show loading spinner
  const submitButton = registerForm.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<div class="loading-spinner"></div>';
  submitButton.disabled = true;
  
  try {
    // Make API call to backend
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ full_name, gmail, phone, password, confirm_password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', 'citizen');
      localStorage.setItem('userData', JSON.stringify(data.citizen));
      
      GovCareAI.showNotification('Registration successful!', 'success');
      
      // Redirect to home page
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      GovCareAI.showNotification(data.message || 'Registration failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Registration error:', error);
    GovCareAI.showNotification('Registration failed. Please try again.', 'error');
  } finally {
    // Restore button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }
}

// Handle Admin Login
async function handleAdminLogin(event) {
  event.preventDefault();
  
  // Get form data
  const formData = new FormData(adminLoginForm);
  const gmail = formData.get('gmail');
  const password = formData.get('password');
  
  // Validate form
  if (!gmail || !password) {
    GovCareAI.showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Show loading spinner
  const submitButton = adminLoginForm.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<div class="loading-spinner"></div>';
  submitButton.disabled = true;
  
  try {
    // Make API call to backend
    const response = await fetch(`${API_BASE_URL}/api/auth/login/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ gmail, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('userData', JSON.stringify(data.admin));
      
      GovCareAI.showNotification('Admin login successful!', 'success');
      
      // Redirect to admin dashboard
      setTimeout(() => {
        window.location.href = 'admin-dashboard.html';
      }, 1500);
    } else {
      GovCareAI.showNotification(data.message || 'Admin login failed. Please check your credentials.', 'error');
    }
  } catch (error) {
    console.error('Admin login error:', error);
    GovCareAI.showNotification('Admin login failed. Please check your credentials.', 'error');
  } finally {
    // Restore button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }
}

// Handle Forgot Password
async function handleForgotPassword(event) {
  event.preventDefault();
  
  // Get form data
  const formData = new FormData(forgotPasswordForm);
  const gmail = formData.get('gmail');
  
  // Validate form
  if (!gmail) {
    GovCareAI.showNotification('Please enter your email address', 'error');
    return;
  }
  
  // Show loading spinner
  const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<div class="loading-spinner"></div>';
  submitButton.disabled = true;
  
  try {
    // Make API call to backend
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ gmail })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Show the reset code
      if (data.resetCode) {
        document.getElementById('reset-code-display').textContent = data.resetCode;
        document.getElementById('code-section').style.display = 'block';
        GovCareAI.showNotification('Reset code generated successfully!', 'success');
      } else {
        GovCareAI.showNotification('Password reset code generated successfully!', 'success');
      }
    } else {
      GovCareAI.showNotification(data.message || 'Failed to generate reset code. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    GovCareAI.showNotification('Failed to generate reset code. Please try again.', 'error');
  } finally {
    // Restore button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }
}

// Function to show reset form
function showResetForm() {
  const resetCode = document.getElementById('reset-code').value;
  
  if (!resetCode || resetCode.length !== 4) {
    GovCareAI.showNotification('Please enter a valid 4-digit code', 'error');
    return;
  }
  
  // Store the code in session storage to use later
  sessionStorage.setItem('resetCode', resetCode);
  
  // Show the reset form
  document.getElementById('reset-form-section').style.display = 'block';
  
  // Scroll to the reset form
  document.getElementById('reset-form-section').scrollIntoView({ behavior: 'smooth' });
}

// Function to submit password reset
async function submitPasswordReset() {
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const resetCode = sessionStorage.getItem('resetCode');
  
  // Validate form
  if (!newPassword || !confirmPassword || !resetCode) {
    GovCareAI.showNotification('Please fill in all fields', 'error');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    GovCareAI.showNotification('Passwords do not match', 'error');
    return;
  }
  
  if (newPassword.length < 6) {
    GovCareAI.showNotification('Password must be at least 6 characters long', 'error');
    return;
  }
  
  // Show loading
  const submitButton = document.querySelector('#reset-form-section .neon-button');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<div class="loading-spinner"></div>';
  submitButton.disabled = true;
  
  try {
    // Make API call to backend
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        code: resetCode,
        password: newPassword
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      GovCareAI.showNotification('Password reset successfully!', 'success');
      
      // Clear stored code
      sessionStorage.removeItem('resetCode');
      
      // Redirect to login page
      setTimeout(() => {
        window.location.href = 'citizen-login.html';
      }, 2000);
    } else {
      GovCareAI.showNotification(data.message || 'Failed to reset password. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Password reset error:', error);
    GovCareAI.showNotification('Failed to reset password. Please try again.', 'error');
  } finally {
    // Restore button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }
}

// Handle Logout
function handleLogout() {
  // Clear user data
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userType');
  localStorage.removeItem('userData');
  
  GovCareAI.showNotification('You have been logged out', 'info');
  
  // Redirect to home page
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// Export functions
window.Auth = {
  handleLogout
};