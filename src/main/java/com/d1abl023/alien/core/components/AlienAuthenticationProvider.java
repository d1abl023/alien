package com.d1abl023.alien.core.components;

import com.d1abl023.alien.tables.AuthUserData;
import com.d1abl023.alien.utilactions.HibernateUtils;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.persistence.Query;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class AlienAuthenticationProvider implements AuthenticationProvider {

    private static final Pattern NUMERIC_PATTERN = Pattern.compile("\\d+");

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        Matcher numericMatcher = NUMERIC_PATTERN.matcher(username);

        Session session = HibernateUtils.getSessionFactory().openSession();
        Transaction transaction = session.beginTransaction();

        Query query;

        if (numericMatcher.matches()) {
            query = session.createQuery("from AuthUserData authData where authData.id = :username " +
                    "or authData.phone = :username");
            query.setParameter("username", new Long(username));
        } else if (username.contains("@")) {
            query = session.createQuery("from AuthUserData authData where authData.email = :username");
            query.setParameter("username", username);
        } else {
            query = session.createQuery("from AuthUserData authData where authData.login = :username");
            query.setParameter("username", username);
        }

        List dbData = query.getResultList();
        transaction.commit();

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("USER"));

        if (dbData.size() == 1) {

            AuthUserData user = (AuthUserData) dbData.get(0);

            if (user.getPassword().equals(password)) {
                return new UsernamePasswordAuthenticationToken(user.getId(), user.getPassword(), authorities);
            } else {
                throw new BadCredentialsException("Incorrect password!");
            }
        } else {
            throw new BadCredentialsException("Authentication failed!");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
