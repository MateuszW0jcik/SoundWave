package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Type;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TypeRepository extends JpaRepository<Type, Long> {
    Optional<Type> findTypeById(Long id);

    Optional<Type> findTypeByName(String name);

    Page<Type> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
