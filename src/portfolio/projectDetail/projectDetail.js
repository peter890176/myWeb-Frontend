import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './projectDetail.css';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    setLoading(true);
    // Use the same base URL as your main API
    axios.get(`http://localhost:8000/api/project/${id}/`)
      .then(res => {
        setProject(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching project details:', err.response || err);
        setError('Failed to load project details. Please try again later.');
        setLoading(false);
      });
  }, [id]);
  
  if (loading) {
    return <div className="loading">Loading project details...</div>;
  }
  
  if (error || !project) {
    return (
      <div className="error-container">
        <div className="error">{error || 'Project not found'}</div>
        <button onClick={() => navigate('/')} className="back-button">Back to Home</button>
      </div>
    );
  }
  
  return (
    <div className="project-detail-container">
      <button onClick={() => navigate('/')} className="back-button">Back to Home</button>
      
      <div className="project-detail">
        <h1>{project.title}</h1>
        
        {project.image && (
          <>
            <div className="project-detail-image">
              <img 
                src={project.image} 
                alt={project.title} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/default-project.jpg';
                }}
              />
            </div>
            {project.imageCaption && (
              <div className="image-caption-below">
                {project.imageCaption}
              </div>
            )}
          </>
        )}
        
        <div className="project-detail-content">
          <h2>Project Description</h2>
          <p>{project.fullDescription || project.description}</p>
          
          {project.technologies && (
            <div className="project-detail-tech">
              <h2>Technologies Used</h2>
              <div className="tech-tags">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          )}
          
          {project.features && (
            <div className="project-detail-features">
              <h2>Key Features</h2>
              <ul>
                {project.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {project.github && (
            <div className="project-detail-links">
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link github-link">
                View Source Code
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;