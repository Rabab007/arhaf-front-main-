# أرهف — Arhaf React App

##تشغيل المشروع

### 1. افتح المجلد في VS Code
```
File → Open Folder → اختر مجلد arhaf-react
```

### 2. افتح Terminal في VS Code
```
Terminal → New Terminal
```

### 3. ثبّت المكتبات
```bash
npm install
```

### 4. شغّل المشروع
```bash
npm start
```

سيفتح المتصفح تلقائياً على: **http://localhost:3000**

---

## 📁 هيكل المشروع

```
arhaf-react/
├── public/
│   └── index.html
├── src/
│   ├── context/
│   │   ├── LangContext.js   ← نظام الترجمة AR/EN
│   │   └── AppContext.js    ← حالة التطبيق (State)
│   ├── components/
│   │   ├── Navbar.js        ← شريط التنقل
│   │   └── UI.js            ← مكونات مشتركة
│   ├── pages/
│   │   ├── Home.js          ← الصفحة الرئيسية
│   │   ├── Upload.js        ← تحليل البكاء
│   │   ├── History.js       ← سجل التحليلات
│   │   ├── Profile.js       ← الملف الشخصي
│   │   └── Auth.js          ← تسجيل الدخول / إنشاء حساب
│   ├── App.js               ← الجذر + Router
│   ├── index.js             ← نقطة البداية
│   └── index.css            ← التصميم الكامل
└── package.json
```

---

## 🔗 ربط الباك-إند

عند جهوزية Django/FastAPI، ابحث في الكود عن:
- `prediction_result` → نتيجة التحليل
- `confidence_score`  → نسبة الثقة
- `audio_file`        → ملف الصوت
- `age_months`        → عمر الطفل
- `gender`            → جنس الطفل (M/F)
- `child`             → FK للطفل

واستبدل Mock Data في `AppContext.js` بـ `fetch()` calls.
