// Particles JavaScript for GovCareAI

// Initialize particles system
document.addEventListener('DOMContentLoaded', function() {
  initializeParticles();
});

// Initialize Particles
function initializeParticles() {
  // Create particle canvas
  const particleCanvas = document.createElement('canvas');
  particleCanvas.id = 'particle-canvas';
  particleCanvas.style.position = 'fixed';
  particleCanvas.style.top = '0';
  particleCanvas.style.left = '0';
  particleCanvas.style.width = '100%';
  particleCanvas.style.height = '100%';
  particleCanvas.style.pointerEvents = 'none';
  particleCanvas.style.zIndex = '-1';
  
  document.body.appendChild(particleCanvas);
  
  // Set canvas dimensions
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
  
  // Get canvas context
  const ctx = particleCanvas.getContext('2d');
  
  // Create particles array
  const particles = [];
  const particleCount = 100;
  
  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * particleCanvas.width;
      this.y = Math.random() * particleCanvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.color = getRandomNeonColor();
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Reset particle if it goes off screen
      if (this.x > particleCanvas.width || this.x < 0) this.speedX = -this.speedX;
      if (this.y > particleCanvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 15;
    }
  }
  
  // Create particles
  function createParticles() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  // Animate particles
  function animateParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    requestAnimationFrame(animateParticles);
  }
  
  // Handle window resize
  function handleResize() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', handleResize);
  
  // Initialize
  createParticles();
  animateParticles();
}

// Get Random Neon Color
function getRandomNeonColor() {
  const colors = [
    'rgba(0, 243, 255, 0.8)',   // neon-blue
    'rgba(189, 0, 255, 0.8)',   // neon-purple
    'rgba(0, 255, 157, 0.8)',   // neon-green
    'rgba(255, 0, 170, 0.8)',   // neon-red
    'rgba(255, 107, 0, 0.8)'    // neon-orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Create Connection Lines Between Particles
function createParticleConnections() {
  // This would be implemented to draw lines between nearby particles
  // For performance reasons in a real app, this would need optimization
}

// Export functions
window.Particles = {
  initializeParticles
};