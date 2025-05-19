package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Type;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TypeRepository extends JpaRepository<Type, Long> {
    Optional<Type> findTypeById(Long id);

    Optional<Type> findTypedByName(String name);
}
