// src/pages/Auth.js
import { useState } from 'react';
import { User, Mail, Lock, Sparkles, ArrowLeft } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';

const API_URL = "https://arhaf-production.up.railway.app";

const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export function Login() {
  const { t } = useLang();
  const { login, navigate, showToast } = useApp();
  const isRtl = t.dir === 'rtl';

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErr('');

    if (!email || !pass) {
      setErr(t.err_fill);
      return;
    }

    if (!validEmail(email)) {
      setErr(t.err_email);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: pass,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.detail ||
          data.non_field_errors?.[0] ||
          "فشل تسجيل الدخول. تأكدي من البريد وكلمة المرور."
        );
      }

      login({
        name: email.split('@')[0],
        email,
        access: data.access,
      });

      showToast(t.ok_login, 'tok');
      navigate('home');
    } catch (error) {
      setErr(error.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="na-auth-screen">
      <button className="na-auth-back" onClick={() => navigate('home')}>
        <ArrowLeft className="na-auth-back-ico" />
        <span>{t.home}</span>
      </button>

      <div className="na-auth-bg">
        <div className="na-auth-r1" />
        <div className="na-auth-r2" />
        <div className="na-auth-r3" />
      </div>

      <div className="na-auth-fx">
        <div className="na-auth-orb na-auth-orb-1" />
        <div className="na-auth-orb na-auth-orb-2" />
        <div className="na-auth-orb na-auth-orb-3" />
        <div className="na-auth-rings">
          <div className="na-auth-ring ring-1" />
          <div className="na-auth-ring ring-2" />
          <div className="na-auth-ring ring-3" />
        </div>
      </div>

      <div className="na-auth-wrap">
        <div className="na-auth-glow-area">
          <div className="na-auth-glow-a" />
          <div className="na-auth-glow-b" />
        </div>
        <div className="na-auth-card-shell">
          <div className="na-auth-card-outline" />
          <div className="na-auth-card">
            <div className="na-auth-head">
              <div className="na-auth-logo">
                <Sparkles className="na-auth-logo-ico" />
              </div>
              <h1 className="na-auth-title">
                Welcome to <span>Arhaf</span>
              </h1>
              <p className="na-auth-sub">AI-powered baby cry analysis system</p>
            </div>

            <div className="na-auth-tabs">
              <div className={`na-auth-tab-indicator ${isRtl ? 'right' : 'left'}`} />
              <button type="button" className="na-auth-tab active">{t.login}</button>
              <button type="button" className="na-auth-tab" onClick={() => navigate('register')}>{t.register}</button>
            </div>

            <form onSubmit={handleLogin} className="na-auth-form">
              <div className="na-auth-input-wrap">
                <Mail className="na-auth-input-ico" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="na-auth-input"
                />
              </div>

              <div className="na-auth-input-wrap">
                <Lock className="na-auth-input-ico" />
                <input
                  type="password"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="Password"
                  className="na-auth-input"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
              </div>

              {err && <div className="auth-err">{err}</div>}

              <button type="submit" className="na-auth-submit" disabled={loading}>
                <div className="na-auth-submit-bg" />
                <div className="na-auth-submit-shimmer" />
                <span>{loading ? '...' : t.login}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const { t } = useLang();
  const { navigate, showToast } = useApp();
  const isRtl = t.dir === 'rtl';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [conf, setConf] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReg = async (e) => {
    if (e) e.preventDefault();
    setErr('');

    if (!name || !email || !pass || !conf) {
      setErr(t.err_fill);
      return;
    }

    if (!validEmail(email)) {
      setErr(t.err_email);
      return;
    }

    if (pass !== conf) {
      setErr(t.err_pass);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          email: email,
          password: pass,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.username?.[0] ||
          data.email?.[0] ||
          data.password?.[0] ||
          data.detail ||
          "فشل إنشاء الحساب"
        );
      }

      showToast(t.ok_reg, 'tok');
      navigate('login');
    } catch (error) {
      setErr(error.message || "فشل إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="na-auth-screen">
      <button className="na-auth-back" onClick={() => navigate('home')}>
        <ArrowLeft className="na-auth-back-ico" />
        <span>{t.home}</span>
      </button>

      <div className="na-auth-bg">
        <div className="na-auth-r1" />
        <div className="na-auth-r2" />
        <div className="na-auth-r3" />
      </div>

      <div className="na-auth-fx">
        <div className="na-auth-orb na-auth-orb-1" />
        <div className="na-auth-orb na-auth-orb-2" />
        <div className="na-auth-orb na-auth-orb-3" />
        <div className="na-auth-rings">
          <div className="na-auth-ring ring-1" />
          <div className="na-auth-ring ring-2" />
          <div className="na-auth-ring ring-3" />
        </div>
      </div>

      <div className="na-auth-wrap">
        <div className="na-auth-glow-area">
          <div className="na-auth-glow-a" />
          <div className="na-auth-glow-b" />
        </div>
        <div className="na-auth-card-shell">
          <div className="na-auth-card-outline" />
          <div className="na-auth-card">
            <div className="na-auth-head">
              <div className="na-auth-logo">
                <Sparkles className="na-auth-logo-ico" />
              </div>
              <h1 className="na-auth-title">
                Welcome to <span>Arhaf</span>
              </h1>
              <p className="na-auth-sub">AI-powered baby cry analysis system</p>
            </div>

            <div className="na-auth-tabs">
              <div className={`na-auth-tab-indicator ${isRtl ? 'left' : 'right'}`} />
              <button type="button" className="na-auth-tab" onClick={() => navigate('login')}>{t.login}</button>
              <button type="button" className="na-auth-tab active">{t.register}</button>
            </div>

            <form onSubmit={handleReg} className="na-auth-form">
              <div className="na-auth-input-wrap">
                <User className="na-auth-input-ico" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t.namePh}
                  className="na-auth-input"
                />
              </div>

              <div className="na-auth-input-wrap">
                <Mail className="na-auth-input-ico" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="na-auth-input"
                />
              </div>

              <div className="na-auth-input-wrap">
                <Lock className="na-auth-input-ico" />
                <input
                  type="password"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="Password"
                  className="na-auth-input"
                />
              </div>

              <div className="na-auth-input-wrap">
                <Lock className="na-auth-input-ico" />
                <input
                  type="password"
                  value={conf}
                  onChange={e => setConf(e.target.value)}
                  placeholder={t.confirmPass}
                  className="na-auth-input"
                  onKeyDown={e => e.key === 'Enter' && handleReg()}
                />
              </div>

              {err && <div className="auth-err">{err}</div>}

              <button type="submit" className="na-auth-submit" disabled={loading}>
                <div className="na-auth-submit-bg" />
                <div className="na-auth-submit-shimmer" />
                <span>{loading ? '...' : t.register}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
