const {
    MessageEmbed
} = require('discord.js');

module.exports = {

    name: "info",

    run: async (client, message) => {

        const Infoembedcontentmessage = [
            "**Having problems with the usage of IDs?**",
            " ",
            "> How do I get an ID?",
            " ",
            "1.)  Check the messages of the Bot, most embeds contain the ID!",
            "2.) Turn on Developer Mode and right click on the user -> `Copy ID`",
            " ",
            "> How do I use an ID?",
            " ",
            "IDs can be used for #send and #closeticket",
            "Just paste the ID behind the command and you should be good!"
        ]

        const Infoembed = new MessageEmbed()
            .setTitle('Info')
            .setDescription(Infoembedcontentmessage)
            .setFooter('Mod Mail | Marwin 2021')
            .setColor('GREEN')

        message.author.send(Infoembed).catch(() => {
            return message.react('❌'), message.channel.send('Please turn on Direct Messages by Server Members to recieve the Info Message!');
        })

        message.react('✅');



    }

}