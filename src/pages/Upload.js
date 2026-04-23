import { useState, useRef } from 'react';
import {
  Upload as UploadIcon,
  Mic,
  User2,
} from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';
import { Orb } from '../components/UI';

/* ════════════ STEP 1: FORM ════════════ */
function FormStep({ onSubmit, setGlobalFile }) {
  const { t } = useLang();
  const { kids, showToast } = useApp();
  const cleanExistingChildLabel = t.existChild.replace(/^[^\p{L}\p{N}]+/u, '').trim();
  const cleanNewChildLabel = t.newChild.replace(/^[^\p{L}\p{N}]+/u, '').trim();

  const [mode, setMode] = useState('new');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [childId, setChildId] = useState('');
  const [hasAudio, setHasAudio] = useState(false);
  const [file, setFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');

  const fileRef = useRef();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const onFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setGlobalFile(f);
      setHasAudio(true);

      if (audioURL) URL.revokeObjectURL(audioURL);
      setAudioURL(URL.createObjectURL(f));
    }
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const audioBufferToWav = (buffer) => {
    const numOfChan = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const samples = buffer.length;
    const blockAlign = numOfChan * bitDepth / 8;
    const byteRate = sampleRate * blockAlign;
    const dataSize = samples * blockAlign;
    const bufferLength = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    let offset = 44;

    for (let i = 0; i < samples; i++) {
      for (let channel = 0; channel < numOfChan; channel++) {
        let sample = buffer.getChannelData(channel)[i];
        sample = Math.max(-1, Math.min(1, sample));
        const s = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, s, true);
        offset += 2;
      }
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  const blobToWavFile = async (blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    const wavBlob = audioBufferToWav(audioBuffer);
    await audioContext.close();

    return new File([wavBlob], 'recorded_audio.wav', {
      type: 'audio/wav',
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const recordedBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType || 'audio/webm',
          });

          const wavFile = await blobToWavFile(recordedBlob);

          setFile(wavFile);
          setGlobalFile(wavFile);
          setHasAudio(true);

          if (audioURL) URL.revokeObjectURL(audioURL);
          setAudioURL(URL.createObjectURL(wavFile));
        } catch (error) {
          console.error(error);
          showToast('فشل تحويل التسجيل إلى WAV', 'terr');
        } finally {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        }
      };

      mediaRecorder.start();
      setRecording(true);
      setHasAudio(false);
      setFile(null);
      setGlobalFile(null);

      if (audioURL) {
        URL.revokeObjectURL(audioURL);
        setAudioURL('');
      }
    } catch (error) {
      console.error(error);
      showToast('تعذر الوصول إلى المايكروفون', 'terr');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleSubmit = () => {
    if (mode === 'new') {
      if (!name || !age) {
        showToast(t.err_name, 'terr');
        return;
      }

      const normalizedGender =
        gender === 'M' ? 'male' :
        gender === 'F' ? 'female' :
        gender;

      onSubmit({
        name,
        age_months: parseInt(age),
        gender: normalizedGender,
      });
    } else {
      if (!childId) {
        showToast(t.err_child, 'terr');
        return;
      }

      const found = kids.find(c => c.id === parseInt(childId));
      if (!found) {
        showToast(t.err_child, 'terr');
        return;
      }

      onSubmit(found);
    }
  };

  return (
    <div className="aa-page">
      <div className="aa-bg">
        <div className="aa-glow aa-glow-top" />
        <div className="aa-glow aa-glow-bottom" />
        <div className="aa-glow aa-glow-left" />
      </div>

      <div className="aa-wrap">
        <h1 className="aa-title">{t.analyze}</h1>

        <div className="aa-mode-grid">
          <button
            className={`aa-mode-card ${mode === 'exist' ? 'active' : ''}`}
            onClick={() => setMode('exist')}
            type="button"
          >
            <span>{cleanExistingChildLabel}</span>
          </button>
          <button
            className={`aa-mode-card ${mode === 'new' ? 'active' : ''}`}
            onClick={() => setMode('new')}
            type="button"
          >
            <span>{cleanNewChildLabel}</span>
          </button>
        </div>

        <div className="aa-block">
          {mode === 'exist' ? (
            <div className="aa-field">
              <label>{cleanExistingChildLabel}</label>
              <select
                value={childId}
                onChange={e => setChildId(e.target.value)}
                className="aa-select"
              >
                <option value="">{t.selectKid}</option>
                {kids.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} • {c.age_months} {t.months}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="aa-form-grid">
              <div className="aa-field">
                <label>{t.childName}</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t.namePh}
                  className="aa-input"
                />
              </div>

              <div className="aa-field">
                <label>{t.childAge}</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(Math.max(0, e.target.value))}
                  min="0"
                  placeholder={t.agePh}
                  className="aa-input"
                />
              </div>

              <div className="aa-field">
                <label>{t.childGender}</label>
                <div className="aa-gender-grid">
                  <button
                    type="button"
                    className={`aa-gender-btn ${gender === 'female' ? 'active female' : ''}`}
                    onClick={() => setGender('female')}
                  >
                    <User2 /> <span>{t.female}</span>
                  </button>
                  <button
                    type="button"
                    className={`aa-gender-btn ${gender === 'male' ? 'active male' : ''}`}
                    onClick={() => setGender('male')}
                  >
                    <User2 /> <span>{t.male}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="aa-audio">
          <h2>{t.uploadExist}</h2>
          <div
            className={`aa-upload-drop ${file ? 'has-file' : ''}`}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".wav,audio/wav"
              style={{ display: 'none' }}
              onChange={onFile}
            />
            <label>
              <UploadIcon className="aa-upload-icon" />
              <p>{file ? file.name : t.uploadExist}</p>
              <small>{t.uploadHint}</small>
            </label>
          </div>

          <div className="aa-record-wrap">
            {!recording ? (
              <button type="button" onClick={startRecording} className="aa-record-btn">
                <Mic /> Start Recording
              </button>
            ) : (
              <button type="button" onClick={stopRecording} className="aa-record-btn recording">
                <Mic /> Stop Recording
              </button>
            )}
          </div>
        </div>

        {audioURL && (
          <div className="aa-preview">
            <audio controls src={audioURL} />
          </div>
        )}

        <button
          className={`aa-submit ${hasAudio ? 'ready' : ''}`}
          disabled={!hasAudio}
          onClick={handleSubmit}
        >
          <span>{t.startAnalysis}</span>
        </button>

        {!hasAudio && <p className="aa-hint">{t.err_audio}</p>}
      </div>
    </div>
  );
}

