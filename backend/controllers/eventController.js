import Event from "../models/Event.js";


async function createEvent(req, res) {
  try {
    const { title, startTime, endTime, description } = req.body;
    const event = new Event({
      title,
      description,
      startTime,
      endTime,
      userId: req.user.id,  
    });
    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


async function getMyEvents(req, res) {
  try {
    const events = await Event.find({ 
                  userId: req.user.id 
                })
                .select("eventid title startTime endTime status -_id"); 
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const updated = await Event.findOneAndUpdate(
      { eventid: id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event updated", event: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Event.findOneAndDelete({ eventid: id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
    createEvent,
    getMyEvents,
    updateEvent,
    deleteEvent
};