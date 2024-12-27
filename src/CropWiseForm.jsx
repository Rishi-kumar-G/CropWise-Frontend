import React, { useState, useEffect, useRef } from 'react';
import './home.css';

import ResultsModal from './ResultModal';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div style={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

const OptionButton = ({ value, onClick, isSelected }) => (
  <button
    style={{
      ...styles.optionButton,
      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    }}
    onClick={() => onClick(value)}
  >
    {value}
  </button>
);

const FormSelect = ({ label, value, onChange, options, required, example }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div style={styles.labelContainer}>
        <label style={styles.label}>
          {label} {required && <span style={{ color: '#ff4444' }}>*</span>}
        </label>
        {example && <span style={styles.example}>e.g., {example}</span>}
      </div>
      <button
        style={styles.selectButton}
        onClick={() => setIsModalOpen(true)}
        type="button"
      >
        {value || `Select ${label.toLowerCase()}`}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Select ${label}`}
      >
        <div style={styles.optionsGrid}>
          {options.map(option => (
            <OptionButton
              key={option}
              value={option}
              isSelected={value === option}
              onClick={(selectedValue) => {
                onChange(selectedValue);
                setIsModalOpen(false);
              }}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

const FormInput = ({ label, value, onChange, required, type = "number", step = "0.1", example }) => (
  <div>
    <div style={styles.labelContainer}>
      <label style={styles.label}>
        {label} {required && <span style={{ color: '#ff4444' }}>*</span>}
      </label>
      {example && <span style={styles.example}>e.g., {example}</span>}
    </div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={styles.input}
      required={required}
      step={step}
    />
  </div>
);

// Your CropWiseForm component remains mostly the same, just updated styles
const CropWiseForm = () => {
  // ... keep all your existing state and handlers ...
  // (keeping the same code from your original component)
  const [formData, setFormData] = useState({
    Crop: '',
    Region: '',
    Soil_Type: '',
    Rainfall_mm: '',
    Fertilizer_Used: '',
    Irrigation_Used: '',
    Weather_Condition: '',
    Temperature_Celsius: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [apiResults, setApiResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const appRef = useRef(null);

  useEffect(() => {
    const moveGradient = (event) => {
      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;

      // const mouseX = Math.round((event.pageX / winWidth) * 100);
      const mouseY = Math.round((event.pageY / winHeight) * 100);
      const mouseX = 50;
      if (appRef.current) {
        appRef.current.style.setProperty("--mouse-x", mouseX.toString() + "%");
        appRef.current.style.setProperty("--mouse-y", mouseY.toString() + "%");
      }
    };

    document.addEventListener("mousemove", moveGradient);
    return () => document.removeEventListener("mousemove", moveGradient);
  }, []);

  const options = {
    regions: ['East', 'West', 'North', 'South'],
    soilTypes: ['Clay', 'Sandy', 'Loam', 'Silt', 'Peat'],
    crops: ['Rice', 'Wheat', 'Corn', 'Soybeans', 'Cotton'],
    weatherConditions: ['Sunny', 'Rainy', 'Cloudy', 'Partially Cloudy'],
    yesNoOptions: ['Yes', 'No']
  };

  const handleInputChange = (field, value) => {
    setError('');
    setSuccess(false);
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };


  const validateForm = () => {
    const requiredFields = ['Region', 'Soil_Type', 'Crop', 'Rainfall_mm', 'Temperature_Celsius', 'Weather_Condition'];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`${field.replace('_', ' ')} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setError('');

      try {
        console.log('Form Data:', JSON.stringify(formData));
        const response = await fetch('https://flow-api.mira.network/v1/flows/flows/rishi/cropwise-ai-advanced?version=0.1.1', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'miraauthorization': "sb-1d8970aa79b250d78f3e032d4759557b"
          },
          body: "{\"input\":" + JSON.stringify(formData) + "}",

        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        console.log('API Response:', data);
        setApiResults(data);
        setSuccess(true);
        setShowResults(true);
      } catch (err) {
        setError('Failed to fetch recommendations. Please try again.' + err);
        console.error('API Error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  let navigate = useNavigate();


  return (
    <div className='app' ref={appRef}>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Press+Start+2P&display=swap');
      </style>

      <ResultsModal isOpen={showResults} onClose={() => setShowResults(false)} results={apiResults} />

      <div style={styles.container}>

        <button style={styles.button} onClick={()=>{navigate(-1)}}>
          <span style={styles.arrow}></span>
        </button>

        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <FormSelect
              label="Region"
              value={formData.Region}
              onChange={(value) => handleInputChange('Region', value)}
              options={options.regions}
              required
              example="North"
            />

            <FormSelect
              label="Soil Type"
              value={formData.Soil_Type}
              onChange={(value) => handleInputChange('Soil_Type', value)}
              options={options.soilTypes}
              required
              example="Loam"
            />

            <FormSelect
              label="Crop"
              value={formData.Crop}
              onChange={(value) => handleInputChange('Crop', value)}
              options={options.crops}
              required
              example="Wheat"
            />

            <FormInput
              label="Rainfall (mm)"
              value={formData.Rainfall_mm}
              onChange={(value) => handleInputChange('Rainfall_mm', value)}
              required
              example="750"
            />

            <FormInput
              label="Temperature (°C)"
              value={formData.Temperature_Celsius}
              onChange={(value) => handleInputChange('Temperature_Celsius', value)}
              required
              example="25"
            />

            <FormSelect
              label="Fertilizer Used"
              value={formData.Fertilizer_Used}
              onChange={(value) => handleInputChange('Fertilizer_Used', value)}
              options={options.yesNoOptions}
              example="Yes"
            />

            <FormSelect
              label="Irrigation Used"
              value={formData.Irrigation_Used}
              onChange={(value) => handleInputChange('Irrigation_Used', value)}
              options={options.yesNoOptions}
              example="Yes"
            />

            <FormSelect
              label="Weather Condition"
              value={formData.Weather_Condition}
              onChange={(value) => handleInputChange('Weather_Condition', value)}
              options={options.weatherConditions}
              required
              example="Sunny"
            />

            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>Recommendations are Ready !!!</div>}
            {success && <button onClick={() => setShowResults(true)} style={styles.buttonStyle}>View Recommendations</button>}


            <button type="submit" style={styles.buttonStyle} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Get Recommendations'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


const styles = {
  // ... keep your existing styles ...
  // Add these new styles for the modal:
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  modalContent: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: '12px',
    padding: '20px',
    width: '90%',
    maxWidth: '500px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },

  modalTitle: {
    color: 'white',
    margin: 0,
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.5rem',
  },

  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '5px 10px',
  },

  modalBody: {
    maxHeight: '60vh',
    overflow: 'auto',
  },

  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '10px',
    padding: '10px',
  },

  optionButton: {
    padding: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
    transition: 'all 0.2s ease',
    width: '100%',
    textAlign: 'center',
  },

  selectButton: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    marginBottom: '0.5rem',
    fontFamily: 'Poppins, sans-serif',
    cursor: 'pointer',
    textAlign: 'left',
  },

  // ... keep all your other existing styles ...
  mainContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, black, magenta)',
    margin: -8,
    padding: 0,
    display: 'flex',
    flexDirection: 'row',
  },

  formContainer: {
    padding: '1rem',
    width: '100%',
    height: '100%',
    maxWidth: '800px',
    marginTop: '4rem',
  },

  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '2rem',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'Poppins, sans-serif',
  },

  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    marginBottom: '0.5rem',
    fontFamily: 'Poppins, sans-serif',
  },

  buttonStyle: {
    padding: '16px 32px',
    border: '2px solid white',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    margin: '1rem 0',
    fontFamily: 'Poppins, sans-serif',
  },

  container: {
    marginTop: '-1%',
    backgroundColor: 'black',
    width: '70%',
    height: '100%',
    justifyContent: 'start',
    alignItems: 'start',
    display:'flex',
    flexDirection: 'row',
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },

  example: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    fontFamily: 'Poppins, sans-serif',
  },

  // Update label style to work with the new container
  label: {
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'Poppins, sans-serif',
  },
  resultsContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '1rem',
    borderRadius: '4px',
    color: 'white',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },

  error: {
    color: '#ff4444',
    marginBottom: '1rem',
    textAlign: 'center',
    fontFamily: 'Poppins, sans-serif'
  },

  success: {
    color: '#44ff44',
    marginBottom: '1rem',
    textAlign: 'center',
    fontFamily: 'Poppins, sans-serif'
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "white",
    // border: "1px solid #ccc",
    cursor: "pointer",
    
    
    margin:"20px",
    marginTop:"120px",
  },
  arrow: {
    display: "inline-block",
    width: "12px",
    height: "12px",
    borderTop: "2px solid black",
    borderLeft: "2px solid black",
    transform: "rotate(-45deg)",
  },
};

export default CropWiseForm;