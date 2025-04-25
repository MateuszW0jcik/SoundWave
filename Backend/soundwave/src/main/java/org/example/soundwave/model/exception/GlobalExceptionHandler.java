package org.example.soundwave.model.exception;

import org.example.soundwave.model.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(AuthException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("AUTH_ERROR", ex.getMessage()));
    }

    @ExceptionHandler(BrandException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(BrandException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("BRAND_ERROR", ex.getMessage()));
    }
}
