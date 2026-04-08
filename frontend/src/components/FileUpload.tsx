import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { FileValidationResult } from '../types';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [teacherId, setTeacherId] = useState('');
  const [validationResult, setValidationResult] = useState<FileValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setValidationResult(null);
      setMessage('');
    }
  };

  const handleValidate = async () => {
    if (!file) return;

    setLoading(true);
    setMessage('');

    try {
      const result = await apiService.validateFile(file);
      setValidationResult(result);
    } catch (error: any) {
      setMessage(`Validation error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !teacherId) return;

    setLoading(true);
    setMessage('');

    try {
      await apiService.uploadFile(file, teacherId);
      setValidationResult(null);
      setFile(null);
      setTeacherId('');
    } catch (error: any) {
      setMessage(`Upload error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Upload Participant File</h2>

      <div>
        <div className="form-group">
          <label>Teacher ID</label>
          <input
            type="text"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            placeholder="Enter teacher ID"
          />
        </div>

        <div className="form-group">
          <label>CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>

        <div>
          <button
            onClick={handleValidate}
            disabled={!file || loading}
            className="btn btn-secondary"
          >
            {loading ? 'Validating...' : 'Validate File'}
          </button>

          <button
            onClick={handleUpload}
            disabled={!file || !teacherId || !validationResult?.isValid || loading}
            className="btn btn-primary"
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>

      {validationResult && (
        <div style={{ marginTop: '20px' }}>
          <h3>Validation Results</h3>
          <div className={`message ${validationResult.isValid ? 'success' : 'error'}`}>
            {validationResult.isValid ? 'File is valid!' : 'File has errors'}
          </div>

          {validationResult.errors.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <h4 style={{ color: 'red' }}>Errors:</h4>
              <ul style={{ color: 'red' }}>
                {validationResult.errors.map((error, index) => (
                  <li key={index}>
                    {error.row && `Row ${error.row}: `}
                    {error.column && `${error.column}: `}
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: '10px' }}>
            <h4>Preview (first 5 rows):</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Level</th>
                  <th>Course</th>
                  <th>Birth Date</th>
                </tr>
              </thead>
              <tbody>
                {validationResult.rows.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    <td>{row.firstName}</td>
                    <td>{row.lastName}</td>
                    <td>{row.level}</td>
                    <td>{row.course}</td>
                    <td>{row.birthDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {message && (
        <div className={`message ${message.includes('error') || message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FileUpload;