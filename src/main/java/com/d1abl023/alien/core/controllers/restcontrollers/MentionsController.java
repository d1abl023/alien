package com.d1abl023.alien.core.controllers.restcontrollers;

import com.d1abl023.alien.tables.MentionsTable;
import com.d1abl023.alien.tables.UserMentionsIdTable;
import com.d1abl023.alien.utilactions.HibernateUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedList;
import java.util.List;

@RestController
public class MentionsController {

    private static final Logger LOGGER = LogManager.getLogger();

    @RequestMapping("/get_mentions")
    public List<String> getMentions(@RequestBody String userId){

        List<String> resultList = new LinkedList<>();

        Session session = HibernateUtils.getSessionFactory().openSession();
        UserMentionsIdTable userMentionsIdTableObject = session.get(UserMentionsIdTable.class, new Long(userId));

        if (userMentionsIdTableObject != null) {
            String[] mentionsIdList = userMentionsIdTableObject.getMentionsIdList().split("");
            for (String mentionId : mentionsIdList){
                resultList.add(session.get(MentionsTable.class, new Long(mentionId)).getMention());
            }
        }

        return resultList;
    }


}
