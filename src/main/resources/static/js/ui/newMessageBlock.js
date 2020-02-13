"use strict";
exports.__esModule = true;
var NewMessageBlock = /** @class */ (function () {
    function NewMessageBlock(webSocket, user) {
        var _this = this;
        this.onClickSend = function () {
            var message = {
                dialogId: "0",
                receiverId: _this.user.id,
                receiverLogin: _this.user.login,
                senderId: _this.myData.myId,
                senderLogin: _this.myData.myUsername,
                text: document.getElementById("send_new_message_field").value,
                timestamp: Date.now().toString()
            };
            _this.webSocket.sendMessage(JSON.stringify(message));
        };
        this.onClickCancel = function () {
            document.getElementById("send_new_message_block").remove();
        };
        this.webSocket = webSocket;
        this.myData = webSocket.getMyData();
        this.user = user;
        this.render();
    }
    NewMessageBlock.prototype.render = function () {
        var sendNewMessageBlock = document.createElement("div");
        sendNewMessageBlock.id = "send_new_message_block";
        sendNewMessageBlock.appendChild(this.createReceiverInfoBlock());
        sendNewMessageBlock.appendChild(this.createSendNewMessageField());
        sendNewMessageBlock.appendChild(this.createSendNewMessageButtonsBlock());
        document.body.appendChild(sendNewMessageBlock);
    };
    NewMessageBlock.prototype.createReceiverInfoBlock = function () {
        var receiverInfoBlock = document.createElement("div");
        receiverInfoBlock.id = "receiver_info";
        receiverInfoBlock.innerText = "Send message to " + this.user.login;
        return receiverInfoBlock;
    };
    NewMessageBlock.prototype.createSendNewMessageField = function () {
        var sendNewMessageField = document.createElement("textarea");
        sendNewMessageField.id = "send_new_message_field";
        return sendNewMessageField;
    };
    NewMessageBlock.prototype.createSendNewMessageButtonsBlock = function () {
        var _this = this;
        var sendNewMessageButtonsBlock = document.createElement("div");
        sendNewMessageButtonsBlock.id = "send_new_message_buttons";
        var sendButton = document.createElement("button");
        sendButton.id = "send_new_message_button";
        sendButton.innerText = "Send";
        sendButton.addEventListener("click", function () { return _this.onClickSend(); });
        var cancelButton = document.createElement("button");
        cancelButton.id = "cancel_button";
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener("click", function () { return _this.onClickCancel(); });
        sendNewMessageButtonsBlock.appendChild(sendButton);
        sendNewMessageButtonsBlock.appendChild(cancelButton);
        return sendNewMessageButtonsBlock;
    };
    return NewMessageBlock;
}());
exports.NewMessageBlock = NewMessageBlock;
