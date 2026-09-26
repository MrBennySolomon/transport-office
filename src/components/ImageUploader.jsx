import React, { useEffect, useState } from "react";
import { Lock } from "lucide-react";

// כתובת בסיס ה-Realtime Database (בלי סלאש בסוף)
const DB_URL =
  "https://test-7b343-default-rtdb.europe-west1.firebasedatabase.app";

// סיסמת הכניסה למסך העלאת התמונות – מומלץ להחליף לפני שימוש בפועל
const UPLOADER_PASSWORD = "12345";
const SESSION_KEY = "image-uploader-authed";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // "data:image/png;base64,...."
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader() {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);

  function handleLogin(e) {
    e.preventDefault();

    if (password === UPLOADER_PASSWORD) {
      setAuthError("");
      setAuthed(true);

      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // sessionStorage לא זמין – ההתחברות עדיין תעבוד לטאב הנוכחי
      }
    } else {
      setAuthError("סיסמה שגויה. נסו שוב.");
    }
  }

  function logout() {
    setAuthed(false);
    setPassword("");

    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (authed) loadImages();
  }, [authed]);

  async function loadImages() {
    try {
      const res = await fetch(`${DB_URL}/images.json`);
      const data = await res.json();
      const list = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
      setImages(list.reverse());
    } catch (err) {
      console.error(err);
    }
  }

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setError("יש לבחור קובץ תמונה בלבד");
      return;
    }
    setError("");
    setSuccess(false);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleUpload() {
    if (!file) {
      setError("בחר קודם תמונה");
      return;
    }
    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      const base64 = await fileToBase64(file);
      const res = await fetch(`${DB_URL}/images.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          data: base64,
          uploadedAt: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error("שמירה נכשלה");

      setSuccess(true);
      setFile(null);
      setPreview("");
      loadImages();
    } catch (err) {
      console.error(err);
      setError(
        "העלאת התמונה נכשלה. בדוק את חוקי ההרשאה (Rules) של מסד הנתונים ונסה שוב."
      );
    } finally {
      setUploading(false);
    }
  }

  if (!authed) {
    return (
      <div style={styles.loginWrap} dir="rtl">
        <form style={styles.loginCard} onSubmit={handleLogin}>
          <div style={styles.loginIcon}>
            <Lock size={20} />
          </div>

          <h1 style={styles.loginTitle}>כניסה להעלאת תמונות</h1>
          <p style={styles.loginSubtitle}>הזינו סיסמה כדי להמשיך</p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="סיסמה"
            autoFocus
            style={styles.loginInput}
          />

          {authError && <div style={styles.loginError}>{authError}</div>}

          <button type="submit" style={styles.button}>
            כניסה
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.wrap} dir="rtl">
      <div style={styles.topBar}>
        <h2 style={{ margin: 0 }}>העלאת תמונה</h2>
        <button onClick={logout} style={styles.logoutButton}>
          יציאה
        </button>
      </div>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div style={{ margin: "16px 0" }}>
          <img src={preview} alt="תצוגה מקדימה" style={styles.preview} />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        style={styles.button}
      >
        {uploading ? "שומר..." : "שמירה"}
      </button>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>התמונה נשמרה בהצלחה!</p>}

      <h3 style={{ marginTop: 30 }}>תמונות שמורות</h3>
      <div style={styles.grid}>
        {images.map((img) => (
          <img
            key={img.id}
            src={img.data}
            alt={img.name}
            style={styles.thumb}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    maxWidth: 480,
    margin: "0 auto",
    padding: 20,
    fontFamily: "Arial, sans-serif"
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10
  },
  logoutButton: {
    padding: "7px 14px",
    borderRadius: 8,
    border: "1px solid #e3e7ed",
    background: "#fff",
    color: "#16202c",
    cursor: "pointer",
    fontSize: ".85rem"
  },
  preview: { maxWidth: "100%", borderRadius: 10 },
  button: {
    marginTop: 10,
    padding: "10px 18px",
    borderRadius: 8,
    border: 0,
    background: "#f04a32",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer"
  },
  error: { color: "#c62828" },
  success: { color: "#247442" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: 10
  },
  thumb: { width: "100%", height: 100, objectFit: "cover", borderRadius: 8 },

  // מסך כניסה
  loginWrap: {
    display: "grid",
    placeItems: "center",
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Arial, sans-serif",
    background: "#f5f6f8"
  },
  loginCard: {
    width: "100%",
    maxWidth: 340,
    background: "#fff",
    border: "1px solid #e3e7ed",
    borderRadius: 16,
    padding: "28px 24px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(20,30,45,.06)"
  },
  loginIcon: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    margin: "0 auto 14px",
    display: "grid",
    placeItems: "center",
    background: "#eef1f5",
    color: "#334155"
  },
  loginTitle: { fontSize: "1.25rem", margin: "0 0 4px" },
  loginSubtitle: { margin: "0 0 18px", color: "#64748b" },
  loginInput: {
    width: "100%",
    font: "inherit",
    padding: "11px 13px",
    borderRadius: 10,
    border: "1px solid #e3e7ed",
    textAlign: "center",
    marginBottom: 12,
    background: "#fbfcfd",
    color: "#16202c",
    boxSizing: "border-box"
  },
  loginError: { color: "#b3202c", fontSize: ".85rem", marginBottom: 12 }
};
