// librarys/requires
require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require ('openai');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// WARNING FOR WHEN THE BOT IS ONLINE
client.on('ready', () => {
    console.log("The bot is online!");
});

// setup open ai API KEY
const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);


client.on('messageCreate', async (message) => {

    // check if the one who sent the message was the bot
    if (message.author.bot) return;

    // check if the channel id is equal to the channel that the user sent the message
    // if u dont want to limit the bot to only a channel u can comment the IF bellow
    if (message.channel.id !== process.env.CHANNEL_ID) return;

    // list of commands
    comandos = [ "!teste"];

    // check if message is present in list of commands
    if (message.content == comandos[0]){
        message.reply("teste");
    };

    var arrayLength = comandos.length;

    // go back if message is a command
    for (var i = 0; i < arrayLength; i++) {
        if(message.content == comandos[i]) return;
        //Do something
    };

    // chat with the OPEN AI  
    if (message.content.startsWith('!')) {

        let conversationLog = [{ role: 'system', content: "you're a friendly bot"}];

        conversationLog.push({
            role: 'user',
            content: message.content,
        });

        await message.channel.sendTyping();

        const result = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: conversationLog,
        });

        message.reply(result.data.choices[0].message);
    };

});

client.login(process.env.TOKEN);