package com.d1abl023.hrhelper.model;

import java.io.Serializable;

public class SearchResponse implements Serializable {

    private String[] user_list;

    public SearchResponse() {
    }

    public String[] getUser_list() {
        return user_list;
    }

    public void setUser_list(String[] user_list) {
        this.user_list = user_list;
    }
}
