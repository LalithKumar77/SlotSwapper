import { useState, useEffect } from 'react';
import { getMyEvents, createSwapRequest } from '../utils/api';
import { toast } from 'react-toastify';
import './SwapRequestModal.css';

function SwapRequestModal({ targetSlot, onClose, onSuccess }) {
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMySwappableSlots();
  }, []);

  const fetchMySwappableSlots = async () => {
    try {
      setLoading(true);
      const response = await getMyEvents();
      const events = response.events || response;
      // Filter only SWAPPABLE events
      const swappable = events.filter(event => event.status === 'SWAPPABLE');
      setMySwappableSlots(swappable);
      console.log('My swappable slots:', swappable);
    } catch (error) {
      toast.error('Failed to fetch your swappable slots');
      console.error('Error fetching swappable slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlotId) {
      toast.warning('Please select one of your slots to offer');
      return;
    }

    try {
      setSubmitting(true);
      await createSwapRequest(selectedSlotId, targetSlot.eventid);
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send swap request');
      console.error('Error creating swap request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0 && diffMinutes > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      return `${diffMinutes}m`;
    }
  };

  return (
    <div className="swap-request-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content swap-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Request Swap</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>

        <div className="swap-info">
          <h3>You want to swap for:</h3>
          <div className="target-slot-card">
            <div className="target-slot-title">
              <strong>{targetSlot.title}</strong>
              <span className="target-duration">{calculateDuration(targetSlot.startTime, targetSlot.endTime)}</span>
            </div>
            <div className="target-slot-time">
              {formatDateTime(targetSlot.startTime)} - {formatDateTime(targetSlot.endTime)}
            </div>
            <div className="target-slot-owner">
              Owner: {targetSlot.ownerName || targetSlot.ownerEmail}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select one of your SWAPPABLE slots to offer:</label>
            
            {loading ? (
              <div className="loading-slots">Loading your slots...</div>
            ) : mySwappableSlots.length === 0 ? (
              <div className="no-slots-message">
                <p>⚠️ You don't have any SWAPPABLE slots.</p>
                <p>Go to your Dashboard and mark an event as "Make Swappable" first.</p>
              </div>
            ) : (
              <div className="slots-list">
                {mySwappableSlots.map(slot => (
                  <label 
                    key={slot.eventid} 
                    className={`slot-option ${selectedSlotId === slot.eventid ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={slot.eventid}
                      checked={selectedSlotId === slot.eventid}
                      onChange={(e) => setSelectedSlotId(e.target.value)}
                    />
                    <div className="slot-option-content">
                      <div className="slot-option-header">
                        <strong>{slot.title}</strong>
                        <span className="slot-option-duration">
                          {calculateDuration(slot.startTime, slot.endTime)}
                        </span>
                      </div>
                      <div className="slot-option-time">
                        {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
                      </div>
                      {slot.description && (
                        <div className="slot-option-desc">{slot.description}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting || !selectedSlotId || mySwappableSlots.length === 0}
            >
              {submitting ? 'Sending...' : 'Send Swap Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default SwapRequestModal;
