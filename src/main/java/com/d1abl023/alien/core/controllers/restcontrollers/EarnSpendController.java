package com.d1abl023.alien.core.controllers.restcontrollers;

import com.d1abl023.alien.tables.Spendings;
import com.d1abl023.alien.utilactions.HibernateUtils;
import org.hibernate.Session;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Collections;
import java.util.Map;

@RestController
public class EarnSpendController {

    @RequestMapping(path = "/getMySpendings", method = RequestMethod.GET)
    public Map<String, String> getMySpendings(Principal principal){

        Session spendingsSession = HibernateUtils.getSessionFactory().openSession();
        Spendings spendings = spendingsSession.get(Spendings.class, principal.getName());

        return Collections.singletonMap(principal.getName(), spendings != null? spendings.getSpendings(): null);
    }



}
