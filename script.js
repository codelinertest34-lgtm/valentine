// Navigation script for the Valentine’s Day website

document.addEventListener('DOMContentLoaded', function() {

    // Page 2 intro popup timeout (kept local and isolated)
    (function initPage2IntroPopupScope() {
        if (!document.querySelector('#page2-intro')) return;
        const overlay = document.getElementById('page2-intro');
        const pageMain = document.getElementById('page2-main');
        if (!overlay || !pageMain) return;

        // Ensure main is hidden initially
        pageMain.classList.add('hidden');

        let page2IntroTimeout;
        if (page2IntroTimeout) clearTimeout(page2IntroTimeout);
        page2IntroTimeout = setTimeout(() => {
            overlay.classList.add('intro-hide');
            // after fadeOut (400ms) remove overlay and show main
            setTimeout(() => {
                overlay.style.display = 'none';
                pageMain.classList.remove('hidden');
                pageMain.classList.add('fade-in');
            }, 450);
        }, 1500);
    })();

    // Page 2 Valentine logic
    let noClickCount = 0;
    const messages = [
        "Are yess pe click karo 😝",
        "Ek baar aur soch lo 😭",
        "Maan jaao please 🥺",

    ];
    let lastMessageIndex = -1;

    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const valentineGif = document.getElementById('valentine-gif');
    const noMessage = document.getElementById('no-message');
    const goodChoice = document.getElementById('good-choice');

    if (yesBtn) {
        yesBtn.addEventListener('click', function() {
            window.location.href = 'page3.html';
        });
    }

    if (noBtn) {
        noBtn.addEventListener('click', function() {
            noClickCount++;

            // Change GIF based on click count
            if (noClickCount === 1) {
                fadeGif(valentineGif, 'https://media1.tenor.com/m/JbT4JqfvxyEAAAAd/dudu-cry-hay-nako-reika.gif');
            } else if (noClickCount === 2) {
                fadeGif(valentineGif, 'https://media.tenor.com/z7ZABFfLkn8AAAAi/kh%C3%B3c.gif');
            }

            // Pick random message, avoid repeat
            let messageIndex;
            do {
                messageIndex = Math.floor(Math.random() * messages.length);
            } while (messageIndex === lastMessageIndex);
            lastMessageIndex = messageIndex;

            // Show message with fade-in
            noMessage.textContent = messages[messageIndex];
            noMessage.style.opacity = '0';
            noMessage.style.display = 'block';
            setTimeout(() => {
                noMessage.style.opacity = '1';
            }, 10);

            // After 3 clicks, hide No button and show good choice
            if (noClickCount >= 3) {
                noBtn.style.display = 'none';
                goodChoice.style.display = 'block';
            }
        });
    }

    // ----------------- Index page lock countdown (isolated) -----------------
    function initIndexLockCountdown() {
        // Guard: run only on index page when our elements exist
        const lockedEl = document.getElementById('index-locked');
        const mainEl = document.getElementById('index-main');
        const pwdInput = document.getElementById('index-password');
        const pwdBtn = document.getElementById('index-unlock-btn');
        if (!lockedEl || !mainEl) return;

        const unlockDate = new Date(2026, 1, 14, 0, 0, 0); // Feb 14 2026 00:00 local
        // When true, require manual password unlock even if the date has passed
        const requirePasswordOnly = true;

        // Ensure main hidden initially (if before unlock)
        function showMain() {
            lockedEl.style.display = 'none';
            mainEl.style.display = '';
            mainEl.classList.add('fade-in');
        }

        function formatNumber(n) { return String(n).padStart(2, '0'); }

        // show locked UI (countdown removed; password-only unlock)
        lockedEl.style.display = '';
        mainEl.style.display = 'none';

        // keep a placeholder interval variable for compatibility with previous logic
        let indexCountdownInterval = null;

        // Password unlock (optional) — same pattern as audio page
        const correctPassword = 'naimish@34';
        function tryPasswordUnlock() {
            if (!pwdInput) return;
            const entered = (pwdInput.value || '').toLowerCase().trim();
            if (!entered) return;
            if (entered === correctPassword.toLowerCase()) {
                if (indexCountdownInterval) { clearInterval(indexCountdownInterval); indexCountdownInterval = null; }
                showMain();
            } else {
                // small feedback
                pwdInput.value = '';
                pwdInput.placeholder = 'Wrong password — try again';
                setTimeout(() => { if (pwdInput) pwdInput.placeholder = 'Enter password'; }, 1200);
            }
        }

        if (pwdBtn) pwdBtn.addEventListener('click', tryPasswordUnlock);
        if (pwdInput) pwdInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') tryPasswordUnlock(); });

        // Delegated fallback in case direct listener is not attached by timing/environment
        document.addEventListener('click', function(e) {
            const t = e.target;
            if (!t) return;
            if (t.id === 'index-unlock-btn') {
                tryPasswordUnlock();
            }
        });

        // Ensure cleanup when navigating away
        window.addEventListener('beforeunload', function() { if (indexCountdownInterval) { clearInterval(indexCountdownInterval); indexCountdownInterval = null; } });
    }

    // Run index lock initializer if present on page
    initIndexLockCountdown();

    // Helper function for smooth GIF transition
    function fadeGif(imgElement, newSrc) {
        imgElement.style.opacity = '0';
        setTimeout(() => {
            imgElement.src = newSrc;
            imgElement.style.opacity = '1';
        }, 250); // Half of transition time
    }

    /* ------------------------------------------------------------------
       Reasons GIF helpers (strict pool + persistence)
       - key: "reasons_gif_src"
       - only uses the EXACT URLs from the provided pool
       ------------------------------------------------------------------ */
    const REASONS_GIF_POOL = [
        'https://media.tenor.com/Lgr_6-nkvnUAAAAi/casal-dudu.gif',
        'https://media.tenor.com/X-FxbDVE8a4AAAAi/bubu-dudu-sseeyall.gif',
        'https://media.tenor.com/arLtVbLvu10AAAAi/bubu-dudu-sseeyall.gif',
        'https://media.tenor.com/2tlTR6jscocAAAAi/kiss-bubu-dudu.gif',
        'https://media1.tenor.com/m/zIacwDB2Mr0AAAAC/huhhh.gif'
    ];

    // Default shown on reasons.html (used when no saved value exists)
    const REASONS_DEFAULT_GIF = 'https://media.tenor.com/X-FxbDVE8a4AAAAi/bubu-dudu-sseeyall.gif';

    function getRandomReasonsGif() {
        // treat the currently-displayed GIF as the 'current' to prefer a visible change
        const stored = localStorage.getItem('reasons_gif_src');
        const current = stored || REASONS_DEFAULT_GIF;

        if (!REASONS_GIF_POOL.length) return null;
        if (REASONS_GIF_POOL.length === 1) return REASONS_GIF_POOL[0];

        let pick, tries = 0;
        do {
            pick = REASONS_GIF_POOL[Math.floor(Math.random() * REASONS_GIF_POOL.length)];
            tries++;
        } while (pick === current && tries < 8);
        return pick;
    }

    function setReasonsGifOnTileClick() {
        const container = document.querySelector('.tile-row');
        if (!container) return; // guard: run only on page3

        // Use event delegation (single listener) and capture phase so storage is set
        // before inline onclick navigation on tiles.
        container.addEventListener('click', function(evt) {
            const tile = evt.target.closest('.tile');
            if (!tile || !container.contains(tile)) return;
            if (tile.classList.contains('disabled') || tile.classList.contains('locked')) return;

            const chosen = getRandomReasonsGif();
            if (!chosen) return;
            try {
                localStorage.setItem('reasons_gif_src', chosen);
                // small debug aid — visible in browser console when you click a tile
                console.debug('reasons_gif_src ->', chosen);
            } catch (err) {
                console.warn('Could not save reasons_gif_src', err);
            }
            // do not prevent navigation; allow inline onclick to run
        }, true);
    }

    function applyReasonsGifOnLoad() {
        const img = document.getElementById('reasons-top-gif');
        if (!img) return;
        try {
            const src = localStorage.getItem('reasons_gif_src');
            if (src && REASONS_GIF_POOL.indexOf(src) !== -1) img.src = src;
        } catch (err) { /* ignore */ }
        img.style.pointerEvents = 'none';
    }

    // Initialize features (guarded) — page3 tile hook + reasons page apply
    setReasonsGifOnTileClick();
    applyReasonsGifOnLoad();

    /* ----------------------
       Page 3: Reels viewer
       - guarded (no-op on other pages)
       - IntersectionObserver (threshold: 0.7)
       - pauses other videos when a slide is >=70% visible
       ---------------------- */
    function initPage3Reels() {
        const gif = document.querySelector('#page3-gif');
        if (!gif) return; // not on page3 — noop

        const modal = document.getElementById('reels-modal');
        const container = document.getElementById('reels-container');
        if (!modal || !container) return;

        const closeBtn = modal.querySelector('.reels-close');
        const reels = Array.from(modal.querySelectorAll('.reel'));
        const videos = Array.from(modal.querySelectorAll('video.reel-video'));

        // Sequence controls (scoped): shuffle first N-1 reels, keep last placeholder fixed
        let sequenceOrder = [];
        let sequencePos = -1;
        let sequenceActive = false;
        let isAdvancing = false; // small guard to avoid double-advances

        // Open modal when GIF clicked
        gif.addEventListener('click', function openReels() {
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            // ensure container starts at top
            container.scrollTop = 0;
            // give focus to container for keyboard scrolling
            container.focus();

            // --- initialize randomized sequence (keep last slide fixed at the end) ---
            // Use reels.length so the final placeholder slide (non-video) is kept at the end
            const count = reels.length;
            const lastIndex = Math.max(0, count - 1);
            const pool = [];
            for (let i = 0; i < lastIndex; i++) pool.push(i);
            // Sequential order (no shuffle) — keep the last placeholder fixed at the end
            sequenceOrder = pool.concat([lastIndex]);
            sequencePos = 0;
            sequenceActive = true;

            // Jump to first randomized reel so IO will pick it up and play
            const firstEl = reels[sequenceOrder[0]];
            if (firstEl) container.scrollTo({ top: firstEl.offsetTop, behavior: 'auto' });

            // Cancel auto-sequence if the user manually interacts
            const cancelAuto = () => { sequenceActive = false; };
            container.addEventListener('pointerdown', cancelAuto, { once: true });
            container.addEventListener('touchstart', cancelAuto, { once: true });
            container.addEventListener('wheel', cancelAuto, { once: true });
        });

        // Close modal helper
        function closeModal() {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            // pause & reset videos
            videos.forEach(v => { try { v.pause(); v.currentTime = 0; } catch (e) {} });
            container.scrollTop = 0;
            // stop any running auto-sequence
            sequenceActive = false;
            sequenceOrder = [];
            sequencePos = -1;
        }

        // Close button
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        // ESC to close
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
        });

        // Pause all videos except one
        function pauseAllExcept(keep) {
            videos.forEach(v => { if (v !== keep) try { v.pause(); } catch (e) {} });
        }

        // helper: scroll to a sequence position
        function scrollToSequence(pos, smooth) {
            if (!sequenceOrder || sequenceOrder.length === 0) return;
            const idx = sequenceOrder[pos];
            const el = reels[idx];
            if (!el) return;
            container.scrollTo({ top: el.offsetTop, behavior: smooth ? 'smooth' : 'auto' });
        }

        // advance through randomized sequence (driven by 'ended' events)
        function advanceSequence() {
            if (!sequenceActive || isAdvancing) return;
            isAdvancing = true;
            try {
                if (sequencePos < sequenceOrder.length - 1) {
                    sequencePos++;
                    scrollToSequence(sequencePos, true);
                } else {
                    // reached final slide — stop sequence
                    sequenceActive = false;
                }
            } finally { isAdvancing = false; }
        }

        // IntersectionObserver to autoplay visible reel (threshold: 0.7)
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                const video = el.querySelector('video.reel-video');
                if (!video) return;

                if (entry.intersectionRatio >= 0.7) {
                    // play this one, pause others
                    pauseAllExcept(video);
                    const p = video.play();
                    if (p && p.catch) p.catch(()=>{});
                } else {
                    try { video.pause(); } catch (err) {}
                }
            });
        }, { root: container, threshold: 0.7 });

        reels.forEach(r => io.observe(r));

        // Show friendly overlay if a video fails to load + sequence handling
        videos.forEach((video, idx) => {
            video.addEventListener('error', function () {
                const parent = video.closest('.reel');
                const overlay = parent ? parent.querySelector('.reel-error') : null;
                const reelIndex = parent ? reels.indexOf(parent) : -1;
                if (overlay) {
                    // use reelIndex for numbering so placeholder position matches
                    const displayIndex = reelIndex >= 0 ? reelIndex + 1 : idx + 1;
                    overlay.textContent = `🎞 Add reel${displayIndex}.mp4 in assets/reels`;
                    overlay.style.display = 'flex';
                    video.style.visibility = 'hidden';
                }
                // if this failed video's parent reel is the current item in sequence, advance
                if (sequenceActive && sequenceOrder[sequencePos] === reelIndex) {
                    advanceSequence();
                }
            });

            // When a video ends, advance sequence if its parent reel is the current item
            video.addEventListener('ended', function () {
                const parent = video.closest('.reel');
                const reelIndex = parent ? reels.indexOf(parent) : -1;
                if (sequenceActive && sequenceOrder[sequencePos] === reelIndex) {
                    advanceSequence();
                }
            });

            // Ensure video is paused when not visible
            video.addEventListener('pause', function () { /* noop - handled by IO */ });
        });
    }

    // run on DOM ready (guarded)
    initPage3Reels();

    

    // Handle back button on page3.html and gallery.html
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'page2.html'; // Back to page2 for gallery
        });
    }

    // Handle next button on gallery.html
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            window.location.href = 'page3.html';
        });
    }

    // Handle library button on page3.html
    const libraryBtn = document.getElementById('library-btn');
    if (libraryBtn) {
        libraryBtn.addEventListener('click', function() {
            window.location.href = 'gallery.html';
        });
    }

    // Handle note button on page3.html
    const noteBtn = document.getElementById('note-btn');
    if (noteBtn) {
        noteBtn.addEventListener('click', function() {
            window.location.href = 'note.html';
        });
    }

    // Handle reasons button on page3.html
    const reasonsBtn = document.getElementById('reasons-btn');
    if (reasonsBtn) {
        reasonsBtn.addEventListener('click', function() {
            window.location.href = 'reasons.html';
        });
    }

    // Handle journey button on page3.html
    const journeyBtn = document.getElementById('journey-btn');
    if (journeyBtn) {
        journeyBtn.addEventListener('click', function() {
            window.location.href = 'timeline.html';
        });
    }

    // Handle timeline page buttons
    const backBtnTimeline = document.getElementById('back-btn');
    if (backBtnTimeline && window.location.pathname.includes('timeline.html')) {
        backBtnTimeline.addEventListener('click', function() {
            window.location.href = 'page3.html';
        });
    }

    const libraryBtnTimeline = document.getElementById('library-btn');
    if (libraryBtnTimeline && window.location.pathname.includes('timeline.html')) {
        libraryBtnTimeline.addEventListener('click', function() {
            window.location.href = 'gallery.html';
        });
    }

    const quizBtnTimeline = document.getElementById('quiz-btn');
    if (quizBtnTimeline && window.location.pathname.includes('timeline.html')) {
        quizBtnTimeline.addEventListener('click', function() {
            window.location.href = 'quiz.html';
        });
    }

    // Page 2 gift buttons
    const gift1Btn = document.getElementById('gift1-btn');
    if (gift1Btn) {
        gift1Btn.addEventListener('click', function() {
            window.location.href = 'page3.html';
        });
    }

    const gift2Btn = document.getElementById('gift2-btn');
    const giftPopup = document.getElementById('gift-popup');
    if (gift2Btn && giftPopup) {
        gift2Btn.addEventListener('click', function() {
            giftPopup.style.display = 'block';
            giftPopup.style.animation = 'popIn 0.3s ease-out';
            setTimeout(() => {
                giftPopup.style.animation = 'fadeOut 0.4s ease-out forwards';
                setTimeout(() => {
                    giftPopup.style.display = 'none';
                }, 400);
            }, 1400);
        });
    }

    // Falling hearts animation
    // Falling hearts animation
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        // make big fading falling hearts
        heart.style.animationDuration = (Math.random() * 6 + 6) + 's'; // 6-12s
        heart.style.fontSize = (Math.random() * 60 + 80) + 'px'; // 80-140px
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 12000);
    }
    const heartInterval = setInterval(createHeart, 300);

    // Page 2 - show main card immediately with fade-in
    const mainCard = document.getElementById('mainCard');
    if (mainCard) {
        mainCard.classList.add('fade-in');
    }

    // Page 2 specific effects
    if (document.getElementById('popup')) {
        // Rising hearts removed for page2

        // confetti and extra hearts removed per design; keep only falling hearts

        // Hide popup after 2 seconds with fade out
        setTimeout(() => {
            const popup = document.getElementById('popup');
            if (popup) {
                popup.style.animation = 'fadeOut 0.5s ease-out forwards';
                setTimeout(() => {
                    popup.style.display = 'none';
                    // Show the container after popup fades
                    const container = document.querySelector('.container');
                    if (container) {
                        container.style.display = 'flex';
                    }
                }, 500);
            }
        }, 2000);
    }

    // Photo modal functionality for gallery.html
    const photoModal = document.getElementById('photo-modal');
    const modalImage = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.close-btn');

    if (photoModal && modalImage && closeBtn) {
        // Add click event to all photo cards
        const photoCards = document.querySelectorAll('.photo-card img');
        photoCards.forEach(img => {
            img.addEventListener('click', function() {
                modalImage.src = this.src;
                modalImage.alt = this.alt;
                photoModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent page scrolling
            });
        });

        // Close modal when clicking close button
        closeBtn.addEventListener('click', closeModal);

        // Close modal when clicking outside the image
        photoModal.addEventListener('click', function(e) {
            if (e.target === photoModal) {
                closeModal();
            }
        });

        function closeModal() {
            photoModal.style.animation = 'fadeOut 0.3s ease-out';
            modalImage.style.animation = 'scaleOut 0.3s ease-out';
            setTimeout(() => {
                photoModal.style.display = 'none';
                photoModal.style.animation = '';
                modalImage.style.animation = '';
                document.body.style.overflow = ''; // Restore page scrolling
            }, 300);
        }
    }

    // Reason cards functionality for reasons.html
    const reasonCards = document.querySelectorAll('.reason-card');
    if (reasonCards.length > 0) {
        reasonCards.forEach(card => {
            card.addEventListener('click', function() {
                const isRevealed = this.dataset.revealed === 'true';

                if (!isRevealed) {
                    // Create hearts burst
                    createHearts(this);

                    // Flip the card
                    this.classList.add('flipped');

                    // Mark as revealed
                    this.dataset.revealed = 'true';
                } else {
                    // Toggle flip for already revealed cards
                    this.classList.toggle('flipped');
                }

                // —— NEW: change Reasons header GIF on every reason-card click ——
                try {
                    const chosen = getRandomReasonsGif();
                    if (chosen) {
                        // persist and update header smoothly
                        localStorage.setItem('reasons_gif_src', chosen);
                        const topImg = document.getElementById('reasons-top-gif');
                        if (topImg) fadeGif(topImg, chosen);
                        console.debug('reasons: header GIF set ->', chosen);
                    }
                } catch (err) {
                    console.warn('Failed to set reasons header GIF', err);
                }
            });
        });
    }

    // Journey map interactions: sync pins and stop-cards
    const pins = Array.from(document.querySelectorAll('.pin'));
    const stopCards = Array.from(document.querySelectorAll('.stop-card'));

    function clearActiveStops() {
        stopCards.forEach(c => c.classList.remove('active'));
        pins.forEach(p => p.classList.remove('active'));
        // remove active from pin badges as well
        const pinBadges = document.querySelectorAll('.pin-badge');
        pinBadges.forEach(b => b.classList.remove('active'));
    }

    if (pins.length > 0 && stopCards.length > 0) {
        pins.forEach(pin => {
            pin.addEventListener('click', function(e) {
                const stopId = this.getAttribute('data-stop');
                const card = document.querySelector(`.stop-${stopId}`);

                if (card) {
                    // scroll into view and set active
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    clearActiveStops();
                    card.classList.add('active');
                    this.classList.add('active');
                    const badge = document.querySelector(`.pin-badge[data-stop="${stopId}"]`);
                    if (badge) badge.classList.add('active');
                }
            });
        });

        // Observe stop-cards to highlight pin when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                const match = el.className.match(/stop-(\d+)/);
                if (!match) return;
                const idx = match[1];
                const relatedPin = document.querySelector(`.pin[data-stop="${idx}"]`);
                const relatedBadge = document.querySelector(`.pin-badge[data-stop="${idx}"]`);

                if (entry.isIntersecting) {
                    clearActiveStops();
                    el.classList.add('active');
                    if (relatedPin) relatedPin.classList.add('active');
                    if (relatedBadge) relatedBadge.classList.add('active');
                }
            });
        }, {
            root: null,
            threshold: 0.45
        });

        stopCards.forEach(card => observer.observe(card));
    }

    // Close stop highlights when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.pin') && !e.target.closest('.stop-card')) {
            clearActiveStops();
        }
    });

    // Voice unlock button functionality for voice.html
    const unlockBtn = document.getElementById('unlock-btn');
    const passwordInput = document.getElementById('password-input');
    const gate = document.getElementById('gate');
    const audioSection = document.getElementById('audio-section');
    const errorMessage = document.getElementById('error-message');

    if (unlockBtn && passwordInput) {
        // Correct password
        const correctPassword = 'sheenu@34';

        // Handle unlock button click
        unlockBtn.addEventListener('click', function() {
            const enteredPassword = passwordInput.value.toLowerCase().trim();

            if (enteredPassword === correctPassword) {
                // Correct password - show audio section
                errorMessage.textContent = '';
                gate.classList.add('hidden');
                audioSection.classList.remove('hidden');
            } else {
                // Wrong password - show error
                errorMessage.textContent = 'Wrong password! Try again 😊';
                passwordInput.value = '';
                passwordInput.focus();
            }
        });

        // Allow Enter key to unlock
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                unlockBtn.click();
            }
        });
    }

    // Lock again button functionality
    const lockAgainBtn = document.getElementById('lock-again-btn');
    if (lockAgainBtn && gate && audioSection && passwordInput) {
        lockAgainBtn.addEventListener('click', function() {
            audioSection.classList.add('hidden');
            gate.classList.remove('hidden');
            passwordInput.value = '';
            errorMessage.textContent = '';
            passwordInput.focus();
        });
    }

    // Audio player functionality for voice.html
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const equalizer = document.getElementById('equalizer');

    if (audioPlayer && playPauseBtn) {
        // Play/Pause button
        playPauseBtn.addEventListener('click', function() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playPauseBtn.textContent = '⏸️';
            } else {
                audioPlayer.pause();
                playPauseBtn.textContent = '▶️';
            }
        });

        // Update progress bar when audio plays
        audioPlayer.addEventListener('timeupdate', function() {
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = percent;
            currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        });

        // Update duration when metadata loads
        audioPlayer.addEventListener('loadedmetadata', function() {
            durationDisplay.textContent = formatTime(audioPlayer.duration);
            progressBar.max = 100;
        });

        // Seek functionality
        progressBar.addEventListener('input', function() {
            const time = (this.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = time;
        });

        // Volume control
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                audioPlayer.volume = this.value / 100;
            });
        }

        // Update equalizer bars during playback
        if (equalizer) {
            audioPlayer.addEventListener('play', function() {
                const bars = equalizer.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.animation = 'pulse 0.6s ease-in-out infinite';
                });
            });

            audioPlayer.addEventListener('pause', function() {
                const bars = equalizer.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.animation = 'none';
                    bar.style.height = '20px';
                });
            });
        }

        // Reset play button when audio ends
        audioPlayer.addEventListener('ended', function() {
            playPauseBtn.textContent = '▶️';
        });
    }

    // Helper function to format time
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
});

