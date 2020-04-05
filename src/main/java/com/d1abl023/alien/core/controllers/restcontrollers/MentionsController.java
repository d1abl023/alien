package com.d1abl023.alien.core.controllers.restcontrollers;

import com.d1abl023.alien.model.JSMention;
import com.d1abl023.alien.tables.MentionsTable;
import com.d1abl023.alien.tables.UserMentionsIdTable;
import com.d1abl023.alien.utilactions.HibernateUtils;
import com.d1abl023.alien.utilactions.MentionUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.util.LinkedList;
import java.util.List;

@RestController
public class MentionsController {

    private static final Logger LOGGER = LogManager.getLogger();

    @RequestMapping("/get_mentions")
    public List<JSMention> getMentions(@RequestBody String userId){
        MentionUtils mentionUtils = new MentionUtils();
        return mentionUtils.getMentionsAboutUser(new Long(userId));
    }

    @RequestMapping("/add_new_mention")
    public String addNewMention(@RequestBody JSMention mention, HttpServletResponse response){
        MentionUtils mentionUtils = new MentionUtils();
        String mentionId = Long.toString(mentionUtils.saveNewMentionInDB(mention));
        response.setStatus(201);
        return mentionId;
    }


}
