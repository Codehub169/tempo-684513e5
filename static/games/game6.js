// static/games/game6.js - Galactic Quizmaster (Placeholder)
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for Galactic Quizmaster.');
        return;
    }

    const questions = [
        { q: "What is the command center of a starship called?", a: ["Bridge", "Cockpit", "Engine Room"], correct: 0, hint: "It's where the captain usually sits." },
        { q: "Which fictional metal is Wolverine's skeleton bonded with?", a: ["Vibranium", "Adamantium", "Kryptonite"], correct: 1, hint: "It's known for its indestructibility." },
        { q: "What powers the TARDIS in Doctor Who?", a: ["Flux Capacitor", "The Heart of the TARDIS", "Dilithium Crystals"], correct: 1, hint: "It's a part of the TARDIS itself."},
        { q: "What is the name of the galaxy that includes our Solar System?", a: ["Andromeda", "Triangulum", "Milky Way"], correct: 2, hint: "Think of a chocolate bar!"}
    ];
    let currentQuestionIndex = 0;
    let score = 0;

    gameContainer.innerHTML = `
        <h3 class='game-title-style'>Galactic Quizmaster</h3>
        <p class='game-text-style'>Test your knowledge of the cosmos and beyond!</p>
        <p class='game-text-style'>Score: <span id='quiz-score'>0</span></p>
        <div id='quiz-question' class='game-text-style' style='font-weight: bold; margin-top:15px; min-height: 2em;'></div>
        <div id='quiz-answers' style='margin-top: 10px; display: flex; flex-direction: column; align-items: center; gap: 5px;'></div>
        <div id='quiz-feedback' class='game-text-style' style='min-height: 2em; margin-top:10px;' aria-live='polite'></div>
        <button id='quiz-hint-button' class='game-button' onclick='showHint()' style='margin-top:10px;'>Show Hint</button>
        <button id='quiz-next-button' class='game-button' onclick='nextQuestion()' style='margin-top:10px; margin-left:10px; display:none;'>Next Question</button>
    `;

    const questionElement = document.getElementById('quiz-question');
    const answersElement = document.getElementById('quiz-answers');
    const feedbackElement = document.getElementById('quiz-feedback');
    const scoreElement = document.getElementById('quiz-score');
    const hintButtonElement = document.getElementById('quiz-hint-button');
    const nextButtonElement = document.getElementById('quiz-next-button');

    if (!questionElement || !answersElement || !feedbackElement || !scoreElement || !hintButtonElement || !nextButtonElement) {
        console.error('Critical game elements not found for Galactic Quizmaster.');
        return;
    }

    function displayQuestion() {
        if (currentQuestionIndex >= questions.length) {
            questionElement.textContent = 'Quiz Complete!';
            answersElement.innerHTML = `<p class='game-text-style'>Your final score: ${score}/${questions.length}. Well done, scholar!</p>`;
            feedbackElement.textContent = '';
            hintButtonElement.style.display = 'none';
            nextButtonElement.textContent = 'Restart Quiz';
            nextButtonElement.onclick = restartQuiz; // Keep this assignment
            nextButtonElement.style.display = 'inline-block';
            return;
        }

        const qData = questions[currentQuestionIndex];
        questionElement.textContent = qData.q;
        const answersHtml = qData.a.map((answer, index) => 
            `<button class='game-button answer-button' onclick='checkAnswer(${index})'>${answer}</button>`
        ).join('');
        answersElement.innerHTML = answersHtml;
        feedbackElement.textContent = '';
        feedbackElement.style.color = 'var(--text-color)'; // Reset color
        scoreElement.textContent = score;
        hintButtonElement.style.display = 'inline-block';
        nextButtonElement.style.display = 'none'; 
        // Buttons are recreated, so no need to re-enable old ones specifically.
    }

    window.checkAnswer = function(selectedIndex) {
        const qData = questions[currentQuestionIndex];
        document.querySelectorAll('#quiz-answers .answer-button').forEach(b => b.disabled = true);
        hintButtonElement.style.display = 'none';
        nextButtonElement.style.display = 'inline-block';

        if (selectedIndex === qData.correct) {
            score++;
            feedbackElement.textContent = 'Correct! You are wise beyond your years.';
            feedbackElement.style.color = 'var(--success-color)';
        } else {
            feedbackElement.textContent = `Incorrect. The correct answer was: ${qData.a[qData.correct]}.`;
            feedbackElement.style.color = 'var(--error-color)';
        }
        scoreElement.textContent = score;
    };

    window.showHint = function() {
        const qData = questions[currentQuestionIndex];
        feedbackElement.textContent = `Hint: ${qData.hint}`;
        feedbackElement.style.color = 'var(--info-color)';
        hintButtonElement.style.display = 'none';
    };

    window.nextQuestion = function() {
        currentQuestionIndex++;
        displayQuestion();
    };
    
    window.restartQuiz = function() {
        currentQuestionIndex = 0;
        score = 0;
        nextButtonElement.textContent = 'Next Question';
        nextButtonElement.onclick = nextQuestion; // Reset to nextQuestion function
        displayQuestion();
    };

    displayQuestion(); // Start the quiz
});
