const {
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: "help",
    category: "help",
    description: "Gives info about the bot and its commands!",

    run: async (client, message, args) => {

        let author = message.author

        const content = [
            'An easy to use Ticket Bot that allows you and your Staff-Members',
            ' ',
            'to **easily open and close** Tickets made by People that need help!',
            ' ',
            'My Commands :',
            ' ',
            ' ',
            '`#new` - Open up a new ticket! This can only be used it DMs!',
            ' ',
            '`#speak` - Talk back to the Mod! This can only used it DMs!',
            ' ',
            '`#send` - Talk back to the Person that needs help! Not available in DMs!',
            ' ',
            '`#close` - Get options on how to close a ticket!',
            ' ',
            '`#closeticket` - Close an open ticket. Not available in DMs!',
            ' ',
            '`#closeDM` - Close your own ticket. This can onnly be used in DMs!',
            ' ',
            '`#info` - Learn how to get an ID and where to use it!',
            ' ',
            ' **------------------------------------------------------------------------------**',
            ' ',
            'Cooldown `#new` = **15 Minutes**',
            ' ',
            'Cooldown `#speak` = **5 Seconds**',
            ' ',
            'Cooldown `#close` = **5 Minutes** | Resets itself when time runs out!'
        ]

        const embed = new MessageEmbed()
            .setTitle('DM Ticket Bot')
            .setDescription(content)
            .setColor('BLUE')
            .setFooter('Made by Marwin | 2021')

        message.react('✅');

        author.send(embed).catch(() => {
            return message.react('❌'), message.channel.send('An Error occured and the help message want sent into your DMs! Check your Privacy Settings on this Server to recieve the help message!');
        });



    }
}