package com.quinicastock.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage();
        String userMessage;
        HttpStatus status = HttpStatus.BAD_REQUEST;

        if (message == null) {
            userMessage = "Une erreur est survenue";
        } else if (message.contains("Email already exists")) {
            userMessage = "Cet email est déjà utilisé par un autre compte";
        } else if (message.contains("Invalid credentials")) {
            userMessage = "Email ou mot de passe incorrect";
        } else if (message.contains("User not found")) {
            userMessage = "Utilisateur introuvable";
        } else if (message.contains("not found")) {
            userMessage = message;
        } else {
            userMessage = message;
        }

        return ResponseEntity.status(status)
                .body(Map.of("error", userMessage));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Une erreur serveur est survenue"));
    }
}
