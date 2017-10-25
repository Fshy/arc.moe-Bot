const Discord   = require('discord.js')
const lib       = require('./lib')
const config    = require('./config')

global.client   = new Discord.Client()
client.login(config.token)

client.on('ready', () => {
  console.log(`\n\x1b[35m\x1b[1m${config.name} //\x1b[0m Connected to Discord`)
})

client.on('message', (message)=>{
  if(message.author.bot) return

  // Receive DM
  if (message.channel.type===`dm`) return

  // Command Parsing
  let command = message.content.split(/\s+/g)[0].slice(config.prefix.length);
  let args    = message.content.split(/\s+/g).slice(1);

  switch (command.toLowerCase()) {
    case 'settitle':    return lib.setTitle(message);
    case 'champ':       return lib.champ(message);
  }

});
