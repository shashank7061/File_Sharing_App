import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiDownload, FiAlertCircle, FiLoader } from 'react-icons/fi';
import '../styles/DownloadPage.css';

function DownloadPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const downloadUrl = `${API_URL}/files/download/${id}`;

  const handleDownload = async () => {
    setLoading(true);
    setError('');

    try {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.click();
      
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Error downloading file. The link may be invalid or expired.');
      setLoading(false);
    }
  };

  return (
    <div className="download-page-container">
      <div className="download-card">
        <div className="download-header">
          <FiDownload size={64} />
          <h2>Download File</h2>
          <p>Your file is ready to download</p>
        </div>

        {error && (
          <div className="error-box">
            <FiAlertCircle />
            <p>{error}</p>
          </div>
        )}

        <div className="download-actions">
          <button 
            onClick={handleDownload}
            className="download-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <FiLoader className="spinner" />
                Downloading...
              </>
            ) : (
              <>
                <FiDownload />
                Download File
              </>
            )}
          </button>

          <div className="download-info">
            <p>Click the button above to download your file.</p>
            <p className="note">
              Note: If the download doesn't start, the link may have expired or is invalid.
            </p>
          </div>
        </div>

        <div className="security-notice">
          <FiAlertCircle />
          <p>
            <strong>Security Notice:</strong> Only download files from trusted sources. 
            Scan downloaded files with antivirus software before opening.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DownloadPage;
