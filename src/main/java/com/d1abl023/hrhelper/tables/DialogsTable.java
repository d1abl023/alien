package com.d1abl023.hrhelper.tables;

import com.d1abl023.hrhelper.interfaces.IDBTable;

import javax.persistence.*;

@Entity
@Table(name = "dialogs")
public class DialogsTable implements IDBTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "user1")
    private long user1;

    @Column(name = "user2")
    private long user2;

    @Column(name = "user1Login")
    private String user1Login;

    @Column(name = "user2Login")
    private String user2Login;

    public DialogsTable() {
    }

    public DialogsTable(long user1, long user2) {
        this.user1 = user1;
        this.user2 = user2;
    }

    public DialogsTable(long id, long user1, long user2) {
        this.id = id;
        this.user1 = user1;
        this.user2 = user2;
    }

    public DialogsTable(long user1, long user2, String user1Login, String user2Login) {
        this.user1 = user1;
        this.user2 = user2;
        this.user1Login = user1Login;
        this.user2Login = user2Login;
    }

    public DialogsTable(long id, long user1, long user2, String user1Login, String user2Login) {
        this.id = id;
        this.user1 = user1;
        this.user2 = user2;
        this.user1Login = user1Login;
        this.user2Login = user2Login;
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

    public String getUser1Login() {
        return user1Login;
    }

    public void setUser1Login(String user1Login) {
        this.user1Login = user1Login;
    }

    public String getUser2Login() {
        return user2Login;
    }

    public void setUser2Login(String user2Login) {
        this.user2Login = user2Login;
    }

    @Override
    public String toString() {
        return "Dialogs{" +
                "id=" + id +
                ", user1=" + user1 +
                ", user2=" + user2 +
                ", user1Login='" + user1Login + '\'' +
                ", user2Login='" + user2Login + '\'' +
                '}';
    }
}
