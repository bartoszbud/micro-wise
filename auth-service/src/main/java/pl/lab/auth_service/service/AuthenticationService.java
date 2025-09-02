package pl.lab.auth_service.service;

import pl.lab.auth_service.Dto.LoginRequest;
import pl.lab.auth_service.Dto.LoginResponse;
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

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final RestTemplate restTemplate;

    // URL mikroserwisu employee
    private final String employeeServiceUrl = "http://account:8080/account/add";

    public AuthenticationService(
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            AccountRepository accountRepository,
            JwtService jwtService,
            RoleRepository roleRepository,
            RestTemplate restTemplate) {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.accountRepository = accountRepository;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
        this.restTemplate = restTemplate;
    }

    /**
 * Logowanie użytkownika i zwrócenie email + nickname + ról + token
 */
public LoginResponse login(LoginRequest loginRequest) {
    Authentication authenticationRequest =
            UsernamePasswordAuthenticationToken.unauthenticated(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            );

    Authentication authenticationResponse = this.authenticationManager.authenticate(authenticationRequest);
    SecurityContextHolder.getContext().setAuthentication(authenticationResponse);

    UserDetails userDetails = (UserDetails) authenticationResponse.getPrincipal();

    Account account = accountRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Account not found"));

    // Aktualizacja ostatniego logowania
    account.setLastLogin(java.time.LocalDateTime.now());
    accountRepository.save(account);

    // Zbieramy role jako Stringi
    Set<String> roles = account.getRoles().stream()
            .map(role -> role.getName().name())
            .collect(Collectors.toSet());

    // 🔑 generujemy token z rolami
    String token = jwtService.generateToken(account.getEmail(), roles);

    // 🔙 zwracamy email, nickname, role i token
    return new LoginResponse(account.getEmail(), account.getNickname(), roles, token);
}

    /**
     * Rejestracja nowego konta z domyślną rolą ROLE_USER i powiadomienie mikroserwisu employee
     */
    public void registerAccount(SignupRequest signupRequest) {
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

        // Przypisujemy domyślną rolę ROLE_USER
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Default role ROLE_USER not found"));
        account.getRoles().add(userRole);

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

    /**
     * Zmiana hasła użytkownika
    */
    public void changePassword(String email, String oldPassword, String newPassword) {
        // Znajdź konto po emailu
        Account account = accountRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Account not found"));

        // Weryfikacja starego hasła
        if (!passwordEncoder.matches(oldPassword, account.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // Zapisz nowe hasło
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);

        System.out.println("Password changed successfully for account: " + email);
    }

}