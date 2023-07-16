import { REST, Routes } from 'discord.js'
import { default as dotenv } from 'dotenv'
import { readdirSync } from 'fs'
import { join } from 'path'

dotenv.config()

const commands: {}[] = []
const commandsPath = join(__dirname, 'commands')
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts'))

for (const file of commandFiles) {
    const filePath = join(commandsPath, file)
    const command = require(filePath).default
    if ('data' in command && 'handler' in command) commands.push(command.data.toJSON())
    else console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "handler" property.`)
}

const rest = new REST().setToken(process.env.BOT_TOKEN!)

const deploy = async () => {
    try {
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.APP_ID!, process.env.DEV_GUILD!),
            { body: commands }
        )
        console.log(`Successfully registered ${commands.length} commands.`)
    }
    catch(err) {
        console.log(`Encountered an error registering ${commands.length} commands: ${err}`)
    }
}

deploy()