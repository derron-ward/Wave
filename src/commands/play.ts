import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { joinVoiceChannel, getVoiceConnection, createAudioResource } from '@discordjs/voice'
import { WaveClient } from '../types/WaveClient'
import { default as ytSearch } from 'youtube-search'
import { default as ytdl } from 'ytdl-core'
import { TrackMetadata } from '../types/WavePlayer'

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays the requested track in your current voice channel.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The name or URL of the track that you want to play.')
                .setRequired(true)
        ),
    handler: async (interaction: ChatInputCommandInteraction<"cached">) => {
        // defer the reply
        await interaction.deferReply()

        // get the IDs of the guild and channel that the user is in, used for joining the bot to the channel
        const guildId = interaction.guildId
        const channelId = interaction.member.voice.channelId

        // if the user is not in a voice channel, do not play
        if (!channelId) {
            await interaction.editReply({
                content: 'You must be in a voice channel to use this command'
            })
            return
        }

        let query = interaction.options.get('query', true).value
        if (typeof query != 'string') throw new Error('InvalidCommandOptionType')

        // if the query is a link, get the video ID
        if (ytdl.validateURL(query)) query = ytdl.getURLVideoID(query)

        const searchResults = await ytSearch(query, {
            maxResults: 1,
            key: (interaction.client as WaveClient).ytKey
        })

        // if the search has no results, return
        if (!searchResults.results.length) {
            await interaction.editReply({
                content: 'Your query returned no results.'
            })
            return
        }

        const details = searchResults.results[0]

        // download the track
        const stream = ytdl(details.link, { filter: 'audioonly' })

        // join the voice channel if not already in one
        if (!getVoiceConnection(guildId)) {
            const connection = joinVoiceChannel({
                guildId: guildId,
                channelId: channelId,
                adapterCreator: interaction.guild.voiceAdapterCreator
            })

            connection.subscribe((interaction.client as WaveClient).player)
        }

        // create the track resource
        const metadata: TrackMetadata = {
            title: details.title,
            author: details.channelTitle,
            requester: interaction.member.displayName
        }
        const track = createAudioResource(stream, { metadata: metadata })
        // add the track to the players queue
        const state = (interaction.client as WaveClient).player.add2queue(track)

        if (state) await interaction.editReply({
            content: `Now playing ${details.title}.`
        })
        else await interaction.editReply({
            content: `${details.title} added to queue.`
        })
    }
}