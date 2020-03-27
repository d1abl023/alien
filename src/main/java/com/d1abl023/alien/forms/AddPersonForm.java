package com.d1abl023.alien.forms;

import com.d1abl023.alien.interfaces.IPersonDataForm;
import com.d1abl023.alien.tables.UserAdditionalData;
import com.d1abl023.alien.tables.UserGeneralData;
import com.d1abl023.alien.tables.UserNameData;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class AddPersonForm implements IPersonDataForm {

    @JsonProperty("first_name")
    private String firstName;

    @JsonProperty("second_name")
    private String secondName;

    @JsonProperty("last_name")
    private String lastName;

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

    @JsonProperty("homecountry")
    private String homecountry;

    @JsonProperty("hometown")
    private String hometown;

    @JsonProperty("schoolList")
    private String schoolList;

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

    public String getHomecountry() {
        return homecountry;
    }

    public void setHomecountry(String homecountry) {
        this.homecountry = homecountry;
    }

    public String getHometown() {
        return hometown;
    }

    public void setHometown(String hometown) {
        this.hometown = hometown;
    }

    public String getSchoolList() {
        return schoolList;
    }

    public void setSchoolList(String schoolList) {
        this.schoolList = schoolList;
    }

    /**
     * Method {@code createUserGeneralDataTableObject()} creates object
     * for mapping data into table {@code user_general_data}
     */
    public UserGeneralData createUserGeneralDataTableObject() {
        return new UserGeneralData(this);
    }

    /**
     * Method {@code createUserAdditionalDataTableObject()} creates object
     * for mapping data into table {@code user_additional_data}
     */
    public UserAdditionalData createUserAdditionalDataTableObject(){
        return new UserAdditionalData(this);
    }

    /**
     * Method {@code createUserNameDataTableObject()} creates object
     * for mapping data into table {@code user_name_data}
     */
    public UserNameData createUserNameDataTableObject(){
        return new UserNameData(this);
    }

    @Override
    public String toString() {
        return "AddPearsonForm{" +
                "firstName='" + firstName + '\'' +
                ", secondName='" + secondName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", phoneNumber=" + phoneNumber +
                ", country='" + country + '\'' +
                ", city='" + city + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", education='" + education + '\'' +
                ", placeOfWork='" + placeOfWork + '\'' +
                ", position='" + position + '\'' +
                ", email='" + email + '\'' +
                ", sex='" + sex + '\'' +
                ", homecountry='" + homecountry + '\'' +
                ", hometown='" + hometown + '\'' +
                ", schoolList='" + schoolList + '\'' +
                '}';
    }
}
