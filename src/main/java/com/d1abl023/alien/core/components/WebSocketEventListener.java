package com.d1abl023.alien.core.components;

import com.d1abl023.alien.model.ChatMessage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.security.Principal;
import java.util.Objects;

@Component
public class WebSocketEventListener {

    private final static Logger logger = LogManager.getLogger();

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.debug("Received a new web socked connection: " + event.getUser().getName());
    }

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {

        logger.debug("Received a new web socked subscription: " + event.getUser().getName() +
                "\nHeaders: " + event.getMessage().getHeaders() +
                "\nPayload: " + event.getMessage().getPayload().length);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        String username = event.getUser().getName();

        logger.debug("User disconnected: " + username);

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setType(ChatMessage.MessageType.LEAVE);
        chatMessage.setSender(username);

        messagingTemplate.convertAndSend("/topic/public", chatMessage);
    }
}


