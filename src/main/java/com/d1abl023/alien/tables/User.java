package com.d1abl023.alien.tables;

import com.d1abl023.alien.interfaces.DBTable;
import com.d1abl023.alien.utilactions.HibernateUtils;
import org.apache.commons.lang3.RandomUtils;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "users")
public class User implements DBTable {

    @Id
    @Column(name = "id")
    private long id;

    @Column(name = "login")
    private String login;

    @Column(name = "email")
    private String email;

    @Column(name = "date_of_birth")
    private Date date;

    @Column(name = "sex")
    private String sex;

    @Column(name = "phone_number")
    private long number;

    @Column(name = "country")
    private String country;

    @Column(name = "city")
    private String city;

    @Column(name = "place_of_work")
    private String placeOfWork;

    @Column(name = "education")
    private String education;

    @Column(name = "status")
    private String status;

    @Column(name = "type")
    private String type;

    public User() {
    }

    public User(String login, String email, Date date, String sex, long number, String country, String city, String status, String type) {
        this.id = System.nanoTime();
        this.login = login;
        this.email = email;
        this.date = date;
        this.sex = sex;
        this.number = number;
        this.country = country;
        this.city = city;
        this.status = status;
        this.type = type;
    }

    public User(long id, String login, String email, Date date, String sex,
                long number, String country, String city, String status, String type) {
        this.id = id;
        this.login = login;
        this.email = email;
        this.date = date;
        this.sex = sex;
        this.number = number;
        this.country = country;
        this.city = city;
        this.status = status;
        this.type = type;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {

        boolean contains = true;
        Session session = HibernateUtils.getSessionFactory().openSession();

        Transaction transaction = session.beginTransaction();

        while (contains) {

            Query query = session.createQuery("from User user where user.id = " + id);
            if (query.list().size() == 0) {
                contains = false;
            }else{
                id = RandomUtils.nextLong();
            }

        }
        transaction.commit();
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
