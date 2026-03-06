import { useState } from 'react';
import { uploadFile } from '../services/api';
import EmailForm from './EmailForm';
import { FiUpload, FiFile, FiCopy, FiCheck } from 'react-icons/fi';
import '../styles/FileUpload.css';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [expiryHours, setExpiryHours] = useState(24);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('expiryHours', expiryHours);

      const response = await uploadFile(formData);
      setUploadedFile(response.file);
      setFile(null);
    } catch (err) {
      setError(err.message || 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (uploadedFile?.downloadLink) {
      navigator.clipboard.writeText(uploadedFile.downloadLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setFile(null);
    setError('');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      {!uploadedFile ? (
        <div className="upload-card">
          <h2>Upload Your File</h2>
          
          <form onSubmit={handleUpload}>
            <div 
              className={`drop-zone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FiUpload size={48} />
              <p>Drag & drop your file here</p>
              <p className="or-text">or</p>
              <label htmlFor="file-input" className="file-label">
                Choose File
              </label>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {file && (
              <div className="selected-file">
                <FiFile />
                <div className="file-details">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{formatFileSize(file.size)}</p>
                </div>
              </div>
            )}

            <div className="expiry-section">
              <label htmlFor="expiry">File Expiry (hours):</label>
              <select
                id="expiry"
                value={expiryHours}
                onChange={(e) => setExpiryHours(e.target.value)}
              >
                <option value="1">1 hour</option>
                <option value="6">6 hours</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours (1 day)</option>
                <option value="72">72 hours (3 days)</option>
                <option value="168">168 hours (1 week)</option>
                <option value="0">No expiry</option>
              </select>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button 
              type="submit" 
              className="upload-btn"
              disabled={loading || !file}
            >
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
          </form>
        </div>
      ) : (
        <div className="success-card">
          <div className="success-header">
            <FiCheck size={64} color="#28a745" />
            <h2>File Uploaded Successfully!</h2>
          </div>

          <div className="file-info">
            <p><strong>File:</strong> {uploadedFile.filename}</p>
            <p><strong>Size:</strong> {formatFileSize(uploadedFile.size)}</p>
            {uploadedFile.expiresAt && (
              <p><strong>Expires:</strong> {new Date(uploadedFile.expiresAt).toLocaleString()}</p>
            )}
          </div>

          <div className="download-link-section">
            <label>Download Link:</label>
            <div className="link-container">
              <input 
                type="text" 
                value={uploadedFile.downloadLink} 
                readOnly 
                className="link-input"
              />
              <button 
                onClick={copyToClipboard} 
                className="copy-btn"
                title="Copy to clipboard"
              >
                {copied ? <FiCheck /> : <FiCopy />}
              </button>
            </div>
          </div>

          <EmailForm fileId={uploadedFile.id} />

          <button onClick={resetUpload} className="upload-another-btn">
            Upload Another File
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
