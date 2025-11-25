package com.fieldz;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class BootCheck {

    public BootCheck(Environment env) {
        var user = env.getProperty("MAIL_USERNAME");
        log.info("🔍 MAIL_USERNAME present? {}", (user != null && !user.isBlank()));
        var from = env.getProperty("MAIL_FROM");
        log.info("🔍 MAIL_FROM = {}", from);
        var host = env.getProperty("SPRING_MAIL_HOST");
        log.info("🔍 SPRING_MAIL_HOST = {}", host);
    }
}
