import {Logger} from "./logger";
import * as $ from "jquery";

export class WebSocketClient {

    private WS_PATH: string = "ws://localhost:8080/websocket";
    private webSocket: WebSocket = new WebSocket(this.WS_PATH);
    private myId: string;
    private myUsername: string;

    constructor() {
        $.ajax({
            url: "get_id",
            type: "GET"
        }).then((data: string): void => {
            this.myId = data;
        });

        $.ajax({
            url: "get_username",
            type: "GET"
        }).then((data: string): void => {
            this.myUsername = data;
        });
        this.webSocket.onmessage = this.onMessage;
        this.webSocket.onclose = this.onClose;
        this.webSocket.onerror = this.onError;
        this.webSocket.onopen = this.onOpen;
    }

    private onOpen = (): void => {
        Logger.info("WebSocket connected on: " + this.WS_PATH);
    };

    private onClose = (): void => {
        Logger.info("Connection closed");
    };

    private onError = (event): void => {
        Logger.error(`Connection error: ${event.data}`)
    };

    public sendMessage = (message: string): void => {
        this.webSocket.readyState === WebSocket.OPEN ?
            this.webSocket.send(message) : console.error("No connection. Cannot send messages.");
    };

    public getState = (): number => {
        return this.webSocket.readyState;
    };

    public onMessage = (event): void => {
        Logger.info(`Received message: "${event.data}"`);
        this.manageIncomingMessage(JSON.parse(event.data));
    };

    public showPopUp = (message): void => {
        if (message["senderId"] === this.myId) {
            document.getElementById("sender_username").innerText = "Message has been send.";
        } else {
            document.getElementById("sender_username").innerText = "New message from " + message["senderLogin"];
        }
        document.getElementById("part_of_message_text").innerText = message.text;
        document.getElementById("newMessagePopUp").style.visibility = "visible";

        setTimeout(function () {
            document.getElementById("newMessagePopUp").style.visibility = "hidden";
        }, 5000);
    };

    public manageIncomingMessage = (message): void => {
        this.showPopUp(message);
    };
}