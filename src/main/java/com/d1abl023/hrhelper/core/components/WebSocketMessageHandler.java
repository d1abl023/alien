package com.d1abl023.hrhelper.core.components;

import com.d1abl023.hrhelper.model.Message;
import com.d1abl023.hrhelper.utilactions.MessageUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

public class WebSocketMessageHandler extends AbstractWebSocketHandler {

    private static Logger logger = LogManager.getLogger();
    private static Map<String, WebSocketSession> sessionPool = new LinkedHashMap<>();

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage textMessage) throws IOException {

        Message message = new ObjectMapper().readValue(textMessage.getPayload(), Message.class);

        logger.info("From: " + session.getPrincipal().getName() + " messsage: " + textMessage);
        if (MessageUtils.insertMessageIntoDB(message)) {
            if (sessionPool.containsKey(message.getReceiverId())) {
                sessionPool.get(message.getReceiverId()).sendMessage(new TextMessage(new ObjectMapper().writeValueAsString(message)));
            }
            session.sendMessage(new TextMessage(new ObjectMapper().writeValueAsString(message)));
        }else{
            message.setId("0000000");
            session.sendMessage(new TextMessage(new ObjectMapper().writeValueAsString(message)));
        }

    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        try {
            String principalName = Objects.requireNonNull(session.getPrincipal()).getName();
            if (sessionPool.containsKey(principalName)) {
                sessionPool.replace(principalName, session);
            } else {
                sessionPool.putIfAbsent(principalName, session);
            }
            logger.info("Added new connection to connection pool from user: " + session.getPrincipal());
        } catch (NullPointerException e) {
            logger.error("Connection refused because of nullable principal. Session id: " + session.getId());
            if (session.isOpen()) {
                try {
                    session.close(new CloseStatus(1016, "Nullable principal."));
                } catch (IOException ex) {
                    logger.error(ex.getMessage());
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        try {
            super.afterConnectionClosed(session, status);
            String principalName = Objects.requireNonNull(session.getPrincipal()).getName();
            if (sessionPool.containsKey(principalName)) {
                sessionPool.replace(principalName, session);
            }
        } catch (Exception e){
            logger.error("Error when connection has been closing: " + e.getMessage());
        }
    }
}
