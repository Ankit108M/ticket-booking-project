package com.ticketbooking.repository;

import com.ticketbooking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByEventId(Long eventId);
    Optional<Seat> findByEventIdAndSeatNumber(Long eventId, String seatNumber);
    boolean existsByEventIdAndSeatNumberAndStatus(Long eventId, String seatNumber, String status);
}
