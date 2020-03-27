package com.d1abl023.alien.core.controllers.restcontrollers;

import com.d1abl023.alien.tables.Mentions;
import com.d1abl023.alien.tables.UserMentionsId;
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
        UserMentionsId userMentionsIdObject = session.get(UserMentionsId.class, new Long(userId));

        if (userMentionsIdObject != null) {
            String[] mentionsIdList = userMentionsIdObject.getMentionsIdList().split("");
            for (String mentionId : mentionsIdList){
                resultList.add(session.get(Mentions.class, new Long(mentionId)).getMention());
            }
        }

        return resultList;
    }


}
