package com.d1abl023.alien;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class AlienApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlienApplication.class, args);
    }

}
