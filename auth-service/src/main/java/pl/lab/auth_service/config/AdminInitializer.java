package pl.lab.auth_service.config;

import pl.lab.auth_service.model.Account;
import pl.lab.auth_service.model.ERole;
import pl.lab.auth_service.model.Role;
import pl.lab.auth_service.repository.AccountRepository;
import pl.lab.auth_service.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class AdminInitializer {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(AccountRepository accountRepository,
                            RoleRepository roleRepository,
                            PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    CommandLineRunner createAdmin() {
        return args -> {
            String adminEmail = "admin@lab.pl";

            if (accountRepository.findByEmail(adminEmail).isEmpty()) {
                Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));

                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);

                Account admin = new Account();
                admin.setNickname("admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("admin123")); // możesz zmienić hasło
                admin.setRoles(roles);

                accountRepository.save(admin);
                System.out.println("Created default admin account: " + adminEmail);
            }
        };
    }
}