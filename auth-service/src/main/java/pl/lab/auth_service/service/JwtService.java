package pl.lab.auth_service.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Set;

@Service
public class JwtService {

    @Value("${jwt.token.secret}")
    private String secret;

    @Value("${jwt.token.expires}")
    private Long jwtExpiresMinutes;

    private Claims claims;

    /**
     * Generuje JWT dla użytkownika (email jako subject + role).
     */
    public String generateToken(String email, Set<String> roles) {
        return Jwts.builder()
                .subject(email)
                .claim("roles", roles)   // dodajemy role
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiresMinutes * 60 * 1000))
                .signWith(getSignInKey())
                .compact();
    }

    /**
     * Waliduje token JWT.
     * Rzuca JwtException jeśli token jest niepoprawny lub wygasł.
     */
    public void validateToken(String token) throws JwtException {
        try {
            claims = Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException e) {
            throw new JwtException(e.getMessage());
        }
    }

    /**
     * Zwraca email (subject) z ostatnio zweryfikowanego tokena.
     */
    public String extractEmail() {
        return claims != null ? claims.getSubject() : null;
    }

    /**
     * Zwraca role z ostatnio zweryfikowanego tokena.
     */
    @SuppressWarnings("unchecked")
    public Set<String> extractRoles() {
        return claims != null ? claims.get("roles", Set.class) : null;
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(this.secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
