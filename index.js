const Discord = require('discord.js');


const {
    MessageEmbed
} = require('discord.js');


const client = new Discord.Client();


const {
    PREFIX,
    token
} = require('./config.json');

const talkedRecently = new Set();
const cooldown = new Set();
const ticketrequest = new Set();
const ticketcheck = new Set();

const {
    Collection
} = require("discord.js");

client.commands = new Collection();

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

client.on('message', async message => {

    let PREFIX = '#';

    if (!message.guild) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);

    if (command)
        command.run(client, message, args);

})

client.on('ready', () => {
    console.log("Ticket Bot is ready.")
    client.user.setActivity('#new to start!')
});


client.on('message', async message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case "new":

            const plusIDembed = new MessageEmbed()
                .setDescription(`Added ${message.author.id} to a queue`)
                .setFooter('#check to see your current cooldowns')
                .setColor('GREEN')


            const minuesIDembed = new MessageEmbed()
                .setDescription(`Removed ${message.author.id} from a queue`)
                .setColor('RED')

            const alrOTick = new MessageEmbed()
                .setTitle('Error!')
                .setDescription('You have an open ticket! Ask the Mods to close your ticket to open up a new one!')
                .addField('Want to close your ticket?', 'Use `#closeDM`')
                .addField('How to speak?', 'Use `#speak` to send a message')
                .setColor('RED')

            if (ticketcheck.has(message.author.id)) {

                return message.react('❌'), message.channel.send(alrOTick);
            }


            if (talkedRecently.has(message.author.id)) {
                const timemebed = new MessageEmbed()
                    .setTitle('On Cooldown!')
                    .setDescription("This command is on cooldown! Please wait **15 Minutes**")
                    .setColor("#FF0000")
                message.channel.send(timemebed);

            } else {




                let ticketmodchannel = client.channels.cache.get('830512828396863538');


                let consolechannel = client.channels.cache.get('832530885336498216');


                const errorembed = new MessageEmbed()
                    .setTitle('Oops, something went wrong!')
                    .setDescription('You are missing some args. Please provide some Text')
                    .setColor('RED')

                const noDMembed = new MessageEmbed()
                    .setTitle('Error')
                    .setDescription('This command is only available in a DM channel!')
                    .setColor('RED')

                const sentembed = new MessageEmbed()
                    .setTitle('You opened a new Ticket!')
                    .setDescription('Your Message has been sent!')
                    .setFooter('Please wait for an answer!')
                    .setColor('GREEN')

                if (message.channel instanceof Discord.DMChannel) {

                    let ticketreason = args.slice(1).join(" ");

                    if (!ticketreason) return message.channel.send(errorembed);


                    if (ticketreason.length <= 5) return message.channel.send('Your ticket reason must at least be 5 letters long!');

                    ticketcheck.add(message.author.id);
                    console.log(`Added ${message.author.id} to ticketcheck`);
                    consolechannel.send(plusIDembed);



                    const newticketembed = new MessageEmbed()
                        .setTitle(`New Ticket!`)
                        .setDescription(`${message.author.username} needs help!`)
                        .addField('Ticket Reason', ticketreason)
                        .addField('Author ID', `${message.author.id}`)
                        .setColor('PURPLE')



                    ticketmodchannel.send(newticketembed);


                    message.channel.send(sentembed);


                } else {

                    return message.channel.send(noDMembed);

                }


                // Adds the user to the set so that they can't talk for a minute
                talkedRecently.add(message.author.id);
                consolechannel.send(plusIDembed)
                console.log(`Added ${message.author.id} to ticket queue`);
                setTimeout(() => {
                    // Removes the user from the set after a minute
                    talkedRecently.delete(message.author.id);
                    console.log(`Removed ${message.author.id} from ticket queue`);
                    consolechannel.send(minuesIDembed);
                }, 900000);



            }

    }
})


client.on('message', async message => {
    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case "speak":

            const noDMembed = new MessageEmbed()
                .setTitle('Error')
                .setDescription('This command is only available in a DM channel!')
                .setColor('RED')

            if (message.channel.guild) {

                return message.channel.send(noDMembed);
            }

            if (!talkedRecently.has(message.author.id)) {

                return message.react('❌'),
                    message.channel.send('Please open a ticket before before sending a message to the Mods!');
            }

            if (cooldown.has(message.author.id)) {
                const timemebed = new MessageEmbed()
                    .setTitle('On Cooldown!')
                    .setDescription("Please wait **5 seconds** before sending another message!")
                    .setColor("#FF0000")
                message.channel.send(timemebed);

            } else {


                let ticketmodchannel = client.channels.cache.get('830512828396863538');

                let ticketreason = args.slice(1).join(" ");

                if (message.channel instanceof Discord.DMChannel) {

                    if (!ticketreason) return message.channel.send('Please provide some Text!');

                    const speakembed = new MessageEmbed()
                        .setTitle(`${message.author.username} answered!`)
                        .setDescription('Cooldown has been set!')
                        .addField('Answer', ticketreason)


                    ticketmodchannel.send(speakembed).catch(() => {
                        return message.channel.send('An Error occured and your Message wasnt sent!', message.react('❌'));
                    });


                    ticketmodchannel.send(`${message.author.id}`).catch(() => {
                        return message.channel.send('Message wasnt sent! Please try again, or open up a new ticket!')
                    })

                    message.react('✅')



                } else {

                    return message.channel.send('This Command is only available in a DM Channel!');
                }

                // Adds the user to the set so that they can't talk for a minute
                cooldown.add(message.author.id);
                console.log(`Added ${message.author.id} to send queue`);
                setTimeout(() => {
                    // Removes the user from the set after a minute
                    cooldown.delete(message.author.id);
                    console.log(`Removed ${message.author.id} from send queue`);
                }, 5000);

            }




    }
})

