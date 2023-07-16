import { Client, ClientOptions, Collection, SlashCommandBuilder, CommandInteraction } from "discord.js";
import { WavePlayer } from "./WavePlayer";
import { join } from 'path'
import { readdirSync } from 'fs'

export interface WaveClientOptions extends ClientOptions {
    commandsPath: string,
    eventsPath: string
    ytKey: string
}

export class WaveClient extends Client {
    commandsPath: string
    eventsPath: string
    commands: Collection<string, {data: SlashCommandBuilder, handler: (interaction: CommandInteraction) => void}>
    ytKey: string
    player: WavePlayer

    constructor(options: WaveClientOptions) {
        super(options)

        this.commandsPath = options.commandsPath
        this.commands = new Collection()
        this.loadCommands()

        this.eventsPath = options.eventsPath
        this.loadEvents()

        this.ytKey = options.ytKey
        this.player = new WavePlayer()
    }

    loadCommands(): void {
        const commandFiles = readdirSync(this.commandsPath).filter(file => file.endsWith('.ts'))
        for (const file of commandFiles) {
            const commandPath = join(this.commandsPath, file)
            const command = require(commandPath).default

            if ('data' in command && 'handler' in command) this.commands.set(command.data.name, command)
            else console.warn(`[WARNING] The command at ${commandPath} is missing a required "data" or "handler" property.`)
        }
    }

    loadEvents() {
        const eventFiles = readdirSync(this.eventsPath).filter(file => file.endsWith('.ts'))
        for (const file of eventFiles) {
            const eventPath = join(this.eventsPath, file)
            const event = require(eventPath).default

            if ('name' in event && 'handler' in event) {
                if (event.once) this.once(event.name, (...args) => event.handler(...args))
                else this.on(event.name, (...args) => event.handler(...args))
            }
            else console.warn(`[WARNING] The event at ${eventPath} is missing a required "name" or "handler" property.`)
        }
    }
}