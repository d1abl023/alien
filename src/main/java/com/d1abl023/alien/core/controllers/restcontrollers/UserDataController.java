package com.d1abl023.alien.core.controllers.restcontrollers;

import com.d1abl023.alien.tables.UserGeneralData;
import com.d1abl023.alien.utilactions.HibernateUtils;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


/**
 * Class UserDataController manage all requests that are related with user data
 */
@RestController
public class UserDataController {

    @RequestMapping("/authentication")
    public String authentication(){
        return "authenticated";
    }

    /**
     * Method userInfo() requests user data from DB
     *
     * @param principal contains id of principal who requested data
     * @param person    contains string whose data is requested
     * @param response  contains response data
     * @return map that contains user data in key=value format
     */
    @RequestMapping("/user_info")
    public Map<String, String> userInfo(Principal principal, @RequestBody String person, HttpServletResponse response) {

        Long userId = person.equals("my") ? new Long(principal.getName()) : new Long(person);

        Map<String, String> responseMap = new LinkedHashMap<>();

        //Requesting DB for user data
        Session session = HibernateUtils.getSessionFactory().openSession();
        Transaction transaction = session.beginTransaction();
        List list = session.createQuery("from UserGeneralData user where user.id = '" + userId + "'").list();
        transaction.commit();

        //If request was successful putting data into resulting map
        if (list.size() > 0) {
            UserGeneralData userGeneralData = (UserGeneralData) list.get(0);
            responseMap.put("login", userGeneralData.getLogin());
            responseMap.put("sex", userGeneralData.getSex());
            responseMap.put("country", userGeneralData.getCountry());
            responseMap.put("city", userGeneralData.getCity());
            responseMap.put("work", userGeneralData.getPlaceOfWork());
            responseMap.put("education", userGeneralData.getEducation());
            response.setStatus(200);
        }

        return responseMap;
    }

    /**
     * Method getUsername() provide username of principal by it's id
     *
     * @param principal contains principal id
     * @return username of the principal
     */
    @RequestMapping("/get_username")
    public String getUsename(Principal principal) {
        return getLoginById(principal.getName());
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
        Transaction transaction = session.beginTransaction();

        Query query = session.createQuery("select user.login from UserGeneralData user where user.id = :id");
        query.setParameter("id", new Long(id));
        String username = (String) query.getSingleResult();
        transaction.commit();
        return username;
    }

    @RequestMapping("/get_id")
    public String getMyId(Principal principal) {
        return principal.getName();
    }
}