// Function to create hearts burst animation
function createHearts(card) {
    // burst hearts removed — keep only falling hearts globally
    return;
}

// Quiz data
const quizQuestions = [
    {
        question: "What do you deserve the most?",
        options: ["All the happiness 💖", "A big hug 🤗", "Endless love 💕", "All of these 😌"],
        correct: 3
    },
    {
        question: "Pick a date idea:",
        options: ["Movie night 🎬", "Long walk 🌙", "Cafe + talks ☕", "Surprise picnic 🧺"],
        correct: null // No correct answer for this question
    },
    {
        question: "What's your love language vibe?",
        options: ["Words 💬", "Time ⏳", "Gifts 🎁", "Hugs 🤍"],
        correct: null
    },
    {
        question: "Which one sounds like you?",
        options: ["Cute 😇", "Bold 😎", "Soft 🥺", "All-in-one ✨"],
        correct: null
    },
    {
        question: "What should your Valentine do more?",
        options: ["Compliments 😘", "More attention 💫", "More surprises 🎉", "All of it 😌"],
        correct: 3
    },
    {
        question: "Final question: Will you accept infinite love?",
        options: ["Yes, obviously 💘", "YESSS 😍", "Okay fine 😳", "No (not allowed) 😝"],
        correct: [0, 1, 2] // Multiple correct answers (any yes-type)
    }
];

