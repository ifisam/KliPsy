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

    const resultsContainer = document.getElementById('results-container');
    const showExtremeBtn = document.getElementById('show-extreme-btn');
    const showAllBtn = document.getElementById('show-all-btn');

    // Mock Data based on the reference image
    const resultData = [
        {
            title: "Immediacy of response",
            metrics: [
                { name: "Immediacy of response", value: 3 }
            ]
        },
        {
            title: "Timing/Efficiency",
            metrics: [
                { name: "Timing/Efficiency", value: 2 }
            ]
        },
        {
            title: "Focus (on central cognitions, emotions, behaviors, motivation, resources)",
            metrics: [
                { name: "Focus (on central cognitions, emotions, behaviors, motivation, resources)", value: 4 }
            ]
        },
        {
            title: "Clarity of communication",
            metrics: [
                { name: "Clarity of communication", value: 2 }
            ]
        },
        {
            title: "Congruence",
            metrics: [
                { name: "Congruence", value: 2 }
            ]
        },
        {
            title: "Self-Assurance",
            metrics: [
                { name: "Self-Assurance", value: 4 }
            ]
        },
        {
            title: "Fluency",
            metrics: [
                { name: "Fluency", value: 3 }
            ]
        },
        {
            title: "Fillers",
            metrics: [
                { name: "Fillers", value: 5 }
            ]
        },
        {
            title: "Professional correctness",
            metrics: [
                { name: "Professional correctness", value: 2 }
            ]
        },
        {
            title: "Global rating of therapeutic competence",
            metrics: [
                { name: "Global rating of therapeutic competence", value: 2 }
            ]
        }
    ];

    // Theme Toggle Logic
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeIcon.textContent = isDark ? '☀️' : '🌙';
    });

    submitBtn.addEventListener('click', startLoading);
    resetBtn.addEventListener('click', resetState);

    // Result Page Logic
    if (showExtremeBtn) {
        showExtremeBtn.addEventListener('click', showExtremeValues);
    }
    showAllBtn.addEventListener('click', showAllValues);

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
        setTimeout(() => {
            switchView(loadingView, resultView);
            renderResults(resultData);
        }, 500);
    }

    function resetState() {
        switchView(resultView, submitView);
        resultsContainer.innerHTML = ''; // Clear results
    }

    function switchView(fromView, toView) {
        fromView.classList.remove('active');
        fromView.classList.add('hidden');

        setTimeout(() => {
            toView.classList.remove('hidden');
            requestAnimationFrame(() => {
                toView.classList.add('active');
            });
        }, 500);
    }

    function renderResults(data) {
        resultsContainer.innerHTML = '';

        data.forEach((item, index) => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            accordionItem.id = `accordion-${index}`;

            // Check if item has extreme values for filtering/highlighting logic later if needed
            const hasExtreme = item.metrics.some(m => m.value >= 90);
            if (hasExtreme) accordionItem.dataset.extreme = "true";

            const header = document.createElement('div');
            header.className = 'accordion-header';
            header.innerHTML = `
                <span class="accordion-title">${item.title}</span>
                <span class="accordion-icon">▼</span>
            `;
            header.onclick = () => toggleAccordion(index);

            const content = document.createElement('div');
            content.className = 'accordion-content';

            const metricsContainer = document.createElement('div');
            metricsContainer.className = 'metrics-container';

            // Add Question if present
            if (item.question) {
                const questionEl = document.createElement('div');
                questionEl.className = 'question-text';
                questionEl.textContent = item.question;
                metricsContainer.appendChild(questionEl);
            }

            // Add Scale Descriptors if present
            if (item.scaleDescriptors) {
                const descriptorsContainer = document.createElement('div');
                descriptorsContainer.className = 'scale-descriptors-container';

                item.scaleDescriptors.forEach(desc => {
                    const box = document.createElement('div');
                    box.className = 'scale-box';
                    box.innerHTML = `<p>${desc.text}</p>`;
                    descriptorsContainer.appendChild(box);
                });
                metricsContainer.appendChild(descriptorsContainer);
            }

            item.metrics.forEach(metric => {
                const metricItem = document.createElement('div');
                metricItem.className = 'metric-item';
                metricItem.innerHTML = `
                    <span class="metric-label">${metric.name}</span>
                    <div class="metric-bar-container">
                        <div class="metric-marker" style="left: calc(${(metric.value - 1) * 25}% - 2px)"></div>
                    </div>
                    <div class="metric-scale">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                    </div>
                `;
                metricsContainer.appendChild(metricItem);
            });

            content.appendChild(metricsContainer);
            accordionItem.appendChild(header);
            accordionItem.appendChild(content);
            resultsContainer.appendChild(accordionItem);
        });
    }

    function toggleAccordion(index) {
        const item = document.getElementById(`accordion-${index}`);
        item.classList.toggle('active');
    }

    function showAllValues() {
        const items = document.querySelectorAll('.accordion-item');
        items.forEach(item => item.classList.add('active'));
    }

    function showExtremeValues() {
        const items = document.querySelectorAll('.accordion-item');
        items.forEach(item => {
            if (item.dataset.extreme === "true") {
                item.classList.add('active');
                item.style.display = 'block';
            } else {
                item.classList.remove('active');
                item.style.display = 'none'; // Hide non-extreme items
            }
        });
    }
});
