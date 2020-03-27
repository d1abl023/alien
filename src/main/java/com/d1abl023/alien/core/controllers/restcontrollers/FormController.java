package com.d1abl023.alien.core.controllers.restcontrollers;

import com.d1abl023.alien.forms.AddPersonForm;
import com.d1abl023.alien.forms.UserRegistrationForm;
import com.d1abl023.alien.model.JSUser;
import com.d1abl023.alien.tables.UserAdditionalData;
import com.d1abl023.alien.tables.UserAuthData;
import com.d1abl023.alien.tables.UserGeneralData;
import com.d1abl023.alien.tables.UserNameData;
import com.d1abl023.alien.utilactions.HibernateUtils;
import com.d1abl023.alien.utilactions.UserSearchUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@RestController
public class FormController {

    private static final Logger LOGGER = LogManager.getLogger();

    @RequestMapping(value = "/search", method = RequestMethod.POST)
    public Map<String, JSUser> search(@RequestBody String requestBody) {
        Map<String, JSUser> searchResult = new LinkedHashMap<>();
        Session session = HibernateUtils.getSessionFactory().openSession();
        List<UserNameData> dbUserNameDate = new LinkedList<>();

        if (requestBody.contains(",")) {
            String firstName = requestBody.split(",")[0].trim();
            String lastName = requestBody.split(",")[1].trim();

            Map<Long, UserNameData> searchByLastName = UserSearchUtils.searchByLastName(session, lastName);

            if (firstName.contains("-")) {
                Map<Long, UserNameData> searchByFirstName = UserSearchUtils.searchByFirstName(session, firstName.split("-")[0].trim());
                Map<Long, UserNameData> searchBySecondName = UserSearchUtils.searchBySecondName(session, firstName.split("-")[1].trim());
                for (Long userId : searchByFirstName.keySet()) {
                    if (searchBySecondName.containsKey(userId) && searchByLastName.containsKey(userId)) {
                        dbUserNameDate.add(searchByFirstName.get(userId));
                    }
                }

                // In case if user find reverse: secondName-firstName
                searchByFirstName = UserSearchUtils.searchByFirstName(session, firstName.split("-")[1].trim());
                searchBySecondName = UserSearchUtils.searchBySecondName(session, firstName.split("-")[0].trim());
                for (Long userId : searchByFirstName.keySet()) {
                    if (searchBySecondName.containsKey(userId) && searchByLastName.containsKey(userId)) {
                        dbUserNameDate.add(searchByFirstName.get(userId));
                    }
                }
            } else {
                Map<Long, UserNameData> searchByFirstName = UserSearchUtils.searchByFirstName(session, firstName.trim());
                for (Long userId : searchByFirstName.keySet()) {
                    if (searchByLastName.containsKey(userId)) {
                        dbUserNameDate.add(searchByFirstName.get(userId));
                    }
                }
                Map<Long, UserNameData> searchBySecondName = UserSearchUtils.searchBySecondName(session, firstName.trim());
                for (Long userId : searchBySecondName.keySet()) {
                    if (searchByLastName.containsKey(userId)) {
                        dbUserNameDate.add(searchBySecondName.get(userId));
                    }
                }
            }
        } else if (requestBody.contains("-")) {
            Map<Long, UserNameData> searchByFirstName = UserSearchUtils.searchByFirstName(session, requestBody.split("-")[0].trim());
            Map<Long, UserNameData> searchBySecondName = UserSearchUtils.searchBySecondName(session, requestBody.split("-")[1].trim());
            for (Long userId : searchByFirstName.keySet()) {
                if (searchBySecondName.containsKey(userId)) {
                    dbUserNameDate.add(searchByFirstName.get(userId));
                }
            }

            // In case if user find reverse: secondName-firstName
            searchByFirstName = UserSearchUtils.searchByFirstName(session, requestBody.split("-")[1].trim());
            searchBySecondName = UserSearchUtils.searchBySecondName(session, requestBody.split("-")[0].trim());
            for (Long userId : searchByFirstName.keySet()) {
                if (searchBySecondName.containsKey(userId)) {
                    dbUserNameDate.add(searchByFirstName.get(userId));
                }
            }
        } else {
            Map<Long, UserNameData> searchByFirstName = UserSearchUtils.searchByFirstName(session, requestBody.trim());
            for (Long userId : searchByFirstName.keySet()) {
                dbUserNameDate.add(searchByFirstName.get(userId));
//                searchResult.put(Long.toString(userId),
//                        new JSUser(session.get(UserGeneralData.class, userId), searchByFirstName.get(userId)));
            }
            Map<Long, UserNameData> searchBySecondName = UserSearchUtils.searchBySecondName(session, requestBody.trim());
            for (Long userId : searchBySecondName.keySet()) {
                dbUserNameDate.add(searchBySecondName.get(userId));
//                searchResult.put(Long.toString(userId),
//                        new JSUser(session.get(UserGeneralData.class, userId), searchBySecondName.get(userId)));
            }
            Map<Long, UserNameData> searchByLastName = UserSearchUtils.searchByLastName(session, requestBody.trim());
            for (Long userId : searchByLastName.keySet()) {
                dbUserNameDate.add(searchByLastName.get(userId));
//                searchResult.put(Long.toString(userId),
//                        new JSUser(session.get(UserGeneralData.class, userId), searchByLastName.get(userId)));
            }


        }

        // TODO: to change logic to remove that
        for (UserNameData tmpUserNameData : dbUserNameDate) {
            searchResult.put(Long.toString(tmpUserNameData.getId()),
                    new JSUser(session.get(UserGeneralData.class, tmpUserNameData.getId()), tmpUserNameData));
        }
        session.close();
        return searchResult;
    }

