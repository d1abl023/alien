package com.d1abl023.hrhelper.tables;

import com.d1abl023.hrhelper.interfaces.IDBTable;
import com.d1abl023.hrhelper.interfaces.IUserDataForm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "auth_data")
public class UserAuthDataTable implements IDBTable {

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


    public UserAuthDataTable() {
    }


    public UserAuthDataTable(IUserDataForm userDataForm) {
        this.login = userDataForm.getLogin();
        this.password = userDataForm.getPassword();
        this.email = userDataForm.getEmail();
        this.phone = userDataForm.getPhoneNumber();
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
