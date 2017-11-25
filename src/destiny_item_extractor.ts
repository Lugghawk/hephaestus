import "reflect-metadata"

import { Entity, Column, createConnection, PrimaryColumn } from "typeorm";
import { Connection } from "typeorm/connection/Connection";
import { Repository } from "typeorm/repository/Repository";
import { DestinyItem, DestinyItemFactory, DestinyItemWeapon, DestinyItemArmor } from "./entity/DestinyItem"
import { PartialGuild } from "discord.js";


@Entity("DestinyInventoryItemDefinition")
export class DestinyInventoryItemDefinition {
    @PrimaryColumn()
    id: number;

    @Column()
    json: string;
}
class DestinyItemMigrator {

    itemRepo: Repository<DestinyItem>;
    weaponRepo: Repository<DestinyItemWeapon>;
    armorRepo: Repository<DestinyItemArmor>;
    constructor(connection: Connection) {
        this.itemRepo = connection.getRepository(DestinyItem);
        this.weaponRepo = connection.getRepository(DestinyItemWeapon);
        this.armorRepo = connection.getRepository(DestinyItemArmor);
        this.itemRepo.clear(); //Clear the weapon repo.
        this.weaponRepo.clear();
        this.armorRepo.clear();
    }
    addItem(item: DestinyItem): Promise<DestinyItem> {
        if (item.getType() == "Item") return this.itemRepo.save(item);   
        if (item.getType() == "Weapon") return this.weaponRepo.save(item);
        if (item.getType() == "Armor") return this.armorRepo.save(item);
    }
}
var migrator: Promise<DestinyItemMigrator> = new Promise<DestinyItemMigrator>((resolve, reject) => {
    createConnection().then(async connection => {
        try {
            console.log("creating item migrator");
            resolve(new DestinyItemMigrator(connection));
        } catch (e) { reject (e) };
    });
});
createConnection({
    type: "sqlite",
    database: "destiny_world_sql_content",
    synchronize: true,
    logging: false,
    entities: [
        DestinyInventoryItemDefinition
    ]
}).then(async connection => {
    const repo = await connection.getRepository(DestinyInventoryItemDefinition);
    const items = await repo.find()

    items.forEach(item => {
        var jsonItem = JSON.parse(item.json)
        if (["Legendary", "Exotic", "Rare"].indexOf(jsonItem.inventory.tierTypeName) > -1){
            try {
                var destinyItem: DestinyItem = DestinyItemFactory.create(jsonItem);
                if (destinyItem.itemTypeAndDisplayName == null) return;
                migrator.then(destinyItemMigrator => {
                    destinyItemMigrator.addItem(destinyItem).then((addedItem) => {
                    console.log("added: " + destinyItem);
                }).catch((error) => {
                    console.log("error: " + error);
                });
            });
            }catch (e){ console.log(`Something bad happened importing ${jsonItem.displayProperties.name}: ${e}`)}
        }
    })
}).catch