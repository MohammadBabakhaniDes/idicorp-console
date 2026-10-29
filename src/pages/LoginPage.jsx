
import { useEffect, useState } from "react";
import { LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";
import { getLoginChallenge, login } from "../services/authService.js";
import { jwtDecode } from "jwt-decode";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [loadingChallenge, setLoadingChallenge] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadChallenge() {
    setLoadingChallenge(true);
    setError("");

    try {
      const data = await getLoginChallenge();
      setChallenge(data);            
      
      setCaptchaAnswer("");
    } catch (err) {
      setError(err.message || "Could not load CAPTCHA.");
    } finally {
      setLoadingChallenge(false);
    }
  }

  useEffect(() => {
    loadChallenge();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!challenge?.salt) {
      setError("CAPTCHA is not ready. Please refresh it.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await login({
        username: username.trim(),
        password,
        salt: challenge.salt,
        captcha_answer: captchaAnswer.trim(),
      });

    

console.log(result);
console.log(jwtDecode(result.access_token));




      onLogin(result);
    } catch (err) {
      setError(err.message || "Sign in failed.");
      await loadChallenge();
    } finally {
      setSubmitting(false);
    }
  }

  const captchaImage =
    challenge?.captcha ||
    challenge?.captcha_image ||
    challenge?.image ||
    challenge?.captcha_data;

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="brand-mark">
            <ShieldCheck size={25} />
          </div>
          <div>
            <h1>IDICorp</h1>
            <p>Service Console</p>
          </div>
        </div>

        <div className="login-heading">
          <p className="eyebrow">SECURE WORKSPACE</p>
          <h2>Welcome back</h2>
          <p>Sign in to access your service tools.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <div className="captcha-heading">
            <label htmlFor="captcha-answer">Security verification</label>
            <button
              type="button"
              className="text-button"
              onClick={loadChallenge}
              disabled={loadingChallenge || submitting}
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          <div className="captcha-image">
            {loadingChallenge ? (
              <span>Loading CAPTCHA...</span>
            ) : captchaImage ? (
              <img src={captchaImage} alt="CAPTCHA verification" />
            ) : (
              <span>CAPTCHA image unavailable</span>
            )}
          </div>

          <input
            id="captcha-answer"
            name="captcha"
            value={captchaAnswer}
            onChange={(event) => setCaptchaAnswer(event.target.value)}
            autoComplete="off"
            placeholder="Enter the characters shown"
            required
          />

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="button-primary login-submit"
            disabled={submitting || loadingChallenge || !challenge}
          >
            <LockKeyhole size={17} />
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="login-footer">Protected access · IDICorp</p>
      </section>
    </main>
  );
}
