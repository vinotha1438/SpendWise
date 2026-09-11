import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Wallet,
  PieChart,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const googleButtonRef = useRef(null);

  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);
  // If api.js bounced the user here because their token
  // expired/was rejected, show them why instead of leaving
  // them wondering why they were logged out.
  useEffect(() => {
    const message = sessionStorage.getItem(
      "sessionExpiredMessage"
    );

    if (message) {
      toast.error(message);
      sessionStorage.removeItem("sessionExpiredMessage");
    }
  }, []);

  const completeLogin = (token, message) => {
    localStorage.setItem("token", token);

    toast.success(message || "Login Successful");

    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  };

  const handleGoogleResponse = async (response) => {
    try {
      const res = await API.post("/google-login", {
        credential: response.credential,
      });

      completeLogin(res.data.token, res.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Google Sign-In Failed"
      );
    }
  };

  // NATIVE (Android/iOS app) Google Sign-In — uses the device's
  // native Google account picker instead of the web JS SDK, which
  // does not work inside a Capacitor WebView.
  const handleNativeGoogleSignIn = async () => {
    try {
      const result = await GoogleAuth.signIn();
      const idToken = result?.authentication?.idToken;

      if (!idToken) {
        toast.error("Google Sign-In Failed");
        return;
      }

      const res = await API.post("/google-login", {
        credential: idToken,
      });

      completeLogin(res.data.token, res.data.message);
    } catch (error) {
      console.log("Native Google Sign-In error:", error);
      toast.error("Google Sign-In Failed");
    }
  };

  useEffect(() => {
    if (isNative) {
      GoogleAuth.initialize();
    }
  }, [isNative]);

  // The Google script (loaded via <script> in index.html) attaches
  // itself to window.google asynchronously, so we poll briefly
  // until it's ready rather than assuming it's there on mount.
  //
  // This WEB flow only runs in the browser — native apps use
  // handleNativeGoogleSignIn instead.
  //
  // initializedRef guards against React StrictMode's dev-only
  // double-invoke of effects, which would otherwise call
  // google.accounts.id.initialize() twice and log a warning.
  const initializedRef = useRef(false);

  useEffect(() => {
    if (isNative) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.log(
        "VITE_GOOGLE_CLIENT_ID is not set — Google Sign-In button will not render."
      );
      return;
    }

    let attempts = 0;
    let cancelled = false;

    const tryRenderButton = () => {
      if (cancelled) return;

      attempts += 1;

      if (window.google?.accounts?.id && googleButtonRef.current) {
        if (!initializedRef.current) {
          initializedRef.current = true;

          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleResponse,
          });
        }

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: "outline",
            size: "large",
            // Google's button API requires a fixed pixel width,
            // not a percentage — 320 comfortably fills this form's
            // input width without overflowing on small screens.
            width: 320,
            text: "continue_with",
          }
        );

        return;
      }

      if (attempts < 50) {
        setTimeout(tryRenderButton, 100);
      }
    };

    tryRenderButton();

    return () => {
      cancelled = true;
    };
  }, [isNative]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/login", {
        email,
        password,
      });

      completeLogin(
        response.data.token,
        response.data.message
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT */}

      <div className="hidden lg:flex bg-slate-900 text-white p-16 flex-col justify-center">

        <h1 className="text-5xl font-bold">
          💰 SpendWise
        </h1>

        <p className="mt-5 text-slate-300 text-lg leading-8">
          Welcome back.
          Manage your expenses,
          income,
          savings,
          budgets,
          analytics and reports
          in one powerful dashboard.
        </p>

        <div className="space-y-6 mt-14">

          <div className="flex items-center gap-5 bg-slate-800 rounded-2xl p-5">

            <Wallet
              className="text-emerald-400"
              size={34}
            />

            <div>

              <h3 className="font-semibold">
                Expense Tracking
              </h3>

              <p className="text-slate-400">
                Track every expense.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-5 bg-slate-800 rounded-2xl p-5">

            <PieChart
              className="text-sky-400"
              size={34}
            />

            <div>

              <h3 className="font-semibold">
                Smart Analytics
              </h3>

              <p className="text-slate-400">
                Beautiful charts.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-5 bg-slate-800 rounded-2xl p-5">

            <ShieldCheck
              className="text-yellow-400"
              size={34}
            />

            <div>

              <h3 className="font-semibold">
                Secure Login
              </h3>

              <p className="text-slate-400">
                JWT Authentication.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div className="bg-slate-100 flex justify-center items-center p-8">

        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

          <div className="text-center mb-8">

            <h2 className="text-4xl font-bold text-slate-800">
              Welcome Back 👋
            </h2>

            <p className="text-slate-500 mt-2">
              Login to your account
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div className="relative">

              <Mail
                className="absolute left-4 top-4 text-slate-400"
                size={20}
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />

            </div>

            {/* PASSWORD */}

            <div className="relative">

              <Lock
                className="absolute left-4 top-4 text-slate-400"
                size={20}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-4"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            <div className="flex justify-between text-sm">

              <label className="flex items-center gap-2">

                <input type="checkbox" />

                Remember Me

              </label>

              <button
                type="button"
                className="text-emerald-600"
              >
                Forgot Password?
              </button>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold transition"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {isNative ? (
              <button
                type="button"
                onClick={handleNativeGoogleSignIn}
                className="w-full border border-slate-300 py-3.5 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-slate-50 transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
            ) : (
              <div
                ref={googleButtonRef}
                className="flex justify-center"
              />
            )}

            <p className="text-center text-slate-500">

              New User?

              <Link
                to="/register"
                className="text-emerald-600 font-semibold ml-2"
              >
                Create Account
              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;