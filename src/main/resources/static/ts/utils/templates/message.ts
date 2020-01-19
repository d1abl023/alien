export class Message {
    constructor() {
        // let dialogId = dialogId;
        // let senderId = senderId;
        // let senderLogin = senderLogin;
        // let receiverId = receiverId;
        // let receiverLogin = receiverLogin;
        // let text = text;


    }

    public createMessageObject (dialogId, senderId, receiverId, text, senderLogin, receiverLogin) {
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