let currentQuestionIndex = 0;
let answers = [];
let score = 0;

function initQuiz() {
    showQuestion(currentQuestionIndex);
    updateProgress();

    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('retry-btn').addEventListener('click', retryQuiz);
    document.getElementById('note-result-btn').addEventListener('click', () => window.location.href = 'note.html');
    document.getElementById('library-result-btn').addEventListener('click', () => window.location.href = 'gallery.html');
}

function showQuestion(index) {
    const question = quizQuestions[index];
    document.getElementById('question').textContent = question.question;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, optionIndex) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => selectOption(optionIndex));
        optionsContainer.appendChild(button);
    });

    document.getElementById('next-btn').classList.add('hidden');
}

function selectOption(optionIndex) {
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => btn.classList.remove('selected'));
    optionButtons[optionIndex].classList.add('selected');

    answers[currentQuestionIndex] = optionIndex;
    document.getElementById('next-btn').classList.remove('hidden');
}

function nextQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const selectedAnswer = answers[currentQuestionIndex];

    // Score only Q1, Q5, Q6
    if (currentQuestionIndex === 0 || currentQuestionIndex === 4 || currentQuestionIndex === 5) {
        if (question.correct === selectedAnswer || (Array.isArray(question.correct) && question.correct.includes(selectedAnswer))) {
            score++;
        } else if (currentQuestionIndex === 5 && selectedAnswer === 3) {
            // Special case for Q6: if "No" is selected, show warning but don't score
            alert("Hey! That's not allowed 😝 You deserve all the love!");
            return;
        }
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion(currentQuestionIndex);
        updateProgress();
    } else {
        showResult();
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-text').textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
}

