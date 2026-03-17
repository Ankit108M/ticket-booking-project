package com.ticketbooking.config;

import com.ticketbooking.entity.Event;
import com.ticketbooking.entity.Seat;
import com.ticketbooking.repository.EventRepository;
import com.ticketbooking.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Override
    public void run(String... args) throws Exception {
        seatRepository.deleteAll();
        eventRepository.deleteAll();
        
        // --- Seed Events ---
        List<Event> events = new ArrayList<>();

        events.add(Event.builder()
                .eventName("Arijit Singh Live Concert")
                .location("Delhi, Jawaharlal Nehru Stadium")
                .date(LocalDate.of(2026, 4, 20))
                .time(LocalTime.of(19, 0))
                .price(1500.0)
                .totalSeats(24)
                .category("MUSIC")
                .description("Experience the magic of Arijit Singh live with a full orchestra under the stars.")
                .imageUrl("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800")
                .build());

        events.add(Event.builder()
                .eventName("Tech Summit 2026")
                .location("Bangalore, NIMHANS Convention Centre")
                .date(LocalDate.of(2026, 4, 25))
                .time(LocalTime.of(9, 0))
                .price(800.0)
                .totalSeats(24)
                .category("TECH")
                .description("Join industry leaders discussing AI, cloud computing, and startup ecosystems.")
                .imageUrl("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800")
                .build());

        events.add(Event.builder()
                .eventName("IPL: MI vs CSK")
                .location("Mumbai, Wankhede Stadium")
                .date(LocalDate.of(2026, 5, 2))
                .time(LocalTime.of(19, 30))
                .price(1200.0)
                .totalSeats(24)
                .category("SPORTS")
                .description("The ultimate rivalry returns! Mumbai Indians vs Chennai Super Kings at Wankhede.")
                .imageUrl("https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800")
                .build());

        events.add(Event.builder()
                .eventName("Stand-Up Comedy Night")
                .location("Hyderabad, Novotel Convention Centre")
                .date(LocalDate.of(2026, 5, 10))
                .time(LocalTime.of(20, 0))
                .price(600.0)
                .totalSeats(24)
                .category("COMEDY")
                .description("A hilarious evening with India's top stand-up comedians. Laughter guaranteed!")
                .imageUrl("https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800")
                .build());

        events.add(Event.builder()
                .eventName("Electronic Music Festival")
                .location("Goa, Vagator Beach")
                .date(LocalDate.of(2026, 5, 18))
                .time(LocalTime.of(18, 0))
                .price(2000.0)
                .totalSeats(24)
                .category("MUSIC")
                .description("Sunsets, beats, and Goa vibes. India's biggest open-air EDM festival is back.")
                .imageUrl("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800")
                .build());

        events.add(Event.builder()
                .eventName("Startup Pitch Night")
                .location("Pune, WeWork Baner")
                .date(LocalDate.of(2026, 5, 22))
                .time(LocalTime.of(18, 30))
                .price(500.0)
                .totalSeats(24)
                .category("TECH")
                .description("Witness the next big startups pitch live to top investors and industry leaders.")
                .imageUrl("https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800")
                .build());

        List<Event> savedEvents = eventRepository.saveAll(events);

        // --- Seed Seats for each event (Rows A–D, Cols 1–6 = 24 seats) ---
        String[] rows = {"A", "B", "C", "D"};
        for (Event event : savedEvents) {
            List<Seat> seats = new ArrayList<>();
            for (String row : rows) {
                for (int col = 1; col <= 6; col++) {
                    seats.add(Seat.builder()
                            .eventId(event.getId())
                            .seatNumber(row + col)
                            .status("AVAILABLE")
                            .build());
                }
            }
            seatRepository.saveAll(seats);
        }

        System.out.println("✅ Data seeded: " + savedEvents.size() + " events with 24 seats each.");
    }
}
