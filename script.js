document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn');

    const submitView = document.getElementById('submit-view');
    const loadingView = document.getElementById('loading-view');
    const resultView = document.getElementById('result-view');

    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.icon');

    // Theme Toggle Logic
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        themeIcon.textContent = isLight ? '🌙' : '☀️';
    });

    submitBtn.addEventListener('click', startLoading);
    resetBtn.addEventListener('click', resetState);

    function startLoading() {
        switchView(submitView, loadingView);

        // Reset progress
        let progress = 0;
        progressFill.style.width = '0%';
        progressText.textContent = '0%';

        // Simulate loading
        const totalDuration = 3000; // 3 seconds total load time
        const intervalTime = 30; // Update every 30ms
        const increment = 100 / (totalDuration / intervalTime);

        const interval = setInterval(() => {
            progress += increment;

            // Add some randomness to make it feel more "real"
            if (Math.random() > 0.7) {
                progress += Math.random() * 2;
            }

            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                finishLoading();
            }

            updateProgress(progress);
        }, intervalTime);
    }

    function updateProgress(value) {
        const percentage = Math.floor(value);
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;
    }

    function finishLoading() {
        // Small delay before showing result to let user see 100%
        setTimeout(() => {
            switchView(loadingView, resultView);
        }, 500);
    }

    function resetState() {
        switchView(resultView, submitView);
    }

    function switchView(fromView, toView) {
        fromView.classList.remove('active');
        fromView.classList.add('hidden');

        // Wait for fade out slightly or just switch immediately for snappier feel?
        // Let's do immediate switch of classes but CSS handles opacity transition

        setTimeout(() => {
            toView.classList.remove('hidden');
            // Small timeout to allow display:block to apply before opacity transition if we were using display:none
            // Since we use opacity, we can just add active
            requestAnimationFrame(() => {
                toView.classList.add('active');
            });
        }, 500); // Wait for the previous view to fade out
    }
});
