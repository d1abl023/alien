package com.d1abl023.alien.model;

import com.d1abl023.alien.tables.UserGeneralData;

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

    public JSUser(UserGeneralData userGeneralData){
        this.id = Long.toString(userGeneralData.getId());
        this.login = userGeneralData.getLogin();
        this.email = userGeneralData.getEmail();
        this.date = userGeneralData.getDate();
        this.sex = userGeneralData.getSex();
        this.number = userGeneralData.getPhoneNumber();
        this.country = userGeneralData.getCountry();
        this.city = userGeneralData.getCity();
        this.placeOfWork = userGeneralData.getPlaceOfWork();
        this.education = userGeneralData.getEducation();
        this.status = userGeneralData.getStatus();
        this.type = userGeneralData.getType();
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
