package com.d1abl023.alien.interfaces;

import java.io.Serializable;
import java.util.Date;

public interface IPersonDataForm extends Serializable {

    String getFirstName();
    void setFirstName(String firstName);
    String getSecondName();
    void setSecondName(String secondName);
    String getLastName();
    void setLastName(String lastName);
    long getPhoneNumber();
    void setPhoneNumber(long phoneNumber);
    String getCountry();
    void setCountry(String country);
    String getCity();
    void setCity(String city);
    Date getDateOfBirth();
    void setDateOfBirth(Date dateOfBirth);
    String getEducation();
    void setEducation(String education);
    String getPlaceOfWork();
    void setPlaceOfWork(String placeOfWork);
    String getPosition();
    void setPosition(String position);
    String getEmail();
    void setEmail(String email);
    String getSex();
    void setSex(String sex);
    String getHomecountry();
    void setHomecountry(String homecountry);
    String getHometown();
    void setHometown(String hometown);
    String getSchoolList();
    void setSchoolList(String schoolList);
    
}
