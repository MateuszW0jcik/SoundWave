package org.example.soundwave.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.example.soundwave.model.entity.Address;

@Data
public class AddressDTO {
    @NotBlank(message = "Country can't be empty")
    private String country;

    @NotBlank(message = "Postal code can't be empty")
    private String postalCode;

    @NotBlank(message = "City can't be empty")
    private String city;

    @NotBlank(message = "Street can't be empty")
    private String street;

    @NotBlank(message = "Street number can't be empty")
    private String streetNumber;

    public AddressDTO(Address address){
        country = address.getCountry();
        postalCode = address.getPostalCode();
        city = address.getCity();
        street = address.getStreet();
        streetNumber = address.getStreetNumber();
    }
}
