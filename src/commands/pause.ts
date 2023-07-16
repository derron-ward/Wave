import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { AudioPlayerStatus } from '@discordjs/voice'
import { WaveClient } from '../types/WaveClient'

export default {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current track.'),
    handler: async (interaction: ChatInputCommandInteraction<"cached">) => {
        if ((interaction.client as WaveClient).player.state.status === AudioPlayerStatus.Playing) {
            (interaction.client as WaveClient).player.pause()

            await interaction.reply({
                content: 'Track paused.'
            })
        }
        else await interaction.reply({
            content: 'There is not a track playing.',
            ephemeral: true
        })
    }
}