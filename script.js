let isPlaying = false;
let audio;

document.addEventListener('DOMContentLoaded', () => {
    audio = document.getElementById('bgm');
    const enterScreen = document.getElementById('enter-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainContent = document.getElementById('main-content');
    const playPauseBtn = document.getElementById('play-pause');
    const volumeSlider = document.getElementById('volume-slider');
    const statusText = document.querySelector('.track-status');
    const progressBar = document.getElementById('progress-bar');

    // Title scroll animation
    const titleText = " susa worldwide ";
    let titleIndex = 0;
    setInterval(() => {
        document.title = titleText.substring(titleIndex) + titleText.substring(0, titleIndex);
        titleIndex = (titleIndex + 1) % titleText.length;
    }, 300);

    // --- Custom Cursor & Binary Trail Logic ---
    const cursor = document.getElementById('custom-cursor');
    let lastTrailSpawn = 0;

    document.addEventListener('mousemove', (e) => {
        // Move the custom cursor
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }

        // Spawn binary trail (throttle to avoid too many DOM elements)
        const now = Date.now();
        if (now - lastTrailSpawn > 50) { // Spawn every 50ms
            spawnTrail(e.clientX, e.clientY);
            lastTrailSpawn = now;
        }
    });

    function spawnTrail(x, y) {
        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        particle.textContent = Math.random() > 0.5 ? '1' : '0';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // Randomize slight offset for organic look
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        particle.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;

        document.body.appendChild(particle);

        // Remove particle after animation completes
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input[type="range"], .pfp-wrapper');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('cursor-hover');
        });
    });
    // --- End Custom Cursor Logic ---

    // Audio status sync
    audio.onplay = () => {
        statusText.textContent = '[ playing ]';
        playPauseBtn.textContent = '[ pause ]';
        isPlaying = true;
    };
    audio.onpause = () => {
        statusText.textContent = '[ paused ]';
        playPauseBtn.textContent = '[ play ]';
        isPlaying = false;
    };

    // Update progress bar
    audio.ontimeupdate = () => {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progress}%`;
        }
    };

    // Initial volume
    audio.volume = volumeSlider.value / 100;

    // Enter screen logic
    enterBtn.addEventListener('click', () => {
        // Start playing music
        audio.play().catch(err => console.log("Autoplay blocked:", err));

        // Glitch fade out
        enterScreen.classList.add('fade-out');
        
        setTimeout(() => {
            enterScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
        }, 500);
    });

    // Music Player Controls
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(err => console.log("Play failed:", err));
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });
});
