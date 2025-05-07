package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Address;
import org.example.soundwave.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findAddressByUser(User user);
}
