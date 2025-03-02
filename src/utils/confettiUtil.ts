/**
 * Simple confetti animation utility for celebrating correct answers
 */
export const showConfetti = () => {
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '999';
  document.body.appendChild(canvas);
  
  // Set canvas dimensions
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }
  
  // Confetti settings
  const particles: Particle[] = [];
  const particleCount = 100;
  const colors = ['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#9c27b0'];
  
  // Create particle class
  class Particle {
    x: number;
    y: number;
    color: string;
    size: number;
    speed: number;
    angle: number;
    spin: number;
    
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height * 0.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.size = Math.random() * 10 + 5;
      this.speed = Math.random() * 6 + 2;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = Math.random() * 0.2 - 0.1;
    }
    
    update() {
      this.y += this.speed;
      this.x += Math.sin(this.angle) * 2;
      this.angle += this.spin;
      
      if (this.y > canvas.height) {
        this.y = -10;
        this.x = Math.random() * canvas.width;
      }
    }
    
    draw() {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Animation function
  let animationFrameId: number;
  const animate = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    animationFrameId = requestAnimationFrame(animate);
  };
  
  // Start animation
  animate();
  
  // Clean up after 2 seconds
  setTimeout(() => {
    cancelAnimationFrame(animationFrameId);
    document.body.removeChild(canvas);
  }, 2000);
};
