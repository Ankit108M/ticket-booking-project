package com.ticketbooking.service;

import com.ticketbooking.entity.Event;
import com.ticketbooking.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // Java Collection: List<Event> for all events
    public List<Event> getAllEvents() {
        List<Event> eventList = new ArrayList<>(eventRepository.findAll());
        return eventList;
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public List<Event> getEventsByCategory(String category) {
        return new ArrayList<>(eventRepository.findByCategory(category.toUpperCase()));
    }

    public Event save(Event event) {
        return eventRepository.save(event);
    }
}
