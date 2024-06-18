import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg, EventInput, EventClickArg } from '@fullcalendar/core';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const EventCalendar: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', time: '', venue: '', price: 0, capacity: 0 });
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/all-event', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEvents(response.data.map((event: any) => ({
          id: event.event_id, 
          title: event.event_name,
          start: new Date(event.event_start_date),
          end: new Date(event.event_end_date),
          time: event.event_time,
          venue: event.event_venue,
          price: event.event_price,
          capacity: event.event_capacity
        })));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateSelect = (arg: DateSelectArg) => {
    setNewEvent({ ...newEvent, start: arg.startStr, end: arg.endStr });
    setShowAddModal(true);
  };

  const handleSaveEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/new-event', newEvent, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEvents([...events, {
        id: response.data.event_id,
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        time: newEvent.time,
        venue: newEvent.venue,
        price: newEvent.price,
        capacity: newEvent.capacity
      }]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleEventClick = (arg: EventClickArg) => {
    setSelectedEvent({
      id: arg.event.id,
      title: arg.event.title,
      start: new Date(arg.event.startStr),
      end: new Date(arg.event.endStr),
      time: arg.event.extendedProps.time,
      venue: arg.event.extendedProps.venue,
      price: arg.event.extendedProps.price,
      capacity: arg.event.extendedProps.capacity
    });
    setShowDetailsModal(true);
  };

  const renderEventContent = (eventInfo: { event: EventInput }) => {
    return (
      <div>
        <b>{eventInfo.event.time}</b>
        <i>{eventInfo.event.title}</i>
      </div>
    );
  };

  return (
    <div className='event-container'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
      />
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventVenue">
              <Form.Label>Venue</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.venue}
                onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.start}
                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.end}
                onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={newEvent.price}
                onChange={(e) => setNewEvent({ ...newEvent, price: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Form.Group controlId="formEventCapacity">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                value={newEvent.capacity}
                onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEvent}>
            Save Event
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              {[
                { label: "Title", value: selectedEvent.title },
                { label: "Venue", value: selectedEvent.venue },
                { label: "Start Date", value: selectedEvent.start instanceof Date ? selectedEvent.start.toLocaleDateString() : '' },
                { label: "End Date", value: selectedEvent.end instanceof Date ? selectedEvent.end.toLocaleDateString() : '' },
                { label: "Time", value: selectedEvent.time },
                { label: "Price", value: selectedEvent.price },
                { label: "Capacity", value: selectedEvent.capacity }
              ].map(item => (
                <p key={item.label}><strong>{item.label}:</strong> {item.value}</p>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventCalendar;

