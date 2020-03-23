package com.d1abl023.alien.forms;

import com.d1abl023.alien.interfaces.Form;
import com.d1abl023.alien.tables.UserAuthData;
import com.d1abl023.alien.tables.UserGeneralData;
import com.d1abl023.alien.tables.UserNameData;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

@JsonAutoDetect
public class UserRegForm implements Form {

    @JsonProperty("first_name")
    private String firstName;

    @JsonProperty("second_name")
    private String secondName;

    @JsonProperty("last_name")
    private String lastName;

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

    @JsonProperty("education")
    private String education;

    @JsonProperty("place_of_work")
    private String placeOfWork;

    @JsonProperty("position")
    private String position;

    @JsonProperty("email")
    private String email;

    @JsonProperty("sex")
    private String sex;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getSecondName() {
        return secondName;
    }

    public void setSecondName(String secondName) {
        this.secondName = secondName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
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

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getPlaceOfWork() {
        return placeOfWork;
    }

    public void setPlaceOfWork(String placeOfWork) {
        this.placeOfWork = placeOfWork;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
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

    /**
     * Method {@code createUserGeneralDataTableObject()} creates object
     * for mapping data into table {@code user_general_data}
     */
    public UserGeneralData createUserGeneralDataTableObject() {
        return new UserGeneralData(
                this.email,
                this.dateOfBirth,
                this.sex,
                this.phoneNumber,
                this.country,
                this.city,
                this.placeOfWork,
                this.education,
                this.position,
                0
        );
    }

    /**
     * Method {@code createUserNameDataTableObject()} creates object
     * for mapping data into table {@code user_name_data}
     */
    public UserNameData createUserNameDataTableObject(){
        return new UserNameData(
                this.firstName,
                this.secondName,
                this.lastName
        );
    }

    /**
     * Method {@code createUserAuthDataTableObject()} creates object
     * for mapping data into table {@code auth_data}
     */
    public UserAuthData createUserAuthDataTableObject() {
        return new UserAuthData(
                this.login,
                this.password,
                this.phoneNumber,
                this.email
        );
    }
}
