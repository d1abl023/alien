export class Logger {

    private static getTimestamp(): string {
        let date: Date = new Date();
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`
    }

    public static info(message: any): void {
        console.log(Logger.getTimestamp() + " [INFO] " + message);
    }

    public static error(message: any): void {
        console.error(Logger.getTimestamp() + " [ERROR] " + message);
    }
}