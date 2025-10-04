package com.fieldz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FieldzApplication {

	public static void main(String[] args) {
		SpringApplication.run(FieldzApplication.class, args);
	}

}
