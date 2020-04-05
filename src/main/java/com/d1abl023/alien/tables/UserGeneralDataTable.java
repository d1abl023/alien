package com.d1abl023.alien.tables;

import com.d1abl023.alien.interfaces.IDBTable;
import com.d1abl023.alien.interfaces.IPersonDataForm;
import com.d1abl023.alien.model.JSUser;

import javax.persistence.*;
import java.util.Date;


@Entity
@Table(name = "user_general_data")
public class UserGeneralDataTable implements IDBTable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "email")
    private String email;

    @Column(name = "date_of_birth")
    private Date date;

    @Column(name = "sex")
    private String sex;

    @Column(name = "phone_number")
    private long phoneNumber;

    @Column(name = "country")
    private String country;

    @Column(name = "city")
    private String city;

    @Column(name = "place_of_work")
    private String placeOfWork;

    @Column(name = "education")
    private String education;

    @Column(name = "position")
    private String position;

    @Column(name = "amount_of_mentions")
    private int amountOfMentions;

    public UserGeneralDataTable() {
    }

    public UserGeneralDataTable(IPersonDataForm pearsonDataForm) {
        this.email = pearsonDataForm.getEmail();
        this.date = pearsonDataForm.getDateOfBirth();
        this.sex = pearsonDataForm.getSex();
        this.phoneNumber = pearsonDataForm.getPhoneNumber();
        this.country = pearsonDataForm.getCountry();
        this.city = pearsonDataForm.getCity();
        this.placeOfWork = pearsonDataForm.getPlaceOfWork();
        this.education = pearsonDataForm.getEducation();
        this.position = pearsonDataForm.getPosition();
        this.amountOfMentions = 0;
    }

    public UserGeneralDataTable(JSUser userGeneralData) {
        this.id = new Long(userGeneralData.getId());
        this.email = userGeneralData.getEmail();
        this.date = userGeneralData.getDate();
        this.sex = userGeneralData.getSex();
        this.phoneNumber = userGeneralData.getNumber();
        this.country = userGeneralData.getCountry();
        this.city = userGeneralData.getCity();
        this.placeOfWork = userGeneralData.getPlaceOfWork();
        this.education = userGeneralData.getEducation();
        this.position = userGeneralData.getPosition();
        this.amountOfMentions = getAmountOfMentions();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public int getAmountOfMentions() {
        return amountOfMentions;
    }

    public void setAmountOfMentions(int amountOfMentions) {
        this.amountOfMentions = amountOfMentions;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", date=" + date +
                ", sex='" + sex + '\'' +
                ", number=" + phoneNumber +
                ", country='" + country + '\'' +
                ", city='" + city + '\'' +
                ", placeOfWork='" + placeOfWork + '\'' +
                ", education='" + education + '\'' +
                ", position='" + position + '\'' +
                ", amountOfMentions=" + amountOfMentions +
                '}';
    }
}
