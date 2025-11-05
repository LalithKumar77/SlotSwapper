import { useState, useEffect } from 'react';
import { getMyEvents, deleteEvent, updateEvent } from '../utils/api';
import { toast } from 'react-toastify';
import EventForm from '../components/EventForm';
import './Dashboard.css';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getMyEvents();

      if(response && response.length <= 0) {
        toast.info('No events found');
      }

      setEvents(response.events || response);
    } catch (error) {
      toast.error(error.response.data.error || 'Failed to fetch events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await deleteEvent(eventId);
      setEvents(events.filter(event => event.eventid !== eventId));
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error(error.response.data.error || 'Failed to delete event');
      console.error('Error deleting event:', error);
    }
  };

  const handleMakeSwappable = async (event) => {
    console.log('Toggling swappable for event:', event);
    if (event.status === 'SWAP_PENDING') {
      toast.warning('This event is already in a pending swap request');
      return;
    }

    try {
      const newStatus = event.status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE';
      await updateEvent(event.eventid, { status: newStatus });
      
      setEvents(events.map(e => 
        e.eventid === event.eventid ? { ...e, status: newStatus } : e
      ));
      
      toast.success(`Event marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update event status');
      console.error('Error updating event:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleEventFormClose = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleEventSaved = () => {
    fetchEvents();
    handleEventFormClose();
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'BUSY': return 'status-busy';
      case 'SWAPPABLE': return 'status-swappable';
      case 'SWAP_PENDING': return 'status-pending';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your events...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>My Calendar</h1>
          <p className="dashboard-subtitle">Manage your events and time slots</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowEventForm(true)}>
          + Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No events yet</h3>
          <p>Create your first event to get started with slot swapping</p>
          <button className="btn btn-primary" onClick={() => setShowEventForm(true)}>
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div key={event.eventid} className="event-card">
              <div className="event-header">
                <h3>{event.title}</h3>
                <span className={`status-badge ${getStatusBadgeClass(event.status)}`}>
                  {event.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="event-time">
                <div className="time-item">
                  <span className="time-icon">🕒</span>
                  <div className="time-details">
                    <span className="time-label">Start:</span>
                    <span className="time-value">{formatDateTime(event.startTime)}</span>
                  </div>
                </div>
                <div className="time-item">
                  <span className="time-icon">🏁</span>
                  <div className="time-details">
                    <span className="time-label">End:</span>
                    <span className="time-value">{formatDateTime(event.endTime)}</span>
                  </div>
                </div>
              </div>

              {event.description && (
                <p className="event-description">{event.description}</p>
              )}

              <div className="event-actions">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleEdit(event)}
                  disabled={event.status === 'SWAP_PENDING'}
                >
                  Edit
                </button>
                <button 
                  className={`btn btn-sm ${event.status === 'SWAPPABLE' ? 'btn-warning' : 'btn-success'}`}
                  onClick={() => handleMakeSwappable(event)}
                  disabled={event.status === 'SWAP_PENDING'}
                >
                  {event.status === 'SWAPPABLE' ? 'Mark as Busy' : 'Make Swappable'}
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(event.eventid)}
                  disabled={event.status === 'SWAP_PENDING'}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEventForm && (
        <EventForm 
          event={editingEvent}
          onClose={handleEventFormClose}
          onSave={handleEventSaved}
        />
      )}
    </div>
  );
}

export default Dashboard;
