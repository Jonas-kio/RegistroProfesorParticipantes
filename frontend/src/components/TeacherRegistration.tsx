import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Institution, TeacherRegistrationInput } from '../types';

const TeacherRegistration: React.FC = () => {
  const [formData, setFormData] = useState<TeacherRegistrationInput>({
    fullName: '',
    email: '',
    institutionId: '',
    newInstitutionName: '',
    newInstitutionCity: '',
  });
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [useExistingInstitution, setUseExistingInstitution] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    try {
      const data = await apiService.getInstitutions();
      setInstitutions(data);
    } catch (error) {
      console.error('Failed to load institutions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const input: TeacherRegistrationInput = {
        fullName: formData.fullName,
        email: formData.email,
      };

      if (useExistingInstitution) {
        input.institutionId = formData.institutionId;
      } else {
        input.newInstitutionName = formData.newInstitutionName;
        input.newInstitutionCity = formData.newInstitutionCity;
      }

      await apiService.registerTeacher(input);
      setMessage('Teacher registered successfully!');
      setFormData({
        fullName: '',
        email: '',
        institutionId: '',
        newInstitutionName: '',
        newInstitutionCity: '',
      });
      loadInstitutions(); // Refresh institutions list
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <h2>Register Teacher</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="radio"
              checked={useExistingInstitution}
              onChange={() => setUseExistingInstitution(true)}
            />
            Use existing institution
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="radio"
              checked={!useExistingInstitution}
              onChange={() => setUseExistingInstitution(false)}
            />
            Create new institution
          </label>
        </div>

        {useExistingInstitution ? (
          <div className="form-group">
            <label>Institution</label>
            <select
              name="institutionId"
              value={formData.institutionId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select institution</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} - {inst.city}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Institution Name</label>
              <input
                type="text"
                name="newInstitutionName"
                value={formData.newInstitutionName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Institution City</label>
              <input
                type="text"
                name="newInstitutionCity"
                value={formData.newInstitutionCity}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Registering...' : 'Register Teacher'}
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default TeacherRegistration;