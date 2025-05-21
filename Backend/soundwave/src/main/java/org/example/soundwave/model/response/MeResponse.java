package org.example.soundwave.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MeResponse {
    public Long userId;
    public String firstName;
    public String lastName;
    public String email;
    public List<String> roles;
}
