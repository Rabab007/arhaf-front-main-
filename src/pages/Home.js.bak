// src/pages/Home.js
import { useLang } from '../context/LangContext';
import { useApp }  from '../context/AppContext';
import { Orb }     from '../components/UI';

export default function Home() {
  const { t }         = useLang();
  const { navigate, user } = useApp();

  const steps = [
    { icon: '⬆️', title: t.s1, desc: t.s1d, n: '1' },
    { icon: '🧠', title: t.s2, desc: t.s2d, n: '2' },
    { icon: '📊', title: t.s3, desc: t.s3d, n: '3' },
  ];

  const feats = [
    { icon: '🎯', title: t.f1, desc: t.f1d, color: 'var(--p1)' },
    { icon: '⚡', title: t.f2, desc: t.f2d, color: 'var(--p2)' },
    { icon: '👨‍⚕️', title: t.f3, desc: t.f3d, color: 'var(--p3)' },
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <Orb size={520} color="#6d28d9" x="15%"  y="24%" opacity={0.1} />
      <Orb size={420} color="#0ea5e9" x="80%"  y="54%" opacity={0.09} />
      <Orb size={300} color="#9333ea" x="50%"  y="90%" opacity={0.07} />

      {/* Hero */}
      <div className="hero page-enter">
        <div className="hero-badge">✨ {t.aiBadge}</div>
        <h1 className="hero-h1">
          {t.heroT1}
          <span className="grad">{t.heroHL}</span>
          {t.heroT2}
        </h1>
        <p className="hero-p">{t.heroDesc}</p>
        <div className="hero-btns">
          <button className="btn bp blg glow-btn" onClick={() => navigate(user ? 'upload' : 'register')}>
            {t.analyzeBtn}
          </button>
          <button className="btn bo blg">{t.learnMore}</button>
        </div>
      </div>

      {/* How it works */}
      <div className="sec">
        <h2 className="sec-ttl">
          {t.howTitle}<span style={{ color: 'var(--p2)' }}>{t.howHL}</span>
        </h2>

        <div className="grid3" style={{ marginBottom: 28 }}>
          {steps.map((s, i) => (
            <div key={i} className="card step-card" style={{ animationDelay: `${(i + 1) * 0.12}s` }}>
              <div className="step-num">{s.n}</div>
              <div className="step-ico">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid3">
          {feats.map((f, i) => (
            <div key={i} className="card feat-card" style={{ borderTop: `3px solid ${f.color}` }}>
              <div className="feat-ico">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
