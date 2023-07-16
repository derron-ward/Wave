import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { AudioPlayerStatus } from '@discordjs/voice'
import { WaveClient } from '../types/WaveClient'

export default {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the current track.'),
    handler: async (interaction: ChatInputCommandInteraction<"cached">) => {
        if ((interaction.client as WaveClient).player.state.status === AudioPlayerStatus.Paused) {
            (interaction.client as WaveClient).player.unpause()

            await interaction.reply({
                content: 'Track resumed.'
            })
        }
        else {
            await interaction.reply({
                content: 'There is not a paused track',
                ephemeral: true
            })
        }
    }
}