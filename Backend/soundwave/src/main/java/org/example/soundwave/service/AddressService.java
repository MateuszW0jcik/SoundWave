package org.example.soundwave.service;


import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.AddressDTO;
import org.example.soundwave.model.dto.ContactDTO;
import org.example.soundwave.model.entity.Address;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.exception.AddressException;
import org.example.soundwave.model.request.AddressRequest;
import org.example.soundwave.repository.AddressRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;

    public void addAddress(AddressRequest request, User user) {
        Address address = Address.builder()
                .country(request.country())
                .postalCode(request.postalCode())
                .city(request.city())
                .street(request.street())
                .streetNumber(request.streetNumber())
                .user(user).build();

        saveAddress(address);
    }

    public void saveAddress(Address address){
        addressRepository.save(address);
    }

    public Address findAddressById(Long id){
        return addressRepository.findById(id)
                .orElseThrow(() -> new AddressException("Address with id: " + id + " do not exist"));
    }

    public void deleteUserAddress(Long id, User user) {
        Address address = findAddressById(id);

        if(!address.getUser().equals(user)){
            throw new AddressException("User do not contains this address");
        }

        deleteAddress(address);
    }

    public void deleteAddress(Address address){
        addressRepository.delete(address);
    }

    public void editUserAddress(Long id, AddressRequest request, User user) {
        Address address = findAddressById(id);

        if(!address.getUser().equals(user)){
            throw new AddressException("User do not contains this address");
        }

        address.setCountry(request.country());
        address.setPostalCode(request.postalCode());
        address.setCity(request.city());
        address.setStreet(request.street());
        address.setStreetNumber(request.streetNumber());

        saveAddress(address);
    }

    public List<AddressDTO> getUserAddresses(User user) {
        return addressRepository.findAddressByUser(user)
                .stream()
                .map(AddressDTO::new)
                .collect(Collectors.toList());
    }
}
