const gameBoard = (function() {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`
        })
        document.querySelector("#gameBoard").innerHTML = boardHTML;

        const squares = document.querySelectorAll(".square");
        squares.forEach(square => {
            square.addEventListener("click", gameController.handleClick)
        })    
    }

    const update = function(index, value) {
        gameboard[index] = value;
        render();
    }

    const getGameboard = () => gameboard;

    const restartBtn = document.querySelector("#restart-button");
    restartBtn.addEventListener("click", () => {
        gameboard = ["", "", "", "", "", "", "", "", ""];
        gameController.outcomeDisplay.textContent = "";
        gameController.start();
    });

    return {
        render,
        update,
        getGameboard
    }
})();

const makePlayer = function(player, mark) {
    return {
        player,
        mark
    }
};

const gameController = (function() {
    let players = [];
    let currentPlayerIndex;
    let gameOver;
    let outcomeMessage;
    let winnerMark;
    const outcomeDisplay = document.querySelector("#outcome-message");
    
    const start = () => {
        players = [
            makePlayer(document.querySelector("#player1").value, "X"), 
            makePlayer(document.querySelector("#player2").value, "O")
        ];

        currentPlayerIndex = 0;
        gameOver = false;
        gameBoard.render();
    
    }

    const gameOutcome = function() {
        const winningCombinations = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];

        for (let i = 0; i < winningCombinations.length; i++) {
            let [a, b, c] = winningCombinations[i];

            if (gameBoard.getGameboard()[a] !== "" && ((gameBoard.getGameboard()[a] === gameBoard.getGameboard()[b]) && (gameBoard.getGameboard()[a] === gameBoard.getGameboard()[c]))) {
                gameOver = true;
                winnerMark = gameBoard.getGameboard()[a]
            }
        }

        if (gameOver === true && winnerMark === "X") {
            outcomeMessage = `${players[0].player} won!`
        } else if (gameOver === true && winnerMark === "O") {
            outcomeMessage = `${players[1].player} won!`
        } else if (gameOver === false && !gameBoard.getGameboard().includes("")) {
            gameOver = true;
            outcomeMessage = "It's a draw."
        }
        return outcomeMessage;
    }

    const handleClick = (event) => {
        let currentSquare = document.querySelector(`#${event.target.id}`);
        let gameBoardIndex = event.target.id.split("-")[1];
        let gameBoardValue = players[currentPlayerIndex].mark;

        currentSquare.textContent = gameBoardValue;

        if (gameBoard.getGameboard()[gameBoardIndex] !== "") 
            return;

        gameBoard.update(gameBoardIndex, gameBoardValue);

        console.log(gameBoard.getGameboard)

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        gameOutcome();
        outcomeDisplay.textContent = outcomeMessage;
    }

    return {
        start,
        handleClick,
        outcomeDisplay,
    }
})();

const startBtn = document.querySelector("#start-button");
startBtn.addEventListener("click", () => {
    gameController.start()
});