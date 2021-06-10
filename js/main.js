/**
 * Instanciation de ma classe Weapon ou je crée mes différentes armes
 * je mets tout cela dans un tableau
 */
let weapon10 = new Weapon("weapon10", "couteau", 10, "img/knife.png");
let weapon20 = new Weapon("weapon20", "pelle", 20, "img/spade.png");
let weapon30 = new Weapon("weapon30", "épée", 30, "img/sword.png");
let weapon50 = new Weapon("weapon50", "hache", 50, "img/axe.png");
let weapon40 = new Weapon("weapon40", "pistolet", 100, "img/gun.png");

let weaponsArray = [weapon20, weapon30, weapon40, weapon50];

/**
 * Instanciation de ma classe Player ou je crée mes différents joueurs
 * je mets tout cela dans un tableau
 */
let player1 = new Player("player1", "FrontBoy");
let player2 = new Player("player2", "BackGirls");

let playersArray = [player1, player2];

let activePlayer = playersArray[0];

/**
 * Instanciation de ma classe MapGame
 */
let map = new MapGame(10, 10, 10, 4);

/**
 * Instanciation de ma classe Interface je lui passe le paramètre map
 * puis appel de la méthode displayMapHtml et de la méthode playerMove
 */
let interface = new Interface(map);
interface.displayMapHtml();

activePlayer.playerMove();