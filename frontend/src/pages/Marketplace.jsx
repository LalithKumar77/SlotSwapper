import { useState, useEffect } from 'react';
import { getSwappableSlots } from '../utils/api';
import { toast } from 'react-toastify';
import SwapRequestModal from '../components/SwapRequestModal';
import './Marketplace.css';

function Marketplace() {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const response = await getSwappableSlots();
      setAvailableSlots(response.slots || response);
      console.log('Available slots:', response);
    } catch (error) {
      toast.error('Failed to fetch available slots');
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = (slot) => {
    setSelectedSlot(slot);
    setShowSwapModal(true);
  };

  const handleModalClose = () => {
    setShowSwapModal(false);
    setSelectedSlot(null);
  };

  const handleSwapRequestSent = () => {
    toast.success('Swap request sent successfully!');
    handleModalClose();
    fetchAvailableSlots(); // Refresh the list
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

  if (loading) {
    return (
      <div className="marketplace-container">
        <div className="loading">Loading available slots...</div>
      </div>
    );
  }

  return (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <div>
          <h1>Marketplace</h1>
          <p className="marketplace-subtitle">Browse and swap available time slots</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchAvailableSlots}>
          🔄 Refresh
        </button>
      </div>

      {availableSlots.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No available slots</h3>
          <p>There are currently no swappable slots available from other users</p>
        </div>
      ) : (
        <div className="slots-grid">
          {availableSlots.map(slot => (
            <div key={slot.eventid} className="slot-card">
              <div className="slot-header">
                <h3>{slot.title}</h3>
                <span className="duration-badge">
                  ⏱️ {calculateDuration(slot.startTime, slot.endTime)}
                </span>
              </div>

              <div className="slot-owner">
                <span className="owner-icon">👤</span>
                <span className="owner-name">{slot.userId.username || slot.ownerEmail}</span>
              </div>

              <div className="slot-time">
                <div className="time-item">
                  <span className="time-icon">🕒</span>
                  <div className="time-details">
                    <span className="time-label">Start:</span>
                    <span className="time-value">{formatDateTime(slot.startTime)}</span>
                  </div>
                </div>
                <div className="time-item">
                  <span className="time-icon">🏁</span>
                  <div className="time-details">
                    <span className="time-label">End:</span>
                    <span className="time-value">{formatDateTime(slot.endTime)}</span>
                  </div>
                </div>
              </div>

              {slot.description && (
                <p className="slot-description">{slot.description}</p>
              )}

              <div className="slot-actions">
                <button 
                  className="btn btn-primary btn-block"
                  onClick={() => handleRequestSwap(slot)}
                >
                  Request Swap 🔄
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSwapModal && selectedSlot && (
        <SwapRequestModal
          targetSlot={selectedSlot}
          onClose={handleModalClose}
          onSuccess={handleSwapRequestSent}
        />
      )}
    </div>
  );
}

export default Marketplace;
