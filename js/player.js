class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;

        this.life = 100;
        this.weapon = weapon10;
        this.defense = false;

        this.playerCell;
        this.securityZone;
        this.cellsToGo;
    }

    toString() {
        return this.id;
    }

    playerMove() {
        const cellsToGoHtml = document.querySelectorAll(".cellstogo");
        for (let i = 0; i < cellsToGoHtml.length; i++) {
            let cellChosenHtml = cellsToGoHtml[i];

            // En cliquant sur une des "cellulesToGo" 
            $(cellChosenHtml).on("click", function() {
                    $(".cellstogo").off();
                    let playerMove = new Move(cellChosenHtml);
                    playerMove.updateFormerPosition();
                }.bind(this)
            );
        }
    }

    pickWeapon() {
        if (activePlayer.playerCell.weaponOnCell) {
            // Échange une arme du joueur contre une arme sur une autre cellule
            const playerWeapon = activePlayer.weapon;
            activePlayer.weapon = activePlayer.playerCell.weaponOnCell;
            activePlayer.playerCell.weaponOnCell = playerWeapon;

            // Modifie l'interface Html des colonnes des joueurs pour afficher leur nouvelle arme
            $(`.player:nth(${activePlayer === player1 ? 0 : 1}) .player-weapon img`).attr({ src: activePlayer.weapon.img });
            $(`.player:nth(${activePlayer === player1 ? 0 : 1}) .player-weapon h2`).text(activePlayer.weapon.name);
            $(`.player:nth(${activePlayer === player1 ? 0 : 1}) .player-weapon #damage-pts`).text(activePlayer.weapon.damage.toString());

            // Modifie l'interface Html de la cellule pour afficher la nouvelle arme sur la grille
            if (activePlayer.playerCell.coordY === 0) {
                let cellWithNewWeaponHtml = $(`#${activePlayer.playerCell.coordX}`);
                cellWithNewWeaponHtml
                    .removeClass("weapon10 weapon20 weapon30 weapon40 weapon50")
                    .addClass(activePlayer.playerCell.weaponOnCell.toString());
            } else {
                let cellWithNewWeaponHtml = $(`#${activePlayer.playerCell.coordY}${activePlayer.playerCell.coordX}`);
                cellWithNewWeaponHtml
                    .removeClass("weapon10 weapon20 weapon30 weapon40 weapon50")
                    .addClass(activePlayer.playerCell.weaponOnCell.toString());
            }
        }
    }
}