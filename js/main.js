// Main JavaScript for GovCareAI

// API Configuration - Update this URL when deploying to production
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? '' // Empty string means relative URLs for local development
  : 'https://your-backend-domain.com'; // Replace with your actual backend domain

// DOM Elements
const navButtons = document.querySelectorAll('.nav-button');
const neonButtons = document.querySelectorAll('.neon-button');
const formInputs = document.querySelectorAll('.form-input');
const complaintCards = document.querySelectorAll('.complaint-card');
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners
  initializeEventListeners();
  
  // Initialize animations
  initializeAnimations();
  
  // Check user authentication status
  checkAuthStatus();
  
  // Load initial content
  loadInitialContent();
});

// Initialize Event Listeners
function initializeEventListeners() {
  // Nav button hover effects
  navButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      createElectricSparks(this);
    });
  });
  
  // Neon button hover effects
  neonButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      createElectricSparks(this);
    });
    
    button.addEventListener('mousedown', function() {
      this.classList.add('button-press');
    });
    
    button.addEventListener('mouseup', function() {
      this.classList.remove('button-press');
    });
    
    button.addEventListener('mouseleave', function() {
      this.classList.remove('button-press');
    });
  });
  
  // Form input focus effects
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
    });
  });
  
  // Complaint card hover effects
  complaintCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.4)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
    });
  });
  
  // Scroll reveal animations
  window.addEventListener('scroll', debounce(handleScrollReveal, 10));
}

// Initialize Animations
function initializeAnimations() {
  // Create floating particles
  createFloatingParticles();
  
  // Create rising smoke
  createRisingSmoke();
  
  // Trigger initial scroll reveal
  handleScrollReveal();
}

// Check Authentication Status
function checkAuthStatus() {
  // In a real app, this would check for JWT tokens
  // For demo, we'll just simulate
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');
  
  if (isLoggedIn && userType) {
    // Update UI based on user type
    updateUIForUser(userType);
  }
}

// Update UI based on user type
function updateUIForUser(userType) {
  const authButtons = document.querySelectorAll('.auth-buttons');
  const userActions = document.querySelector('.user-actions');
  
  if (authButtons.length > 0 && userActions) {
    authButtons.forEach(button => button.style.display = 'none');
    userActions.style.display = 'flex';
    
    if (userType === 'citizen') {
      document.querySelector('.citizen-actions').style.display = 'flex';
    } else if (userType === 'admin') {
      document.querySelector('.admin-actions').style.display = 'flex';
    }
  }
}

// Load Initial Content
function loadInitialContent() {
  // Load any initial data
  // For demo, we'll just add a class for page transition
  document.body.classList.add('page-transition');
}

// Create Electric Sparks Effect
function createElectricSparks(element) {
  const rect = element.getBoundingClientRect();
  const sparksContainer = document.createElement('div');
  sparksContainer.className = 'sparks-container';
  sparksContainer.style.position = 'fixed';
  sparksContainer.style.top = '0';
  sparksContainer.style.left = '0';
  sparksContainer.style.width = '100%';
  sparksContainer.style.height = '100%';
  sparksContainer.style.pointerEvents = 'none';
  sparksContainer.style.zIndex = '1000';
  
  document.body.appendChild(sparksContainer);
  
  // Create 3 sparks
  for (let i = 0; i < 3; i++) {
    const spark = document.createElement('div');
    spark.className = `electric-spark spark-${i+1}`;
    spark.style.left = `${rect.left + Math.random() * rect.width}px`;
    spark.style.top = `${rect.top + Math.random() * rect.height}px`;
    spark.style.backgroundColor = getRandomNeonColor();
    spark.style.boxShadow = `0 0 10px ${getRandomNeonColor()}`;
    
    sparksContainer.appendChild(spark);
    
    // Remove spark after animation
    setTimeout(() => {
      if (spark.parentNode) {
        spark.parentNode.removeChild(spark);
      }
    }, 2000);
  }
  
  // Remove container after all sparks are gone
  setTimeout(() => {
    if (sparksContainer.parentNode) {
      sparksContainer.parentNode.removeChild(sparksContainer);
    }
  }, 2500);
}

