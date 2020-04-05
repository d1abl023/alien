package com.d1abl023.alien.core.controllers.restcontrollers;

import com.d1abl023.alien.model.JSAdditionalUserData;
import com.d1abl023.alien.model.JSUser;
import com.d1abl023.alien.model.JSUserGeneralAndAdditionalData;
import com.d1abl023.alien.tables.UserAdditionalDataTable;
import com.d1abl023.alien.tables.UserGeneralDataTable;
import com.d1abl023.alien.tables.UserNameDataTable;
import com.d1abl023.alien.utilactions.HibernateUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.security.Principal;


/**
 * Class UserDataController manage all requests that are related with user data
 */
@RestController
public class UserDataController {

    private Logger logger = LogManager.getLogger();

    @RequestMapping("/authentication")
    public String authentication() {
        return "authenticated";
    }

    /**
     * Method userInfo() requests user data from DB
     *
     * @param principal contains id of principal who requested data
     * @param person    contains string whose data is requested
     * @param response  contains response data
     * @return object that contains user data in key=value format
     */
    @RequestMapping("/user_info")
    public JSUser userInfo(Principal principal, @RequestBody String person, HttpServletResponse response) {
        Long userId = new Long(person.equals("id=my") ? principal.getName() : person.split("=")[1].trim());
        Session session = HibernateUtils.getSessionFactory().openSession();
        UserGeneralDataTable userGeneralDataTable = session.get(UserGeneralDataTable.class, userId);
        UserNameDataTable userNameDataTable = session.get(UserNameDataTable.class, userId);
        response.setStatus(200);
        return new JSUser(userGeneralDataTable, userNameDataTable);
    }

    /**
     * Method getUsername() provide username of principal by it's id
     *
     * @param principal contains principal id
     * @return username of the principal
     */
    @RequestMapping("/get_short_name")
    public String getUsename(Principal principal) {
        return getShortNameById(principal.getName());
    }

    /**
     * Method getShortNameById() requests user login from DB
     *
     * @param id contains id of user whose username should be requested from DB
     * @return string that contains short name of person
     */
    @RequestMapping("/get_short_name_by_id")
    public String getShortNameById(@RequestBody String id) {
        Session session = HibernateUtils.getSessionFactory().openSession();
        UserNameDataTable userNameDataTable = session.get(UserNameDataTable.class, new Long(id));
        return userNameDataTable.getFirstName() + ", " + userNameDataTable.getLastName();
    }

    /**
     * Method getUserLogin() requests user login from DB
     *
     * @param id contains id of user whose username should be requested from DB
     * @return string that contains user login
     */
    @RequestMapping("/get_username_by_id")
    public String getLoginById(@RequestBody String id) {
        Session session = HibernateUtils.getSessionFactory().openSession();
        UserNameDataTable userNameDataTable = session.get(UserNameDataTable.class, new Long(id));
        return userNameDataTable.getFirstName() + ", " + userNameDataTable.getLastName();
    }

    @RequestMapping("/get_additional_user_info")
    public JSAdditionalUserData getAdditionalUserInfo(@RequestBody String userId) {
        Session session = HibernateUtils.getSessionFactory().openSession();
        return new JSAdditionalUserData(session.get(UserAdditionalDataTable.class, new Long(userId)));
    }

    @RequestMapping("/get_id")
    public String getMyId(Principal principal) {
        return principal.getName();
    }

    @RequestMapping("/update_user_info")
    public String updateUserInfo(@RequestBody JSUserGeneralAndAdditionalData userData, HttpServletResponse response) {
        UserAdditionalDataTable userAdditionalDataTable = new UserAdditionalDataTable(userData.getAdditionalUserData());
        UserGeneralDataTable userGeneralDataTable = new UserGeneralDataTable(userData.getGeneralUserData());

        try (Session session = HibernateUtils.getSessionFactory().openSession()) {
            Transaction transaction = session.beginTransaction();
            session.update(userGeneralDataTable);
            transaction.commit();

            transaction = session.beginTransaction();
            session.saveOrUpdate(userAdditionalDataTable);
            transaction.commit();
            return userData.getGeneralUserData().getId();
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("Failed to update user data." + e.getMessage() + " " + userData.toString());
            response.setStatus(500);
        }
        return null;
    }
}
