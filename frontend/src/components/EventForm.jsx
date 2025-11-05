import { useState, useEffect } from 'react';
import { createEvent, updateEvent } from '../utils/api';
import { toast } from 'react-toastify';
import './EventForm.css';

function EventForm({ event, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    status: 'BUSY'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      // Convert dates to local datetime format for input
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        title: event.title || '',
        description: event.description || '',
        startTime: formatDateForInput(event.startTime),
        endTime: formatDateForInput(event.endTime),
        status: event.status || 'BUSY'
      });
    }
  }, [event]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dates
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    if (end <= start) {
      toast.error('End time must be after start time');
      return;
    }

    setLoading(true);

    try {
      if (event) {
        // Update existing event
        await updateEvent(event.eventid, formData);
        toast.success('Event updated successfully');
      } else {
        // Create new event
        await createEvent(formData);
        toast.success('Event created successfully');
      }
      onSave();
    } catch (error) {
      toast.error(error.message || 'Failed to save event');
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Team Meeting, Workshop, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Add event details (optional)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time *</label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time *</label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="BUSY">Busy (Not available for swapping)</option>
              <option value="SWAPPABLE">Swappable (Available for swapping)</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default EventForm;
