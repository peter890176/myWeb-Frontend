import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProjectCard({ project }) {
  const navigate = useNavigate();

  const handleViewProject = () => {
    navigate(`/project/${project.id}`);
  };

  return (
    <div className="portfolio-card">
      {project.image && (
        <div className="project-image">
          <img 
            src={project.image} 
            alt={project.title} 
            onError={(e) => {
              console.log("Project image failed to load:", e.target.src);
              e.target.onerror = null;
              e.target.src = '/images/default-project.jpg';
            }}
          />
        </div>
      )}
      <div className="project-info">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {project.technologies && (
          <div className="project-tech">
            {project.technologies.map((tech, j) => (
              <span key={j} className="tech-tag">{tech}</span>
            ))}
          </div>
        )}
        <button 
          onClick={handleViewProject} 
          className="project-link"
        >
          View Project
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;