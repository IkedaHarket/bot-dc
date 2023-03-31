import App from "./App";

import config from "./config";
import { Logger } from "./helpers/logger";
import MediaPlayer from "./music";
import HttpClient from "./http-client";
import VoiceChannel from "./helpers/voice";

const httpClient = new HttpClient();
const mediaPlayer = new MediaPlayer( {httpClient} )
const voice = new VoiceChannel();
const logger : Logger = new Logger();

const app = new App({token: config.token, logger, mediaPlayer, voice});

app.start();
