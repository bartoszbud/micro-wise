package pl.lab.auth_service.config;

import pl.lab.auth_service.repository.RoleRepository;
import pl.lab.auth_service.model.Role;
import pl.lab.auth_service.model.ERole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoleInitializer {

    private final RoleRepository roleRepository;

    public RoleInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Bean
    CommandLineRunner initRoles() {
        return args -> {
            if (roleRepository.findByName(ERole.ROLE_USER).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_USER));
                System.out.println("Inserted default role ROLE_USER");
            }

            if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_ADMIN));
                System.out.println("Inserted default role ROLE_ADMIN");
            }
        };
    }
}