/* ════════════ STEP 2: ANALYZING ════════════ */
function AnalyzingStep() {
  const { t } = useLang();

  return (
    <div className="an-screen page-enter">
      <div className="card" style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 46, marginBottom: 12 }}>🧠</div>
        <h2 className="an-ttl" style={{ marginBottom: 10 }}>{t.analyzing}</h2>
        <p style={{ opacity: 0.75, marginBottom: 20 }}>
          Processing cry signal and extracting acoustic features...
        </p>

        <div className="prog-wrap">
          <div className="prog-bar">
            <div
              className="prog-fill"
              style={{ width: '100%', transition: 'width 2s ease' }}
            />
          </div>
        </div>

        <div style={{ marginTop: 18, fontSize: 14, opacity: 0.65 }}>
          MFCC • Spectral Features • Confidence Scoring
        </div>
      </div>
    </div>
  );
}

function CircularScore({ value, label = "Confidence" }) {
  const v = Math.max(0, Math.min(100, Number(value || 0)));
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (v / 100) * circumference;

  return (
    <div style={{ display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'relative', width: radius * 2, height: radius * 2 }}>
        <svg height={radius * 2} width={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            stroke="rgba(255,255,255,0.14)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="url(#grad)"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease' }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F5DFF" />
              <stop offset="55%" stopColor="#7A52FF" />
              <stop offset="100%" stopColor="#00E2C7" />
            </linearGradient>
          </defs>
        </svg>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 800, textShadow: '0 0 18px rgba(122,82,255,0.45)' }}>
            {v.toFixed(0)}%
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, fontWeight: 500, opacity: 0.78, color: 'rgba(255,255,255,0.7)' }}>
        {label}
      </div>
    </div>
  );
}

