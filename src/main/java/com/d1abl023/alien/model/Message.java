package com.d1abl023.alien.model;

import java.io.Serializable;

/**
 * Class {@code Message} represents model of private messages,
 * that is used in client-server communication
 */
public class Message implements Serializable {

    private String timestamp;

    private long dialogId;

    private String sender;

    private String receiver;

    private String text;

    public Message() {
    }

    public Message(String timestamp, long dialogId, String sender, String receiver, String text) {
        this.timestamp = timestamp;
        this.dialogId = dialogId;
        this.sender = sender;
        this.receiver = receiver;
        this.text = text;
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

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @Override
    public String toString() {
        return "Message{" +
                "id=" + timestamp +
                ", dialogId=" + dialogId +
                ", sender='" + sender + '\'' +
                ", receiver='" + receiver + '\'' +
                ", text='" + text + '\'' +
                '}';
    }
}
