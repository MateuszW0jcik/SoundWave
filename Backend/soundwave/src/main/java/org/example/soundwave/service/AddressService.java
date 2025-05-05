package org.example.soundwave.service;


import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.AddressDTO;
import org.example.soundwave.model.dto.BrandDTO;
import org.example.soundwave.model.entity.Address;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.exception.AddressException;
import org.example.soundwave.repository.AddressRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;
    private final UserService userService;

    public void addAddress(AddressDTO request, User user) {
        Address address = Address.builder()
                .country(request.getCountry())
                .postalCode(request.getPostalCode())
                .city(request.getCity())
                .street(request.getStreet())
                .streetNumber(request.getStreetNumber()).build();

        saveAddress(address);

        user.addAddress(address);
        userService.saveUser(user);
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

        if(!user.getAddresses().contains(address)){
            throw new AddressException("User do not contains this address");
        }

        deleteAddress(address);
    }

    public void deleteAddress(Address address){
        addressRepository.delete(address);
    }

    public void editUserAddress(Long id, AddressDTO request, User user) {
        Address address = findAddressById(id);

        if(!user.getAddresses().contains(address)){
            throw new AddressException("User do not contains this address");
        }

        address.setCountry(request.getCountry());
        address.setPostalCode(request.getPostalCode());
        address.setCity(request.getCity());
        address.setStreet(request.getStreet());
        address.setStreetNumber(request.getStreetNumber());

        saveAddress(address);
    }

    public List<AddressDTO> getUserAddress(User user) {
        return user.getAddresses().stream()
                .map(AddressDTO::new)
                .collect(Collectors.toList());
    }
}
