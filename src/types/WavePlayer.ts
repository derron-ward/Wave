import { AudioPlayer, CreateAudioPlayerOptions, AudioResource, AudioPlayerStatus } from "@discordjs/voice"

export interface TrackMetadata {
    title: string
    author: string
    requester: string
}

export class WavePlayer extends AudioPlayer {
    queue: AudioResource<TrackMetadata>[]

    constructor(options?: CreateAudioPlayerOptions) {
        super(options)

        this.queue = []
    }

    add2queue(resource: AudioResource<TrackMetadata>): boolean {
        // if there is nothing playing and nothing in queue, play the resource immediately
        if (this.state.status === AudioPlayerStatus.Idle && !this.queue.length) {
            this.play(resource)
            return true
        }

        this.queue.push(resource)
        return false
    }

    next(): AudioResource<TrackMetadata> | null {
        const next = this.queue.shift()

        // if there is nothing next in queue, just stop playing
        if (!next) {
            if (this.state.status === AudioPlayerStatus.Playing) this.stop()
            return null
        }

        this.play(next)
        return next
    }

    stop(force?: boolean): boolean {
        this.queue = []
        if (this.state.status === AudioPlayerStatus.Idle) return false
        if (force || this.state.resource.silencePaddingFrames === 0) {
            this.state = {
                status: AudioPlayerStatus.Idle
            }
        } else if (this.state.resource.silenceRemaining === -1) {
            this.state.resource.silenceRemaining = this.state.resource.silencePaddingFrames
        }

        return true
    }
}