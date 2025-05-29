import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import HomePage from './pages/HomePage/HomePage';
import ProjectDetail from './pages/ProjectDetailPage/ProjectDetail';


function App() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('https://myweb-peterli.up.railway.app/api/resume/')
    //axios.get('http://localhost:8000/api/resume/') 
      .then(res => {
        setResume(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching resume:', err.response || err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      });
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }


  if (error || !resume) {
    return <div className="error">{error || 'Something went wrong'}</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage resume={resume} scrollToSection={scrollToSection} />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </Router>
  );
}

export default App;