function showResult() {
    document.getElementById('question-container').classList.add('hidden');
    document.getElementById('result-container').classList.remove('hidden');

    let resultTitle = '';
    if (score === 3) {
        resultTitle = "Perfect match energy 💖";
    } else if (score === 2) {
        resultTitle = "So close—still adorable 😘";
    } else {
        resultTitle = "Hehe, try again 😝";
    }

    document.getElementById('result-title').textContent = resultTitle;
}

function retryQuiz() {
    currentQuestionIndex = 0;
    answers = [];
    score = 0;
    document.getElementById('result-container').classList.add('hidden');
    document.getElementById('question-container').classList.remove('hidden');
    showQuestion(currentQuestionIndex);
    updateProgress();
}

    // Image modal functionality for journey page
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.getElementById('close-modal');

    if (modal && modalImg && closeBtn) {
        // Add click event to all thumbnail images
        const thumbnails = document.querySelectorAll('.thumb');
        thumbnails.forEach(img => {
            img.addEventListener('click', function() {
                modal.style.display = 'flex';
                modalImg.src = this.src;
                modalImg.alt = this.alt;
            });
        });

        // Close modal when clicking the close button
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside the image
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Gift Page functionality
    const claimBtn = document.getElementById('claim-btn');
    const successMessage = document.getElementById('success-message');
    const surpriseSection = document.getElementById('surprise-section');
    const resetLink = document.getElementById('reset-gift');

    // Check if already claimed on page load
    if (claimBtn && localStorage.getItem('gift_claimed') === 'true') {
        // Show already claimed state
        claimBtn.textContent = 'Claimed ✓';
        claimBtn.classList.add('claimed');
        if (successMessage) successMessage.classList.remove('gift-hidden');
        if (surpriseSection) surpriseSection.classList.remove('gift-hidden');
    }

    // Handle claim button click
    if (claimBtn) {
        claimBtn.addEventListener('click', function() {
            // Store claimed state
            localStorage.setItem('gift_claimed', 'true');
            
            // Change button state
            claimBtn.textContent = 'Claimed ✓';
            claimBtn.classList.add('claimed');
            
            // Show success message
            if (successMessage) {
                successMessage.classList.remove('gift-hidden');
            }
            
            // Create hearts burst effect
            createGiftHearts();
            
            // Reveal surprise section after a short delay
            setTimeout(() => {
                if (surpriseSection) {
                    surpriseSection.classList.remove('gift-hidden');
                }
            }, 500);
        });
    }

    // Create hearts burst animation for gift surprise
    function createGiftHearts() {
        const hearts = ['💖', '💗', '💝', '❤️', '💘'];
        const container = document.createElement('div');
        container.className = 'surprise-hearts';
        container.style.position = 'fixed';
        container.style.inset = '0';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9999';
        document.body.appendChild(container);

        // Create multiple hearts
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.className = 'surprise-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'absolute';
            
            // Random starting position near center
            const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
            const startY = window.innerHeight / 2 + (Math.random() - 0.5) * 100;
            heart.style.left = startX + 'px';
            heart.style.top = startY + 'px';
            
            // Random direction
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 150 + 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            heart.style.setProperty('--tx', tx + 'px');
            heart.style.setProperty('--ty', ty + 'px');
            
            // Random delay
            heart.style.animationDelay = (Math.random() * 0.3) + 's';
            
            container.appendChild(heart);
        }

        // Remove container after animation
        setTimeout(() => {
            container.remove();
        }, 1500);
    }

    // Handle reset link (for testing)
    if (resetLink) {
        resetLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear localStorage
            localStorage.removeItem('gift_claimed');
            
            // Reset button
            if (claimBtn) {
                claimBtn.textContent = 'Claim Gift →';
                claimBtn.classList.remove('claimed');
            }
            
            // Hide success message
            if (successMessage) {
                successMessage.classList.add('gift-hidden');
            }
            
            // Hide surprise section
            if (surpriseSection) {
                surpriseSection.classList.add('gift-hidden');
            }
        });
    }

    // Get body reference once (used by multiple toggles)
    const body = document.body;



    // Night Mode functionality
    const nightToggle = document.getElementById('night-toggle');
    if (nightToggle) { // Only run if element exists
        // Check localStorage on load
        const isNight = localStorage.getItem('theme_mode') === 'night';
        if (isNight) {
            body.classList.add('night-mode');
            nightToggle.classList.add('active');
            nightToggle.querySelector('.icon').textContent = '✨';
            switchToStars();
        } else {
            switchToHearts();
        }

        // Toggle click handler
        nightToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const newNight = !body.classList.contains('night-mode');
            if (newNight) {
                body.classList.add('night-mode');
                nightToggle.classList.add('active');
                nightToggle.querySelector('.icon').textContent = '✨';
                localStorage.setItem('theme_mode', 'night');
                switchToStars();
            } else {
                body.classList.remove('night-mode');
                nightToggle.classList.remove('active');
                nightToggle.querySelector('.icon').textContent = '🌙';
                localStorage.setItem('theme_mode', 'day');
                switchToHearts();
            }
        });
    }

    // Function to switch to stars
    function switchToStars() {
        // Clear existing hearts
        document.querySelectorAll('.heart').forEach(h => h.remove());
        // Start star creation
        window.particleInterval = setInterval(createStar, 800);
    }

    // Function to switch to hearts
    function switchToHearts() {
        // Clear existing stars
        document.querySelectorAll('.star').forEach(s => s.remove());
        // Start heart creation
        window.particleInterval = setInterval(createHeart, 600);
    }

    // Create star function
    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = '✦';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.fontSize = (Math.random() * 4 + 2) + 'px'; // 2-6px
        star.style.animationDelay = Math.random() * 3 + 's';
        document.body.appendChild(star);

        setTimeout(() => {
            star.remove();
        }, 8000); // Remove after 8 seconds
    }



    // Simple toast helper for page3 locked tile
    window.showToast = function(message) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.remove('hidden');
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';

        clearTimeout(window._toastTimeout);
        window._toastTimeout = setTimeout(() => {
            if (toast) {
                toast.classList.add('hidden');
            }
        }, 1800);
    };

    // Since page timer functionality
    if (document.getElementById('since-timer')) {
        startSinceCounter();
    }

    // Memory Match Game functionality
    if (document.getElementById('match-grid')) {
        initNewMemoryMatch();
    }

