package com.ticketbooking.controller;

import com.ticketbooking.entity.Booking;
import com.ticketbooking.entity.Seat;
import com.ticketbooking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/seats/{eventId}")
    public ResponseEntity<List<Seat>> getSeatsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(bookingService.getSeatsByEvent(eventId));
    }

    @PostMapping("/bookings/book")
    public ResponseEntity<Map<String, Object>> bookTicket(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        Long eventId = Long.valueOf(request.get("eventId").toString());
        String seatNumber = request.get("seatNumber").toString();
        String paymentMethod = request.get("paymentMethod").toString();
        return ResponseEntity.ok(bookingService.bookSeat(userId, eventId, seatNumber, paymentMethod));
    }

    @GetMapping("/bookings/history/{userId}")
    public ResponseEntity<List<Booking>> getHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingHistory(userId));
    }

    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<?> getBooking(@PathVariable Long bookingId) {
        return bookingService.getBookingById(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
