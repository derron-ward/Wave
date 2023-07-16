import { Client, Events, ActivityType } from 'discord.js'

export default {
    name: Events.ClientReady,
    once: true,
    handler: async (client: Client) => {
        client.user!.setPresence({
            activities: [
                {
                    name: 'YouTube',
                    type: ActivityType.Listening,
                    url: 'https://www.youtube.com/'
                }
            ]
        })

        console.log(`Logged in as ${client.user?.tag}`)
    }
}