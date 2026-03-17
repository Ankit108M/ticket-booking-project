package com.ticketbooking.service;

import com.ticketbooking.entity.Booking;
import com.ticketbooking.entity.Event;
import com.ticketbooking.entity.Seat;
import com.ticketbooking.repository.BookingRepository;
import com.ticketbooking.repository.EventRepository;
import com.ticketbooking.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private EventRepository eventRepository;

    // Java Collection: Set<String> to prevent duplicate seat booking (in-memory guard)
    private final Set<String> bookedSeatKeys = new HashSet<>();

    // Java Collection: Map<Integer, Booking> for quick booking lookup
    private final Map<Long, Booking> bookingCache = new HashMap<>();

    public List<Seat> getSeatsByEvent(Long eventId) {
        return seatRepository.findByEventId(eventId);
    }

    @Transactional
    public Map<String, Object> bookSeat(Long userId, Long eventId, String seatNumber,
                                         String paymentMethod) {
        Map<String, Object> response = new HashMap<>();
        String seatKey = eventId + "_" + seatNumber;

        // Guard: Check Set for in-memory duplicate
        if (bookedSeatKeys.contains(seatKey)) {
            response.put("success", false);
            response.put("message", "Seat already booked (in-memory guard)");
            return response;
        }

        // Guard: Check DB for persisted duplicate
        Optional<Seat> seatOpt = seatRepository.findByEventIdAndSeatNumber(eventId, seatNumber);
        if (seatOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Seat not found");
            return response;
        }

        Seat seat = seatOpt.get();
        if ("BOOKED".equals(seat.getStatus())) {
            response.put("success", false);
            response.put("message", "Seat is already booked");
            return response;
        }

        // Mark seat as BOOKED
        seat.setStatus("BOOKED");
        seatRepository.save(seat);
        bookedSeatKeys.add(seatKey); // Add to in-memory Set

        // Get event details
        Event event = eventRepository.findById(eventId).orElseThrow();

        // Create booking
        Booking booking = Booking.builder()
                .userId(userId)
                .eventId(eventId)
                .seatNumber(seatNumber)
                .paymentStatus("CONFIRMED")
                .paymentMethod(paymentMethod.toUpperCase())
                .bookingDate(LocalDateTime.now())
                .eventName(event.getEventName())
                .eventLocation(event.getLocation())
                .amountPaid(event.getPrice())
                .build();

        Booking saved = bookingRepository.save(booking);
        bookingCache.put(saved.getId(), saved); // Cache in Map

        response.put("success", true);
        response.put("message", "Booking confirmed!");
        response.put("booking", saved);
        return response;
    }

    public List<Booking> getBookingHistory(Long userId) {
        return bookingRepository.findByUserIdOrderByBookingDateDesc(userId);
    }

    public Optional<Booking> getBookingById(Long bookingId) {
        // Check cache first
        if (bookingCache.containsKey(bookingId)) {
            return Optional.of(bookingCache.get(bookingId));
        }
        return bookingRepository.findById(bookingId);
    }
}
