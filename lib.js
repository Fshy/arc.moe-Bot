const Discord   = require('discord.js')
const Jimp      = require('jimp')
const imgur     = require('imgur');
const config    = require('./config')

global.embedMsg = function (text,message) {
  return ({embed:new Discord.RichEmbed().setDescription(text).setColor(`${message.guild.me.displayHexColor!=='#000000' ? message.guild.me.displayHexColor : config.hexColour}`)});
}

class Lib {

  setTitle(message){
    if (message.mentions.members.size!==1)
      return message.channel.send(embedMsg(`**ERROR**: Mention one (1) user to promote as ${config.title.champ_title}`,message))
    if (message.mentions.roles.size!==1)
      return message.channel.send(embedMsg(`**ERROR**: Mention the role/title in the command also`,message))

    var champ = message.mentions.members.first()
    var title = message.mentions.roles.first()

    if (title.id===config.title.id) {
      var currentChamp = title.members.array()
      for (var i = 0; i < currentChamp.length; i++) {
        currentChamp[i].removeRole(title, `Removed as ${config.title.champ_title}`).then(res =>
          message.channel.send(embedMsg(`${res.displayName} has been removed as ${config.title.champ_title}`,message))
        )
      }
      var imgTitle = Jimp.read('https://i.imgur.com/bgNtAsI.png')
      var imgAvi = Jimp.read(champ.user.avatarURL)
      var imgMask = Jimp.read('https://i.imgur.com/95Nr9In.png')
      Promise.all([imgTitle, imgAvi, imgMask]).then(function(images){
        var imgTitle = images[0]
        var imgAvi = images[1]
        var imgMask = images[2]
        imgTitle.composite(imgAvi.resize(218,218).mask(imgMask, 0, 0), 120, 0 ).getBase64(Jimp.MIME_PNG, function (err, src) {
          imgur.uploadBase64(src.substring(22))
          .then(function (json) {
            champ.addRole(title, `Added as new ${config.title.champ_title}`).then(res =>
              message.channel.send({embed:new Discord.RichEmbed()
                .setDescription(`${res.displayName} is your new ${config.title.champ_title}!`)
                .setImage(json.data.link)
                .setColor(`${message.guild.me.displayHexColor!=='#000000' ? message.guild.me.displayHexColor : config.hexColour}`)
              })
            )
          })
          .catch(function (err) {
            console.error(err.message);
          });
        })
      });
    }
  }

  champ(message){
    var role = message.guild.roles.get(config.title.id)
    var champ = role.members.first()

    var imgTitle = Jimp.read('https://i.imgur.com/bgNtAsI.png')
    var imgAvi = Jimp.read(champ.user.avatarURL)
    var imgMask = Jimp.read('https://i.imgur.com/95Nr9In.png')

    Promise.all([imgTitle, imgAvi, imgMask]).then(function(images){
      var imgTitle = images[0]
      var imgAvi = images[1]
      var imgMask = images[2]
      imgTitle.composite(imgAvi.resize(218,218).mask(imgMask, 0, 0), 120, 0 ).getBase64(Jimp.MIME_PNG, function (err, src) {
        imgur.uploadBase64(src.substring(22))
        .then(function (json) {
            message.channel.send({embed:new Discord.RichEmbed()
              .setDescription(`${champ.displayName} is your reigning ${config.title.champ_title}!`)
              .setImage(json.data.link)
              .setColor(`${message.guild.me.displayHexColor!=='#000000' ? message.guild.me.displayHexColor : config.hexColour}`)
            })
        })
        .catch(function (err) {
          console.error(err.message);
        });
      })
    });
  }

}

module.exports = new Lib();
