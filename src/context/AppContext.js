import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const API_URL = "https://arhaf-production.up.railway.app";
const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [kids, setKids] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    const savedToken = localStorage.getItem('access_token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user_data');
        localStorage.removeItem('access_token');
      }
    }
  }, []);

  const navigate = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showToast = useCallback((msg, type = 'tok') => {
    setToast({ msg, type });
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const login = (userData) => {
    setUser(userData);

    if (userData.access) {
      localStorage.setItem('access_token', userData.access);
    }

    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setKids([]);
    setAnalyses([]);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    navigate('home');
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchKids = async () => {
    try {
      const response = await fetch(`${API_URL}/api/children/`, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) throw new Error("Failed to fetch children");

      const data = await response.json();
      setKids(data);
      return data;
    } catch (error) {
      showToast("خطأ في تحميل الأطفال", "err");
      return [];
    }
  };

  const addKid = async (kid) => {
    try {
      const response = await fetch(`${API_URL}/api/children/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(kid),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error("Failed to add child");
      }

      setKids(prev => [...prev, data]);
      showToast("تمت إضافة الطفل بنجاح", "tok");
      return data;
    } catch (error) {
      showToast("خطأ في إضافة الطفل", "err");
      return null;
    }
  };

  const addAnalysis = async (audioBlob, childId) => {
    const formData = new FormData();
    formData.append('audio_file', audioBlob);
    formData.append('child', childId);

    try {
      const response = await fetch(`${API_URL}/api/upload-voice/`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error("Server Error");
      }

      const selectedChild = kids.find(k => k.id === parseInt(childId));

      const newAnalysis = {
        id: data.id || Date.now(),
        childName: selectedChild ? selectedChild.name : 'Unknown Child',
        date: new Date().toLocaleDateString(),
        prediction_result: data.prediction_result,
        confidence_score: data.confidence_score,
        notes: data.notes,
        created_at: data.created_at,
      };

      setAnalyses(prev => [newAnalysis, ...prev]);
      showToast("تم التحليل بنجاح", "tok");
      return newAnalysis;
    } catch (error) {
      showToast("خطأ في الاتصال بالخادم", "err");
      return null;
    }
  };

  const fetchAnalyses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/results/`, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) throw new Error("Failed to fetch analyses");

      const data = await response.json();

      const normalized = data.map((item) => ({
        id: item.id,
        childName: item.child_name || item.childName || 'Analysis Record',
        prediction_result: item.prediction_result,
        confidence_score: item.confidence_score,
        created_at: item.created_at,
        notes: item.notes,
        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : '',
      }));

      setAnalyses(normalized);
      return normalized;
    } catch (error) {
      showToast("خطأ في تحميل النتائج", "err");
      return [];
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        page,
        navigate,
        kids,
        setKids,
        fetchKids,
        addKid,
        analyses,
        fetchAnalyses,
        addAnalysis,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);