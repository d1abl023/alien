package com.d1abl023.alien.core.controllers.websocketcontrollers;

import com.d1abl023.alien.core.exceptions.ExcessNumberOfTableValuesException;
import com.d1abl023.alien.model.Message;
import com.d1abl023.alien.utilactions.MessageUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Date;

@Controller
public class MessageWebSocketController {

    private static final Logger logger = LogManager.getLogger();

    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public MessageWebSocketController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/news")
    public void broadcastNews(@Payload String message) {
        this.simpMessagingTemplate.convertAndSend("/topic/news", message);
    }

    @MessageMapping("/privateMessage")
    public void sendMessageToUser(@Payload Message msg) {
        msg.setTimestamp(Long.toString(new Date().getTime()));
        logger.debug(msg.toString());
        try {
            if (MessageUtils.insertMessageIntoDB(msg)) {
                logger.trace("Message inserted into DB");

                if (!msg.getReceiverId().equals(msg.getSenderId())) {
                    this.simpMessagingTemplate
                            .convertAndSendToUser(msg.getSenderId(), "/queue/privateMessages", msg);
                }
                this.simpMessagingTemplate
                        .convertAndSendToUser(msg.getReceiverId(), "/queue/privateMessages", msg);
            } else {
                this.simpMessagingTemplate
                        .convertAndSendToUser(msg.getSenderId(), "/queue/privateMessagesErrors", msg);
            }
        } catch (Exception e) {

            this.simpMessagingTemplate
                    .convertAndSendToUser(msg.getSenderId(), "/queue/privateMessagesErrors", msg);

            // TODO: To write in log files this exceptions
            e.printStackTrace();
        }
    }
}