function FeatureBars({ score }) {
  const { t } = useLang();
  const s = Number(score || 0);

  const values = [
    Math.max(18, Math.min(95, s * 0.92)),
    Math.max(14, Math.min(88, s * 0.74)),
    Math.max(10, Math.min(82, s * 0.58)),
  ];

  const labels = [t.featureMfcc, t.featureCentroid, t.featureRms];

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {values.map((v, i) => (
        <div key={labels[i]}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ opacity: 0.8 }}>{labels[i]}</span>
            <span style={{ fontWeight: 700 }}>{Math.round(v)}%</span>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${v}%`,
                height: '100%',
                borderRadius: 999,
                background: 'linear-gradient(90deg, #7A52FF, #4F5DFF, #00E2C7)',
                transition: 'width 0.8s ease',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
/* ════════════ STEP 3: RESULTS PRO ════════════ */
function ResultsStep({ result, onReset }) {
  const { t } = useLang();
  const { showToast } = useApp();

  const isNormal = result.prediction_result === 'TD';
  const confidence = Number(result.confidence_score || 0).toFixed(2);

  const resultTitle = isNormal ? t.noPatterns : t.patternsFound;
  const resultDescription = isNormal ? t.descNorm : t.descAttn;

  const recommendationText = isNormal ? t.recNorm : t.recAttn;

  const handleDownload = () => {
    const report = `
${t.reportTitle}
-------------------------
${t.reportChild}: ${result.childName || 'N/A'}
${t.reportPrediction}: ${result.prediction_result}
${t.reportConfidence}: ${confidence}%
${t.reportSummary}: ${resultTitle}
${t.reportRecommendation}: ${recommendationText}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arhaf-analysis-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const text = `Arhaf analysis result: ${result.prediction_result} (${confidence}%)`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Arhaf Analysis Result',
          text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        showToast(t.shareCopied, 'tok');
      }
    } catch (e) {
      showToast(t.shareCancelled, 'terr');
    }
  };

  return (
    <div className="wrap-md page-enter">
      <Orb size={320} color="#7A52FF" x="88%" y="8%" opacity={0.12} />
      <Orb size={240} color="#4F5DFF" x="12%" y="75%" opacity={0.1} />

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          {t.resultsTitle}
        </h2>
        <p style={{ opacity: 0.78, maxWidth: 720, lineHeight: 1.85, color: 'rgba(255,255,255,0.75)' }}>
          {t.resultsIntro}
        </p>
      </div>

      {/* HERO CARD */}
      <div
        className={`card res-main ${isNormal ? 'normal' : 'attn'}`}
        style={{
          marginTop: 8,
          border: `1px solid ${isNormal ? 'rgba(0,226,199,0.32)' : 'rgba(122,82,255,0.32)'}`,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))',
          boxShadow: isNormal
            ? '0 0 0 1px rgba(0,226,199,0.06), 0 20px 60px rgba(0,226,199,0.08), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 0 0 1px rgba(122,82,255,0.08), 0 20px 60px rgba(122,82,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 16px',
            borderRadius: 999,
            background: isNormal ? 'rgba(0,226,199,0.14)' : 'rgba(122,82,255,0.18)',
            border: `1px solid ${isNormal ? 'rgba(0,226,199,0.35)' : 'rgba(122,82,255,0.42)'}`,
            marginBottom: 16,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          <span style={{ fontSize: 18 }}>{isNormal ? '✅' : '⚠️'}</span>
          <span>{isNormal ? t.normalTd : t.asdIndicator}</span>
        </div>

        <div
          style={{
            width: 82,
            height: 82,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            marginBottom: 18,
            background: isNormal
              ? 'radial-gradient(circle, rgba(0,226,199,0.22), rgba(79,93,255,0.06))'
              : 'radial-gradient(circle, rgba(122,82,255,0.24), rgba(79,93,255,0.06))',
            border: `1px solid ${isNormal ? 'rgba(0,226,199,0.35)' : 'rgba(122,82,255,0.42)'}`,
            fontSize: 34,
            boxShadow: isNormal
              ? '0 0 24px rgba(0,226,199,0.24)'
              : '0 0 24px rgba(122,82,255,0.28)',
          }}
        >
          {isNormal ? '😊' : '⚠️'}
        </div>

        <div className="res-ttl" style={{ fontSize: 28, lineHeight: 1.35, marginBottom: 10, letterSpacing: '0.01em' }}>
          {resultTitle}
        </div>

        <div className="res-desc" style={{ fontSize: 16, opacity: 0.86, lineHeight: 1.85, maxWidth: 760, color: 'rgba(255,255,255,0.76)' }}>
          {resultDescription}
        </div>

        <div
          style={{
            marginTop: 18,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(122,82,255,0.22)',
              fontSize: 14,
            }}
          >
            <strong>{t.predictionLabel}:</strong> {result.prediction_result}
          </div>

          <div
            style={{
              padding: '10px 14px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(79,93,255,0.22)',
              fontSize: 14,
            }}
          >
            <strong>{t.confidenceLabel}:</strong> {confidence}%
          </div>

          {result.childName && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(0,226,199,0.24)',
                fontSize: 14,
              }}
            >
              <strong>{t.childLabel}:</strong> {result.childName}
            </div>
          )}
        </div>
      </div>

      {/* VISUALIZATION */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 18,
          marginTop: 20,
        }}
      >
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, rgba(122,82,255,0.22), rgba(79,93,255,0.2))',
                border: '1px solid rgba(122,82,255,0.3)',
                fontSize: 18,
              }}
            >
              📈
            </div>
            <h3 style={{ margin: 0, fontSize: 18 }}>{t.modelConfidenceTitle}</h3>
          </div>

          <div style={{ display: 'grid', placeItems: 'center', marginTop: 10 }}>
            <CircularScore value={confidence} label={t.confidence} />
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, rgba(79,93,255,0.18), rgba(0,226,199,0.18))',
                border: '1px solid rgba(79,93,255,0.3)',
                fontSize: 18,
              }}
            >
              🎛️
            </div>
            <h3 style={{ margin: 0, fontSize: 18 }}>{t.featureSnapshotTitle}</h3>
          </div>

          <p style={{ opacity: 0.8, lineHeight: 1.8, marginBottom: 14, color: 'rgba(255,255,255,0.74)' }}>
            {t.featuresSummary}
          </p>

          <FeatureBars score={confidence} />
        </div>
      </div>

      {/* FEATURES */}
      <div className="card" style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, rgba(122,82,255,0.22), rgba(145,72,255,0.18))',
              border: '1px solid rgba(122,82,255,0.28)',
              fontSize: 18,
            }}
          >
            🎧
          </div>
          <h3 style={{ margin: 0, fontSize: 18 }}>{t.analyzedFeaturesTitle}</h3>
        </div>

        <p style={{ marginTop: 8, opacity: 0.82, lineHeight: 1.85, color: 'rgba(255,255,255,0.74)' }}>
          {t.featuresSummary}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            marginTop: 14,
          }}
        >
          {[
            t.featureMfcc,
            t.featureDelta,
            t.featureRms,
            t.featureZcr,
            t.featureCentroid,
            t.featureRolloff,
          ].map((item) => (
            <div
              key={item}
              style={{
                padding: '12px 14px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(122,82,255,0.18)',
                fontSize: 14,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* RECOMMENDATION */}
      <div className="card" style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, rgba(122,82,255,0.22), rgba(0,226,199,0.16))',
              border: '1px solid rgba(122,82,255,0.28)',
              fontSize: 18,
            }}
          >
            💡
          </div>
          <h3 style={{ margin: 0, fontSize: 18 }}>{t.recLabel.replace(/^[^\p{L}\p{N}]+/u, '').trim()}</h3>
        </div>

        <p style={{ marginTop: 8, opacity: 0.86, lineHeight: 1.85, color: 'rgba(255,255,255,0.78)' }}>
          {recommendationText}
        </p>
      </div>

      {/* ACTIONS */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          marginTop: 28,
          maxWidth: 360,
        }}
      >
        <button className="btn bp" onClick={handleDownload}>
          {t.download}
        </button>

        <button className="btn bg" onClick={onReset}>
          {t.analyzeAnother}
        </button>

        <button
          className="btn"
          style={{
            background: 'transparent',
            border: '1px solid rgba(122,82,255,0.34)',
            color: 'white',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
          onClick={handleShare}
        >
          {t.share}
        </button>
      </div>
    </div>
  );
}

/* ════════════ UPLOAD PAGE ROOT ════════════ */
export default function Upload() {
  const { addAnalysis, addKid } = useApp();

  const [step, setStep] = useState('form');
  const [result, setResult] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);

  const handleFormSubmit = async (childData) => {
    if (!currentFile) return;

    setStep('analyzing');

    let savedChild = childData;

    if (!childData.id) {
      savedChild = await addKid(childData);

      if (!savedChild) {
        setStep('form');
        return;
      }
    }

    const serverResponse = await addAnalysis(currentFile, savedChild.id);

    if (serverResponse) {
      setResult({
        ...serverResponse,
        childName: savedChild.name,
      });
      setStep('results');
    } else {
      setStep('form');
    }
  };

  return (
    <>
      {step === 'form' && (
        <FormStep
          onSubmit={handleFormSubmit}
          setGlobalFile={setCurrentFile}
        />
      )}

      {step === 'analyzing' && <AnalyzingStep />}

      {step === 'results' && (
        <ResultsStep
          result={result}
          onReset={() => {
            setResult(null);
            setCurrentFile(null);
            setStep('form');
          }}
        />
      )}
    </>
  );
}