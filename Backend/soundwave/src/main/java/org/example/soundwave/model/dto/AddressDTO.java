package org.example.soundwave.model.dto;

import lombok.*;
import org.example.soundwave.model.entity.Address;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {
    private Long id;
    private String country;
    private String postalCode;
    private String city;
    private String street;
    private String streetNumber;

    public AddressDTO(Address address){
        id = address.getId();
        country = address.getCountry();
        postalCode = address.getPostalCode();
        city = address.getCity();
        street = address.getStreet();
        streetNumber = address.getStreetNumber();
    }
}
