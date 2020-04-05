package com.d1abl023.alien.model;

import com.d1abl023.alien.tables.UserAdditionalDataTable;
import com.fasterxml.jackson.annotation.JsonProperty;

public class JSAdditionalUserData {

    @JsonProperty("id")
    private String id;

    @JsonProperty("homecountry")
    private String homecountry;

    @JsonProperty("hometown")
    private String hometown;

    @JsonProperty("schoolList")
    private String schoolList;

    public JSAdditionalUserData() {
    }

    public JSAdditionalUserData(UserAdditionalDataTable userAdditionalDataTable) {
        if(userAdditionalDataTable != null) {
            this.id = Long.toString(userAdditionalDataTable.getId());
            this.homecountry = userAdditionalDataTable.getHomecountry();
            this.hometown = userAdditionalDataTable.getHometown();
            this.schoolList = userAdditionalDataTable.getScoolList();
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public String getSchoolList() {
        return schoolList;
    }

    public void setSchoolList(String schoolList) {
        this.schoolList = schoolList;
    }

    @Override
    public String toString() {
        return "JSAdditionalUserData{" +
                "id='" + id + '\'' +
                ", homecountry='" + homecountry + '\'' +
                ", hometown='" + hometown + '\'' +
                ", schoolList='" + schoolList + '\'' +
                '}';
    }
}
