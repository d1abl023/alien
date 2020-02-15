"use strict";
exports.__esModule = true;
var logger_1 = require("./logger");
var $ = require("jquery");
var WebSocketClient = /** @class */ (function () {
    function WebSocketClient() {
        var _this = this;
        this.WS_PATH = "ws://localhost:8080/websocket";
        this.webSocket = new WebSocket(this.WS_PATH);
        this.onOpen = function () {
            logger_1.Logger.info("WebSocket connected on: " + _this.WS_PATH);
        };
        this.onClose = function () {
            logger_1.Logger.info("Connection closed");
        };
        this.onError = function (event) {
            logger_1.Logger.error("Connection error: " + event.data);
        };
        this.sendMessage = function (message) {
            _this.webSocket.readyState === WebSocket.OPEN ?
                _this.webSocket.send(message) : console.error("No connection. Cannot send messages.");
        };
        this.getState = function () {
            return _this.webSocket.readyState;
        };
        this.onMessage = function (event) {
            logger_1.Logger.info("Received message: \"" + event.data + "\"");
            _this.manageIncomingMessage(JSON.parse(event.data));
        };
        this.showPopUp = function (message) {
            if (message.senderId === _this.myId) {
                document.getElementById("sender_username").innerText = "Message has been send.";
            }
            else {
                document.getElementById("sender_username").innerText = "New message from " + message.senderLogin;
            }
            document.getElementById("part_of_message_text").innerText = message.text;
            document.getElementById("newMessagePopUp").style.visibility = "visible";
            setTimeout(function () {
                document.getElementById("newMessagePopUp").style.visibility = "hidden";
            }, 5000);
        };
        this.manageIncomingMessage = function (message) {
            _this.showPopUp(message);
        };
        this.getMyData = function () {
            return { myId: _this.myId, myUsername: _this.myUsername };
        };
        $.ajax({
            url: "get_id",
            type: "GET"
        }).then(function (data) {
            _this.myId = data;
        });
        $.ajax({
            url: "get_username",
            type: "GET"
        }).then(function (data) {
            _this.myUsername = data;
        });
        this.webSocket.onmessage = this.onMessage;
        this.webSocket.onclose = this.onClose;
        this.webSocket.onerror = this.onError;
        this.webSocket.onopen = this.onOpen;
    }
    return WebSocketClient;
}());
exports.WebSocketClient = WebSocketClient;
