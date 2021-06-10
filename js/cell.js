class Cell {
    constructor(coordX, coordY) {
        this.coordX = coordX;
        this.coordY = coordY;

        this.cellContent = "0";
        this.weaponOnCell = null;
        this.playerOnCell = null;

        this.diagonalOfObstacle = false;
        this.securityCell = false;
        this.cellToGo = false;
    }
}