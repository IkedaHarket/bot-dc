export interface ILogger{
    get(text:string): void;
    danger(text:string): void;
    warning(text:string): void;
}