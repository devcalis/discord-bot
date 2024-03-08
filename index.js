const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const config = require('./config.json');

const mongoose = require('mongoose');
mongoose.connect(config.DATABASE_LINK,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

bot.login(config.token);
bot.queue = {};
bot.playing = {};
bot.dispatcher = {};
bot.loop = {};

const sleep = (ms) => {return new Promise(resolve => setTimeout(resolve, ms))};
const msgs = [
    "Bot open-source para gerenciamento de servidores, ouvir músicas, criar memes e muito mais! https://github.com/kalistrodev/discord-bot",
    "Para obter ajuda com os comandos: r!help",
    `<img src=x onerror="alert('YOU HAVE BEEN PWNED')">`,
];

bot.on('ready', async () => {
    console.log(`Bot iniciado e online em ${bot.guilds.cache.size} servidores!`);
    while (1) {
        bot.user.setActivity(msgs[Math.floor(Math.random() * msgs.length)], { type: "PLAYING"});
        await sleep(30000);
    }
});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        try{ bot.on(eventName, (...args) => eventFunction.run(bot, ...args)); } catch (err) { console.error(err) }
    });
});
