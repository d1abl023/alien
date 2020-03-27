package com.d1abl023.alien.tables;

import com.d1abl023.alien.interfaces.IDBTable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "mentions")
public class Mentions implements IDBTable {

    @Id
    @Column(name = "id")
    private long id;

    @Column(name = "mentions")
    private String mention;

    public Mentions() {
    }

    public Mentions(long id, String mention) {
        this.id = id;
        this.mention = mention;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getMention() {
        return mention;
    }

    public void setMention(String mention) {
        this.mention = mention;
    }
}
