import { GatewayIntentBits } from 'discord.js'
import { WaveClient } from "./types/WaveClient";
import { join } from 'path'
import { default as dotenv } from 'dotenv'

dotenv.config()

const client = new WaveClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ],
    commandsPath: join(__dirname, 'commands'),
    eventsPath: join(__dirname, 'events'),
    ytKey: process.env.YT_KEY!
})

client.login(process.env.BOT_TOKEN)