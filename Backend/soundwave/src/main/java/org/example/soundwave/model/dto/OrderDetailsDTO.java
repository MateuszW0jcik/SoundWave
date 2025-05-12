package org.example.soundwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.soundwave.model.entity.Order;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailsDTO {
    private String street;
    private String streetNumber;
    private String postalCode;
    private String city;
    private String country;
    private Set<OrderedItemDTO> orderedItemDTOs = new HashSet<>();

    public OrderDetailsDTO(Order order) {
        street = order.getStreet();
        streetNumber = order.getStreetNumber();
        postalCode = order.getPostalCode();
        city = order.getCity();
        country = order.getCountry();
    }
}
