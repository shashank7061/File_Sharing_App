import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import DownloadPage from './components/DownloadPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>🔐 Secure File Share</h1>
          <p>Share files securely with unique download links</p>
        </header>
        
        <Routes>
          <Route path="/" element={<FileUpload />} />
          <Route path="/download/:id" element={<DownloadPage />} />
        </Routes>
        
        <footer className="app-footer">
          <p>Made with ❤️ using React, Node.js, and MongoDB</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
