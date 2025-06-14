import React, { useRef, useState } from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { ASSETS } from '../../constants';
import Chatbot from '../../components/Chatbot/Chatbot';
import './HomePage.css';

// English example prompts
const examplePromptsForPage = [
    { id: 'ex1', text: "What are your technical skills?" },
    { id: 'ex2', text: "What's your view on AI?" },
    { id: 'ex3', text: "What are your hobbies?" },
];

function HomePage({ resume, scrollToSection }) {
  const [showPastProjects, setShowPastProjects] = useState(false);
  const chatbotInputSetterRef = useRef(null);

  const handlePageExampleClick = (promptText) => {
      if (chatbotInputSetterRef.current) {
          chatbotInputSetterRef.current(promptText);
      }
  };

  const recentProjects = resume.portfolio ? resume.portfolio.slice(0, 2) : [];
  const pastProjects = resume.portfolio ? resume.portfolio.slice(2) : [];

  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="profile-container">
          <div className="profile-circle">
            <img 
              src={resume.profileImage} 
              alt="Profile" 
              className="profile-image-inner" 
              onError={(e) => {
                console.log("Profile image failed to load:", e.target.src);
                e.target.onerror = null;
                e.target.src = ASSETS.PROFILE_IMAGE;
              }}
            />
          </div>
        </div>
        <ul className="nav-links">
          <li onClick={() => scrollToSection('about')}>About Me</li>
          <li onClick={() => scrollToSection('chatbot')}>AI Assistant</li>
          <li onClick={() => scrollToSection('portfolio')}>Portfolio</li>
          <li onClick={() => scrollToSection('certificates')}>Certificate</li>
          <li onClick={() => scrollToSection('education')}>Education</li>
          <li onClick={() => scrollToSection('skills')}>Skill Set</li>
          <li>
            <a href={resume.cvPdf || ASSETS.CV_PDF} target="_blank" rel="noopener noreferrer">CV</a>
          </li>
        </ul>
      </nav>
      
      <main className="content">
        <section id="about" className="section">
          <h2>About Me</h2>
          <div className="about-content">
            <h1>{resume.name}</h1>
            <h3>{resume.job}</h3>
            <p className="about-text">{resume.about}</p>
            
            <div className="contact-links">
              <a href={`mailto:${resume.email}`} className="contact-link">
                <FaEnvelope /> {resume.email}
              </a>
              <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
                <FaLinkedin /> LinkedIn
              </a>
              <a href={resume.github} target="_blank" rel="noopener noreferrer" className="contact-link">
                <FaGithub /> GitHub
              </a>
            </div>
          </div>
        </section>
        
        <section id="chatbot" className="section">
          <h2>Chat with My AI Assistant</h2>
          
          <div className="ai-assistant-content-area">
            <div className="chatbot-wrapper">
              <Chatbot 
                setExternalInputValue={chatbotInputSetterRef} 
                scrollToSection={scrollToSection}
              />
            </div>
            
            <div className="page-example-prompts">
              <div className="example-buttons-row">
                <h4>Try Asking:</h4>
                {examplePromptsForPage.map((prompt) => (
                  <button 
                    key={prompt.id} 
                    onClick={() => handlePageExampleClick(prompt.text)}
                    className="page-example-prompt-button"
                  >
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        <section id="portfolio" className="section">
          <h2>Recent Projects</h2>
          <div className="portfolio-grid">
            {recentProjects.map((project, i) => (
              <ProjectCard key={`recent-${i}`} project={project} />
            ))}
          </div>
          
          {pastProjects.length > 0 && (
            <div className="past-projects-container">
              <button 
                onClick={() => setShowPastProjects(!showPastProjects)} 
                className="toggle-projects-button"
              >
                {showPastProjects ? 'Hide Past Projects' : 'Show Past Projects'}
              </button>
              
              {showPastProjects && (
                <div className="past-projects-grid">
                  <h3>Past Projects</h3>
                  <div className="portfolio-grid">
                    {pastProjects.map((project, i) => (
                      <ProjectCard key={`past-${i}`} project={project} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
        
        <section id="certificates" className="section">
          <h2>Certificate</h2>
          <div className="certificates-list">
            {resume.certificates && resume.certificates.map((cert, i) => (
              <div key={i} className="certificate-item">
                <h3>
                  {cert.link ? (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-link">
                      {cert.name}
                    </a>
                  ) : (
                    cert.name
                  )}
                </h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <p className="cert-date">Certificate earned at {cert.date}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section id="education" className="section">
          <h2>Education</h2>
          <div className="education-list">
            {resume.education && resume.education.map((edu, i) => (
              <div key={i} className="education-item">
                <h3>{edu.institution}</h3>
                {edu.department && <p className="edu-dept">{edu.department}</p>}
                <p className="edu-degree">{edu.degree}</p>
                <p className="edu-period">{edu.period}</p>
                {edu.expected && <p className="edu-expected">{edu.expected}</p>}
                {edu.gpa && <p className="edu-gpa">{edu.gpa}</p>}
              </div>
            ))}
          </div>
        </section>
        
        <section id="skills" className="section">
          <h2>Skill Set</h2>
          <div className="skills-container">
            <div className="skills-list">
              {resume.skills && resume.skills.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage; 