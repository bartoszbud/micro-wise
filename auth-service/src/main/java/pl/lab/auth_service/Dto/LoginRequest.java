/**
 * Data Transfer Object representing a login request.
 * Contains the user's email and password fields.
 */
package pl.lab.auth_service.Dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}