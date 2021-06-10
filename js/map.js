class MapGame {
    constructor(numberOfCellOnX, numberOfCellOnY, numberOfObstacles, numberOfWeapons) {
        this.numberOfCellOnX = numberOfCellOnX;
        this.numberOfCellOnY = numberOfCellOnY;
        this.totalNumberOfCells = this.numberOfCellOnX * this.numberOfCellOnY;

        this.numberOfObstacles = numberOfObstacles;
        this.numberOfWeapons = numberOfWeapons;

        this.mapArray = [];

        this.generateMap();
    }

    // Définit les coordX et coordY de chaque cellule puis ajoute chaque cellule dans le mapArray
    generateMap() {
        
        for (let i = 0; i < this.totalNumberOfCells; i++) {
            let newCell = new Cell(i % this.numberOfCellOnX, Math.trunc(i / this.numberOfCellOnX));
            this.mapArray.push(newCell);
        }
        this.addObstacles();
    }

    // Les quatres fonctions suivantes aideront plus tard à placer les obstacles, les armes et les joueurs sur la grille : ils renvoient une seule cellule, ou une sélection des cellules
    findCell(x, y) {
        return this.mapArray.find((cell) => cell.coordX === x && cell.coordY === y);
    }

    returnEmptyCells() {
        return this.mapArray.filter((cell) => cell.cellContent === "0");
    }

    returnCellsForObstacles() {
        return this.mapArray.filter((cell) => cell.cellContent === "0" && cell.diagonalOfObstacle === false);
    }

    returnCellsForPlayer() {
        return this.mapArray.filter((cell) => cell.cellContent === "0" && cell.securityCell === false);
    }

    // Place chaque obstacle sur une cellule aléatoire
    addObstacles() {
        for (let i = 0; i < this.numberOfObstacles; i++) {
            let emptyCells = this.returnCellsForObstacles();
            let index = Math.floor(Math.random() * emptyCells.length);
            emptyCells[index].cellContent = "Obstacle";

            // Stocke les cellules diagonales pour éviter les obstacles bloquant les mouvements des autres joueurs
            let diagonalCells = [];
            let obstacleCell = emptyCells[index];

            if (obstacleCell.coordY - 1 >= 0 && obstacleCell.coordX + 1 < this.numberOfCellOnX) { // en haut à droite
                this.findCell(obstacleCell.coordX + 1, obstacleCell.coordY - 1).diagonalOfObstacle = true;
                diagonalCells.push(this.findCell(obstacleCell.coordX + 1, obstacleCell.coordY - 1));
            }
            if (obstacleCell.coordX + 1 < this.numberOfCellOnX && obstacleCell.coordY + 1 < this.numberOfCellOnY) { // en bas à droite
                this.findCell(obstacleCell.coordX + 1, obstacleCell.coordY + 1).diagonalOfObstacle = true;
                diagonalCells.push(this.findCell(obstacleCell.coordX + 1, obstacleCell.coordY + 1));
            }
            if (obstacleCell.coordY + 1 < this.numberOfCellOnY && obstacleCell.coordX - 1 >= 0) { // en bas à gauche
                this.findCell(obstacleCell.coordX - 1, obstacleCell.coordY + 1).diagonalOfObstacle = true;
                diagonalCells.push(this.findCell(obstacleCell.coordX - 1, obstacleCell.coordY + 1));
            }
            if (obstacleCell.coordX - 1 >= 0 && obstacleCell.coordY - 1 >= 0) { // en haut à gauche
                this.findCell(obstacleCell.coordX - 1, obstacleCell.coordY - 1).diagonalOfObstacle = true;
                diagonalCells.push(this.findCell(obstacleCell.coordX - 1, obstacleCell.coordY - 1));
            }
        }
        this.addWeapons();
    }

    // Place chaque arme sur une cellule disponible au hasard
    addWeapons() {
        for (let i = 0; i < this.numberOfWeapons; i++) {
            let emptyCells = this.returnEmptyCells();
            let index = Math.floor(Math.random() * emptyCells.length);
            emptyCells[index].cellContent = "Weapon";
            emptyCells[index].weaponOnCell = weaponsArray[i];
        }
        this.addPlayers();
    }

    // Place chaque joueur sur une cellule disponible au hasard
    addPlayers() {
        for (let i = 0; i < playersArray.length; i++) {
            let emptyCells = this.returnCellsForPlayer();
            let index = Math.floor(Math.random() * emptyCells.length);
            let playerCell = emptyCells[index];

            playerCell.cellContent = "Player";
            playerCell.playerOnCell = playersArray[i];
            playersArray[i].playerCell = playerCell;

            // Attribue un périmètre de sécurité autour de la cellule du joueur
            let securityZone = [];

            if (playerCell.coordX + 1 < this.numberOfCellOnX) { // droit
                securityZone.push(this.findCell(playerCell.coordX + 1, playerCell.coordY));
                this.findCell(playerCell.coordX + 1, playerCell.coordY).securityCell = true;
            }
            if (playerCell.coordY + 1 < this.numberOfCellOnY) { // en bas
                securityZone.push(this.findCell(playerCell.coordX, playerCell.coordY + 1));
                this.findCell(playerCell.coordX, playerCell.coordY + 1).securityCell = true;
            }
            if (playerCell.coordX - 1 >= 0) { // à gauche
                securityZone.push(this.findCell(playerCell.coordX - 1, playerCell.coordY));
                this.findCell(playerCell.coordX - 1, playerCell.coordY).securityCell = true;
            }
            if (playerCell.coordY - 1 >= 0) { // haut
                securityZone.push(this.findCell(playerCell.coordX, playerCell.coordY - 1));
                this.findCell(playerCell.coordX, playerCell.coordY - 1).securityCell = true;
            }
            playersArray[i].securityZone = securityZone;
        }
        this.getCellsToGo();
    }

    // Fait des boucles dans quatre directions autour de la cellule du joueur, si les cellules sont libres, elles deviennent accessibles
    getCellsToGo() {
        let cellsToGo = [];
        let playerCell = activePlayer.playerCell;

        for (let i = 1; i <= 3; i++) { // droit
            if (playerCell.coordX + i < this.numberOfCellOnX) {
                let cellRight = this.findCell(playerCell.coordX + i, playerCell.coordY);

                if (cellRight.cellContent !== "Obstacle" && cellRight.playerOnCell === null) {
                    cellRight.cellToGo = true;
                    cellsToGo.push(cellRight);
                } else {
                    break;
                }
            }
        }

        for (let i = 1; i <= 3; i++) { // en bas
            if (playerCell.coordY + i < this.numberOfCellOnY) {
                let cellDown = this.findCell(playerCell.coordX, playerCell.coordY + i);

                if (cellDown.cellContent !== "Obstacle" && cellDown.playerOnCell === null) {
                    cellDown.cellToGo = true;
                    cellsToGo.push(cellDown);
                } else {
                    break;
                }
            }
        }

        for (let i = 1; i <= 3; i++) { // à gauche
            if (playerCell.coordX - i >= 0) {
                let cellLeft = this.findCell(playerCell.coordX - i, playerCell.coordY);

                if (cellLeft.cellContent !== "Obstacle" && cellLeft.playerOnCell === null) {
                    cellLeft.cellToGo = true;
                    cellsToGo.push(cellLeft);
                } else {
                    break;
                }
            }
        }

        for (let i = 1; i <= 3; i++) { // haut
            if (playerCell.coordY - i >= 0) {
                let cellUp = this.findCell(playerCell.coordX, playerCell.coordY - i);

                if (cellUp.cellContent !== "Obstacle" && cellUp.playerOnCell === null) {
                    cellUp.cellToGo = true;
                    cellsToGo.push(cellUp);
                } else {
                    break;
                }
            }
        }
        activePlayer.cellsToGo = cellsToGo;
    }
}