import { Message } from "discord.js";
import { createAudioResource, StreamType, AudioPlayer, entersState, AudioPlayerStatus } from '@discordjs/voice';
import IHttpClient from "../http-client/http-client.interface";
import HttpClient from "../http-client";

class MediaPlayer {
  private _http: IHttpClient;

  constructor({ httpClient }: {httpClient: IHttpClient}) {
    this._http = httpClient;
  }

  async play(message: Message, player: AudioPlayer):Promise<AudioPlayer> {
    const resource = createAudioResource('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', {
      inputType: StreamType.Arbitrary
    });
    player.play(resource);
    return entersState(player, AudioPlayerStatus.Playing, 5000);
  }
}

export default MediaPlayer;
