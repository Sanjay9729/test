import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartPage.css';
import logo from '../assets/Ella stein logo.png';


const StartPage = () => {
  const navigate = useNavigate();

 const handleStart = React.useCallback(() => {
  console.log('Start clicked, navigating to /login');
  navigate('/login');
}, [navigate]);


 React.useEffect(() => {
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };
  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}, [handleStart]);



  return (
    <div className="startpage-background bg-[rgb(191, 165, 138)] min-h-screen flex items-center justify-center ">
      <div className="startpage-container w-full max-w-4xl px-6 py-10">
        <div className="startpage-card  text-center">
         <div className="logo-text logo-image">
            <img src={logo} alt="Ella Stein Logo" />
          </div>
          <h1 className="startpage-title text-3xl md:text-4xl font-medium mb-4">
            Warranty Registration Form
          </h1>
          <p className="startpage-subtitle text-xl font-light mb-6">
            To claim your complimentary 1-year warranty on your Ella Stein jewelry,<br />
            kindly fill out this form.
          </p>
          <button
            className="startpage-button bg-white text-white py-2 px-6 rounded-md font-medium text-lg hover:black-800 hover:text-white transition-all"
            onClick={handleStart} autoFocus
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
