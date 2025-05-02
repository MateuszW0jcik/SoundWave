package org.example.soundwave.service;

import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.TokenPair;
import org.example.soundwave.model.entity.RefreshToken;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.exception.AuthException;
import org.example.soundwave.repository.RefreshTokenRepository;
import org.example.soundwave.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${refresh.expiration}")
    private long refreshTokenDurationMs;

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new AuthException("Refresh token expired");
        }
        return token;
    }

    public RefreshToken createRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);

        return refreshTokenRepository.save(
                RefreshToken.builder()
                        .user(user)
                        .token(UUID.randomUUID().toString())
                        .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                        .build()
        );
    }

    public TokenPair refreshAuthTokens(String refreshToken) {
        RefreshToken verifiedToken = refreshTokenRepository.findByToken(refreshToken)
                .map(this::verifyExpiration)
                .orElseThrow(() -> new AuthException("Invalid refresh token"));

        User user = verifiedToken.getUser();
        String newAccessToken = jwtTokenProvider.generateToken(user);
        RefreshToken newRefreshToken = createRefreshToken(user);

        return new TokenPair(newAccessToken, newRefreshToken.getToken());
    }
}