client.on('message', async message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case "send":


            if (!message.guild) return message.channel.send('This is only available in a Server! Not in DMs');

            if (!args[1]) return message.channel.send('Please provide an ID you want to send the message to.');



            let content = [
                "**Error**",
                " ",
                "Make sure that : ",
                " ",
                "> Your ID is long enough ( 18 Numbers), ",
                " ",
                "> Your ID only contains Numbers,",
                " ",
                "> Your ID actually exists"
            ]

            let IDuser;

            try {

                IDuser = await client.users.fetch(args[1])

            } catch (e) {

                return message.channel.send(content);

                //message.channel.send('>' + " " + e);

            }

            const user = IDuser

            if (!user) return console.log('error');

            if (!ticketcheck.has(user.id)) {

                return message.channel.send('This Member does not have an open ticket!');

            }

            let supportreason = args.slice(2).join(" ");



            /*
            const IDuser = await client.users.fetch(args[1]).catch((e) => { 
                return message.channel.send('Please provide an ID you want to send your message to! You can find the ID in the `New Ticket` message!');
            })
            */

            const permsembed = new MessageEmbed()
                .setTitle('No Permissions!')
                .setDescription('You are missing the `KICK_MEMBERS` permission!')
                .setColor('RED')

            if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(permsembed);


            if (!args[1]) return;

            //if (!user) return message.channel.send('User not found!');

            //if (!ticketcheck.has(user.id)) return message.channel.send('Error');



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


});



client.on('message', async message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case "close":

            if (ticketrequest.has(message.author.id)) {
                const timemebed = new MessageEmbed()
                    .setTitle('On Cooldown!')
                    .setDescription("Please wait **5 Minutes** before closing another ticket!")
                    .setFooter('Type #cancel to reset this cooldown!')
                    .setColor("#FF0000")
                message.channel.send(timemebed);

            } else {
                const content = [
                    'Closing a ticket will reset all cooldowns!',
                    " ",
                    "`^speak` and `^send` won't be available!",
                    " ",
                    " ",

                    '**Do you really want to close this ticket?**',
                    " ",
                    " ",

                    'Type : ',
                    " ",
                    "`#closeticket` to close the ticket!",
                    " ",
                    "`#closeDM` to close your ticket by yourself!",
                    " ",
                    "`#cancel` to cancel!"
                ]

                const requestembed = new MessageEmbed()
                    .setTitle('Hold up!')
                    .setDescription(content)
                    .setColor('RED')

                message.channel.send(requestembed);
                message.channel.send('You have 5 Minutes until your `cancel` message resets it self!');


                ticketrequest.add(message.author.id);
                console.log(`Added ${message.author.id} to close || ticketrequest queue`);
                setTimeout(() => {
                    ticketrequest.delete(message.author.id);
                    console.log(`Removed ${message.author.id} from close || ticketrequest queue`);
                }, 300000);

            }

    }


});


