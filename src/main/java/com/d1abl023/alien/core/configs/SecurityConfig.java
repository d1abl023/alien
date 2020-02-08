package com.d1abl023.alien.core.configs;


import com.d1abl023.alien.core.components.AlienAuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AlienAuthenticationProvider authenticationProvider;

    @Override
    protected void configure(final AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authenticationProvider);
    }

    @Override
    protected void configure(final HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
//                .antMatchers("/js/**").permitAll()
                .antMatchers("/out/**").permitAll()
//                .antMatchers("/css/**").permitAll()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .antMatchers("/anonymous*").anonymous()
                .antMatchers("/application.html*").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .loginPage("/application.html?login")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/application.html?pageOfUser=my&success=true", true)
                .failureUrl("/application.html&error=true")
//                .failureHandler(/*authenticationFailureHandler()*/)
                .and()
                .logout()
//                .logoutUrl("/perform_logout")
                .deleteCookies("JSESSIONID")
                .and()
                .httpBasic();
//                .logoutSuccessHandler(logoutSuccessHandler());
    }


}
