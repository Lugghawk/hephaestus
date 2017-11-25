import {Message} from 'discord.js'
import "reflect-metadata"
import { DestinyItem, DestinyItemWeapon, DestinyItemArmor } from "./entity/DestinyItem"
import {createConnection} from "typeorm";
import { Repository } from 'typeorm/repository/Repository';
import { ItemInfoMessage } from './messages/item_info_message';

const Discord = require('discord.js')
const client = new Discord.Client();
function greeter(person: string){
  return "Hello, " + person;
}
var itemRepo: Repository<DestinyItem>;
var weaponRepo: Repository<DestinyItemWeapon>;
var armorRepo: Repository<DestinyItemArmor>;
const inlineBacktickRegexp = new RegExp(/`(.*?)`/g)
const backtickRegexp = new RegExp(/`/g);
createConnection().then(async connection => {
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

client.on('message', (message: Message) => {
  console.log("Incoming Message: " + message.content);
  if (client.user != message.author){
    var matches = {};
    while(matches = inlineBacktickRegexp.exec(message.content)){
      var match = matches[1];
      var matched_item = match.replace(backtickRegexp, "");
      itemRepo.findOne({name: match}).then(async item => {
        if (item == null) return;
        message.reply('', {embed: ItemInfoMessage.createItemInfoMessage(item)})
      });
      weaponRepo.findOne({name: match}).then(async item => {
        if (item == null) return;
        message.reply('', {embed: ItemInfoMessage.createWeaponInfoMessage(item)})
      });
      armorRepo.findOne({name: match}).then(async item => {
        if (item == null) return;
        message.reply('', {embed: ItemInfoMessage.createArmorInfoMessage(item)})
      });
    }
  }
});
client.login(process.env.BOT_TOKEN)