    @RequestMapping("/add_new_person")
    public String addNewPerson(@RequestBody AddPersonForm addPearsonForm, HttpServletResponse response){
        try (Session session = HibernateUtils.getSessionFactory().openSession()) {
            UserGeneralData userGeneralData = addPearsonForm.createUserGeneralDataTableObject();

            //Saving used general data into DB table
            Transaction transaction = session.beginTransaction();
            Long userId = (Long) session.save(userGeneralData);
            transaction.commit();

            UserNameData userNameData = addPearsonForm.createUserNameDataTableObject();
            userNameData.setId(userId);

            //Saving user name data into DB table
            transaction = session.beginTransaction();
            session.save(userNameData);
            transaction.commit();

            UserAdditionalData userAdditionalData = addPearsonForm.createUserAdditionalDataTableObject();
            userAdditionalData.setId(userId);

            //Saving user additional data into DB table
            transaction = session.beginTransaction();
            session.save(userAdditionalData);
            transaction.commit();

            response.setStatus(201);
            return Long.toString(userId);
        } catch (InternalError | HibernateException e) {
            LOGGER.error(e.getMessage());
            response.setStatus(500);
            return null;
            // TODO: to implement logic in case of failure
        }
    }

    @RequestMapping("/registration")
    public void registration(@RequestBody UserRegistrationForm userRegForm, HttpServletResponse response) {
        try (Session session = HibernateUtils.getSessionFactory().openSession()) {
            UserGeneralData userGeneralData = userRegForm.createUserGeneralDataTableObject();

            //Saving used general data into DB table
            Transaction transaction = session.beginTransaction();
            Long userId = (Long) session.save(userGeneralData);
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

            UserAdditionalData userAdditionalData = userRegForm.createUserAdditionalDataTableObject();
            userAdditionalData.setId(userId);

            //Saving user additional data into DB table
            transaction = session.beginTransaction();
            session.save(userAdditionalData);
            transaction.commit();

            response.setStatus(201);
        } catch (InternalError | HibernateException e) {
            LOGGER.error(e.getMessage());
            response.setStatus(500);
            // TODO: to implement logic in case of failure
        }
    }

}
