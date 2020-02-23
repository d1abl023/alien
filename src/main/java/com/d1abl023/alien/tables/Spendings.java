package com.d1abl023.alien.tables;

import com.d1abl023.alien.interfaces.DBTable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "spendings")
public class Spendings implements DBTable {

    @Id
    private long id;

    @Column(name = "spendings")
    private String spendings;

    public Spendings() {
    }

    public Spendings(long id, String spendings){
        this.id = id;
        this.spendings = spendings;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getSpendings() {
        return spendings;
    }

    public void setSpendings(String spendings) {
        this.spendings = spendings;
    }

    @Override
    public String toString() {
        return "Spendings{" +
                "id=" + id +
                ", spendings='" + spendings + '\'' +
                '}';
    }
}
