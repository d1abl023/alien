package com.d1abl023.alien.model;

import com.d1abl023.alien.tables.User;

import java.io.Serializable;
import java.util.Date;

public class JSUser implements Serializable {


    private String id;

    private String login;

    private String email;

    private Date date;

    private String sex;

    private long number;

    private String country;

    private String city;

    private String placeOfWork;

    private String education;

    private String status;

    private String type;

    public JSUser() {
    }

    public JSUser(String id, String login, String email, Date date, String sex, long number, String country, String city, String placeOfWork, String education, String status, String type) {
        this.id = id;
        this.login = login;
        this.email = email;
        this.date = date;
        this.sex = sex;
        this.number = number;
        this.country = country;
        this.city = city;
        this.placeOfWork = placeOfWork;
        this.education = education;
        this.status = status;
        this.type = type;
    }

    public JSUser(User user){
        this.id = Long.toString(user.getId());
        this.login = user.getLogin();
        this.email = user.getEmail();
        this.date = user.getDate();
        this.sex = user.getSex();
        this.number = user.getNumber();
        this.country = user.getCountry();
        this.city = user.getCity();
        this.placeOfWork = user.getPlaceOfWork();
        this.education = user.getEducation();
        this.status = user.getStatus();
        this.type = user.getType();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public long getNumber() {
        return number;
    }

    public void setNumber(long number) {
        this.number = number;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPlaceOfWork() {
        return placeOfWork;
    }

    public void setPlaceOfWork(String placeOfWork) {
        this.placeOfWork = placeOfWork;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
