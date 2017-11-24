import {Message} from 'discord.js'
import "reflect-metadata"
const Discord = require('discord.js')
const client = new Discord.Client();
function greeter(person: string){
  return "Hello, " + person;
}

client.on('ready', () => { console.log ("Logged in!"); });

client.on('message', (message: Message) => {
  if (client.user != message.author){
    console.log ("message: " +message);
    message.reply ("got ya!");
  }
});
client.login(process.env.BOT_TOKEN)
