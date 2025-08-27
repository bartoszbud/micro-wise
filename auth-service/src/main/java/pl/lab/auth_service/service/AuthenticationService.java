package pl.lab.auth_service.service;

import pl.lab.auth_service.Dto.LoginRequest;
import pl.lab.auth_service.Dto.SignupRequest;
import pl.lab.auth_service.model.Account;
import pl.lab.auth_service.model.ERole;
import pl.lab.auth_service.model.Role;
import pl.lab.auth_service.repository.AccountRepository;
import pl.lab.auth_service.repository.RoleRepository;
import jakarta.persistence.EntityExistsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Service responsible for authentication and registration logic.
 * <p>
 * Handles user login by validating credentials using Spring Security,
 * and manages user registration by creating new accounts and notifying
 * the employee microservice about new users.
 * </p>
 *
 * <p>
 * Dependencies:
 * <ul>
 *   <li>{@link AuthenticationManager} - for authenticating user credentials</li>
 *   <li>{@link PasswordEncoder} - for encoding user passwords</li>
 *   <li>{@link AccountRepository} - for accessing account data</li>
 *   <li>{@link JwtService} - for handling JWT operations</li>
 *   <li>{@link RestTemplate} - for communicating with external microservices</li>
 * </ul>
 * </p>
 *
 * <p>
 * Main responsibilities:
 * <ul>
 *   <li>Authenticate users and return their email (username) upon successful login</li>
 *   <li>Register new accounts, ensure email uniqueness, encode passwords, and notify the employee microservice</li>
 * </ul>
 * </p>
 */
@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final AccountRepository accountRepository;
    private final JwtService jwtService;
    //private final RoleRepository roleRepository;
    private final RestTemplate restTemplate;

    // URL mikroserwisu employee
    private final String employeeServiceUrl = "http://account:8080/account/add";

    // Jeden konstruktor, wszystkie pola inicjalizowane
    public AuthenticationService(
        AuthenticationManager authenticationManager,
        PasswordEncoder passwordEncoder,
        AccountRepository accountRepository,
        JwtService jwtService,
        //RoleRepository roleRepository,
        RestTemplate restTemplate) {
            this.authenticationManager = authenticationManager;
            this.passwordEncoder = passwordEncoder;
            this.accountRepository = accountRepository;
            this.jwtService = jwtService;
            //this.roleRepository = roleRepository;
            this.restTemplate = restTemplate;
        }

    /**
     * Logowanie użytkownika: walidacja poświadczeń przez Spring Security
     * i zwrócenie emaila (username).
     */
    public String login(LoginRequest loginRequest) {
        Authentication authenticationRequest =
                UsernamePasswordAuthenticationToken.unauthenticated(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                );

        Authentication authenticationResponse = this.authenticationManager.authenticate(authenticationRequest);
        SecurityContextHolder.getContext().setAuthentication(authenticationResponse);

        UserDetails userDetails = (UserDetails) authenticationResponse.getPrincipal();

        accountRepository.findByEmail(userDetails.getUsername()).ifPresent(account -> {
                account.setLastLogin(java.time.LocalDateTime.now());
                accountRepository.save(account);
            });

        return userDetails.getUsername(); // email
    }

    /**
     * Rejestracja nowego konta i powiadomienie mikroserwisu employee
     */
    public void registerAccount(SignupRequest signupRequest) {
        // Logowanie danych wejściowych
        System.out.println("Received signup request:");
        System.out.println("Name: " + signupRequest.getName());
        System.out.println("Email: " + signupRequest.getEmail());
        System.out.println("Password: " + (signupRequest.getPassword() != null ? "[PROVIDED]" : "[NULL]"));

        if (accountRepository.existsByEmail(signupRequest.getEmail())) {
            throw new EntityExistsException("Email already used");
        }

        // Tworzymy konto w auth-service
        Account account = new Account(
            signupRequest.getName(),
            signupRequest.getEmail(),
            passwordEncoder.encode(signupRequest.getPassword())
        );

        accountRepository.save(account);

        System.out.println("Account saved in auth-service: " + account.getNickname() + ", " + account.getEmail());

        // Przygotowujemy request do mikroserwisu employee
        Map<String, String> employeeRequest = new HashMap<>();
        employeeRequest.put("email", signupRequest.getEmail());
        employeeRequest.put("nickname", signupRequest.getName());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(employeeRequest, headers);

        System.out.println("Sending request to employee service: " + employeeRequest);

        try {
            restTemplate.postForEntity(employeeServiceUrl, requestEntity, Void.class);
            System.out.println("Request to employee service sent successfully");
        } catch (Exception e) {
            System.out.println("Error sending request to employee service: " + e.getMessage());
        }
    }   

    /*
    public void registerAccount(SignupRequest signupRequest) {
        if (accountRepository.existsByEmail(signupRequest.getEmail())) {
            throw new EntityExistsException("Email already used");
        }

        Account account = new Account(
                signupRequest.getName(),
                signupRequest.getEmail(),
                passwordEncoder.encode(signupRequest.getPassword())
        );

        /*
        Role role = roleRepository.findByErole(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        account.setRoles(Collections.singleton(role));
        
        accountRepository.save(account);

        // Powiadomienie mikroserwisu employee
        Map<String, String> employeeRequest = new HashMap<>();
        employeeRequest.put("name", signupRequest.getName());
        employeeRequest.put("email", signupRequest.getEmail());

        try {
            restTemplate.postForEntity(employeeServiceUrl, employeeRequest, Void.class);
        } catch (Exception e) {
            System.out.println("Error sending request to employee service: " + e.getMessage());
        }
    }*/
}