import React, { useEffect, useRef } from 'react';
import { X, FileText, Search, Trash2, Plus } from 'lucide-react';
import './WelcomeModal.css';

interface WelcomeModalProps {
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
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
  }, [onClose]);

  const features = [
    {
      icon: <Plus size={20} />,
      title: 'Create Notes',
      description: 'Click "New Note" to start writing with markdown support',
    },
    {
      icon: <Search size={20} />,
      title: 'Search Instantly',
      description: 'Find your notes quickly with real-time search',
    },
    {
      icon: <FileText size={20} />,
      title: 'Markdown Editor',
      description: 'Write with a clean, distraction-free markdown editor',
    },
    {
      icon: <Trash2 size={20} />,
      title: 'Easy Management',
      description: 'Delete notes with a simple click when you no longer need them',
    },
  ];

  return (
    <div className="welcome-modal__overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome-modal" ref={modalRef}>
        <button
          ref={closeButtonRef}
          className="welcome-modal__close"
          onClick={onClose}
          aria-label="Close welcome modal"
        >
          <X size={20} />
        </button>

        <div className="welcome-modal__content">
          <div className="welcome-modal__header">
            <h2 id="welcome-title" className="welcome-modal__title">
              Welcome to Notes
            </h2>
            <p className="welcome-modal__subtitle">
              Your personal space for thoughts, ideas, and everything in between.
            </p>
          </div>

          <div className="welcome-modal__features">
            {features.map((feature, index) => (
              <div key={index} className="welcome-modal__feature">
                <div className="welcome-modal__feature-icon">{feature.icon}</div>
                <div className="welcome-modal__feature-text">
                  <h3 className="welcome-modal__feature-title">{feature.title}</h3>
                  <p className="welcome-modal__feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="welcome-modal__button" onClick={onClose}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
