const express = require('express');
const router = express.Router();
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Discord bot is online!');
});

router.post('/sendMessage', async (req, res) => {
    const { channelId, message } = req.body;
    const channel = await client.channels.fetch(channelId);
    if (channel) {
        channel.send(message);
        res.status(200).send('Message sent');
    } else {
        res.status(404).send('Channel not found');
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = router;
