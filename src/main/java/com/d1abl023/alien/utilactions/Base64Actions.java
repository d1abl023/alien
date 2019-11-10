package com.d1abl023.alien.utilactions;

import java.util.Base64;

/**
 * Class {@code Base64Actions} works with Base64 encoding/decoding com.d1abl023.montana.actions
 */
public class Base64Actions {

    /**
     * Method {@code encodeToString()} encode a normal string into encoded string
     *
     * @param string normal string that will be encoded
     * @return encoded string
     */
    @SuppressWarnings("WeakerAccess")
    public static String encodeToString(String string) {
        return Base64.getEncoder().encodeToString(string.getBytes());
    }

    /**
     * Method {@code decode to string} decode an encoded string into normal string
     *
     * @param string encoded string that will be returned
     * @return normal string
     */
    public static String decodeToString(String string) {
        return new String(Base64.getDecoder().decode(string));
    }

}