client.on('message', async message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case "closeticket":

            let reason = args[2] ? args.slice(2).join(" ") : 'no reason provided';

            const noDMembed = new MessageEmbed()
                .setTitle('Error')
                .setDescription('This command is not available in a DM channel!')
                .setColor('RED')

            const closeembed = new MessageEmbed()
                .setTitle('Your Ticket was closed!')
                .addField('Reason', reason)
                .setFooter('You can open up a new one anytime!')
                .setColor('GREEN')


            if (!message.guild) return message.channel.send(noDMembed);

            let content = [
                "**Error**",
                " ",
                "Make sure that : ",
                " ",
                "> Your ID is long enough ( 18 Numbers), ",
                " ",
                "> Your ID only contains Numbers,",
                " ",
                "> Your ID actually exists"
            ]

            let IDuser;

            try {

                IDuser = await client.users.fetch(args[1])

            } catch (e) {

                return message.channel.send(content);

                //message.channel.send('>' + " " + e);

            }

            const user = IDuser

            if (!user) return console.log('error');

            if (!ticketrequest.has(message.author.id)) {

                //checks if author uses #close before this, if not -> return
                return message.channel.send('ID not found! #close to add your ID to the list!'), console.log(`${message.author.id} did not appear on ticketrequest`);

            }

            //if user is not on the list for an open ticket (talkedRecently), the message will return
            if (!talkedRecently.has(user.id)) return message.channel.send('Looks like that member does not have an open ticket!');


            ticketrequest.delete(message.author.id);
            console.log(`Removed ${message.author.id} from ticketrequest queue`);


            ticketcheck.delete(user.id);
            console.log(`Removed ${user.id} from ticketcheck queue`);

            //Removes cooldown from (talkedRecently)
            talkedRecently.delete(user.id);
            console.log(`Removed ${user.id} from ticket queue || closeticket`);

            //Sends message to user, that the ticket has been closed. Cooldown has been reset            
            user.send(closeembed).catch(() => {
                return message.channel.send('Message wasnt sent! The user may have disabled DMs. Their ticket was closed though!');
            })

            message.react('✅');





    }


});

client.on('message', async message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case "closeDM":

            let ticketmodchannel = client.channels.cache.get('830512828396863538');

            if (message.channel.guild) {

                return message.channel.send('This command can not be used on a Server || Only DMs');
            }

            const closeticketembed = new MessageEmbed()
                .setTitle('Ticket closed || DM Close')
                .setDescription(`${message.author} closed their own ticket!`)
                .setColor('RED')

            if (!ticketrequest.has(message.author.id)) {

                console.log(`${message.author.id} did not appear on ticketrequest || close`);
                return message.channel.send('Wrong ID --> Type `#close` to add yourself!');
            }

            if (!ticketcheck.has(message.author.id)) {

                //If author doesn't have a Ticket the message returns
                return message.channel.send(`Please open a new Ticket before closing one || ${message.author.id}`), console.log(`${message.author.id} did not create a new ticket!`);
            }

            if (!talkedRecently.has(message.author.id)) {

                //Just a double check if the author really has a ticket. This should check for the 15 Minute Cooldown!
                return message.channel.send(`An Error occured!`);
            }

            talkedRecently.delete(message.author.id);
            //deletes ID from from the 15 Minute Cooldown
            console.log(`${message.author.id} removed from talkedRecently || DM Close`);

            ticketcheck.delete(message.author.id);
            //deletes ID from ticketchek!
            console.log(`${message.author.id} removed from ticketcheck || DM Close`)

            ticketrequest.delete(message.author.id);
            //deletes ID from the ticketrequest queue || close, this should make them type #close again


            ticketmodchannel.send(closeticketembed).catch(() => {
                //sends in case the message was not sent to the Mods!
                message.channel.send('An Error occured. Message wasnt sent to the Mods!')
            })

            //Succsefully closed your Ticket!
            message.channel.send('Your ticket has been closed! You can open up a new one anytime!');
            message.react('✅')






    }


});


client.on('message', async message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case "cancel":


            const cancelembed = new MessageEmbed()
                .setTitle('Canceled')
                .setDescription('Message has been canceled! Cooldown has beend deleted.')
                .setColor('#add8e6')

            //if user does not appear on the cooldown list, return
            if (!ticketrequest.has(message.author.id)) {

                return message.channel.send('Your ID does not appear on the `ticketrequest` queue! Type `#close` to renew your Ticketrequest!');
            }

            //removing cooldown
            ticketrequest.delete(message.author.id);
            console.log(`Removed ${message.author.id} from close queue || cancel --> close`);

            message.channel.send(cancelembed);




    }


});


client.on('message', async message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case "check":

            const hasticketembed = new MessageEmbed()
                .setDescription('Has an open Ticket : ✅')

            const newticketembed = new MessageEmbed()
                .setDescription('Is on cooldown for a new ticket : ✅')

            const ticketrequestembed = new MessageEmbed()
                .setDescription('Has used #close -> Resets in 5 Minutes : ✅')


            if (!ticketcheck.has(message.author.id)) {
                hasticketembed.setDescription('Has an open Ticket : ❌')
            }

            if (!talkedRecently.has(message.author.id)) {
                newticketembed.setDescription('Is on cooldown for a new ticket : ❌')
            }

            if (!ticketrequest.has(message.author.id)) {
                ticketrequestembed.setDescription('Has used #close -> 5 Minutes : ❌')
            }

            const content = [
                'Current Ticketrequest queue : ',
                " ",
                `${message.author.id}`,
                " ",
                " ",
                "Queue ends here!",
            ]

            message.channel.send(hasticketembed);
            message.channel.send(newticketembed);
            message.channel.send(ticketrequestembed);
            //message.channel.send(content);



    }


});



client.login(token)