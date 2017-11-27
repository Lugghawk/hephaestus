import "reflect-metadata"

import { Entity, Column, createConnection, PrimaryColumn } from "typeorm";
import { Connection } from "typeorm/connection/Connection";
import { Repository } from "typeorm/repository/Repository";
import { DestinyItem, DestinyItemFactory, DestinyItemWeapon, DestinyItemArmor } from "../entity/DestinyItem"
import { PartialGuild } from "discord.js";


@Entity("DestinyInventoryItemDefinition")
export class DestinyInventoryItemDefinition {
    @PrimaryColumn()
    id: number;

    @Column()
    json: string;
}
export class DestinyItemMigrator {
    itemRepo: Repository<DestinyItem>;
    weaponRepo: Repository<DestinyItemWeapon>;
    armorRepo: Repository<DestinyItemArmor>;
    addItem(item: DestinyItem): Promise<DestinyItem> {
        if (item.getType() == "Item") return this.itemRepo.save(item);   
        if (item.getType() == "Weapon") return this.weaponRepo.save(item);
        if (item.getType() == "Armor") return this.armorRepo.save(item);
    }
    async clearPostGres(connection: Connection){
        this.itemRepo.clear(); //Clear the weapon repo.
        this.weaponRepo.clear();
        this.armorRepo.clear();
    }
    migrate(connection: Connection) {
        this.itemRepo = connection.getRepository(DestinyItem);
        this.weaponRepo = connection.getRepository(DestinyItemWeapon);
        this.armorRepo = connection.getRepository(DestinyItemArmor);
        this.clearPostGres(connection);
        createConnection({
            name: "destiny_sqlite",
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
                        this.addItem(destinyItem).then((addedItem) => {
                        console.log("added: " + destinyItem);
                    });
                    }catch (e){ console.log(`Something bad happened importing ${jsonItem.displayProperties.name}: ${e}`)}
                }
            })
        }).catch
    }
}