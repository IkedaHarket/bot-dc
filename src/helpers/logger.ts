import moment from 'moment';
import { ILogger } from '../interfaces';

export class Logger implements ILogger{


    danger(text: string): void {
        console.log(`%c [${this.getTime()}] ${text}`,'color: #de0d1f');
    }
    warning(text: string): void {
        console.log(`%c [${this.getTime()}] ${text}`,'color: #d4d00b');
    }
    get(text: string): void {
        console.log(`%c [${this.getTime()}] ${text}`,'color: #24f2d0');
    }

    private getTime(): string {
        return moment().format('hh:mm:ss')
    }
}