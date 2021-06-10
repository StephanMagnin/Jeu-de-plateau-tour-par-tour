class Weapon {
    constructor(id, name, damage, img) {
        this.id = id;
        this.name = name;
        this.damage = damage;
        this.img = img;
    }

    toString() {
        return this.id;
    }
}