// Function to initialize click-to-heart splash effect on index lock screen
function initIndexHeartSplash() {
    const lock = document.querySelector("#index-locked");
    if (!lock) return;

    lock.addEventListener('click', function(e) {
        const hearts = ['❤️', '💖', '💗'];
        const numHearts = Math.floor(Math.random() * 4) + 5; // 5-8 hearts

        for (let i = 0; i < numHearts; i++) {
            const heart = document.createElement('div');
            heart.className = 'click-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = e.clientX + 'px';
            heart.style.top = e.clientY + 'px';

            // Random direction and distance
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 100 + 50; // 50-150px
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            heart.style.setProperty('--tx', tx + 'px');
            heart.style.setProperty('--ty', ty + 'px');

            // Slight delay for each heart
            heart.style.animationDelay = (Math.random() * 0.2) + 's';

            document.body.appendChild(heart);

            // Remove after animation
            setTimeout(() => heart.remove(), 1000);
        }
    });
}

// Function to start the since counter
function startSinceCounter() {
    const startDate = new Date(2025, 4, 31, 23, 7, 0); // May 31, 2025, 23:07:00
    const timerElement = document.getElementById('since-timer');

    function updateTimer() {
        const now = new Date();

        if (now < startDate) {
            timerElement.textContent = "It hasn't started yet 😝";
            return;
        }

        const diff = now - startDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        timerElement.textContent = `${days} days  ${String(hours).padStart(2, '0')} hours  ${String(minutes).padStart(2, '0')} minutes  ${String(seconds).padStart(2, '0')} seconds`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// New Memory Match Game Logic
function initNewMemoryMatch() {
    const matchGrid = document.getElementById('match-grid');
    const complimentList = document.getElementById('compliment-list');
    const playAgainBtn = document.getElementById('play-again-btn');
    const backBtn = document.getElementById('back-btn');
    const movesElement = document.getElementById('moves');
    const matchesElement = document.getElementById('matches');
    const timerElement = document.getElementById('timer');

    if (!matchGrid || !playAgainBtn || !backBtn) {
        return;
    }

    // Game data
    const emojis = ['❤️', '😊', '💖', '🥺', '✨', '😄', '🌸', '🫶'];
    const compliments = [
        "Your smile makes everything better 💖",
        "You’re effortlessly amazing ✨",
        "You make my days brighter 😄",
        "You’re someone truly special 💕",
        "I feel lucky just knowing you 🥰",
        "You deserve all the love in the world ❤️",
        "You’re my favorite kind of happiness 🌸",
        "You’re exactly the good thing I prayed for 🫶"
    ];

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let complimentIndex = 0;
    let canFlip = true;
    let timerInterval;
    let startTime;

    // Shuffle array function (Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Format time as mm:ss
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Update timer
    function updateTimer() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerElement.textContent = `Timer: ${formatTime(elapsed)}`;
    }

    // Create heart particle animation
    function createHeartParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'heart-particle';
        particle.textContent = '💖';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);
    }

    // Create game board
    function createBoard() {
        // Create pairs
        const cardValues = [...emojis, ...emojis];
        const shuffledValues = shuffleArray(cardValues);

        matchGrid.innerHTML = '';
        cards = [];

        shuffledValues.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'match-card';
            card.dataset.value = emoji;

            const cardInner = document.createElement('div');
            cardInner.className = 'match-inner';

            const cardFront = document.createElement('div');
            cardFront.className = 'match-front';

            const cardBack = document.createElement('div');
            cardBack.className = 'match-back';
            cardBack.textContent = emoji;

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);

            card.addEventListener('click', handleCardClick);
            matchGrid.appendChild(card);
            cards.push(card);
        });
    }

    // Handle card click
    function handleCardClick() {
        if (!canFlip || this.classList.contains('flipped') || this.classList.contains('matched') || flippedCards.length >= 2) {
            return;
        }

        // Start timer on first click
        if (!startTime) {
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
        }

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            canFlip = false;
            moves++;
            movesElement.textContent = `Moves: ${moves}`;
            setTimeout(checkMatch, 800);
        }
    }

    // Check if cards match
    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            matchesElement.textContent = `Matches: ${matchedPairs}/8`;

            // Create heart particles
            const rect1 = card1.getBoundingClientRect();
            const rect2 = card2.getBoundingClientRect();
            createHeartParticle(rect1.left + rect1.width / 2, rect1.top + rect1.height / 2);
            createHeartParticle(rect2.left + rect2.width / 2, rect2.top + rect2.height / 2);

            // Show compliment
            showCompliment();

            // Check if game is complete
            if (matchedPairs === 8) {
                clearInterval(timerInterval);
                setTimeout(showFinalMessage, 1000);
            }
        } else {
            // No match - flip back
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        flippedCards = [];
        canFlip = true;
    }

    // Show compliment
    function showCompliment() {
        if (complimentIndex < compliments.length) {
            const complimentItem = document.createElement('div');
            complimentItem.className = 'compliment-item';
            complimentItem.textContent = compliments[complimentIndex];
            complimentList.appendChild(complimentItem);
            complimentIndex++;
        }
    }

    // Show final message
    function showFinalMessage() {
        const finalItem = document.createElement('div');
        finalItem.className = 'compliment-item';
        finalItem.style.background = 'linear-gradient(135deg, #ffe0ec, #fff0f7)';
        finalItem.style.borderLeftColor = '#e91e63';
        finalItem.style.fontWeight = 'bold';
        finalItem.textContent = "You matched them all… just like you matched my heart 💘";
        complimentList.appendChild(finalItem);
    }

    // Reset game
    function resetGame() {
        clearInterval(timerInterval);
        cards.forEach(card => {
            card.classList.remove('flipped', 'matched');
        });
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        complimentIndex = 0;
        canFlip = true;
        startTime = null;

        movesElement.textContent = 'Moves: 0';
        matchesElement.textContent = 'Matches: 0/8';
        timerElement.textContent = 'Timer: 00:00';
        complimentList.innerHTML = '';

        createBoard();
    }

    // Event listeners
    playAgainBtn.addEventListener('click', resetGame);
    backBtn.addEventListener('click', () => window.location.href = 'page3.html');

    // Initialize game
    createBoard();
}

// ------------------ Since page timer (page-scoped) ------------------
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('#since-timer')) return;

    const el = document.getElementById('since-timer');
    const startDate = new Date(2025, 4, 13, 11, 7, 0); // months are 0-based: 4 -> May

    function formatNumber(n) { return String(n).padStart(2, '0'); }

    function updateSince() {
        const now = new Date();
        if (now < startDate) {
            el.textContent = "It hasn't started yet 😝";
            return;
        }
        let diff = Math.floor((now - startDate) / 1000);
        const days = Math.floor(diff / 86400); diff %= 86400;
        const hours = Math.floor(diff / 3600); diff %= 3600;
        const minutes = Math.floor(diff / 60); const seconds = diff % 60;

        const display = `${days} days  ${formatNumber(hours)} hours  ${formatNumber(minutes)} minutes  ${formatNumber(seconds)} seconds`;
        el.textContent = display;
    }

    updateSince();
    const sinceInterval = setInterval(updateSince, 1000);

    // Clear interval when leaving the page
    window.addEventListener('beforeunload', function() { clearInterval(sinceInterval); });
});

