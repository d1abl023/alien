package com.d1abl023.alien.tables;

import com.d1abl023.alien.interfaces.DBTable;
import com.d1abl023.alien.model.ChatMessage;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
@Table(name = "chat_room_1_messages")
public class ChatRoom1Msg implements DBTable {

//    private static final SimpleDateFormat FORMAT = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss.SSS");

    @Id
    private long id;

    @Column(name = "type")
    private String type;

    @Column(name = "content")
    private String content;

    @Column(name = "sender")
    private String sender;

    @Column(name = "timestamp")
    private String timestamp;

    public ChatRoom1Msg() {
    }

    public ChatRoom1Msg(ChatMessage message) {
        this.id = System.nanoTime();
        this.type = message.getType().name();
        this.content = message.getContent();
        this.sender = message.getSender();
        this.timestamp = /*FORMAT*/new SimpleDateFormat("MM/dd/yyyy HH:mm:ss.SSS").format(new Date().getTime());
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = /*FORMAT*/new SimpleDateFormat("MM/dd/yyyy HH:mm:ss.SSS").format(timestamp);
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
