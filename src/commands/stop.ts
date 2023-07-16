import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { AudioPlayerStatus, getVoiceConnection } from '@discordjs/voice'
import { WaveClient } from '../types/WaveClient'

export default {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the current track and clears the queue.'),
    handler: async (interaction: ChatInputCommandInteraction<"cached">) => {
        if ((interaction.client as WaveClient).player.state.status === AudioPlayerStatus.Idle && !(interaction.client as WaveClient).player.queue.length) {
            await interaction.reply({
                content: 'There is nothing playing and nothing in the queue.',
                ephemeral: true
            })
        }
        else {
            (interaction.client as WaveClient).player.stop()

            await interaction.reply({
                content: 'Stopped the track and cleared the queue.'
            })
        }

        const connection = getVoiceConnection(interaction.guildId)
        if (connection) connection.destroy()
    }
}