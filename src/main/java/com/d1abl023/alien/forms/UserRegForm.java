package com.d1abl023.alien.forms;

import com.d1abl023.alien.interfaces.Form;
import com.d1abl023.alien.tables.AuthUserData;
import com.d1abl023.alien.tables.User;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

@JsonAutoDetect
public class UserRegForm implements Form {

    @JsonProperty("login")
    private String login;

    @JsonProperty("password")
    private String password;

    @JsonProperty("phone_number")
    private long phoneNumber;

    @JsonProperty("country")
    private String country;

    @JsonProperty("city")
    private String city;

    @JsonProperty("date_of_birth")
    private Date dateOfBirth;

    @JsonProperty("email")
    private String email;

    @JsonProperty("sex")
    private String sex;

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

    public long getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(long phoneNumber) {
        this.phoneNumber = phoneNumber;
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

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    @Override
    public String toString() {
        return "UserRegForm{" +
                "login='" + login + '\'' +
                ", password='" + password + '\'' +
                ", phoneNumber=" + phoneNumber +
                ", country='" + country + '\'' +
                ", city='" + city + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", email='" + email + '\'' +
                ", sex='" + sex + '\'' +
                '}';
    }

    /**Method {@code createUserTableDataObject()} creates object
     * for mapping data into table {@code users}*/
    public User createUserTableObject(){
        return new User(login,email,dateOfBirth,sex,phoneNumber,country,city,"null", "null");
    }

    /**Method {@code createUserAuthTableObject()} creates object
     * for mapping data into table {@code auth_data}*/
    public AuthUserData createUserAuthTableObject(){
        return new AuthUserData(login,password,phoneNumber,email);
    }
}
