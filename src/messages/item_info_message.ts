import { DestinyItem } from "../entity/DestinyItem"
import { RichEmbed } from "discord.js"

export class ItemInfoMessage {
    public static create(item: DestinyItem): RichEmbed {
        const embed = new RichEmbed();
        embed.addField("Name", item.name, true);
        embed.addField("Description", item.description, true);
        embed.addField("Type", item.itemTypeAndDisplayName, true);
        return embed;
    }
}