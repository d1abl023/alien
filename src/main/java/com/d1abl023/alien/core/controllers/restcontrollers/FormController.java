package com.d1abl023.alien.core.controllers.restcontrollers;

import com.d1abl023.alien.forms.UserRegForm;
import com.d1abl023.alien.model.JSUser;
import com.d1abl023.alien.tables.UserAuthData;
import com.d1abl023.alien.tables.UserGeneralData;
import com.d1abl023.alien.tables.UserNameData;
import com.d1abl023.alien.utilactions.HibernateUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.HibernateException;
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
//        Transaction transaction = session.beginTransaction();
        TypedQuery<UserNameData> selectUsers = session.createQuery(
                "from UserNameData user where user.first_name = :firstName", UserNameData.class);
        selectUsers.setParameter("firstName", requestBody);
        List<UserNameData> dbUserGeneralData = selectUsers.getResultList();
        for (UserNameData tmpUserGeneralData : dbUserGeneralData) {
            searchResult.put(Long.toString(tmpUserGeneralData.getId()),
                    new JSUser(session.get(UserGeneralData.class, tmpUserGeneralData.getId()), tmpUserGeneralData));
        }
//        transaction.commit();
        session.close();
        return searchResult;
    }

    @RequestMapping("/registration")
    public void registration(@RequestBody UserRegForm userRegForm, HttpServletResponse response) {
        //Creating DB session
        Session session = HibernateUtils.getSessionFactory().openSession();
        Long userId = null;

        try {
            UserGeneralData userGeneralData = userRegForm.createUserGeneralDataTableObject();

            //Saving used general data into DB table
            Transaction transaction = session.beginTransaction();
            userId = (Long) session.save(userGeneralData);
            transaction.commit();

            UserAuthData userAuthData = userRegForm.createUserAuthDataTableObject();
            userAuthData.setId(userId);

            //Saving user authentication data into DB table
            transaction = session.beginTransaction();
            session.save(userAuthData);
            transaction.commit();

            UserNameData userNameData = userRegForm.createUserNameDataTableObject();
            userNameData.setId(userId);

            //Saving user name data into DB table
            transaction = session.beginTransaction();
            session.save(userNameData);
            transaction.commit();
            response.setStatus(201);

        } catch (InternalError | HibernateException e) {
            LOGGER.error(e.getMessage());
            response.setStatus(500);
            // TODO: to implement logic in case of failure
        }
    }

}
