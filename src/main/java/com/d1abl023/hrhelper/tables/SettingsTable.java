package com.d1abl023.hrhelper.tables;

import com.d1abl023.hrhelper.interfaces.IDBTable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "settings")
public class SettingsTable implements IDBTable {

    @Id
    @Column(name = "id")
    private long id;

    @Column(name = "settings")
    private String settings;

    public SettingsTable() {
    }

    public SettingsTable(long id, String settings){
        this.id = id;
        this.settings = settings;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getSettings() {
        return settings;
    }

    public void setSettings(String settings) {
        this.settings = settings;
    }
}
