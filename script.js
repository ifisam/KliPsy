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
    const showAllBtn = document.getElementById('show-all-btn');

    // Mock Data based on the reference image
    const resultData = [
        {
            title: "Immediacy of response",
            metrics: [
                { name: "Immediacy of response", value: 3 }
            ],
            reasoning: `
                <h3>Evaluation and Reasoning:</h3>
                <ol>
                    <li><strong>Temporal Component:</strong>
                        <ul>
                            <li>You begin with a brief delay ("…"), indicating a moment of pause before responding.</li>
                            <li>Despite that initial silence, you quickly move into a validating statement demonstrating understanding of the patient's perspective.</li>
                        </ul>
                    </li>
                    <li><strong>Delay Tactics:</strong>
                        <ul>
                            <li>You do not use generic statements or filler questions; instead, you directly address the patient's feelings and their curiosity about therapy motivation.</li>
                            <li>Your response combines validation ("I can understand well how you came to this conclusion") with exploration ("there is of course some incentive … that led you here today").</li>
                        </ul>
                    </li>
                    <li><strong>Conclusion:</strong>
                        <ul>
                            <li>You respond relatively quickly after the pause and engage meaningfully with the patient.</li>
                            <li>Your answer aligns with the criteria of picking up emotions, validating, showing understanding, and strengthening the therapeutic relationship.</li>
                        </ul>
                    </li>
                </ol>

                <p><strong>Summary:</strong> Overall, your response is immediate and direct, using validation and exploration without unnecessary delay.</p>
            `
        },
        {
            title: "Emphasis",
            metrics: [
                { name: "Emphasis", value: 2 }
            ],
            reasoning: `
                <h3>Evaluation and Reasoning:</h3>
                <ol>
                    <li><strong>Efficiency & Structure:</strong>
                        <ul>
                            <li>Your response is long with filler words.</li>
                            <li>Repetitions do not add insight.</li>
                            <li>The structure feels scattered.</li>
                            <li>You digress instead of addressing emotions directly.</li>
                        </ul>
                    </li>
                </ol>

                <p><strong>Conclusion:</strong> Your response is unstructured and inefficient, weakening clarity and emotional attunement.</p>
            `
        },
        {
            title: "Focus (on central cognitions, emotions, behaviors, motivation, resources)",
            metrics: [
                { name: "Focus (on central cognitions, emotions, behaviors, motivation, resources)", value: 4 }
            ],
            reasoning: `
                <h3>Evaluation and Reasoning:</h3>
                <ol>
                    <li><strong>Criteria Alignment:</strong>
                        <ul>
                            <li>You validate the patient's exhaustion and workload.</li>
                            <li>But you move too quickly into solutions.</li>
                        </ul>
                    </li>
                </ol>

                <p><strong>Conclusion:</strong> Partially aligned; deeper exploration of emotions was needed.</p>
            `
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
            ],
            reasoning: `
                <h3>Evaluation and Reasoning:</h3>
                <ol>
                    <li><strong>Self-Confidence Cues:</strong>
                        <ul>
                            <li>You express certainty by acknowledging the patient's achievements, showing confidence in your understanding of their perspective.</li>
                            <li>You communicate clearly and confidently introduce curiosity about what brought them to therapy.</li>
                            <li>Your directive phrasing conveys a proactive stance.</li>
                            <li>You avoid evasive language.</li>
                        </ul>
                    </li>
                </ol>

                <p><strong>Conclusion:</strong> You appear credible and self-confident, balancing understanding with an invitation to exploration.</p>
            `
        },
        {
            title: "Fluency",
            metrics: [
                { name: "Fluency", value: 3 }
            ],
            reasoning: `
                <h3>Evaluation and Reasoning:</h3>
                <ol>
                    <li><strong>Speech Fluency:</strong>
                        <ul>
                            <li>One brief hesitation ("Mhh") appears natural.</li>
                            <li>Flow remains coherent.</li>
                        </ul>
                    </li>
                </ol>

                <p><strong>Conclusion:</strong> You speak fluently; hesitation is natural and not disruptive.</p>
            `
        },
        {
            title: "Fillers",
            metrics: [
                { name: "Fillers", value: 5 }
            ],
            reasoning: `
                <h3>Evaluation and Reasoning:</h3>
                <ol>
                    <li><strong>Filler Words:</strong>
                        <ul>
                            <li>High number of fillers disrupts clarity.</li>
                        </ul>
                    </li>
                </ol>

                <p><strong>Conclusion:</strong> The frequency of filler words weakens communication effectiveness.</p>
            `
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
            ],
            reasoning: `
                <h3>Evaluation and Reasoning:</h3>
                <ol>
                    <li><strong>Therapeutic Alignment:</strong>
                        <ul>
                            <li>You show empathy but shift too quickly to problem-solving.</li>
                        </ul>
                    </li>
                </ol>

                <p><strong>Conclusion:</strong> Partially aligned; deeper emotional validation required before offering solutions.</p>
            `
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

            // Add Reasoning Box if present
            if (item.reasoning) {
                const reasoningBox = document.createElement('div');
                reasoningBox.className = 'reasoning-box';
                reasoningBox.innerHTML = `
                    <h4 class="reasoning-title">PsyRAI Reasoning</h4>
                    <div class="reasoning-content">${item.reasoning}</div>
                `;
                metricsContainer.appendChild(reasoningBox);
            }

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
});
