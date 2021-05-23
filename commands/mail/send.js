const {
    MessageEmbed
} = require('discord.js');

const Discord = require('discord.js');
const ticketcheck = new Set;

module.exports = {
    name: "sendadawdadaw",
    category: "mail",
    description: "Send your Answer to the person that needs help!",

    run: async (client, message, PREFIX,) => {

        let args = message.content.substring(PREFIX.length).split(" ");

        let supportreason = args.slice(2).join(" ");

        //const user = message.mentions.users.first();

        const IDuser = await client.users.fetch(args[0]);

        const permsembed = new MessageEmbed()
            .setTitle('No Permissions!')
            .setDescription('You are missing the `KICK_MEMBERS` permission!')
            .setColor('RED')

        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(permsembed);

        //if (!user) return message.channel.send('User not found!');

        //if (!ticketcheck.has(user.id)) return message.channel.send('Error');



        // let member = await client.user.fetch('420277395036176405').catch(() => null);
        // if (!member) return message.channel.send('User not found!');
        // if (!member) return message.channel.send('You have to provide a Discord ID! This ID should be found in the latest message of the Bot!');
        //if (isNaN(member)) return message.channel.send('The ID has to be a number!');

        if (!supportreason) return message.channel.send('Please provide some text after the Discord ID. This is your support message!');

        const supportembed = new MessageEmbed()
            .setTitle('Support Answer!')
            .setDescription(`${message.author.username} answered you. `)
            .setFooter('Use #speak to write back!')
            .addField('Answer', supportreason)
            .setColor('GREEN')


        IDuser.send(supportembed).catch(() => {
            return message.channel.send('Message was not sent! The person may not share a server with the bot or has DMs disabled! ', message.react('❌'));
        })

        message.react('✅')

    }
}