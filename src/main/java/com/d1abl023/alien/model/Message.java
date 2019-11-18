package com.d1abl023.alien.model;

import java.io.Serializable;

/**
 * Class {@code Message} represents model of private messages,
 * that is used in client-server communication
 */
public class Message implements Serializable {

    private String timestamp;

    private long dialogId;

    private String senderId;

    private String receiverId;

    private String text;

    private String senderLogin;

    private String receiverLogin;

    public Message() {
    }

    public Message(String timestamp, long dialogId, String senderId, String receiver, String text) {
        this.timestamp = timestamp;
        this.dialogId = dialogId;
        this.senderId = senderId;
        this.receiverId = receiver;
        this.text = text;
    }

    public Message(String timestamp, long dialogId, String senderId, String receiverId,
                   String text, String senderLogin, String receiverLogin) {
        this.timestamp = timestamp;
        this.dialogId = dialogId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.text = text;
        this.senderLogin = senderLogin;
        this.receiverLogin = receiverLogin;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public long getDialogId() {
        return dialogId;
    }

    public void setDialogId(long dialogId) {
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
                "id=" + timestamp +
                ", dialogId=" + dialogId +
                ", sender='" + senderId + '\'' +
                ", receiver='" + receiverId + '\'' +
                ", text='" + text + '\'' +
                '}';
    }
}
