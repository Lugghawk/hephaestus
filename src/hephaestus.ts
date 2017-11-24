import {Message} from 'discord.js'
import "reflect-metadata"
import { DestinyItem } from "./entity/DestinyItem"
import {createConnection} from "typeorm";
import { Repository } from 'typeorm/repository/Repository';

const Discord = require('discord.js')
const client = new Discord.Client();
function greeter(person: string){
  return "Hello, " + person;
}
var repo: Repository<DestinyItem>;
const inlineBacktickRegexp = new RegExp(/`(.*?)`/g)
const backtickRegexp = new RegExp(/`/g);
createConnection().then(async connection => {
  repo = connection.getRepository(DestinyItem);
  console.log("Configured Database");
});
client.on('ready', () => { console.log ("Logged in!"); });

client.on('message', (message: Message) => {
  console.log("Incoming Message: " + message.content);
  if (client.user != message.author){
    var matches = {};
    while(matches = inlineBacktickRegexp.exec(message.content)){
      var match = matches[1];
      var matched_item = match.replace(backtickRegexp, "");
      repo.find({name: match}).then(async item => {
        if (item.length != 0) message.reply(item);
      });
    }
  }
});
client.login(process.env.BOT_TOKEN)