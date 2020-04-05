package com.d1abl023.hrhelper.tables;

import com.d1abl023.hrhelper.interfaces.IDBTable;
import com.d1abl023.hrhelper.interfaces.IPersonDataForm;
import com.d1abl023.hrhelper.model.JSAdditionalUserData;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "user_additional_data")
public class UserAdditionalDataTable implements IDBTable {

    @Id
    private long id;

    @Column(name = "homecountry")
    private String homecountry;

    @Column(name = "hometown")
    private String hometown;

    @Column(name = "school_list")
    private String scoolList;

    public UserAdditionalDataTable() {
    }

    public UserAdditionalDataTable(IPersonDataForm pearsonDataForm){
        this.homecountry = pearsonDataForm.getHomecountry();
        this.hometown = pearsonDataForm.getHometown();
        this.scoolList = pearsonDataForm.getSchoolList();
    }
    
    public UserAdditionalDataTable(JSAdditionalUserData additionalUserData){
        this.id = new Long(additionalUserData.getId());
        this.homecountry = additionalUserData.getHomecountry();
        this.hometown = additionalUserData.getHometown();
        this.scoolList = additionalUserData.getSchoolList();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public String getScoolList() {
        return scoolList;
    }

    public void setScoolList(String scoolList) {
        this.scoolList = scoolList;
    }

    @Override
    public String toString() {
        return "UserAdditionalData{" +
                "id=" + id +
                ", homecountry='" + homecountry + '\'' +
                ", hometown='" + hometown + '\'' +
                ", scoolList='" + scoolList + '\'' +
                '}';
    }
}
