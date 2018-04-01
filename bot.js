"use strict";
exports.__esModule = true;
var Discord = require("discord.js");
var Config = require('./config.json');
// instantiate client
var client = new Discord.Client();
var str = '';
client.on('ready', function () {
    client.channels.array().forEach(function (channel) {
        client.sendMessage(channel, 'Don\'t stop chopping until the pieces stop wriggling.');
    });
});
client.on('message', function (msg) {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
});
client.login(Config.token);
