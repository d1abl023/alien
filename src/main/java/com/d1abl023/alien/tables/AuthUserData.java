package com.d1abl023.alien.tables;

import com.d1abl023.alien.interfaces.DBTable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "auth_data")
public class AuthUserData implements DBTable {

    @Id
    private long id;

    @Column(name = "login")
    private String login;

    @Column(name = "password")
    private String password;

    @Column(name = "phone_number")
    private long phone;

    @Column(name = "email")
    private String email;


    public AuthUserData() {
    }


    public AuthUserData(long id, String login, String password, long phone, String email) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.phone = phone;
        this.email = email;
    }

    public AuthUserData(String login, String password, long phone, String email) {
        this.login = login;
        this.password = password;
        this.phone = phone;
        this.email = email;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public long getPhone() {
        return phone;
    }

    public void setPhone(long phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
