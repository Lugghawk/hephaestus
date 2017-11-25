import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { watch } from "fs";

export class DestinyItemFactory {

    static create(json: any): DestinyItem{
        return DestinyItemFactory.getItemObject(json);
    }

    private static getItemObject(json: any): DestinyItem {
        const itemType = json.itemTypeDisplayName;
        if (DestinyItemWeapon.types.indexOf(itemType) > -1) return new DestinyItemWeapon(json);
        if (DestinyItemArmor.types.indexOf(itemType) > -1) return new DestinyItemArmor(json);
        return new DestinyItem(json);
    }
}

@Entity()
export class DestinyItem {

    constructor(json: any){
        if (json == undefined) return;
        this.id = json.hash;
        this.name = json.displayProperties.name;
        this.description = json.displayProperties.description;
        if (json.displayProperties.icon == null) {
            this.iconUrl = "";
        } else {
            this.iconUrl = json.displayProperties.icon;
        }
        this.itemTypeAndDisplayName = json.itemTypeDisplayName;
        this.rarity = json.inventory.tierTypeName;
    }

    @PrimaryGeneratedColumn({type:"bigint"})
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    iconUrl: string;

    @Column()
    itemTypeAndDisplayName: string;

    @Column()
    rarity: string;


    public getType() { return "Item" }

    public toString = () : string => {
        return `
        id: ${this.id}
        name: ${this.name}
        description: ${this.description}
        iconUrl: ${this.iconUrl}
        itemTypeAndDisplayName: ${this.itemTypeAndDisplayName},
        rarity: ${this.rarity}`
    }
}

@Entity()
export class DestinyItemArmor extends DestinyItem {

    constructor(json :any){
        super(json);
        if (json == undefined) return;
        if (json.stats == undefined) return;
        this.populateStats(json.stats.stats);
    }
    static types: Array<string> = [
        "Gauntlets",
        "Warlock Bond",
        "Titan Mark",
        "Leg Armor",
        "Hunter Cloak",
        "Helmet",
        "Chest Armor"
    ]

    private populateStats(jsonStats: any){
        this.mobility=jsonStats["2996146975"] != null ? jsonStats["2996146975"].value : null;
        this.resilience=jsonStats["392767087"] != null ? jsonStats["392767087"].value : null;
        this.recovery=jsonStats["1943323491"] != null ? jsonStats["1943323491"].value : null;
    }

    public getType(){ return "Armor" }
    @Column({nullable: true})
    mobility: number;

    @Column({nullable: true})
    resilience: number;

    @Column({nullable: true})
    recovery: number;
}

@Entity()
export class DestinyItemWeapon extends DestinyItem {

    constructor(json :any) {
        super(json);
        if (json == undefined) return;
        if (json.stats == undefined) return;
        this.populateStats(json.stats.stats);
    }

    private populateStats(jsonStats: any){
        console.log("Weapon Stats " + JSON.stringify(jsonStats));
        this.chargeTime = jsonStats["2961396640"] != null ? jsonStats["2961396640"].value : null;
        this.roundsPerMinute = jsonStats["4284893193"] != null ? jsonStats["4284893193"].value : null; 
        this.impact = jsonStats["4043523819"] != null ? jsonStats["4043523819"].value : null;
        this.range = jsonStats["1240592695"] != null ? jsonStats["1240592695"].value : null;
        this.stability = jsonStats["155624089"] != null ? jsonStats["155624089"].value : null;
        this.handling = jsonStats["943549884"] != null ? jsonStats["943549884"].value : null;
        this.reloadSpeed = jsonStats["4188031367"] != null ? jsonStats["4188031367"].value : null;
        this.aimAssist = jsonStats["1345609583"] != null ? jsonStats["1345609583"].value : null;
        this.magazine = jsonStats["3871231066"] != null ? jsonStats["3871231066"].value : null;
        this.zoom = jsonStats["3555269338"] != null ? jsonStats["3555269338"].value : null;
    }

    public getType() { return "Weapon" }
    static types: Array<string> = [
        "Auto Rifle", 
        "Scout Rifle", 
        "Submachine Gun",
        "Rocket Launcher",
        "Fusion Rifle",
        "Sidearm",
        "Trace Rifle",
        "Pulse Rifle",
        "Shotgun",
        "Grenade Launcher",
        "Hand Cannon",
        "Sniper Rifle",
        "Linear Fusion Rifle",
        "Blade",
        "Sword"
        ]

    @Column({nullable: true})
    chargeTime: number;

    @Column({nullable: true})
    roundsPerMinute: number;

    @Column({nullable: true})
    impact: number;

    @Column({nullable: true})
    range: number;

    @Column({nullable: true})
    stability: number;

    @Column({nullable: true})
    handling: number;

    @Column({nullable: true})
    reloadSpeed: number;

    @Column({nullable: true})
    aimAssist: number;

    @Column({nullable: true})
    magazine: number;

    @Column({nullable: true})
    zoom: number;

}