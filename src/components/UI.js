// src/components/UI.js
import { useEffect, useRef } from 'react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';

/* ── Orb background decoration ── */
export function Orb({ size = 300, color, x, y, opacity = 0.1 }) {
  return (
    <div className="orb" style={{
      width: size, height: size,
      background: color, opacity,
      left: x, top: y,
    }} />
  );
}

/* ── Wave Bars visualizer ── */
export function WaveBars({ count = 16, active = false, color = '#0ea5e9', height = 34 }) {
  const bars = Array.from({ length: count }, (_, i) => {
    const h = active ? (18 + Math.random() * 68) : 16;
    return (
      <div key={i} className="wbar" style={{
        height: `${h}%`,
        background: `linear-gradient(to top, ${color}, #a855f7)`,
        animation: active ? `wave ${0.44 + Math.random() * 0.55}s ease-in-out infinite` : 'none',
        animationDelay: active ? `${i * 0.05}s` : '0s',
      }} />
    );
  });
  return (
    <div className="waves" style={{ height }}>
      {bars}
    </div>
  );
}

/* ── Toast notification ── */
export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return <div className={`toast ${toast.type}`}>{toast.msg}</div>;
}

/* ── Field Input ── */
export function Field({ label, type = 'text', value, onChange, placeholder, icon, onKeyDown }) {
  const { t } = useLang();
  return (
    <div className="fgrp">
      {label && <label className="flbl">{label}</label>}
      <div className="fwrap">
        {icon && <span className="ficon">{icon}</span>}
        <input
          className="finput"
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          dir={t.dir}
        />
      </div>
    </div>
  );
}

/* ── Gender Toggle ── */
export function GenderToggle({ value, onChange }) {
  const { t } = useLang();
  return (
    <div className="gender-row">
      <button className={`gbtn${value === 'M' ? ' active' : ''}`} onClick={() => onChange('M')}>
        <span className="em">👦</span>
        <span>{t.male}</span>
      </button>
      <button className={`gbtn${value === 'F' ? ' active' : ''}`} onClick={() => onChange('F')}>
        <span className="em">👧</span>
        <span>{t.female}</span>
      </button>
    </div>
  );
}

/* ── Badge ── */
export function Badge({ type }) {
  const { t } = useLang();
  const isNormal = type === 'normal';
  return (
    <span className={`badge ${isNormal ? 'b-ok' : 'b-warn'}`}>
      {isNormal ? t.normal : t.attention}
    </span>
  );
}

/* ── Modal ── */
export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;
  return (
    <div className="modal-ov" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <h3>{title}</h3>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
