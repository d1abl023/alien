package com.d1abl023.alien.tables;

import com.d1abl023.alien.interfaces.DBTable;

import javax.persistence.*;

@Entity
@Table(name = "dialogs")
public class Dialogs implements DBTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "user1")
    private long user1;

    @Column(name = "user2")
    private long user2;

    public Dialogs() {
    }

    public Dialogs(long user1, long user2){
        this.user1 = user1;
        this.user2 = user2;
    }

    public Dialogs(long id, long user1, long user2) {
        this.id = id;
        this.user1 = user1;
        this.user2 = user2;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getUser1() {
        return user1;
    }

    public void setUser1(long user1) {
        this.user1 = user1;
    }

    public long getUser2() {
        return user2;
    }

    public void setUser2(long user2) {
        this.user2 = user2;
    }
}
