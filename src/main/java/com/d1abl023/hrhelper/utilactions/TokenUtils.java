package com.d1abl023.hrhelper.utilactions;

import javax.servlet.http.Cookie;
import java.util.Date;

public class TokenUtils {

    private static final long THIRTY_MINUTES_MS = 1800000L;
    private static final long THIRTY_DAYS_MS = 2592000000L;
    private static final int THIRTY_MINUTES_S = 1800;
    private static final int THIRTY_DAYS_S = 2592000;

    @SuppressWarnings("WeakerAccess")
    public static String generateAuthToken(long id, String login) {
        return "id:" + id + "||" + "login:" + login + "||"
                + "expiration_time:" + new Date(new Date().getTime() + THIRTY_MINUTES_MS).getTime();
    }

    @SuppressWarnings("WeakerAccess")
    public static String generateRefreshToken(long id, String login){
        return "id:" + id + "||" + "login:" + login + "||"
                + "expiration_time:" + new Date(new Date().getTime() + THIRTY_DAYS_MS).getTime();
    }

    public static Cookie getAuthTokenAsCookie(long id, String login){
        Cookie authToken = new Cookie("authToken",
                Base64Actions.encodeToString(generateAuthToken(id, login)));
        authToken.setMaxAge(THIRTY_MINUTES_S);
        return authToken;
    }

    public static Cookie getRefreshTokenAsCookie(long id, String login){
        Cookie refreshToken = new Cookie("refreshToken",
                Base64Actions.encodeToString(generateRefreshToken(id, login)));
        refreshToken.setMaxAge(THIRTY_DAYS_S);
        return refreshToken;
    }

}
