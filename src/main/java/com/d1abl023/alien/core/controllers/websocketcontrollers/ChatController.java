package com.d1abl023.alien.core.controllers.websocketcontrollers;

import com.d1abl023.alien.model.ChatMessage;
import com.d1abl023.alien.tables.ChatRoom1Msg;
import com.d1abl023.alien.utilactions.HibernateUtils;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.Objects;

@Controller
public class ChatController {

    /**
     * Method @code sendMessage() receive message, register it in DB and send to particular topic
     *
     * @param chatMessage message that receive
     * @return message that sends to topic
     */
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {

        Session session = HibernateUtils.getSessionFactory().openSession();
        Transaction transaction = session.beginTransaction();
        session.save(new ChatRoom1Msg(chatMessage));
        transaction.commit();

        return chatMessage;
    }


    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("username", chatMessage.getSender());

        return chatMessage;
    }

}
