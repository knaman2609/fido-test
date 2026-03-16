import React, { useEffect, useRef, useState } from 'react';
import { FileText, Moon, Search, Sparkles, ArrowRight, Zap, Keyboard, FolderOpen, Type, Command, Plus, Trash2, Edit3, Layers, Clock, Shield } from 'lucide-react';
import { useLandingStore } from '@/store/landingStore';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
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

const howItWorksSteps = [
  {
    icon: Plus,
    title: 'Create',
    description: 'Start with a blank note or choose from templates. Your ideas deserve a clean canvas.',
  },
  {
    icon: Type,
    title: 'Write',
    description: 'Use Markdown to format your thoughts. Bold, lists, headers - all at your fingertips.',
  },
  {
    icon: FolderOpen,
    title: 'Organize',
    description: 'Keep everything tidy. Search, sort, and manage your notes with ease.',
  },
];

const shortcuts = [
  { keys: ['⌘', 'N'], action: 'New Note' },
  { keys: ['⌘', 'F'], action: 'Search' },
  { keys: ['⌘', '⌫'], action: 'Delete Note' },
  { keys: ['⌘', 'E'], action: 'Edit Title' },
  { keys: ['⌘', 'K'], action: 'Command Palette' },
  { keys: ['⌘', '⇧', 'T'], action: 'Toggle Theme' },
];

const stats = [
  { icon: Layers, value: 'Unlimited', label: 'Notes' },
  { icon: Clock, value: 'Instant', label: 'Sync' },
  { icon: Shield, value: 'Private', label: 'Storage' },
  { icon: Zap, value: 'Zero', label: 'Latency' },
];

const useScrollAnimation = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = '', 
  delay = 0 
}) => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div 
      ref={ref} 
      className={`${className} animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const TypingAnimation: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = '# My Ideas\n\n- Capture thoughts instantly\n- Stay organized\n- Never lose an idea';
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="landing-page__typing-content">
      {text.split('\n').map((line, i) => (
        <div key={i} className="landing-page__typing-line">
          {line.startsWith('#') ? (
            <span className="landing-page__typing-header">{line}</span>
          ) : line.startsWith('-') ? (
            <span className="landing-page__typing-bullet">{line}</span>
          ) : (
            <span>{line}</span>
          )}
          {i === text.split('\n').length - 1 && <span className="landing-page__typing-cursor" />}
        </div>
      ))}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const { enterApp } = useLandingStore();

  return (
    <div className="landing-page">
      <div className="landing-page__gradient-bg" />
      <div className="landing-page__floating-orb landing-page__floating-orb--1" />
      <div className="landing-page__floating-orb landing-page__floating-orb--2" />
      <div className="landing-page__floating-orb landing-page__floating-orb--3" />
      
      <header className="landing-page__header">
        <div className="landing-page__logo">
          <Sparkles size={28} className="landing-page__logo-icon" />
          <span className="landing-page__logo-text">Notes</span>
        </div>
        <ThemeToggle />
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

          <div className="landing-page__preview" aria-hidden="true">
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
                  <TypingAnimation />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-page__how-it-works">
          <AnimatedSection>
            <h2 className="landing-page__section-title">How It Works</h2>
          </AnimatedSection>
          <div className="landing-page__steps">
            {howItWorksSteps.map((step, index) => (
              <AnimatedSection key={step.title} delay={index * 100}>
                <div className="landing-page__step">
                  <div className="landing-page__step-number">{index + 1}</div>
                  <div className="landing-page__step-icon">
                    <step.icon size={28} />
                  </div>
                  <h3 className="landing-page__step-title">{step.title}</h3>
                  <p className="landing-page__step-description">{step.description}</p>
                  {index < howItWorksSteps.length - 1 && (
                    <div className="landing-page__step-connector" />
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section className="landing-page__features">
          <AnimatedSection>
            <h2 className="landing-page__features-title">Everything you need</h2>
          </AnimatedSection>
          <div className="landing-page__features-grid">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 100}>
                <div className="landing-page__feature-card">
                  <div className="landing-page__feature-icon">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="landing-page__feature-title">{feature.title}</h3>
                  <p className="landing-page__feature-description">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section className="landing-page__stats">
          <div className="landing-page__stats-grid">
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 100}>
                <div className="landing-page__stat-item">
                  <stat.icon size={32} className="landing-page__stat-icon" />
                  <div className="landing-page__stat-value">{stat.value}</div>
                  <div className="landing-page__stat-label">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section className="landing-page__shortcuts">
          <AnimatedSection>
            <div className="landing-page__shortcuts-header">
              <Keyboard size={32} className="landing-page__shortcuts-icon" />
              <h2 className="landing-page__section-title">Keyboard Shortcuts</h2>
            </div>
          </AnimatedSection>
          <div className="landing-page__shortcuts-grid">
            {shortcuts.map((shortcut, index) => (
              <AnimatedSection key={shortcut.action} delay={index * 50}>
                <div className="landing-page__shortcut-item">
                  <div className="landing-page__shortcut-keys">
                    {shortcut.keys.map((key, keyIndex) => (
                      <kbd key={keyIndex} className="landing-page__shortcut-key">{key}</kbd>
                    ))}
                  </div>
                  <span className="landing-page__shortcut-action">{shortcut.action}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </main>

      <footer className="landing-page__footer">
        <div className="landing-page__footer-content">
          <div className="landing-page__footer-brand">
            <Sparkles size={20} className="landing-page__footer-logo" />
            <span className="landing-page__footer-name">Notes</span>
          </div>
          <p className="landing-page__footer-text">
            A clean, minimal notes experience. Built for focus.
          </p>
          <div className="landing-page__footer-meta">
            <span>v1.0.0</span>
            <span className="landing-page__footer-dot">•</span>
            <span>Local First</span>
            <span className="landing-page__footer-dot">•</span>
            <span>Privacy Focused</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
