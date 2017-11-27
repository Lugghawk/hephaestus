import {Message} from 'discord.js'
import "reflect-metadata"
import { DestinyItem, DestinyItemWeapon, DestinyItemArmor } from "./entity/DestinyItem"
import {createConnection} from "typeorm";
import { Repository } from 'typeorm/repository/Repository';
import { ItemInfoMessage } from './messages/item_info_message';
import { Connection } from 'typeorm/connection/Connection';
import { DestinyItemMigrator } from './migration/migrator';

const Discord = require('discord.js')
const client = new Discord.Client();

var itemRepo: Repository<DestinyItem>;
var weaponRepo: Repository<DestinyItemWeapon>;
var armorRepo: Repository<DestinyItemArmor>;

const inlineBacktickRegexp = new RegExp(/`(.*?)`/g)
const backtickRegexp = new RegExp(/`/g);

function migrateRequired(connection: Connection): Promise<boolean> {
  return connection.getRepository(DestinyItem).createQueryBuilder().getMany().then(items => items.length == 0);
}
createConnection().then(async connection => {
  const doMigrate = await migrateRequired(connection);
  if (doMigrate) {
    const migrator = new DestinyItemMigrator();
    migrator.migrate(connection);
  }
  itemRepo = connection.getRepository(DestinyItem);
  armorRepo = connection.getRepository(DestinyItemArmor);
  weaponRepo = connection.getRepository(DestinyItemWeapon);

  console.log("Configured Database");
});
client.on('ready', () => { 
  console.log ("Logged in!"); 
  client.user.setPresence({
    status: "online",
    game: {
      name: "Armory"
    }
  });
  if (client.user.username != "Hephaestus") client.user.setUsername("Hephaestus");
});

function fetchOneItem<T>(item: string, repo: Repository<T> ): Promise<T> {
  return repo.createQueryBuilder().where("LOWER(name) = LOWER(:item)", {item}).getOne().catch();
}

client.on('message', (message: Message) => {
  console.log("Incoming Message: " + message.content);
  if (client.user != message.author){
    var matches = {};
    while(matches = inlineBacktickRegexp.exec(message.content)){
      var match = matches[1].replace(backtickRegexp, "");
      fetchOneItem(match, itemRepo).then(async item => {
        if (item == null) return;
        message.reply('', {embed: ItemInfoMessage.createItemInfoMessage(item)})
      });
      fetchOneItem(match, weaponRepo).then(async item => {
        if (item == null) return;
        message.reply('', {embed: ItemInfoMessage.createWeaponInfoMessage(item)})
      });
      fetchOneItem(match, armorRepo).then(async item => {
        if (item == null) return;
        message.reply('', {embed: ItemInfoMessage.createArmorInfoMessage(item)})
      });
    }
  }
});
client.login(process.env.BOT_TOKEN)
