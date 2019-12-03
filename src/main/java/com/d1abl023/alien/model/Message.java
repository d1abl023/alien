package com.d1abl023.alien.model;

import java.io.Serializable;

/**
 * Class {@code Message} represents model of private messages,
 * that is used in client-server communication
 */
public class Message implements Serializable {

    private String id;

    private String timestamp;

    private String dialogId;

    private String senderId;

    private String receiverId;

    private String text;

    private String senderLogin;

    private String receiverLogin;

    public Message() {
    }

    public Message(String timestamp, String dialogId, String senderId, String receiverId,
                   String text, String senderLogin, String receiverLogin) {
        this.timestamp = timestamp;
        this.dialogId = dialogId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.text = text;
        this.senderLogin = senderLogin;
        this.receiverLogin = receiverLogin;
    }

    public Message(String id, String timestamp, String dialogId, String senderId,
                   String receiverId, String text, String senderLogin, String receiverLogin) {
        this.id = id;
        this.timestamp = timestamp;
        this.dialogId = dialogId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.text = text;
        this.senderLogin = senderLogin;
        this.receiverLogin = receiverLogin;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getDialogId() {
        return dialogId;
    }

    public void setDialogId(String dialogId) {
        this.dialogId = dialogId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getSenderLogin() {
        return senderLogin;
    }

    public void setSenderLogin(String senderLogin) {
        this.senderLogin = senderLogin;
    }

    public String getReceiverLogin() {
        return receiverLogin;
    }

    public void setReceiverLogin(String receiverLogin) {
        this.receiverLogin = receiverLogin;
    }


    @Override
    public String toString() {
        return "Message{" +
                "id='" + id + '\'' +
                ", timestamp='" + timestamp + '\'' +
                ", dialogId='" + dialogId + '\'' +
                ", senderId='" + senderId + '\'' +
                ", receiverId='" + receiverId + '\'' +
                ", text='" + text + '\'' +
                ", senderLogin='" + senderLogin + '\'' +
                ", receiverLogin='" + receiverLogin + '\'' +
                '}';
    }
}
