import "reflect-metadata"

import { Entity, Column, createConnection, PrimaryColumn } from "typeorm";
import { Connection } from "typeorm/connection/Connection";
import { Repository } from "typeorm/repository/Repository";
import { DestinyItem } from "./entity/DestinyItem"
import { PartialGuild } from "discord.js";


@Entity("DestinyInventoryItemDefinition")
export class DestinyInventoryItemDefinition {
    @PrimaryColumn()
    id: number;

    @Column()
    json: string;
}
class DestinyItemMigrator {

    repo: Repository<DestinyItem>;
    constructor(connection: Connection) {
        this.repo = connection.getRepository(DestinyItem);
        this.repo.clear(); //Clear the weapon repo.
    }
    addItem(item: DestinyItem): Promise<DestinyItem> {
        return this.repo.save(item);
    }

}
var migrator: DestinyItemMigrator;
createConnection().then(async connection => {
    console.log("creating item migrator");
    migrator = new DestinyItemMigrator(connection);
})
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
            var destinyItem: DestinyItem = new DestinyItem();
            destinyItem.id = item.id;
            destinyItem.name = jsonItem.displayProperties.name;
            destinyItem.description = jsonItem.displayProperties.description;
            if (jsonItem.displayProperties.icon == null) {
                destinyItem.iconUrl = "";
            } else {
                destinyItem.iconUrl = jsonItem.displayProperties.icon;
            }
            destinyItem.itemTypeAndDisplayName = jsonItem.itemTypeDisplayName;
            destinyItem.rarity = jsonItem.inventory.tierTypeName;
            migrator.addItem(destinyItem).then((addedItem) => {
                console.log("added: " + destinyItem);
            }).catch((error) => {
                console.log("error: " + error);
            });
        }
    })
}).catch