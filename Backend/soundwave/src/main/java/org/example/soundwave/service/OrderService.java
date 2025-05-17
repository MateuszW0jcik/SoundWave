package org.example.soundwave.service;

import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.BrandDTO;
import org.example.soundwave.model.dto.OrderDTO;
import org.example.soundwave.model.dto.OrderDetailsDTO;
import org.example.soundwave.model.dto.OrderedItemDTO;
import org.example.soundwave.model.entity.*;
import org.example.soundwave.model.exception.ContactException;
import org.example.soundwave.model.exception.OrderException;
import org.example.soundwave.model.request.OrderRequest;
import org.example.soundwave.model.response.PageResponse;
import org.example.soundwave.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ContactService contactService;
    private final AddressService addressService;
    private final PaymentService paymentService;
    private final ShoppingCartItemService shoppingCartItemService;
    private final OrderedItemService orderedItemService;
    private final ShippingMethodService shippingMethodService;

    public PageResponse<OrderDTO> getUserOrders(User user, int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Order> orders = orderRepository.findOrdersByUser(user, pageable);

        List<OrderDTO> content = orders.getContent()
                .stream()
                .map(OrderDTO::new)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                orders.getNumber(),
                orders.getSize(),
                orders.getTotalElements(),
                orders.getTotalPages(),
                orders.isLast());
    }

    public OrderDetailsDTO getUserOrderDetails(Long orderId, User user) {
        Order order = getOrderById(orderId);

        if (!order.getUser().equals(user)) {
            throw new ContactException("User do not contains this order");
        }

        OrderDetailsDTO orderDetailsDTO = new OrderDetailsDTO(order);

        List<OrderedItem> orderedItems = orderedItemService.findOrderedItemsByOrder(order);

        for(OrderedItem orderedItem : orderedItems){
            orderDetailsDTO.getOrderedItemDTOs().add(new OrderedItemDTO(orderedItem));
        }

        return orderDetailsDTO;
    }

    public void createOrder(OrderRequest request, User user) {
        Contact contact = contactService.findContactById(request.contactId());
        if (!contact.getUser().equals(user)) {
            throw new ContactException("User do not contains this contact");
        }

        Address address = addressService.findAddressById(request.addressId());
        if (!address.getUser().equals(user)) {
            throw new ContactException("User do not contains this address");
        }

        Payment payment = paymentService.findPaymentById(request.paymentId());
        if (!payment.getUser().equals(user)) {
            throw new ContactException("User do not contains this payment");
        }

        List<ShoppingCartItem> shoppingCartItems = shoppingCartItemService.getUserShoppingCartItems(user);
        if (shoppingCartItems.isEmpty()) {
            throw new ContactException("User do not have shopping cart");
        }

        ShippingMethod shippingMethod = shippingMethodService.findShippingMethodById(request.shippingMethodId());

        BigDecimal totalPrice = getTotalPrice(shippingMethod.getPrice(), shoppingCartItems);

        Order order = Order.builder()
                .user(user)
                .totalPrice(totalPrice)
                .paymentMethod(payment.getPaymentMethod())
                .country(address.getCountry())
                .postalCode(address.getPostalCode())
                .city(address.getCity())
                .street(address.getStreet())
                .streetNumber(address.getStreetNumber())
                .email(contact.getEmail())
                .phoneNumber(contact.getPhoneNumber())
                .placedOn(Instant.now()).build();

        saveOrder(order);

        for (ShoppingCartItem shoppingCartItem : shoppingCartItems) {
            OrderedItem orderedItem = OrderedItem.builder()
                    .order(order)
                    .productName(shoppingCartItem.getProduct().getName())
                    .brandName(shoppingCartItem.getProduct().getBrand().getName())
                    .price(shoppingCartItem.getProduct().getPrice())
                    .quantity(shoppingCartItem.getQuantity())
                    .imageURL(shoppingCartItem.getProduct().getImageURL()).build();

            orderedItemService.saveOrderedItem(orderedItem);
        }

        shoppingCartItemService.clearUserShoppingCart(user);
    }

    private static BigDecimal getTotalPrice(BigDecimal shippingPrice, List<ShoppingCartItem> shoppingCartItems) {
        BigDecimal totalPrice = BigDecimal.valueOf(0);
        for (ShoppingCartItem shoppingCartItem : shoppingCartItems) {
            totalPrice = totalPrice.add(BigDecimal.valueOf(shoppingCartItem.getQuantity()).multiply(shoppingCartItem.getProduct().getPrice()));
        }

        return totalPrice.add(shippingPrice);
    }

    public void saveOrder(Order order) {
        orderRepository.save(order);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderException("Order with id: " + id + " do not exist"));
    }
}
