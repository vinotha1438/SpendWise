import { useState } from "react";
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
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

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

      localStorage.setItem(
        "token",
        response.data.token
      );

      toast.success(
        response.data.message || "Login Successful"
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
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