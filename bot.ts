import * as Discord from 'discord.js';
import * as Scry from 'scryfall-sdk';
const Config = require('./config.json');

// instantiate client
const client = new Discord.Client();


let str = '';
client.on('ready', () => {
    console.log('I am reddy');
});

client.on('message', msg => {
    let cards: string[] = getCards(msg.content);
    if(cards && cards.length !== 0) {
        let cardsPromise = getResponsesForCards(cards);
        cardsPromise
        .then(cardResponses => {
            let responseMessage = '\n';
            cardResponses.forEach(cardResponse => {
                responseMessage = responseMessage + cardResponse.name + ': ' + cardResponse.image_uris.normal + '\n';
            });

            msg.reply(responseMessage);
        })
        .catch(error => {
            msg.reply('No cards found =(');
        });
    };
});

client.login(Config.token);

function getResponsesForCards(cards: string[]): Promise<Scry.Card[]> {
    let responses: Promise<Scry.Card>[] = [];
    cards.forEach(card => {
        responses.push(Scry.Cards.byName(card));
    });

    return Promise.all(responses);
}

function getCards(str: string): string[] {
    // card regex
    const regex = /\[\[([^\[\]]*)\]\]/g;
    let m;
    let cards: string[] = [];
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            if (groupIndex == 1)
            {
                cards.push(match);
            }
        });
    }        
    return cards;
}