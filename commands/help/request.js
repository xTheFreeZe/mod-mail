const {
    MessageEmbed
} = require('discord.js');

const cooldown = new Set;

module.exports = {
    name: "request",
    category: "help",
    description: "Request a feature, or report a Bug",

    run: async (client, message, PREFIX) => {


        if (cooldown.has(message.guild.id)) {
            const timemebed = new MessageEmbed()
                .setDescription("To prevent spamming, this command has a **15 Minute** Cooldown!")
                .setColor("#FF0000")
            message.channel.send(timemebed);
            console.log('Server appeared on cooldown list! Returned!');

        } else {

            let args = message.content.substring(PREFIX.length).split(" ");

            let reportreason = args.slice(1).join(" ");

            let marwin = client.users.cache.get('420277395036176405');

            const content = [
                "This feature allows you to send a message to the developer!",
                " ",
                "Use it to request a feature or to report a Bug",
                " ",
                " ",
                "Messages will be sent straight into the DM's of the Developer.",
                " ",
                "Feel free to use this command! "
            ]

            const noargsembed = new MessageEmbed()
                .setTitle('Request a feature or report a Bug!')
                .setDescription(content)
                .setColor('YELLOW')


            if (!reportreason) return message.channel.send(noargsembed);

            const reportembed = new MessageEmbed()
                .setTitle('New request!')
                .setDescription(`New request from ${message.author.username}`)
                .addField('Request', reportreason)
                .setColor('BLUE')

            marwin.send(reportembed).catch(() => {
                message.react('❌')
                message.channel.send('An unexpected error occured! Please try again!');

            })

            message.react('✅');



            cooldown.add(message.guild.id);
            console.log('Added Server to cooldown');
            setTimeout(() => {
                cooldown.delete(message.guild.id);
                console.log('Deleted Server from cooldown');
            }, 900000)

            //900000

        }


    }
}