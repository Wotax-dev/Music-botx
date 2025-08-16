require('dotenv').config(); // <-- add this at the top

module.exports = {
    prefix: '!',
    nodes: [{
    host: "lavalink.devamop.in",
    port: 443,
    password: "youshallnotpass",
    secure: true,
    name: "Backup Node"
    }],

    spotify: {
        clientId: "a568b55af1d940aca52ea8fe02f0d93b",
        clientSecret: "e8199f4024fe49c5b22ea9a3dd0c4789"
    },
    botToken: process.env.BOT_TOKEN, // <-- now read from .env
    
    // Embed colors
    embedColor: 0x00ffff, // cyan for normal embeds
    errorColor: 0xff0033  // neon red for errors
};
