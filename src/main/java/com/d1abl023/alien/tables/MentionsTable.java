package com.d1abl023.alien.tables;

import com.d1abl023.alien.interfaces.IDBTable;

import javax.persistence.*;

@Entity
@Table(name = "mentions")
public class MentionsTable implements IDBTable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "mentions")
    private String mention;

    public MentionsTable() {
    }

    public MentionsTable(long id, String mention) {
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
