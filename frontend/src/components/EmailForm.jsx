import { useState } from 'react';
import { sendEmail } from '../services/api';
import { FiMail, FiSend } from 'react-icons/fi';
import '../styles/EmailForm.css';

function EmailForm({ fileId }) {
  const [senderEmail, setSenderEmail] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!senderEmail || !receiverEmail) {
      setError('Both email addresses are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await sendEmail({
        fileId,
        senderEmail,
        receiverEmail,
        message
      });
      
      setSuccess(true);
      setSenderEmail('');
      setReceiverEmail('');
      setMessage('');
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Error sending email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-form-container">
      <div className="email-header">
        <FiMail size={24} />
        <h3>Send via Email</h3>
      </div>

      <form onSubmit={handleSubmit} className="email-form">
        <div className="form-group">
          <label htmlFor="sender">Your Email:</label>
          <input
            id="sender"
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="receiver">Recipient Email:</label>
          <input
            id="receiver"
            type="email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            placeholder="recipient@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message (optional):</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a personal message..."
            rows="3"
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Email sent successfully!</p>}

        <button 
          type="submit" 
          className="send-btn"
          disabled={loading}
        >
          <FiSend />
          {loading ? 'Sending...' : 'Send Email'}
        </button>
      </form>
    </div>
  );
}

export default EmailForm;