// Get Random Neon Color
function getRandomNeonColor() {
  const colors = [
    'var(--neon-blue)',
    'var(--neon-purple)',
    'var(--neon-green)',
    'var(--neon-red)',
    'var(--neon-orange)'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Create Floating Particles
function createFloatingParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.id = 'particles-js';
  particlesContainer.style.position = 'fixed';
  particlesContainer.style.top = '0';
  particlesContainer.style.left = '0';
  particlesContainer.style.width = '100%';
  particlesContainer.style.height = '100%';
  particlesContainer.style.pointerEvents = 'none';
  particlesContainer.style.zIndex = '-1';
  
  document.body.appendChild(particlesContainer);
  
  // Create 30 particles
  for (let i = 0; i < 30; i++) {
    createParticle(particlesContainer);
  }
}

// Create Individual Particle
function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Random properties
  const size = Math.random() * 5 + 2;
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  const colorClass = ['blue', 'purple', 'green', 'red'][Math.floor(Math.random() * 4)];
  
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${posX}%`;
  particle.style.top = `${posY}%`;
  particle.classList.add(colorClass);
  
  container.appendChild(particle);
  
  // Animate particle
  animateParticle(particle);
  
  // Recreate particle when animation ends
  particle.addEventListener('animationend', () => {
    particle.remove();
    createParticle(container);
  });
}

// Animate Particle
function animateParticle(particle) {
  const duration = Math.random() * 10 + 10; // 10-20 seconds
  const distanceX = (Math.random() - 0.5) * 100;
  const distanceY = (Math.random() - 0.5) * 100;
  
  particle.style.animation = `float ${duration}s linear infinite`;
  particle.style.transform = `translate(${distanceX}px, ${distanceY}px)`;
}

// Create Rising Smoke
function createRisingSmoke() {
  const smokeContainer = document.createElement('div');
  smokeContainer.id = 'smoke-container';
  smokeContainer.style.position = 'fixed';
  smokeContainer.style.bottom = '0';
  smokeContainer.style.left = '0';
  smokeContainer.style.width = '100%';
  smokeContainer.style.height = '100%';
  smokeContainer.style.pointerEvents = 'none';
  smokeContainer.style.zIndex = '-2';
  
  document.body.appendChild(smokeContainer);
  
  // Create smoke periodically
  setInterval(() => {
    createSmokeElement(smokeContainer);
  }, 3000);
}

// Create Smoke Element
function createSmokeElement(container) {
  const smoke = document.createElement('div');
  smoke.className = 'smoke';
  
  // Random position
  const posX = Math.random() * 100;
  smoke.style.left = `${posX}%`;
  
  container.appendChild(smoke);
  
  // Remove smoke after animation
  setTimeout(() => {
    if (smoke.parentNode) {
      smoke.parentNode.removeChild(smoke);
    }
  }, 15000);
}

// Handle Scroll Reveal
function handleScrollReveal() {
  scrollRevealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('active');
    }
  });
}

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility Functions
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Style notification
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '15px 25px';
  notification.style.borderRadius = '8px';
  notification.style.color = 'white';
  notification.style.fontFamily = "'Orbitron', sans-serif";
  notification.style.zIndex = '9999';
  notification.style.opacity = '0';
  notification.style.transform = 'translateX(100%)';
  notification.style.transition = 'all 0.3s ease';
  
  // Set background color based on type
  switch(type) {
    case 'success':
      notification.style.background = 'rgba(0, 255, 157, 0.2)';
      notification.style.border = '1px solid var(--neon-green)';
      notification.style.boxShadow = '0 0 15px var(--neon-green)';
      break;
    case 'error':
      notification.style.background = 'rgba(255, 0, 170, 0.2)';
      notification.style.border = '1px solid var(--neon-red)';
      notification.style.boxShadow = '0 0 15px var(--neon-red)';
      break;
    case 'warning':
      notification.style.background = 'rgba(255, 107, 0, 0.2)';
      notification.style.border = '1px solid var(--neon-orange)';
      notification.style.boxShadow = '0 0 15px var(--neon-orange)';
      break;
    default:
      notification.style.background = 'rgba(0, 243, 255, 0.2)';
      notification.style.border = '1px solid var(--neon-blue)';
      notification.style.boxShadow = '0 0 15px var(--neon-blue)';
  }
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after delay
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Form Validation
function validateForm(form) {
  const inputs = form.querySelectorAll('input, textarea, select');
  let isValid = true;
  
  inputs.forEach(input => {
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      input.style.borderColor = 'var(--neon-red)';
      showNotification(`Please fill in the ${input.name || input.placeholder} field`, 'error');
    } else {
      input.style.borderColor = 'var(--dark-border)';
    }
    
    // Email validation
    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        input.style.borderColor = 'var(--neon-red)';
        showNotification('Please enter a valid email address', 'error');
      } else {
        input.style.borderColor = 'var(--dark-border)';
      }
    }
    
    // Password validation
    if (input.type === 'password' && input.name === 'password' && input.value.length < 6) {
      isValid = false;
      input.style.borderColor = 'var(--neon-red)';
      showNotification('Password must be at least 6 characters long', 'error');
    }
  });
  
  return isValid;
}

// Toggle Password Visibility
function togglePasswordVisibility(inputId) {
  const passwordInput = document.getElementById(inputId);
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  
  // Update eye icon
  const eyeIcon = passwordInput.parentElement.querySelector('.password-toggle');
  eyeIcon.textContent = type === 'password' ? '👁️' : '🔒';
}

// Export functions for use in other modules
window.GovCareAI = {
  showNotification,
  validateForm,
  togglePasswordVisibility
};