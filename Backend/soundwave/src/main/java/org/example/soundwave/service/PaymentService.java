package org.example.soundwave.service;

import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.PaymentDTO;
import org.example.soundwave.model.entity.Payment;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.exception.PaymentException;
import org.example.soundwave.model.request.PaymentRequest;
import org.example.soundwave.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public void addPayment(PaymentRequest request, User user) {
        Payment payment = Payment.builder()
                .email(request.email())
                .paymentMethod(request.paymentMethod())
                .expirationDate(request.expirationDate())
                .lastDigits(request.lastDigits())
                .user(user).build();

        savePayment(payment);
    }

    public void savePayment(Payment payment) {
        paymentRepository.save(payment);
    }

    public Payment findPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentException("Payment with id: " + id + " do not exist"));
    }

    public void deleteUserPayment(Long id, User user) {
        Payment payment = findPaymentById(id);

        if (!payment.getUser().equals(user)) {
            throw new PaymentException("User do not contains this payment");
        }

        deletePayment(payment);
    }

    public void deletePayment(Payment payment) {
        paymentRepository.delete(payment);
    }

    public void editUserPayment(Long id, PaymentRequest request, User user) {
        Payment payment = findPaymentById(id);

        if (!payment.getUser().equals(user)) {
            throw new PaymentException("User do not contains this payment");
        }

        payment.setEmail(request.email());
        payment.setPaymentMethod(request.paymentMethod());
        payment.setExpirationDate(request.expirationDate().withDayOfMonth(1));
        payment.setLastDigits(request.lastDigits());

        savePayment(payment);
    }

    public List<PaymentDTO> getUserPayments(User user) {
        return paymentRepository.findPaymentsByUser(user)
                .stream()
                .map(PaymentDTO::new)
                .collect(Collectors.toList());
    }
}
