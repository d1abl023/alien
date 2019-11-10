package com.d1abl023.alien.model;

public class OutputMessage {

    private String from;
    private String text;

    public OutputMessage() {
    }

    public OutputMessage(String from, String text) {
        this.from = from;
        this.text = text;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
