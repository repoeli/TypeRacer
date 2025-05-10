// Simple confetti animation effect for celebration
function celebrateSuccess() {
    // Create canvas if it doesn't exist
    let canvas = document.getElementById('celebration-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'celebration-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);
    }
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Get context
    const ctx = canvas.getContext('2d');
    
    // Confetti particles
    const particles = [];
    const particleCount = 100;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            weight: Math.random() * 1 + 1,
            directionX: Math.random() * 2 - 1,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
    
    // Animation function
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let particlesDone = 0;
        
        // Draw each particle
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            ctx.fillStyle = p.color;
            
            // Draw particle
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.size, p.y + p.size * 0.5);
            ctx.lineTo(p.x, p.y + p.size);
            ctx.lineTo(p.x - p.size, p.y + p.size * 0.5);
            ctx.closePath();
            ctx.fill();
            
            // Update particle position
            p.y += p.weight;
            p.x += p.directionX;
            
            // Rotate particle by adding randomness
            p.directionX += Math.random() * 0.2 - 0.1;
            
            // If particle is below screen, mark as done
            if (p.y > canvas.height) {
                particlesDone++;
            }
        }
        
        // Continue animation until all particles are done
        if (particlesDone !== particles.length) {
            requestAnimationFrame(animate);
        } else {
            // Remove canvas after animation is done
            setTimeout(() => {
                canvas.remove();
            }, 1000);
        }
    }
    
    // Start animation
    animate();
}
