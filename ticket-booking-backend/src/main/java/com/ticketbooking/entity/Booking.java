package com.ticketbooking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private String seatNumber;

    @Column(nullable = false)
    private String paymentStatus; // CONFIRMED or PENDING

    @Column(nullable = false)
    private String paymentMethod; // UPI, CARD, WALLET

    @Column(nullable = false)
    private LocalDateTime bookingDate;

    // Denormalized fields for easy history display
    @Column
    private String eventName;

    @Column
    private String eventLocation;

    @Column
    private Double amountPaid;
}
