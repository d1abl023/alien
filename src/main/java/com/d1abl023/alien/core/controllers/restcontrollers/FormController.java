package com.d1abl023.alien.core.controllers.restcontrollers;

import com.d1abl023.alien.forms.UserRegForm;
import com.d1abl023.alien.model.JSUser;
import com.d1abl023.alien.tables.AuthUserData;
import com.d1abl023.alien.tables.User;
import com.d1abl023.alien.utilactions.HibernateUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.web.bind.annotation.*;

import javax.persistence.Query;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@RestController
public class FormController {

    private static final Logger LOGGER = LogManager.getLogger();

    @RequestMapping(value = "/search", method = RequestMethod.POST)
    public Map<String, List> search(@RequestBody String requestBody, HttpServletResponse response) throws IOException {

        Map<String, List> searchResult = new LinkedHashMap<>();

        Session session = HibernateUtils.getSessionFactory().openSession();
        Transaction transaction = session.beginTransaction();

        Query selectUsers = session.createQuery("from User user where user.login = :userLogin");
        selectUsers.setParameter("userLogin", requestBody);
        List dbUsers = selectUsers.getResultList();
        List<JSUser> users = new LinkedList<>();
        for(Object tmpUser : dbUsers){
            users.add(new JSUser((User) tmpUser));
        }
        searchResult.put("users", users);

        return searchResult;
    }

    @RequestMapping("/registration")
    public void registration(@RequestBody UserRegForm userRegForm, HttpServletResponse response) {

        try {
            //Creating DB session
            Session session = HibernateUtils.getSessionFactory().openSession();

            User user = userRegForm.createUserTableObject();

            //Saving used data(id, login, email, date of birth, sex, phone number,
            // country, city, status, user type) into DB table
            Transaction transaction = session.beginTransaction();
            session.save(user);
            transaction.commit();

            //Verifying if user data has been successfully added into DB table
            //If success - adding user auth data, else - throwing InternalError
            transaction = session.beginTransaction();
            if (session.createQuery("from User user where user.id = " + user.getId()).list().size() > 0) {

                transaction.commit();

                AuthUserData authUserData = userRegForm.createUserAuthTableObject();
                authUserData.setId(user.getId());

                //Saving user authentication data (id, login, password) into DB table
                transaction = session.beginTransaction();
                session.save(authUserData);
                transaction.commit();

                //Verifying if user authentication data has been successfully added onto DB table
                //If success - setting response status 201 and adding response cookies, else - throwing InternalError
                transaction = session.beginTransaction();
                if (session.createQuery("from AuthUserData authData where authData.id = "
                        + authUserData.getId()).list().size() > 0) {

                    transaction.commit();

                    response.setStatus(201);

                } else {
                    transaction.commit();
                    throw new InternalError("Error adding into \"auth_data\" DB table!");
                }
            } else {
                transaction.commit();
                throw new InternalError("Error adding into \"users\" DB table!");
            }
        } catch (InternalError e) {
            LOGGER.error(e.getMessage());
            response.setStatus(500);
        }
    }

}
