import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from "@fullcalendar/list";
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput, EventContentArg } from '@fullcalendar/core';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EventCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    time: '',
    venue: '',
    price: '',
    capacity: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = (arg: any) => {
    setNewEvent({ ...newEvent, start: arg.dateStr, end: arg.dateStr });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSaveEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/new-event', newEvent, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEvents([...events, response.data]);
      setShowModal(false);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const renderEventContent = (eventContent: EventContentArg) => (
    <div>
      <b>{eventContent.timeText}</b>
      <i>{eventContent.event.title}</i>
    </div>
  );

  return (
    <div className='event-container'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        dayMaxEventRows={3}
        dayMaxEvents={true}
        moreLinkClick="popover"
        dayPopoverFormat={{ weekday: "long", month: "short", day: "numeric", year: "numeric" }}
        editable={true}
        dateClick={handleDateClick}
        eventContent={renderEventContent}
      />

      <Modal show={showModal} onHide={handleCloseModal}>
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
                onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventCapacity">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                value={newEvent.capacity}
                onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEvent}>
            Save Event
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventCalendar;

// now provide me the fetch all , update and delete controller in node js which also verifies the user

// and want to show all users other than the admin at the AllUsers component in a tabular form