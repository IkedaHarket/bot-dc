import config from "./config";
import { Client, Message, VoiceBasedChannel } from 'discord.js';
import MediaPlayer from "./music";
import VoiceChannel from './helpers/voice';
import { createAudioPlayer } from '@discordjs/voice';
import { OpenAi } from "./open-ai";
import { ILogger } from "./interfaces";

const player = createAudioPlayer();

class App {
  private _logger: ILogger;
  private _openai: OpenAi;
  private client: Client;
  private mediaPlayer: MediaPlayer;
  private token: string;
  private voice : VoiceChannel;
  
  constructor({
    token,
    logger,
    mediaPlayer,
    voice,
    }:{token:string, logger: ILogger, mediaPlayer: MediaPlayer, voice: VoiceChannel}) {
    this._logger = logger;
    this._openai = new OpenAi();
    this.client = new Client({ intents: [3276799] });
    this.mediaPlayer = mediaPlayer;
    this.token = token;
    this.voice = voice;
  }

  start() {
    this.client.login(this.token);
    this.initialize();
  }
  initialize() {
    this.client.on("ready", () => console.log("Bot Ready"));
    this.client.on("messageCreate", async (message: Message) => {
      if (message.author.bot || !message.content.startsWith(config.prefix)) return;
      this._logger.get(message.content)

      if(message.content.startsWith(config.prefix + " p")){
        if(!message.member?.voice.channel) return  
        const connection = await this.voice.connectToChannel(message.member?.voice.channel as VoiceBasedChannel)
        connection.subscribe(player)
        await this.mediaPlayer.play(message, player)
        await message.reply('Hojita')
      }

      if(message.content.startsWith(config.prefix + " gpt")){
        const { data } = await this._openai.openAi.createChatCompletion({
            model:"gpt-3.5-turbo",
            messages: [
              { role:"user", content:message.content.slice(7)}
            ]
          })
        await message.reply(data.choices[0].message?.content || "No lo se :c")
      }
      
    });
  }
}

export default App;
