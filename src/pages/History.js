import { useEffect } from 'react';
import { Activity, Baby } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';

export default function History() {
  const { t } = useLang();
  const { analyses, fetchAnalyses } = useApp();
  const cleanHistoryTitle = t.histTitle.replace(/^[^\p{L}\p{N}]+/u, '').trim();

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  return (
    <div className="hr-page">
      <div className="hr-bg-layer">
        <div className="hr-radial-top" />
        <div className="hr-radial-bottom" />
      </div>

      <div className="hr-wrap">
        <div className="hr-head">
          <div className="hr-head-row">
            <h1>{cleanHistoryTitle}</h1>
          </div>
          <p>{t.histSub}</p>
        </div>

        {!analyses.length ? (
          <div className="hr-empty-wrap">
            <div className="hr-empty-card">
              <div className="hr-empty-icon">
                <Activity />
              </div>
              <h3>{t.noAnalysis}</h3>
            </div>
          </div>
        ) : (
          <div className="hr-list">
            {analyses.map((a) => {
              const isNormal = a.prediction_result === 'TD';
              return (
                <div key={a.id} className="hr-item-wrap">
                  <div className="hr-item-card">
                    <div className="hr-item-row">
                      <div className="hr-item-left">
                        <div className="hr-baby-icon">
                          <Baby />
                        </div>
                        <div>
                          <h3>Analysis Record</h3>
                          {a.childName && <p>{a.childName}</p>}
                        </div>
                      </div>

                      <div className="hr-confidence">
                        <p>{t.confidence}</p>
                        <div>{a.confidence_score}%</div>
                      </div>

                      <div className="hr-item-right">
                        <div className={`hr-status ${isNormal ? 'ok' : 'warn'}`}>
                          <span>{isNormal ? t.normal : t.attention}</span>
                        </div>
                        <div className="hr-date">
                          <p>
                            {a.created_at
                              ? new Date(a.created_at).toLocaleDateString()
                              : a.date || '-'}
                          </p>
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
    </div>
  );
}