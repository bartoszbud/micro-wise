/**
 * Data Transfer Object for user signup requests.
 * <p>
 * This class holds the necessary information required for a user to register,
 * including their name, email, and password.
 * </p>
 */
package pl.lab.auth_service.Dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;

}