import { Stomp } from "@stomp/stompjs";
import { SockJS } from "sockjs";

export class MessageManager {

    private myUsername: string;
    private myId: string;
    private socket: SockJS;
    private stompClient;

    public getMyId(): string {
        return this.myId;
    }

    public getMyUsername(): string {
        return this.myUsername;
    }

    public onMessageReceived: Function = function (payload: Object): void {
        let message = JSON.parse(payload["body"]);
        document.title === "Messages" ? this.manageMessageInDialogs(message) : this.showPopUp(message);
    };

    public onMessageErrorsReceived: Function = function (payload: Object): void {
        let message = JSON.parse(payload["body"]);
        this.showPopUpWithSendingError(message);
    };

    /**
    * Function that perform connection to WebSocket
    */
    public connect(): void {
        this.socket = new SockJS('/ws');
        this.stompClient = Stomp.over(this.socket);

        console.log("Trying to connect to the server...");

        $.ajax({
            url: "get_id",
            type: "GET",
            complete: (function (data) {
                this.myId = data.responseText;
            })
        });

        $.ajax({
            url: "get_username",
            type: "GET",
            complete: (function (data) {
                this.myUsername = data.responseText;
            })
        });

        this.stompClient.connect({}, this.onConnected, this.onError);
    }

    /**
     * Function that is called when connection was successfully established
    */
    public onConnected() {

        console.log("User has been successfully connected.");

        this.stompClient.subscribe("/user/queue/privateMessages", this.onMessageReceived);
        this.stompClient.subscribe("/user/queue/privateMessagesErrors", this.onMessageErrorsReceived);
    }

    public onError(): void {
        window.alert('Could not connect to server. Please refresh this page!');
    }

    /**
    * Function that sends private message to a certain user
    *
    * @param message should be an JSON object
    */
    public sendMessage(message: Object): void {
        this.stompClient.send("/app/privateMessage", {}, JSON.stringify(message));
    }

    public showPopUpWithSendingError(message): void {
        console.log("Error: " + message);
    }

    public showPopUp(message): void {
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
    }

    // public manageMessageInDialogs(message): void {
    //     this.addMessageToMessageList(message);
    //     if (message["dialogId"] !== isOpenedDialogId) {
    //         if (message["receiverId"] !== this.myId) {
    //             this.showPopUp(message);
    //         }
    //     }
    // }
}
