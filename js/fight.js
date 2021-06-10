class Fight {
    constructor(activePlayer) {
        this.activePlayer = activePlayer;
        this.target = activePlayer === player1 ? player2 : player1;
    }

    // Modifie l'interface Html et appelle la fonction fight()
    startFight() {
        // Affiche les boutons du combat
        $(`.${this.activePlayer.toString()}button`).css("visibility", "visible");
        $(".fighting-player-image").attr({ src: `img/${this.activePlayer.toString()}.png` });

        // Ouvre le #fightModal
        $(".fighting-player-name").html(`${activePlayer.name}`);
        $("#fightModal").modal();

        // Modifie l'interface Html en cliquant sur le bouton #fightModal
        $(".start-fight").on("click", () => {
            $(`.${this.activePlayer.toString()}button.battle-button:first-child`).addClass("red-pulse");
            $(`.${this.activePlayer.toString()}button.battle-button:nth-child(2)`).addClass("blue-pulse");
            $(".obstacle").css("background-color", "rgba(220, 157, 80, 0.4)");
            $(".obstacle").css("box-shadow", "1px 1px 2px rgb(220, 157, 80)");
            $(".obstacle").removeClass("obstacle");
            $(".cellstogo").removeClass("cellstogo");
            $(".weapon10").removeClass("weapon10");
            $(".weapon20").removeClass("weapon20");
            $(".weapon30").removeClass("weapon30");
            $(".weapon40").removeClass("weapon40");
            $(".weapon50").removeClass("weapon50");
            $(".cell").not($(".cell.player1")).not($(".cell.player2")).addClass("fight");
        });

        this.fight();
    }

    // Attache les gestionnaires d'événements aux boutons du combat
    fight() {
        // En cliquant sur "Attaquer" :
        $(`.${this.activePlayer.toString()}button.battle-button:first-child`).on("click", function () {
                this.battleButtonsOff();
                this.playerAttack();
            }.bind(this)
        );

        // En cliquant sur "Défendre" :
        $(`.${this.activePlayer.toString()}button.battle-button:nth-child(2)`).on("click", function () {
                this.battleButtonsOff();
                this.playerDefense();
            }.bind(this)
        );
    }

    // Supprime les gestionnaires d'événements de tous les boutons du combat
    battleButtonsOff() {
        $(".player1button.battle-button:first-child").off();
        $(".player1button.battle-button:nth-child(2)").off();
        $(".player2button.battle-button:first-child").off();
        $(".player2button.battle-button:nth-child(2)").off();
    }

    playerAttack() {
       // Résumés des points de vie des joueurs et des changements de l'interface des points de vie
        if (this.target.defense === true) {
            this.target.life -= this.activePlayer.weapon.damage / 2;
            this.target.defense = false;
            $(`#${this.target.toString()}-life-bg`).css("background-color", "#D82101");
            $(`.${this.target.toString()}-tiny-heart`).attr({ src: "img/Heart.png" });
        } else {
            this.target.life -= this.activePlayer.weapon.damage;
        }
        $(`#${this.target.toString()}-life-bg`).css("width", `${this.target.life}%`);
        $(`#${this.target.toString()}-pts`).html(`${this.target.life}`);

        this.checkVictory();
    }

    playerDefense() {
        this.activePlayer.defense = true;

        // Modifie l'interface des points de vie des joueurs actifs :
        $(`#${this.activePlayer.toString()}-life-bg`).css("background-color", "#3838C1");
        $(`.${this.activePlayer.toString()}-tiny-heart`).attr({ src: "img/HeartBlue.png" });

        this.changeTurn();
    }

    // En cas de victoire : modification de l'interface, demande d'une nouvelle partie, ou la fin de l'exécution de la fonction
    checkVictory() {
        if (this.target.life <= 0) {
            $(`#${this.target.toString()}-life-bg`).css("width", "0%");
            $(`#${this.target.toString()}-pts`).html("0");

            $(".winner-image").attr({ src: `img/${this.activePlayer.toString()}.png` });
            $(".winner-name").html(`${this.activePlayer.name}`);
            $("#winnerModal").modal();

            $(".reload-btn").on("click", () => {
                document.location.reload(true);
            });
            return;
        } else {
            this.changeTurn();
        }
    }

    changeTurn() {
        // Bascule l'affichage des boutons de combat :
        $(`.${this.activePlayer.toString()}button.battle-button:first-child`).removeClass("red-pulse");
        $(`.${this.activePlayer.toString()}button.battle-button:nth-child(2)`).removeClass("blue-pulse");
        $(`.${this.activePlayer.toString()}button`).css("visibility", "hidden");
        $(`.${this.target.toString()}button`).css("visibility", "visible");
        $(`.${this.target.toString()}button.battle-button:first-child`).addClass("red-pulse");
        $(`.${this.target.toString()}button.battle-button:nth-child(2)`).addClass("blue-pulse");

        // Tournez-vous pour jouer :
        this.activePlayer = this.target;
        this.target = this.activePlayer === player1 ? player2 : player1;
        this.fight();
    }
}