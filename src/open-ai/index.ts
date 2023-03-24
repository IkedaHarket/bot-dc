import { Configuration, OpenAIApi } from "openai";
import config from '../config';


export class OpenAi{

    private _openAi;

    constructor(){
        this._openAi = new OpenAIApi(new Configuration({apiKey: config.openAiToken}))
    }

    get openAi(){
        return this._openAi
    }
}