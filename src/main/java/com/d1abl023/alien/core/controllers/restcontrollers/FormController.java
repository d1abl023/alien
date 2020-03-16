package com.d1abl023.alien.core.controllers.restcontrollers;

import com.d1abl023.alien.forms.UserRegForm;
import com.d1abl023.alien.model.JSUser;
import com.d1abl023.alien.tables.AuthUserData;
import com.d1abl023.alien.tables.UserGeneralData;
import com.d1abl023.alien.utilactions.HibernateUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.web.bind.annotation.*;

import javax.persistence.TypedQuery;
import javax.servlet.http.HttpServletResponse;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class FormController {

    private static final Logger LOGGER = LogManager.getLogger();

    @RequestMapping(value = "/search", method = RequestMethod.POST)
    public Map<String, JSUser> search(@RequestBody String requestBody) {
        Map<String, JSUser> searchResult = new LinkedHashMap<>();
        Session session = HibernateUtils.getSessionFactory().openSession();
        Transaction transaction = session.beginTransaction();
        TypedQuery<UserGeneralData> selectUsers = session.createQuery(
                "from UserGeneralData user where user.login = :userLogin", UserGeneralData.class);
        selectUsers.setParameter("userLogin", requestBody);
        List<UserGeneralData> dbUserGeneralData = selectUsers.getResultList();
        for (UserGeneralData tmpUserGeneralData : dbUserGeneralData) {
            searchResult.put(Long.toString(tmpUserGeneralData.getId()), (new JSUser(tmpUserGeneralData)));
        }
        transaction.commit();
        session.close();
        return searchResult;
    }

    @RequestMapping("/registration")
    public void registration(@RequestBody UserRegForm userRegForm, HttpServletResponse response) {

        try {
            //Creating DB session
            Session session = HibernateUtils.getSessionFactory().openSession();

            UserGeneralData userGeneralData = userRegForm.createUserTableObject();

            //Saving used data(id, login, email, date of birth, sex, phone number,
            // country, city, status, user type) into DB table
            Transaction transaction = session.beginTransaction();
            session.save(userGeneralData);
            transaction.commit();

            //Verifying if user data has been successfully added into DB table
            //If success - adding user auth data, else - throwing InternalError
            transaction = session.beginTransaction();
            if (session.createQuery("from UserGeneralData user where user.id = " + userGeneralData.getId()).list().size() > 0) {

                transaction.commit();

                AuthUserData authUserData = userRegForm.createUserAuthTableObject();
                authUserData.setId(userGeneralData.getId());

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
