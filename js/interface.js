class Interface {
    constructor(map) {
        this.map = map;
    }

    // Affiche la carte en format Html
    displayMapHtml() {
        const grid = $("#grid");
        let gridLine = "";
        let gridCell = "";
        let k = 0;

        // Prépare une valeur CSS qui sera utilisée dans la boucle, pour attribuer une largeur égale à chaque cellule
        const cssWidth = (100 / map.numberOfCellOnX) * 0.75 + "%";
        let widthInPx = null;

        // Crée de nouvelles lignes sur Y
        for (let i = 0; i < map.numberOfCellOnY; i++) {
            gridLine = $(`<div class='gridline' id='line${i}'></div>`);
            grid.append(gridLine);

            // A l'intérieur de chaque ligne, crée de nouvelles cellules sur X
            for (let j = 0; j < map.numberOfCellOnX; j++) {
                gridCell = $(`<div class='cell' id='${k}'></div>`);
                gridLine.append(gridCell);

                // Place l'attribut CSS correspondant aux données de chaque cellule
                if (map.mapArray[k].cellContent === "Obstacle") {
                    gridCell.addClass("obstacle");
                    gridCell.css("box-shadow", "none");
                    gridCell.css("background-color", "transparent");
                }
                if (map.mapArray[k].weaponOnCell) {
                    gridCell.addClass(map.mapArray[k].weaponOnCell.toString());
                }
                if (map.mapArray[k].playerOnCell) {
                    gridCell.addClass(map.mapArray[k].playerOnCell.toString());
                }
                if (map.mapArray[k].cellToGo === true) {
                    gridCell.addClass("cellstogo");
                }

                k++;

                // Fixe la hauteur des cellules égale à la largeur de la première cellule, puis attribue la même hauteur et la même largeur à chaque cellule
                gridCell.css("width", cssWidth);
                if (widthInPx === null) {
                    widthInPx = document.getElementById("0").offsetWidth + "px";
                }
                gridCell.css("height", widthInPx);
            }
        }

        // Garde la largeur et la hauteur égales lors du redimensionnement de la fenêtre du navigateur
        window.addEventListener("resize", () => {
            widthInPx = document.getElementById("0").offsetWidth + "px";
            $(".cell").css("height", widthInPx);
        });
    }
}