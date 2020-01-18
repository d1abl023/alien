"use strict";
exports.__esModule = true;
var stompjs_1 = require("@stomp/stompjs");
var sockjs_1 = require("sockjs");
var MessageManager = /** @class */ (function () {
    function MessageManager() {
        this.onMessageReceived = function (payload) {
            var message = JSON.parse(payload["body"]);
            document.title === "Messages" ? this.manageMessageInDialogs(message) : this.showPopUp(message);
        };
        this.onMessageErrorsReceived = function (payload) {
            var message = JSON.parse(payload["body"]);
            this.showPopUpWithSendingError(message);
        };
        // public manageMessageInDialogs(message): void {
        //     this.addMessageToMessageList(message);
        //     if (message["dialogId"] !== isOpenedDialogId) {
        //         if (message["receiverId"] !== this.myId) {
        //             this.showPopUp(message);
        //         }
        //     }
        // }
    }
    MessageManager.prototype.getMyId = function () {
        return this.myId;
    };
    MessageManager.prototype.getMyUsername = function () {
        return this.myUsername;
    };
    /**
    * Function that perform connection to WebSocket
    */
    MessageManager.prototype.connect = function () {
        this.socket = new sockjs_1.SockJS('/ws');
        this.stompClient = stompjs_1.Stomp.over(this.socket);
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
    };
    /**
     * Function that is called when connection was successfully established
    */
    MessageManager.prototype.onConnected = function () {
        console.log("User has been successfully connected.");
        this.stompClient.subscribe("/user/queue/privateMessages", this.onMessageReceived);
        this.stompClient.subscribe("/user/queue/privateMessagesErrors", this.onMessageErrorsReceived);
    };
    MessageManager.prototype.onError = function () {
        window.alert('Could not connect to server. Please refresh this page!');
    };
    /**
    * Function that sends private message to a certain user
    *
    * @param message should be an JSON object
    */
    MessageManager.prototype.sendMessage = function (message) {
        this.stompClient.send("/app/privateMessage", {}, JSON.stringify(message));
    };
    MessageManager.prototype.showPopUpWithSendingError = function (message) {
        console.log("Error: " + message);
    };
    MessageManager.prototype.showPopUp = function (message) {
        if (message["senderId"] === this.myId) {
            document.getElementById("sender_username").innerText = "Message has been send.";
        }
        else {
            document.getElementById("sender_username").innerText = "New message from " + message["senderLogin"];
        }
        document.getElementById("part_of_message_text").innerText = message.text;
        document.getElementById("newMessagePopUp").style.visibility = "visible";
        setTimeout(function () {
            document.getElementById("newMessagePopUp").style.visibility = "hidden";
        }, 5000);
    };
    return MessageManager;
}());
exports.MessageManager = MessageManager;
