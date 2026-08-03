import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Wallet,
  ShieldCheck,
  PieChart,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill all fields");
      return false;
    }

    if (fullName.length < 3) {
      toast.error(
        "Full Name must contain at least 3 characters"
      );
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email");
      return false;
    }

    if (password.length < 6) {
      toast.error(
        "Password must contain at least 6 characters"
      );
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await API.post("/register", {
        name: fullName,
        email,
        password,
      });

      toast.success(
        response.data.message ||
          "Registration Successful"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex bg-slate-900 text-white p-16 flex-col justify-center">

        <div>

          <h1 className="text-5xl font-bold">
            💰 SpendWise
          </h1>

          <p className="mt-5 text-slate-300 text-lg leading-8">
            Take complete control of your personal
            finance with powerful analytics,
            budgeting and goal tracking.
          </p>

        </div>

        <div className="space-y-6 mt-14">

          <div className="flex items-center gap-5 bg-slate-800 rounded-2xl p-5">

            <Wallet
              size={34}
              className="text-emerald-400"
            />

            <div>

              <h3 className="font-semibold text-lg">
                Expense Tracking
              </h3>

              <p className="text-slate-400">
                Manage every rupee easily.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-5 bg-slate-800 rounded-2xl p-5">

            <PieChart
              size={34}
              className="text-sky-400"
            />

            <div>

              <h3 className="font-semibold text-lg">
                Smart Analytics
              </h3>

              <p className="text-slate-400">
                Beautiful charts & reports.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-5 bg-slate-800 rounded-2xl p-5">

            <ShieldCheck
              size={34}
              className="text-yellow-400"
            />

            <div>

              <h3 className="font-semibold text-lg">
                Secure Account
              </h3>

              <p className="text-slate-400">
                JWT Protected Authentication.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="bg-slate-100 flex justify-center items-center p-8">

        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

          <div className="text-center mb-8">

            <h2 className="text-4xl font-bold text-slate-800">
              Create Account
            </h2>

            <p className="text-slate-500 mt-2">
              Start your financial journey
            </p>

          </div>

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* NAME */}

            <div className="relative">

              <User
                size={20}
                className="absolute left-4 top-4 text-slate-400"
              />

              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                className="w-full pl-12 pr-4 py-4 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none"
              />

            </div>

            {/* EMAIL */}

            <div className="relative">

              <Mail
                size={20}
                className="absolute left-4 top-4 text-slate-400"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full pl-12 pr-4 py-4 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none"
              />

            </div>

            {/* PASSWORD */}

            <div className="relative">

              <Lock
                size={20}
                className="absolute left-4 top-4 text-slate-400"
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
                className="w-full pl-12 pr-12 py-4 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none"
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

            {/* CONFIRM */}

            <div className="relative">

              <Lock
                size={20}
                className="absolute left-4 top-4 text-slate-400"
              />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full pl-12 pr-12 py-4 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-4"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            <button
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold transition"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

            <p className="text-center text-slate-500">

              Already have an account?

              <Link
                to="/login"
                className="text-emerald-600 font-semibold ml-2"
              >
                Login
              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Register;