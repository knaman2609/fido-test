import React from 'react';
import { FileText, Moon, Search, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useLandingStore } from '@/store/landingStore';
import './LandingPage.css';

const features = [
  {
    icon: FileText,
    title: 'Markdown Support',
    description: 'Write with the power of Markdown. Format text, create lists, and organize your thoughts effortlessly.',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    description: 'Easy on the eyes, day or night. Switch between light and dark themes with a single click.',
  },
  {
    icon: Search,
    title: 'Fast Search',
    description: 'Find your notes instantly. Powerful search helps you locate exactly what you need.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built for speed. Your notes are always ready when inspiration strikes.',
  },
];

export const LandingPage: React.FC = () => {
  const { enterApp } = useLandingStore();

  return (
    <div className="landing-page">
      <div className="landing-page__gradient-bg" />
      
      <header className="landing-page__header">
        <div className="landing-page__logo">
          <Sparkles size={28} className="landing-page__logo-icon" />
          <span className="landing-page__logo-text">Notes</span>
        </div>
      </header>

      <main className="landing-page__main">
        <section className="landing-page__hero">
          <div className="landing-page__hero-content">
            <h1 className="landing-page__title">
              Your thoughts,
              <br />
              <span className="landing-page__title-accent">beautifully organized</span>
            </h1>
            <p className="landing-page__subtitle">
              A clean, fast, and elegant markdown notes app inspired by Apple Notes.
              Capture ideas, organize projects, and stay productive.
            </p>
            <button className="landing-page__cta" onClick={enterApp}>
              <span>Open Notes</span>
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="landing-page__preview">
            <div className="landing-page__preview-window">
              <div className="landing-page__preview-header">
                <div className="landing-page__preview-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="landing-page__preview-content">
                <div className="landing-page__preview-sidebar">
                  <div className="landing-page__preview-search" />
                  <div className="landing-page__preview-note landing-page__preview-note--active" />
                  <div className="landing-page__preview-note" />
                  <div className="landing-page__preview-note" />
                </div>
                <div className="landing-page__preview-editor">
                  <div className="landing-page__preview-line landing-page__preview-line--title" />
                  <div className="landing-page__preview-line" />
                  <div className="landing-page__preview-line" />
                  <div className="landing-page__preview-line landing-page__preview-line--short" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-page__features">
          <h2 className="landing-page__features-title">Everything you need</h2>
          <div className="landing-page__features-grid">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="landing-page__feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="landing-page__feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3 className="landing-page__feature-title">{feature.title}</h3>
                <p className="landing-page__feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="landing-page__footer">
        <p className="landing-page__footer-text">
          Press <kbd>Cmd</kbd> + <kbd>K</kbd> to search • <kbd>Cmd</kbd> + <kbd>N</kbd> for new note
        </p>
      </footer>
    </div>
  );
};
