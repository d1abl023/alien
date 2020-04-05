package com.d1abl023.alien.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class JSUserGeneralAndAdditionalData {

    @JsonProperty("userData")
    private JSUser generalUserData;

    @JsonProperty("userAdditionalData")
    private JSAdditionalUserData additionalUserData;

    public JSUserGeneralAndAdditionalData() {
    }

    public JSUserGeneralAndAdditionalData(JSUser generalUserData, JSAdditionalUserData additionalUserData) {
        this.generalUserData = generalUserData;
        this.additionalUserData = additionalUserData;
    }

    public JSUser getGeneralUserData() {
        return generalUserData;
    }

    public void setGeneralUserData(JSUser generalUserData) {
        this.generalUserData = generalUserData;
    }

    public JSAdditionalUserData getAdditionalUserData() {
        return additionalUserData;
    }

    public void setAdditionalUserData(JSAdditionalUserData additionalUserData) {
        this.additionalUserData = additionalUserData;
    }

    @Override
    public String toString() {
        return "JSUserGeneralAndAdditionalData{" +
                "generalUserData=" + generalUserData.toString() +
                ", additionalUserData=" + additionalUserData.toString() +
                '}';
    }
}
