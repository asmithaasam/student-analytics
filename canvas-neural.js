/* ==========================================================================
   AI-POWERED STUDENT ANALYTICS & SUCCESS PLATFORM
   Interactive Neural Network & Academic Data Stream Canvas
   ========================================================================== */

(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let particles = [];
  let packets = [];
  let mouse = { x: -1000, y: -1000, radius: 140 };

  const PARTICLE_COUNT = window.innerWidth < 768 ? 32 : 65;
  const MAX_DISTANCE = window.innerWidth < 768 ? 100 : 140;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.75;
      this.vy = (Math.random() - 0.5) * 0.75;
      this.radius = Math.random() * 2.2 + 1.2;
      this.baseRadius = this.radius;
      // Palette: electric blue, cyan, subtle violet
      const colors = ['#3B82F6', '#22D3EE', '#60A5FA', '#8B5CF6'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.55 + 0.35;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.pulseAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Subtle pulse
      this.pulseAngle += this.pulseSpeed;
      this.radius = this.baseRadius + Math.sin(this.pulseAngle) * 0.6;

      // Mouse gentle interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 2.5;
        this.y -= (dy / dist) * force * 2.5;
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.restore();
    }
  }

  // Data packet traveling along an edge
  class Packet {
    constructor(p1, p2) {
      this.p1 = p1;
      this.p2 = p2;
      this.progress = 0;
      this.speed = Math.random() * 0.012 + 0.008;
      this.color = Math.random() > 0.5 ? '#22D3EE' : '#60A5FA';
    }

    update() {
      this.progress += this.speed;
      return this.progress <= 1;
    }

    draw() {
      const x = this.p1.x + (this.p2.x - this.p1.x) * this.progress;
      const y = this.p1.y + (this.p2.y - this.p1.y) * this.progress;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particles = [];
    packets = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function spawnPackets() {
    if (packets.length < 12 && Math.random() < 0.08) {
      // Pick random pair of close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DISTANCE) {
            packets.push(new Packet(particles[i], particles[j]));
            return;
          }
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DISTANCE) {
          const alpha = (1 - dist / MAX_DISTANCE) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);

          // Gradient filament
          const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
          gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha})`);
          gradient.addColorStop(1, `rgba(34, 211, 238, ${alpha})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Spawn & update data packets
    spawnPackets();
    packets = packets.filter((packet) => {
      packet.draw();
      return packet.update();
    });

    // Draw nodes
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  requestAnimationFrame(animate);
})();
