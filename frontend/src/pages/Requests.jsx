import { useState, useEffect } from 'react';
import { getSwapRequests, respondToSwapRequest } from '../utils/api';
import { toast } from 'react-toastify';
import './Requests.css';

function Requests() {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  const fetchSwapRequests = async () => {
    try {
      setLoading(true);
      const response = await getSwapRequests();
      console.log('Swap requests:', response);
      
      // Handle the response structure: response.data contains incoming and outgoing arrays
      const incoming = response.data?.incoming || [];
      const outgoing = response.data?.outgoing || [];
      
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (error) {
      toast.error('Failed to fetch swap requests');
      console.error('Error fetching swap requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId, accept) => {
    try {
      setProcessingId(requestId);
      await respondToSwapRequest(requestId, accept);
      
      toast.success(accept ? 'Swap request accepted!' : 'Swap request rejected');
      fetchSwapRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${accept ? 'accept' : 'reject'} swap request`);
      console.error('Error responding to swap request:', error);
    } finally {
      setProcessingId(null);
    }
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
      <div className="requests-container">
        <div className="requests-loading">Loading swap requests...</div>
      </div>
    );
  }

  return (
    <div className="requests-container">
      <div className="requests-header">
        <h1>Swap Requests</h1>
        <p className="requests-subtitle">Manage your incoming and outgoing swap requests</p>
      </div>

      {/* Incoming Requests Section */}
      <section className="requests-section">
        <div className="section-header">
          <h2>Incoming Requests</h2>
          <span className="requests-count">{incomingRequests.length}</span>
        </div>

        {incomingRequests.length === 0 ? (
          <div className="requests-empty-state">
            <div className="empty-icon">📥</div>
            <h3>No incoming requests</h3>
            <p>When someone requests to swap with your slots, they'll appear here</p>
          </div>
        ) : (
          <div className="requests-list">
            {incomingRequests.map(request => (
              <div key={request._id} className="request-card incoming">
                <div className="request-header">
                  <span className="request-badge incoming-badge">Incoming</span>
                  <span className="request-from">From: {request.mySlot?.username || 'Unknown'}</span>
                  <span className={`request-status status-${request.status?.toLowerCase()}`}>
                    {request.status}
                  </span>
                </div>

                <div className="swap-details">
                  <div className="swap-slot">
                    <div className="slot-label">They offer:</div>
                    <div className="slot-info">
                      <h4>{request.mySlot?.title}</h4>
                      <div className="slot-time">
                        <span className="time-icon">🕒</span>
                        <span>{formatDateTime(request.mySlot?.startTime)}</span>
                      </div>
                      <div className="slot-time">
                        <span className="time-icon">🏁</span>
                        <span>{formatDateTime(request.mySlot?.endTime)}</span>
                      </div>
                      <span className="slot-duration">
                        ⏱️ {calculateDuration(
                          request.mySlot?.startTime,
                          request.mySlot?.endTime
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="swap-arrow">⇄</div>

                  <div className="swap-slot">
                    <div className="slot-label">For your:</div>
                    <div className="slot-info">
                      <h4>{request.theirSlot?.title}</h4>
                      <div className="slot-time">
                        <span className="time-icon">🕒</span>
                        <span>{formatDateTime(request.theirSlot?.startTime)}</span>
                      </div>
                      <div className="slot-time">
                        <span className="time-icon">🏁</span>
                        <span>{formatDateTime(request.theirSlot?.endTime)}</span>
                      </div>
                      <span className="slot-duration">
                        ⏱️ {calculateDuration(
                          request.theirSlot?.startTime,
                          request.theirSlot?.endTime
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {request.status === 'PENDING' && (
                  <div className="request-actions">
                    <button 
                      className="btn btn-success"
                      onClick={() => handleResponse(request.requestCode, true)}
                      disabled={processingId === request._id}
                    >
                      {processingId === request._id ? 'Processing...' : '✓ Accept'}
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleResponse(request.requestCode, false)}
                      disabled={processingId === request._id}
                    >
                      {processingId === request._id ? 'Processing...' : '✗ Reject'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Outgoing Requests Section */}
      <section className="requests-section">
        <div className="section-header">
          <h2>Outgoing Requests</h2>
          <span className="requests-count">{outgoingRequests.length}</span>
        </div>

        {outgoingRequests.length === 0 ? (
          <div className="requests-empty-state">
            <div className="empty-icon">📤</div>
            <h3>No outgoing requests</h3>
            <p>Visit the Marketplace to request swaps with other users</p>
          </div>
        ) : (
          <div className="requests-list">
            {outgoingRequests.map(request => (
              <div key={request._id} className="request-card outgoing">
                <div className="request-header">
                  <span className="request-badge outgoing-badge">Outgoing</span>
                  <span className="request-to">To: {request.theirSlot?.username || 'Unknown'}</span>
                  <span className={`request-status status-${request.status?.toLowerCase()}`}>
                    {request.status}
                  </span>
                </div>

                <div className="swap-details">
                  <div className="swap-slot">
                    <div className="slot-label">You offer:</div>
                    <div className="slot-info">
                      <h4>{request.mySlot?.title}</h4>
                      <div className="slot-time">
                        <span className="time-icon">🕒</span>
                        <span>{formatDateTime(request.mySlot?.startTime)}</span>
                      </div>
                      <div className="slot-time">
                        <span className="time-icon">🏁</span>
                        <span>{formatDateTime(request.mySlot?.endTime)}</span>
                      </div>
                      <span className="slot-duration">
                        ⏱️ {calculateDuration(
                          request.mySlot?.startTime,
                          request.mySlot?.endTime
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="swap-arrow">⇄</div>

                  <div className="swap-slot">
                    <div className="slot-label">For their:</div>
                    <div className="slot-info">
                      <h4>{request.theirSlot?.title}</h4>
                      <div className="slot-time">
                        <span className="time-icon">🕒</span>
                        <span>{formatDateTime(request.theirSlot?.startTime)}</span>
                      </div>
                      <div className="slot-time">
                        <span className="time-icon">🏁</span>
                        <span>{formatDateTime(request.theirSlot?.endTime)}</span>
                      </div>
                      <span className="slot-duration">
                        ⏱️ {calculateDuration(
                          request.theirSlot?.startTime,
                          request.theirSlot?.endTime
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Requests;
