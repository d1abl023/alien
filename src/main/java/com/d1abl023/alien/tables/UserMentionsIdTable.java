package com.d1abl023.alien.tables;

import com.d1abl023.alien.interfaces.IDBTable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "user_mentions_id")
public class UserMentionsIdTable implements IDBTable {

    @Id
    private long id;

    @Column(name = "mentions_id_list")
    private String mentionsIdList;

    public UserMentionsIdTable() {
    }

    public UserMentionsIdTable(long id, String mentionsIdList) {
        this.id = id;
        this.mentionsIdList = mentionsIdList;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getMentionsIdList() {
        return mentionsIdList;
    }

    public void setMentionsIdList(String mentionsIdList) {
        this.mentionsIdList = mentionsIdList;
    }

    public void addElementToMentionIdList(String string){
        this.mentionsIdList += " |+| " + string;
    }
}
