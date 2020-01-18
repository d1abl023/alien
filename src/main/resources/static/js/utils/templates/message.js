class Message {
    constructor(dialogId, senderId, receiverId, text, senderLogin, receiverLogin) {
        // let dialogId = dialogId;
        // let senderId = senderId;
        // let senderLogin = senderLogin;
        // let receiverId = receiverId;
        // let receiverLogin = receiverLogin;
        // let text = text;

        this.createMessageObject = function () {
            return {
                "dialogId": dialogId,
                "senderId": senderId,
                "receiverId": receiverId,
                "text": text,
                "senderLogin": senderLogin,
                "receiverLogin": receiverLogin
            };
        }
    }
}