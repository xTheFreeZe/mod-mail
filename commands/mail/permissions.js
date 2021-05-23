const {
    MessageEmbed
} = require('discord.js');


module.exports = {
    name: "perms",
    category: "mail",
    description: "check if bot has permissions",

    run: async (client, message) => {



        const hasPermissionembed = new MessageEmbed()
            .setDescription('I have all the Permissions I need!')
            .setFooter(`${message.author.username}`)
            .setTimestamp()
            .setColor('GREEN')


        const hasntPermissionembed = new MessageEmbed()
            .setDescription('I need some Permissons!')
            .addField('Needed', '`MANAGE_MESSAGES`', true)
            .addField('Needed', '`MANAGE_CHANNELS`', true)
            .setFooter('Please grant those permissions so the Bot works properly')
            .setTimestamp()
            .setColor('RED')


        if (message.guild.me.hasPermission('MANAGE_MESSAGES')) {

            message.channel.send(hasPermissionembed);


        } else {

            message.channel.send(hasntPermissionembed);
        }




    }
}