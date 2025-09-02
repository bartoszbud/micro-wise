package pl.lab.auth_service.controller;

import pl.lab.auth_service.Dto.LoginRequest;
import pl.lab.auth_service.Dto.LoginResponse;
import pl.lab.auth_service.Dto.SignupRequest;
import pl.lab.auth_service.Dto.ChangePasswordRequest;
import pl.lab.auth_service.service.AuthenticationService;
import pl.lab.auth_service.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;

    public AuthenticationController(AuthenticationService authenticationService, JwtService jwtService) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
    }

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @PostMapping("/signin")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // teraz login zwraca LoginResponse
            LoginResponse loginResponse = authenticationService.login(loginRequest);

            // generujemy token na podstawie emaila
            Set<String> roles = loginResponse.getRoles(); 
            String token = jwtService.generateToken(loginRequest.getEmail(), roles);

            // zwracamy JSON z tokenem i danymi użytkownika
            Map<String, Object> response = Map.of(
                "token", token,
                "email", loginResponse.getEmail(),
                "nickname", loginResponse.getNickname(),
                "roles", loginResponse.getRoles()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        try {
            authenticationService.registerAccount(signupRequest);
            return new ResponseEntity<>("Account registered.", HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        // przy tokenach w nagłówku/backend nic nie czyści,
        // to frontend usuwa token z pamięci
        return ResponseEntity.ok("You've been signed out!");
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token found");
            }

            String token = authHeader.substring(7); // obcięcie "Bearer "
            jwtService.validateToken(token);
            String email = jwtService.extractEmail();

            return ResponseEntity.ok(Collections.singletonMap("email", email));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            authenticationService.changePassword(request.getEmail(), request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
