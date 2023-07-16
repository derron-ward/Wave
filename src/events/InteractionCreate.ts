import { BaseInteraction, Events } from 'discord.js'
import { WaveClient } from '../types/WaveClient'

export default {
    name: Events.InteractionCreate,
    handler: async (interaction: BaseInteraction) => {
        // handle slash commands
        if (interaction.isChatInputCommand()) {
            // slash commands must be used in a guild, otherwise do nothing
            if (!interaction.inCachedGuild()) {
                await interaction.reply({
                    content: 'You must be in a server to use slash commands.',
                    ephemeral: true
                })
                return
            }

            const command = (interaction.client as WaveClient).commands.get(interaction.commandName)
            if (!command) {
                await interaction.reply({
                    content: `I could not find a command named ${interaction.commandName}.`,
                    ephemeral: true
                })
                return
            }

            try {
                command.handler(interaction)
            }
            catch (err) {
                console.log(`There was an error executing command ${interaction.commandName}: ${err}`)

                if (interaction.replied) {
                    await interaction.editReply({
                        content: 'I encountered an error while executing your command.'
                    })
                }
                else await interaction.reply({
                    content: 'I encountered an error while executing your command.',
                    ephemeral: true
                })
            }
        }
    }
}