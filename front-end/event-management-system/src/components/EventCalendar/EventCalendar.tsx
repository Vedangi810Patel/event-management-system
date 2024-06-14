import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventInput, EventContentArg } from '@fullcalendar/core';
// import '@fullcalendar/daygrid/main.min.css';
// import '@fullcalendar/timegrid/main.min.css';

const EventCalendar: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/events')
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const handleDateClick = (arg: DateClickArg) => {
    const title = prompt('Enter event title:');
    if (title) {
      const newEvent = { title, start: arg.dateStr };
      axios.post('http://localhost:5000/events', newEvent)
        .then(response => setEvents([...events, response.data]))
        .catch(error => console.error('Error adding event:', error));
    }
  };

  const renderEventContent = (eventContent: EventContentArg) => (
    <div>
      <b>{eventContent.timeText}</b>
      <i>{eventContent.event.title}</i>
    </div>
  );

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      dateClick={handleDateClick}
      eventContent={renderEventContent}
    />
  );
};

export default EventCalendar;
