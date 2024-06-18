const Event = require('../models/eventModel');

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createEvent = async (req, res) => {
  const { title, start, end, time, venue, price, capacity } = req.body;
  try {
    const newEvent = await Event.create({
      event_name: title,
      event_start_date: start,
      event_end_date: end,
      event_time: time,
      event_venue: venue,
      event_price: price,
      event_capacity: capacity
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, start, end, time, venue, price, capacity } = req.body;
  try {
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    event.event_name = title;
    event.event_start_date = start;
    event.event_end_date = end;
    event.event_time = time;
    event.event_venue = venue;
    event.event_price = price;
    event.event_capacity = capacity;
    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try { 
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    await event.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
