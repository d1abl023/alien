package com.d1abl023.alien.tables;

import com.d1abl023.alien.interfaces.DBTable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "mentions")
public class Mentions implements DBTable {

    @Id
    @Column(name = "id")
    private long id;

    @Column(name = "mentions")
    private String mentions;

    public Mentions() {
    }

    public Mentions(long id, String mentions) {
        this.id = id;
        this.mentions = mentions;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getMentions() {
        return mentions;
    }

    public void setMentions(String mentions) {
        this.mentions = mentions;
    }
}
