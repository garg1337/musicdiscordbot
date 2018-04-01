import * as Discord from 'discord.js';
import * as Scry from 'scryfall-sdk';
const ytdl = require('ytdl-core');
const Config = require('./config.json');

// instantiate client
const client = new Discord.Client();


let str = '';
client.on('ready', () => {
    console.log('I am reddy');
});

let connection: Discord.VoiceConnection;
let dispatcher: Discord.StreamDispatcher;

client.on('message', async message => {
    if (message.content.indexOf('akornz ') !== 0) {
        return;
    }

    let pieces = message.content.split(' ');

    if (pieces.length < 2) {
        return;
    }

    let command = pieces[1];

    if (command === 'play') {

        if (pieces.length !== 3) {
            message.reply('No track provided!');
            return;
        }

        if (dispatcher) {
            dispatcher.end();
        }

        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voiceChannel) {
            connection = await message.member.voiceChannel.join();
            let track = pieces[2];
            dispatcher = connection.playStream(ytdl(track, {filter: 'audioonly' }));
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    if (command === 'pause') {
        if (dispatcher) {
            console.log('pausing');
            dispatcher.pause();
        }
    }

    if (command === 'stop') {
        if (dispatcher) {
            dispatcher.end();
        }
    }

    if (command === 'resume') {
        if (dispatcher) {
            dispatcher.resume();
        }
    }

    if (command === 'logoff') {
        message.reply('Bye!');
        client.destroy();
    }
});

client.login(Config.token);