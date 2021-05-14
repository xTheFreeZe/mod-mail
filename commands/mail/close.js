const {
    MessageEmbed
} = require('discord.js');

const ticketrequest = new Set();

module.exports = {
    name: "closewdasdawd",
    category: "mail",
    description: "close a ticket!",

    run: async (client, message, args) => {


        if (ticketrequest.has(message.author.id)) {

            console.log('Bad request');

        } else {

            const user = message.mentions.users.first();

            const content = [
                'Closing this ticket will force the Person to open up a new one!',
                " ",
                "A DM will be send to the person!",
                " ",
                'If the cooldown is still active, they may have to wait!',
                " ",
                " ",

                '**Do you really want to close this ticket?**',
                " ",
                " ",

                'Type : ',
                " ",
                "`#close yes` to close the ticket!",
                " ",
                "`#close no` to cancel!"
            ]

            const requestembed = new MessageEmbed()
                .setTitle('Hold up!')
                .setDescription(content)
                .setColor('RED')

            const closeembed = new MessageEmbed()
                .setTitle('Ticket closed!')
                .setDescription('A Mod closed your ticket!')
                .setFooter('Open up a new one if you still need help!')


            //message.channel.send(requestembed);



            if (!args[0]) {

                message.channel.send(requestembed);


                ticketrequest.add(message.author.id);
                setTimeout(() => {

                    ticketrequest.delete(message.author.id);
                },30000);

                return;

            } else if (args[0] == 'yes') {

                if (ticketrequest.has(message.author.id)) {

                    if (!user) return message.channel.send('Whos ticket do you want to close? `Mention someone the Person!`');

                    user.send(closeembed);

                } else {

                    return message.channel.send('Request Error!');

                }

            }




        }

    }
}