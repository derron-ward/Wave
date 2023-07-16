import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { WaveClient } from '../types/WaveClient'

export default {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current track and plays the next (if any).'),
    handler: async (interaction: ChatInputCommandInteraction<"cached">) => {
        const next = (interaction.client as WaveClient).player.next()

        if (!next) {
            await interaction.reply({
                content: 'There is nothing to play next.',
                ephemeral: true
            })
        }
        else await interaction.reply({
            content: `Now playing ${next.metadata.title}.`
        })
    }
}