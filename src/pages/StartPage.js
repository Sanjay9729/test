import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartPage.css';

const StartPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    console.log('Start clicked, navigating to /login');
    navigate('/login');
  };

  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleStart();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="startpage-background">
      <div className="startpage-container">
        <div className="startpage-card">
          <div className="startpage-logo">ELLA STEIN</div>
          <h1 className="startpage-title">Warranty Registration Form</h1>
          <p className="startpage-subtitle">
            To claim your complimentary 1-year warranty on your Ella Stein jewelry,<br />
            kindly fill out this form.
          </p>
          <button className="startpage-button" onClick={handleStart} autoFocus>
            Start
          </button>
          <div className="startpage-info">
            <span>press <kbd>Enter ↵</kbd></span>
            {/* <br />
            <small>⏲ Takes 30 sec</small> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
