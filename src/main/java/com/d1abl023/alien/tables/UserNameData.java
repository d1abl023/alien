package com.d1abl023.alien.tables;

import com.d1abl023.alien.interfaces.DBTable;

import javax.persistence.*;

@Entity
@Table(name = "user_name_data")
public class UserNameData implements DBTable {

    @Id
    @Column(name = "id")
    private long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "second_name")
    private String secondName;

    @Column(name = "last_name")
    private String lastName;

    public UserNameData() {
    }

    public UserNameData(String firstName, String secondName, String lastName){
        this.firstName = firstName;
        this.secondName = secondName;
        this.lastName = lastName;
    }

    public UserNameData(long id, String firstName, String secondName, String lastName){
        this.id = id;
        this.firstName = firstName;
        this.secondName = secondName;
        this.lastName = lastName;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

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

    @Override
    public String toString() {
        return "UserNameData{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", secondName='" + secondName + '\'' +
                ", lastName='" + lastName + '\'' +
                '}';
    }
}
