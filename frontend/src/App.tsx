import React, { useState } from 'react';
import TeacherRegistration from './components/TeacherRegistration';
import FileUpload from './components/FileUpload';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'register' | 'upload'>('register');

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '24px', margin: '0' }}>
          Teacher Participant Registration System
        </h1>
      </header>

      <nav style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('register')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            border: activeTab === 'register' ? '2px solid #007bff' : '1px solid #ccc',
            backgroundColor: activeTab === 'register' ? '#e7f3ff' : '#fff',
            cursor: 'pointer'
          }}
        >
          Register Teacher
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          style={{
            padding: '10px 20px',
            border: activeTab === 'upload' ? '2px solid #007bff' : '1px solid #ccc',
            backgroundColor: activeTab === 'upload' ? '#e7f3ff' : '#fff',
            cursor: 'pointer'
          }}
        >
          Upload Participants
        </button>
      </nav>

      <main>
        {activeTab === 'register' && <TeacherRegistration />}
        {activeTab === 'upload' && <FileUpload />}
      </main>
    </div>
  );
}

export default App;
