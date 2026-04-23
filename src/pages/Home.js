import { Brain, Zap, HeartPulse, Upload, Sparkles, FileText } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';

export default function Home() {
  const { t } = useLang();
  const { navigate, user } = useApp();
  const cleanAnalyzeLabel = t.analyzeBtn.replace(/^[^\p{L}\p{N}]+/u, '').trim();

  const featureCards = [
    {
      icon: Brain,
      title: t.f1,
      description: t.f1d,
      gradientCss: 'linear-gradient(135deg, #7A52FF, #9148FF)',
      glowColor: 'rgba(122, 82, 255, 0.4)',
    },
    {
      icon: Zap,
      title: t.f2,
      description: t.f2d,
      gradientCss: 'linear-gradient(135deg, #4F5DFF, #00E2C7)',
      glowColor: 'rgba(79, 93, 255, 0.4)',
    },
    {
      icon: HeartPulse,
      title: t.f3,
      description: t.f3d,
      gradientCss: 'linear-gradient(135deg, #00E2C7, #7A52FF)',
      glowColor: 'rgba(0, 226, 199, 0.4)',
    },
  ];

  const steps = [
    { icon: Upload, title: t.s1, description: t.s1d, gradientCss: 'linear-gradient(135deg, #7A52FF, #9148FF)' },
    { icon: Sparkles, title: t.s2, description: t.s2d, gradientCss: 'linear-gradient(135deg, #4F5DFF, #00E2C7)' },
    { icon: FileText, title: t.s3, description: t.s3d, gradientCss: 'linear-gradient(135deg, #00E2C7, #7A52FF)' },
  ];

  return (
    <div className="fh-page">
      <div className="fh-bg-layer">
        <div className="fh-radial-top" />
        <div className="fh-radial-bottom" />
      </div>

      <div className="fh-content">
        <section className="fh-hero">
          <div className="fh-hero-bg">
            <div className="fh-hero-g1" />
            <div className="fh-hero-g2" />
            <div className="fh-hero-g3" />
          </div>

          <div className="fh-hero-inner">
            <div className="fh-orb-wrap">
              <div className="fh-orb-glow">
                <div className="fh-orb-glow-grad" />
              </div>
              <div className="fh-orb-main-wrap">
                <div className="fh-orb-main">
                  <div className="fh-orb-rotator">
                    <div className="fh-orb-ring" />
                  </div>
                  <div className="fh-orb-inner">
                    <div className="fh-orb-highlight" />
                    <div className="fh-wave-wrap">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="fh-wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="fh-fade-up-1">
              <h1 className="fh-hero-title">
                {t.heroT1}{' '}
                <span className="fh-hero-gradient">{t.heroHL}</span>{' '}
                {t.heroT2}
              </h1>
              <p className="fh-hero-desc">{t.heroDesc}</p>
              <div className="fh-fade-up-2">
                <button
                  onClick={() => navigate(user ? 'upload' : 'register')}
                  className="fh-hero-cta"
                >
                  <span className="fh-hero-cta-text">
                    {cleanAnalyzeLabel}
                  </span>
                  <div className="fh-hero-cta-overlay" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="fh-features">
          <div className="fh-shell">
            <div className="fh-grid3">
              {featureCards.map((feature, index) => (
                <div key={feature.title} className="fh-feature-group fh-fade-feature" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="fh-feature-glow" style={{ background: feature.glowColor }} />
                  <div className="fh-feature-card">
                    <div className="fh-feature-icon-block">
                      <div className="fh-feature-icon-glow" style={{ background: feature.gradientCss }} />
                      <div className="fh-feature-icon" style={{ background: feature.gradientCss }}>
                        <feature.icon className="fh-feature-svg" />
                      </div>
                    </div>
                    <h3 className="fh-feature-title">{feature.title}</h3>
                    <p className="fh-feature-desc">{feature.description}</p>
                    <div className="fh-feature-line" style={{ background: feature.gradientCss }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="fh-how">
          <div className="fh-how-shell">
            <div className="fh-how-title-wrap fh-fade-feature">
              <h2 className="fh-how-title">
                {t.howTitle}{' '}
                <span className="fh-hero-gradient">{t.howHL}</span>
              </h2>
            </div>

            <div className="fh-how-track-wrap">
              <div className="fh-how-track" />
              <div className="fh-grid3 fh-grid-steps">
                {steps.map((step, index) => (
                  <div key={step.title} className="fh-step fh-fade-feature" style={{ animationDelay: `${index * 0.2}s` }}>
                    <div className="fh-step-icon-wrap">
                      <div className="fh-step-glow" style={{ background: step.gradientCss }} />
                      <div className="fh-step-icon-box">
                        <div className="fh-step-icon-ring" style={{ background: step.gradientCss }}>
                          <div className="fh-step-icon-inner">
                            <div className="fh-step-icon-halo" style={{ background: step.gradientCss }} />
                            <step.icon className="fh-step-svg" />
                          </div>
                        </div>
                        <div className="fh-step-num">{index + 1}</div>
                      </div>
                    </div>
                    <h3 className="fh-step-title">{step.title}</h3>
                    <p className="fh-step-desc">{step.description}</p>
                    {index < steps.length - 1 && (
                      <div className="fh-step-dot-wrap">
                        <div className="fh-step-dot" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="fh-bottom-note fh-fade-feature" style={{ animationDelay: '0.8s' }}>
              <p>Results are preliminary and should be discussed with healthcare professionals</p>
            </div>
          </div>
        </section>

        <footer className="fh-footer">
          <div className="fh-footer-glowline" />
          <div className="fh-shell fh-footer-inner">
            <nav className="fh-footer-nav">
              <a href="#">{t.learnMore}</a>
              <a href="#">{t.history}</a>
              <a href="#">{t.profile}</a>
            </nav>
            <p className="fh-footer-copy">© 2025 {t.appName}. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
