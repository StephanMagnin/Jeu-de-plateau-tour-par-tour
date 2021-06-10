class Move {
    constructor(cellChosenHtml) {
        this.cellChosenHtml = cellChosenHtml;
        this.formerCell;
        this.cellChosen;
    }

    updateFormerPosition() {
        // Modifie l'interface Html de l'ancienne cellule du joueur :
        if (activePlayer === player1) {
            document.querySelector(".player1").classList.remove("player1");
        } else {
            document.querySelector(".player2").classList.remove("player2");
        }

        // Supprime les informations impliquant l'ancienne cellule du joueur dans les classes d'objets :
        this.formerCell = activePlayer.playerCell;
        activePlayer.playerCell.cellContent = "0";
        activePlayer.playerCell.playerOnCell = null;

        // Initialise la zone de sécurité du joueur :
        for (let i = 0; i < activePlayer.securityZone.length; i++) {
            activePlayer.securityZone[i].securityCell = false;
        }
        activePlayer.securityZone = [];

        // Initialise les cellules du joueur ou il peut aller :
        $(".cellstogo").removeClass("cellstogo");
        for (let i = 0; i < activePlayer.cellsToGo.length; i++) {
            activePlayer.cellsToGo[i].cellToGo = false;
        }
        activePlayer.cellsToGo = [];

        this.updateNewPosition();
    }

    updateNewPosition() {
        // Modifications de l'interface Html de la nouvelle cellule du joueur :
        if (activePlayer === player1) {
            this.cellChosenHtml.classList.add("player1");
        } else {
            this.cellChosenHtml.classList.add("player2");
        }

        // Modifie les informations impliquant la nouvelle cellule du joueur dans les classes d'objets :
        this.cellChosen = map.mapArray[this.cellChosenHtml.id];
        this.cellChosen.cellContent = "Player";
        this.cellChosen.playerOnCell = activePlayer;
        activePlayer.playerCell = this.cellChosen;

        // Vérifie dans quelle direction le joueur est allé, puis fait des boucles sur chaque cellule couverte pour vérifier si il y avait une arme :
        if (this.formerCell.coordY === this.cellChosen.coordY && this.formerCell.coordX < this.cellChosen.coordX) { // droit
            for (let i = 1; i <= this.cellChosen.coordX - this.formerCell.coordX; i++) {
                activePlayer.playerCell = map.findCell(this.formerCell.coordX + i, this.formerCell.coordY);
                activePlayer.pickWeapon();
            }
        } else if (this.formerCell.coordX === this.cellChosen.coordX && this.formerCell.coordY < this.cellChosen.coordY) { // en bas
            for (let i = 1; i <= this.cellChosen.coordY - this.formerCell.coordY; i++) {
                activePlayer.playerCell = map.findCell(this.formerCell.coordX, this.formerCell.coordY + i);
                activePlayer.pickWeapon();
            }
        } else if (this.formerCell.coordY === this.cellChosen.coordY && this.formerCell.coordX > this.cellChosen.coordX) { // à gauche
            for (let i = 1; i <= this.formerCell.coordX - this.cellChosen.coordX; i++) {
                activePlayer.playerCell = map.findCell(this.formerCell.coordX - i, this.formerCell.coordY);
                activePlayer.pickWeapon();
            }
        } else if (this.formerCell.coordX === this.cellChosen.coordX && this.formerCell.coordY > this.cellChosen.coordY) { // haut
            for (let i = 1; i <= this.formerCell.coordY - this.cellChosen.coordY; i++) {
                activePlayer.playerCell = map.findCell(this.formerCell.coordX, this.formerCell.coordY - i);
                activePlayer.pickWeapon();
            }
        }

        // Calcule la nouvelle zone de sécurité, prend la cellule suivante dans toutes les directions :
        let securityZone = [];
        if (activePlayer.playerCell.coordX + 1 < map.numberOfCellOnX) { // droit
            map.findCell(activePlayer.playerCell.coordX + 1, activePlayer.playerCell.coordY).securityCell = true;
            securityZone.push(map.findCell(activePlayer.playerCell.coordX + 1, activePlayer.playerCell.coordY));
        }
        if (activePlayer.playerCell.coordY + 1 < map.numberOfCellOnY) { // en bas
            map.findCell(activePlayer.playerCell.coordX, activePlayer.playerCell.coordY + 1).securityCell = true;
            securityZone.push(map.findCell(activePlayer.playerCell.coordX, activePlayer.playerCell.coordY + 1));
        }
        if (activePlayer.playerCell.coordX - 1 >= 0) { // à gauche
            map.findCell(activePlayer.playerCell.coordX - 1, activePlayer.playerCell.coordY).securityCell = true;
            securityZone.push(map.findCell(activePlayer.playerCell.coordX - 1, activePlayer.playerCell.coordY));
        }
        if (activePlayer.playerCell.coordY - 1 >= 0) { // haut
            map.findCell(activePlayer.playerCell.coordX, activePlayer.playerCell.coordY - 1).securityCell = true;
            securityZone.push(map.findCell(activePlayer.playerCell.coordX, activePlayer.playerCell.coordY - 1));
        }
        activePlayer.securityZone = securityZone;

        // Si les joueurs sont l'un à côté de l'autre, le combat peut commencer :
        for (let i = 0; i < activePlayer.securityZone.length; i++) {
            if (activePlayer.securityZone[i].cellContent === "Player") {
                let fight = new Fight(activePlayer);
                fight.startFight();
                return;
            }
        }

        this.prepareNextPlayerToMove();
    }

    prepareNextPlayerToMove() {
        // Changement des joueurs :
        activePlayer = activePlayer === player1 ? player2 : player1;

        // Prépare les variables à utiliser dans la partie suivante :
        const checkFreeCell = (cell) => {
            return cell.cellContent !== "Obstacle" && !cell.playerOnCell;
        };
        const becomesCellsToGo = (cell) => {
            cell.cellToGo = true;
            activePlayer.cellsToGo.push(cell);
        };

        // Calcule les cellules du nouveau joueur :
        activePlayer.cellsToGo = [];

        for (let i = 1; i <= 3; i++) { // boucles à droite
            if (activePlayer.playerCell.coordX + i < map.numberOfCellOnX) {
                let cellRight = map.findCell(activePlayer.playerCell.coordX + i, activePlayer.playerCell.coordY);
                if (checkFreeCell(cellRight)) {
                    becomesCellsToGo(cellRight);
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i <= 3; i++) { // boucles vers le bas
            if (activePlayer.playerCell.coordY + i < map.numberOfCellOnY) {
                let cellDown = map.findCell(activePlayer.playerCell.coordX, activePlayer.playerCell.coordY + i);
                if (checkFreeCell(cellDown)) {
                    becomesCellsToGo(cellDown);
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i <= 3; i++) { // boucles à gauche
            if (activePlayer.playerCell.coordX - i >= 0) {
                let cellLeft = map.findCell(activePlayer.playerCell.coordX - i, activePlayer.playerCell.coordY);
                if (checkFreeCell(cellLeft)) {
                    becomesCellsToGo(cellLeft);
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i <= 3; i++) { // en boucle
            if (activePlayer.playerCell.coordY - i >= 0) {
                let cellUp = map.findCell(activePlayer.playerCell.coordX, activePlayer.playerCell.coordY - i);
                if (checkFreeCell(cellUp)) {
                    becomesCellsToGo(cellUp);
                } else {
                    break;
                }
            }
        }

        // Affiche les nouvelles cellules d'ActivePlayerToGo dans l'interface Html :
        for (let i = 0; i < activePlayer.cellsToGo.length; i++) {
            if (activePlayer.cellsToGo[i].coordY === 0) {
                $(`#${activePlayer.cellsToGo[i].coordX}`).addClass("cellstogo");
            } else {
                $(`#${activePlayer.cellsToGo[i].coordY}${activePlayer.cellsToGo[i].coordX}`).addClass("cellstogo");
            }
        }

        // Rappelle la méthode playerMove, afin de cliquer sur un autre "cellToGo"
        activePlayer.playerMove();
    }
}