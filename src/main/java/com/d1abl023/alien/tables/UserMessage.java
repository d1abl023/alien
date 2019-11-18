package com.d1abl023.alien.tables;

import com.d1abl023.alien.interfaces.DBTable;
import com.d1abl023.alien.interfaces.Message;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "messages")
public class UserMessage implements DBTable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "dialogId")
    private long dialogId;

    @Column(name = "sender")
    private String sender;

    @Column(name = "receiver")
    private String receiver;

    @Column(name = "msg")
    private String text;

    @Column(name = "timestamp")
    private long timestamp;

    public UserMessage() {
    }

    public UserMessage(long dialogId, String sender, String receiver, String text, long timestamp) {
        this.dialogId = dialogId;
        this.sender = sender;
        this.receiver = receiver;
        this.text = text;
        this.timestamp = timestamp;
    }

    public UserMessage(long id, long dialogId, String sender, String receiver, String text, long timestamp) {
        this.id = id;
        this.dialogId = dialogId;
        this.sender = sender;
        this.receiver = receiver;
        this.text = text;
        this.timestamp = timestamp;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "UserMessage{" +
                "id=" + id +
                ", dialogId=" + dialogId +
                ", sender='" + sender + '\'' +
                ", receiver='" + receiver + '\'' +
                ", text='" + text + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
