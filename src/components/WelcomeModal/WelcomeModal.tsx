import React, { useEffect, useRef } from 'react';
import { useGreeting } from '@/hooks/useGreeting';
import './WelcomeModal.css';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { greeting } = useGreeting();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="welcome-modal__overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome-modal" ref={modalRef}>
        <div className="welcome-modal__content">
          <h2 id="welcome-title" className="welcome-modal__title">
            {greeting}!
          </h2>
          <p className="welcome-modal__subtitle">Welcome to your personal notes</p>
          
          <div className="welcome-modal__features">
            <div className="welcome-modal__feature">
              <span className="welcome-modal__feature-icon">📝</span>
              <span className="welcome-modal__feature-text">Create and edit notes with markdown</span>
            </div>
            <div className="welcome-modal__feature">
              <span className="welcome-modal__feature-icon">🔍</span>
              <span className="welcome-modal__feature-text">Search through all your notes instantly</span>
            </div>
            <div className="welcome-modal__feature">
              <span className="welcome-modal__feature-icon">☁️</span>
              <span className="welcome-modal__feature-text">Your notes are saved automatically</span>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            className="welcome-modal__button"
            onClick={onClose}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
