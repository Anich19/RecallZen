const emojis = ['🌸', '🦁', '👶', '😊', '😂', '👠', '📱', '🐻', '🪥', '💧', '🦈', '🌟', '🍀', '🎈', '🎸', '📚', '🎮', '🚀', '⚽', '🏀'];
let board = [];
let openCards = [];
let matchedPairs = 0;
let timer;
let seconds = 0;
let steps = 0;
let isPaused = false;

// Initialize the game board
function initGame(numCards) {
    board = [...emojis.slice(0, numCards / 2), ...emojis.slice(0, numCards / 2)];
    board = board.sort(() => Math.random() - 0.5);

    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    board.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-index', index);
        card.setAttribute('data-emoji', emoji);
        card.addEventListener('click', handleCardClick);
        boardElement.appendChild(card);
    });
    resetGameStats();
}

// Handle card click
function handleCardClick(event) {
    if (isPaused) return;

    const card = event.target;
    if (card.classList.contains('open') || openCards.length === 2) return;

    card.textContent = card.getAttribute('data-emoji');
    card.classList.add('open');
    openCards.push(card);

    if (openCards.length === 2) {
        steps++;
        updateSteps();
        checkMatch();
    }
}

// Check if the opened cards match
function checkMatch() {
    const [card1, card2] = openCards;
    if (card1.getAttribute('data-emoji') === card2.getAttribute('data-emoji')) {
        card1.classList.add('match');
        card2.classList.add('match');
        matchedPairs++;
        if (matchedPairs === board.length / 2) {
            clearInterval(timer);
            showCongratsMessage();
        }
    } else {
        setTimeout(() => {
            card1.textContent = '';
            card2.textContent = '';
            card1.classList.remove('open');
            card2.classList.remove('open');
        }, 1000);
    }
    openCards = [];
}

// Show the congratulations message and Play Again option
function showCongratsMessage() {
    const congratsMessage = document.getElementById('congratsMessage');
    congratsMessage.style.display = 'block';
}

// Start the timer
function startTimer() {
    timer = setInterval(() => {
        if (!isPaused) {
            seconds++;
            updateTimer();
        }
    }, 1000);
}

// Update the timer
function updateTimer() {
    document.getElementById('timer').innerHTML = `Time: <span>${seconds}s</span>`;
}

// Update the steps
function updateSteps() {
    document.getElementById('steps').innerHTML = `Steps: <span>${steps}</span>`;
}

// Reset the game stats
function resetGameStats() {
    clearInterval(timer);
    seconds = 0;
    steps = 0;
    matchedPairs = 0;
    isPaused = false;
    updateTimer();
    updateSteps();
    document.getElementById('pauseButton').textContent = 'Pause';
    document.getElementById('congratsMessage').style.display = 'none';
}

// Pause the game
function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pauseButton').textContent = isPaused ? 'Resume' : 'Pause';
    document.getElementById('resumeInfo').style.display = isPaused ? 'block' : 'none';
}

// Hide the header section when the game starts
function hideHeader() {
    document.getElementById('headerSection').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'block';
}

// Event listeners
document.getElementById('playButton').addEventListener('click', () => {
    const numCards = parseInt(document.getElementById('cardRange').value);
    hideHeader();
    initGame(numCards);
    startTimer();
});

document.getElementById('pauseButton').addEventListener('click', togglePause);

document.getElementById('playAgainButton').addEventListener('click', () => {
    const numCards = parseInt(document.getElementById('cardRange').value);
    initGame(numCards);
    startTimer();
});
