// Simulate loading time
        setTimeout(function() {
            document.getElementById('loaderContainer').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        }, 3000);

        // Selecting all required elements
        const start_btn = document.querySelector(".start_btn button");
        const info_box = document.querySelector(".info_box");
        const exit_btn = info_box.querySelector(".buttons .quit");
        const continue_btn = info_box.querySelector(".buttons .restart");
        const game_box = document.querySelector(".game_box");
        const result_box = document.querySelector(".result_box");
        const game_board = document.getElementById("game-board");
        const current_player_symbol = document.getElementById("current-player-symbol");
        const score_x = document.getElementById("score-x");
        const score_o = document.getElementById("score-o");
        const victory_screen = document.getElementById("victory-screen");
        const winner_text = document.getElementById("winner-text");
        const winner_symbol = document.getElementById("winner-symbol");
        const play_again_btn = document.getElementById("play-again-btn");
        const main_menu_btn = document.getElementById("main-menu-btn");

        // Game state variables
        let currentPlayer = 'X';
        let gameBoard = ['', '', '', '', '', '', '', '', ''];
        let gameActive = false;
        let scores = { X: 0, O: 0 };
        
        // Winning combinations
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        // If start button clicked
        start_btn.onclick = () => {
            info_box.classList.add("activeInfo");
        }

        // If exit button clicked
        exit_btn.onclick = () => {
            info_box.classList.remove("activeInfo");
        }

        // If continue button clicked
        continue_btn.onclick = () => {
            info_box.classList.remove("activeInfo");
            game_box.classList.add("activeGame");
            startGame();
        }

        // Initialize the game board
        function initializeBoard() {
            game_board.innerHTML = '';
            for (let i = 0; i < 9; i++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.setAttribute('data-index', i);
                cell.addEventListener('click', () => handleCellClick(i));
                game_board.appendChild(cell);
            }
        }

        // Handle cell click
        function handleCellClick(index) {
            if (!gameActive || gameBoard[index] !== '') return;
            
            gameBoard[index] = currentPlayer;
            updateBoard();
            
            const winResult = checkWinner();
            if (winResult.winner) {
                highlightWinningCells(winResult.combination);
                setTimeout(() => {
                    endGame(false, winResult.combination);
                }, 1000);
                return;
            }
            
            if (checkDraw()) {
                endGame(true);
                return;
            }
            
            // Switch player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            current_player_symbol.textContent = currentPlayer;
        }

        // Update the visual board
        function updateBoard() {
            const cells = document.querySelectorAll('.cell');
            cells.forEach((cell, index) => {
                cell.textContent = gameBoard[index];
                if (gameBoard[index] === 'X') {
                    cell.classList.add('x');
                    cell.classList.remove('o');
                } else if (gameBoard[index] === 'O') {
                    cell.classList.add('o');
                    cell.classList.remove('x');
                } else {
                    cell.classList.remove('x', 'o');
                }
            });
        }

        // Check for a winner
        function checkWinner() {
            for (let condition of winningConditions) {
                const [a, b, c] = condition;
                if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                    return { winner: gameBoard[a], combination: condition };
                }
            }
            return { winner: null, combination: null };
        }

        // Highlight winning cells
        function highlightWinningCells(combination) {
            combination.forEach(index => {
                const cell = document.querySelector(`.cell[data-index="${index}"]`);
                cell.classList.add('winning-cell');
            });
        }

        // Check for a draw
        function checkDraw() {
            return !gameBoard.includes('');
        }

        // End the game
        function endGame(isDraw, winningCombination = null) {
            gameActive = false;
            
            if (isDraw) {
                result_box.querySelector(".complete_text").textContent = "It's a Draw!";
                result_box.querySelector(".score_text").innerHTML = '<span>No one wins this round.</span>';
                result_box.classList.add("activeResult");
            } else {
                scores[currentPlayer]++;
                updateScores();
                showVictoryScreen(currentPlayer, winningCombination);
            }
        }

        // Show victory celebration
        function showVictoryScreen(winner, winningCombination) {
            winner_text.textContent = `Player ${winner} Wins!`;
            winner_symbol.textContent = winner;
            
            // Create confetti
            createConfetti();
            
            // Show victory screen
            victory_screen.style.display = 'flex';
        }

        // Create confetti effect
        function createConfetti() {
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
            for (let i = 0; i < 150; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
                confetti.style.opacity = Math.random();
                victory_screen.appendChild(confetti);
                
                // Remove confetti after animation
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }
        }

        // Hide victory screen
        function hideVictoryScreen() {
            victory_screen.style.display = 'none';
            
            // Remove any remaining confetti
            const confettiElements = document.querySelectorAll('.confetti');
            confettiElements.forEach(confetti => confetti.remove());
        }

        // Update score display
        function updateScores() {
            score_x.textContent = scores.X;
            score_o.textContent = scores.O;
        }

        // Start a new game
        function startGame() {
            gameBoard = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameActive = true;
            current_player_symbol.textContent = currentPlayer;
            result_box.classList.remove("activeResult");
            hideVictoryScreen();
            
            // Remove winning cell highlights
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.classList.remove('winning-cell');
            });
            
            updateBoard();
        }

        // Reset the game
        function resetGame() {
            scores = { X: 0, O: 0 };
            updateScores();
            startGame();
        }

        // Quit the game
        function quitGame() {
            gameActive = false;
            gameBoard = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            current_player_symbol.textContent = currentPlayer;
            game_box.classList.remove("activeGame");
            result_box.classList.remove("activeResult");
            hideVictoryScreen();
            updateBoard();
        }

        // Event listeners for game box buttons
        const game_restart_btn = game_box.querySelector("footer .restart");
        game_restart_btn.onclick = () => {
            startGame();
        }

        // Event listeners for result box buttons
        const result_restart_btn = result_box.querySelector(".buttons .restart");
        const result_quit_btn = result_box.querySelector(".buttons .quit");
        
        result_restart_btn.onclick = () => {
            result_box.classList.remove("activeResult");
            startGame();
        }

        result_quit_btn.onclick = () => {
            result_box.classList.remove("activeResult");
            game_box.classList.remove("activeGame");
        }

        // Event listeners for victory screen buttons
        play_again_btn.onclick = () => {
            hideVictoryScreen();
            startGame();
        }

        main_menu_btn.onclick = () => {
            hideVictoryScreen();
            game_box.classList.remove("activeGame");
        }

        // Initialize the game
        initializeBoard();
        updateScores();