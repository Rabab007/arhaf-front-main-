// src/pages/Profile.js
import { useEffect, useState } from 'react';
import { User, Plus, Baby, FileBarChart, X } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';

function AddChildModal({ open, onClose }) {
  const { t } = useLang();
  const { addKid, showToast } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name || !age) {
      showToast(t.err_fill, 'terr');
      return;
    }

    const normalizedGender =
      gender === 'M' ? 'male' :
      gender === 'F' ? 'female' :
      gender;

    try {
      setLoading(true);

      const saved = await addKid({
        name,
        age_months: parseInt(age),
        gender: normalizedGender,
      });

      if (!saved) {
        return;
      }

      showToast(t.ok_child, 'tok');
      setName('');
      setAge('');
      setGender('male');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fp-modal-ov" onClick={onClose}>
      <div className="fp-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="fp-modal-head">
          <h3>{t.addChildTitle}</h3>
          <button type="button" className="fp-modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="fp-modal-body">
          <div className="fp-input-wrap">
            <Baby className="fp-input-ico" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t.namePh}
              className="fp-input"
            />
          </div>

          <div className="fp-input-wrap">
            <FileBarChart className="fp-input-ico" />
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder={t.agePh}
              className="fp-input"
            />
          </div>

          <div className="fp-gender-row">
            <button
              type="button"
              className={`fp-gender-btn ${gender === 'male' ? 'active' : ''}`}
              onClick={() => setGender('male')}
            >
              {t.male}
            </button>
            <button
              type="button"
              className={`fp-gender-btn ${gender === 'female' ? 'active' : ''}`}
              onClick={() => setGender('female')}
            >
              {t.female}
            </button>
          </div>

          <button className="fp-submit" onClick={handleAdd} disabled={loading}>
            <span>{loading ? '...' : t.addChild}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { t } = useLang();
  const { user, kids, analyses, fetchKids } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const cleanMyChildren = t.myChildren.replace(/^[^\p{L}\p{N}]+/u, '').trim();
  const cleanRecentAnalyses = t.recentAn.replace(/^[^\p{L}\p{N}]+/u, '').trim();

  useEffect(() => {
    if (user) {
      fetchKids();
    }
  }, [user, fetchKids]);

  if (!user) return null;

  return (
    <div className="fp-page">
      <div className="fp-wrap">
        <h1 className="fp-title">{t.profile}</h1>

        <div className="fp-profile-card-wrap">
          <div className="fp-profile-glow" />
          <div className="fp-profile-card">
            <div className="fp-profile-row">
              <div className="fp-avatar-wrap">
                <div className="fp-avatar-glow" />
                <div className="fp-avatar">
                  <User />
                </div>
              </div>

              <div className="fp-profile-main">
                <h2>{user.name}</h2>
                <p>{user.email}</p>

                <div className="fp-stats">
                  <div className="fp-stat">
                    <Baby className="fp-stat-ico purple" />
                    <div>
                      <p className="fp-stat-val">{kids.length}</p>
                      <p className="fp-stat-label">{t.children}</p>
                    </div>
                  </div>

                  <div className="fp-stat">
                    <FileBarChart className="fp-stat-ico cyan" />
                    <div>
                      <p className="fp-stat-val">{analyses.length}</p>
                      <p className="fp-stat-label">{t.analyses}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fp-section">
          <div className="fp-sec-head">
            <h2>{cleanMyChildren}</h2>
            <button className="fp-add-btn" onClick={() => setModalOpen(true)}>
              <Plus />
              {t.addChild}
            </button>
          </div>

          {kids.length === 0 ? (
            <div className="fp-empty-wrap">
              <div className="fp-empty-glow" />
              <div className="fp-empty-card">
                <div className="fp-empty-icon"><Baby /></div>
                <h3>{t.noChildren}</h3>
              </div>
            </div>
          ) : (
            <div className="fp-list">
              {kids.map((c) => {
                const isMale = c.gender === 'male' || c.gender === 'M';
                return (
                  <div key={c.id} className="fp-item-wrap">
                    <div className="fp-item-glow" />
                    <div className="fp-item-card">
                      <div className="fp-item-row">
                        <div className="fp-item-left">
                          <div className={`fp-kid-avatar ${isMale ? 'male' : 'female'}`}>
                            <Baby />
                          </div>
                          <div>
                            <h3>{c.name}</h3>
                            <p>{c.age_months} {t.months} • {isMale ? t.male : t.female}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="fp-section">
          <h2 className="fp-sec-title">{cleanRecentAnalyses}</h2>
          {analyses.length === 0 ? (
            <div className="fp-empty-wrap">
              <div className="fp-empty-glow" />
              <div className="fp-empty-card">
                <div className="fp-empty-icon"><FileBarChart /></div>
                <h3>{t.noAnalysis}</h3>
              </div>
            </div>
          ) : (
            <div className="fp-list">
              {analyses.slice(0, 5).map((a) => {
                const isWarning = a.prediction_result !== 'TD';
                return (
                  <div key={a.id} className="fp-item-wrap">
                    <div className="fp-item-glow" />
                    <div className="fp-item-card">
                      <div className="fp-item-row fp-analysis-row">
                        <div className={`fp-status ${isWarning ? 'warn' : 'ok'}`}>
                          <span>{isWarning ? t.attention : t.normal}</span>
                        </div>

                        <div className="fp-confidence">{a.confidence_score}%</div>

                        <div className="fp-analysis-main">
                          <h3>{a.childName}</h3>
                          <p>{a.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AddChildModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}