import { DestinyItem } from "../entity/DestinyItem"
import { RichEmbed } from "discord.js"

export class ItemInfoMessage {
    public static create(item: DestinyItem): RichEmbed {
        const embed = new RichEmbed();
        embed.addField("Name", item.name, true);
        embed.addField("Description", item.description, true);
        embed.addField("Type", item.itemTypeAndDisplayName, true);
        if (item.rarity == "Legendary") embed.setColor("PURPLE");
        if (item.rarity == "Rare") embed.setColor("BLUE");
        if (item.rarity == "Exotic") embed.setColor("GOLD");

        embed.setImage("http://bungie.net" + item.iconUrl);
        return embed;
    }
}