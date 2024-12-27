import React from 'react';

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.233)',
    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    zIndex: 50,
    backdropFilter: 'blur(1.5px)'
    
  },
  modalContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#393939',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    color: '#ffffff'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    borderBottom: '1px solid #333',
    backgroundColor: '#393939'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 500,
    margin: 0,
    color: '#e5e5e5',
    fontFamily: 'Poppins, sans-serif'

  },
  closeButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff'
  },
  contentContainer: {
    overflowY: 'auto',
    maxHeight: '90vh'
  },
  content: {
    padding: '1.5rem',
    color: '#d1d1d1',
    fontFamily: 'Poppins, sans-serif'

  },
  heading: {
    fontSize: '1.125rem',
    fontWeight: 500,
    marginTop: '1.5rem',
    marginBottom: '0.75rem',
    color: '#ffffff',
    fontFamily: 'Poppins, sans-serif'
    
  },
  paragraph: {
    margin: '0.5rem 0',
    color: '#e0e0e0d3',
    fontFamily: 'Poppins, sans-serif'

  },
  listItem: {
    marginLeft: '1rem',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
    color: '#c5c4c4',
    fontFamily: 'Poppins, sans-serif'
  }
};

const formatText = (text) => {
  // Replace ** bold ** with spans
  text = text.replace(/\*\*(.*?)\*\*/g, '<span style="font-weight: 600; color: #ffffff;">$1</span>');
  
  // Split on newlines and wrap each line
  const lines = text.split('\n').filter(line => line.trim());
  
  return lines.map((line, index) => {
    if (line.startsWith('###')) {
      return (
        <h3 key={index} style={styles.heading}>
          {line.replace('###', '').trim()}
        </h3>
      );
    }
    
    if (/^\d+\./.test(line)) {
      return (
        <div key={index} style={styles.listItem}>
          <span dangerouslySetInnerHTML={{ __html: line }} />
        </div>
      );
    }
    
    return (
      <div key={index} style={styles.paragraph} dangerouslySetInnerHTML={{ __html: line }} />
    );
  });
};

const ResultsModal = ({ isOpen, onClose, results }) => {
  if (!isOpen || !results) return null;
  
  const content = results.result || '';

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContainer} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Recommendations</h2>
          <button style={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div style={styles.contentContainer}>
          <div style={styles.content}>
            {formatText(content)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;
