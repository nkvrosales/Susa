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
