package com.d1abl023.alien.model;

import java.io.Serializable;

public class JSMention implements Serializable {

    private String id;
    private String mentionedPersonId;
    private String mentionFromId;
    private String mentionFromCorpId;
    private String mention_text;
    private String timestamp;

    public JSMention() {
    }

    public JSMention(String id, String mentionedPersonId, String mentionFromId, String mentionFromCorpId, String mention_text, String timestamp) {
        this.id = id;
        this.mentionedPersonId = mentionedPersonId;
        this.mentionFromId = mentionFromId;
        this.mentionFromCorpId = mentionFromCorpId;
        this.mention_text = mention_text;
        this.timestamp = timestamp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMentionedPersonId() {
        return mentionedPersonId;
    }

    public void setMentionedPersonId(String mentionedPersonId) {
        this.mentionedPersonId = mentionedPersonId;
    }

    public String getMentionFromId() {
        return mentionFromId;
    }

    public void setMentionFromId(String mentionFromId) {
        this.mentionFromId = mentionFromId;
    }

    public String getMentionFromCorpId() {
        return mentionFromCorpId;
    }

    public void setMentionFromCorpId(String mentionFromCorpId) {
        this.mentionFromCorpId = mentionFromCorpId;
    }

    public String getMention_text() {
        return mention_text;
    }

    public void setMention_text(String mention_text) {
        this.mention_text = mention_text;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "JSMention{" +
                "id='" + id + '\'' +
                ", mentionedPersonId='" + mentionedPersonId + '\'' +
                ", mentionFromId='" + mentionFromId + '\'' +
                ", mentionFromCorpId='" + mentionFromCorpId + '\'' +
                ", mention_text='" + mention_text + '\'' +
                ", timestamp='" + timestamp + '\'' +
                '}';
    }
}
