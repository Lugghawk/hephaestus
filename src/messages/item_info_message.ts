import { DestinyItem, DestinyItemWeapon, DestinyItemArmor } from "../entity/DestinyItem"
import { RichEmbed } from "discord.js"

export class ItemInfoMessage {
    public static createItemInfoMessage(item: DestinyItem): RichEmbed {
        return ItemInfoMessage.getBaseEmbed(item);
    }


    public static createArmorInfoMessage(armor: DestinyItemArmor): RichEmbed {
        const embed = ItemInfoMessage.getBaseEmbed(armor);

        embed.addField("Mobility", armor.mobility, true);
        embed.addField("Resilience", armor.resilience, true);
        embed.addField("Recovery", armor.recovery, true);
        return embed;
    }

    public static createWeaponInfoMessage(weapon: DestinyItemWeapon): RichEmbed {
        const embed = ItemInfoMessage.getBaseEmbed(weapon);
        embed.addField("Impact", weapon.impact +"/100", true);
        embed.addField("Stability", weapon.stability +"/100", true);
        embed.addField("Magazine", weapon.magazine, true);
        embed.addField("RPM", weapon.roundsPerMinute, true);      
        return embed;
    }

    private static getBaseEmbed(item: DestinyItem): RichEmbed {
        const embed = new RichEmbed();
        embed.addField("Name", item.name);
        embed.addField("Description", item.description);
        embed.addField("Type", item.itemTypeAndDisplayName, true);
        ItemInfoMessage.setColor(embed, item);
        embed.setThumbnail("http://bungie.net" + item.iconUrl);
        return embed;
    }
    private static setColor(embed: RichEmbed, item: DestinyItem) {
        if (item.rarity == "Legendary") embed.setColor("PURPLE");
        if (item.rarity == "Rare") embed.setColor("BLUE");
        if (item.rarity == "Exotic") embed.setColor("GOLD");
    }
}