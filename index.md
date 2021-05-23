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