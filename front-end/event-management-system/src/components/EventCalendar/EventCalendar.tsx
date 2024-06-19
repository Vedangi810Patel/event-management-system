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
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState({ id: '', title: '', start: '', end: '', time: '', venue: '', price: 0, capacity: 0 });

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const handleDateSelect = (arg: DateSelectArg) => {
    setEventData({ id: '', title: '', start: arg.startStr, end: arg.endStr, time: '', venue: '', price: 0, capacity: 0 });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSaveEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      if (isEditing) {
        await axios.put(`http://localhost:5000/update-event/${eventData.id}`, eventData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post('http://localhost:5000/new-event', eventData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/delete-event/${eventData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEventClick = (arg: EventClickArg) => {
    setEventData({
      id: arg.event.id as string,
      title: arg.event.title,
      start: arg.event.startStr.split('T')[0],
      end: arg.event.endStr.split('T')[0],
      time: arg.event.extendedProps.time,
      venue: arg.event.extendedProps.venue,
      price: arg.event.extendedProps.price,
      capacity: arg.event.extendedProps.capacity
    });
    setIsEditing(true);
    setShowModal(true);
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Event' : 'Add Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventVenue">
              <Form.Label>Venue</Form.Label>
              <Form.Control
                type="text"
                value={eventData.venue}
                onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={eventData.start}
                onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={eventData.end}
                onChange={(e) => setEventData({ ...eventData, end: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={eventData.time}
                onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={eventData.price}
                onChange={(e) => setEventData({ ...eventData, price: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Form.Group controlId="formEventCapacity">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                value={eventData.capacity}
                onChange={(e) => setEventData({ ...eventData, capacity: parseInt(e.target.value) })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {isEditing && (
            <Button variant="danger" onClick={handleDeleteEvent}>
              Delete Event
            </Button>
          )}
          <Button variant="primary" onClick={handleSaveEvent}>
            {isEditing ? 'Update Event' : 'Save Event'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventCalendar;
  