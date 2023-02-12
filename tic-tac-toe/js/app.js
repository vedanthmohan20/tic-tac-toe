import { Game } from "./game.js";

const container = document.getElementById("container");

const newGameButton = document.createElement("button");
newGameButton.className = "button";
newGameButton.innerText = "New Game";
newGameButton.addEventListener("click", startNewGame);

const xButton = document.createElement("button");
xButton.className = "button";
xButton.innerText = "X";

const oButton = document.createElement("button");
oButton.className = "button";
oButton.innerText = "O";

function startNewGame() {
    container.innerHTML = "";
    container.appendChild(newGameButton);
    container.appendChild(xButton);
    container.appendChild(oButton);

    xButton.onclick = () => { new Game("X") }
    oButton.onclick = () => { new Game("O") }
}

container.appendChild(newGameButton);