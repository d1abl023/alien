package com.d1abl023.hrhelper;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class HRHApplication {

    public static void main(String[] args) {
        SpringApplication.run(HRHApplication.class, args);
    }

}
