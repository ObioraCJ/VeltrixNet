import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const planId = params.get("plan");

  const [plan, setPlan] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    houseAddress: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Show the plan the visitor picked on the home page
  useEffect(() => {
    if (!planId) return;
    api
      .get(`/packages/${planId}`)
      .then((res) => setPlan(res.data.package))
      .catch(() => setPlan(null));
  }, [planId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form);
      // Keep the chosen plan so the dashboard can open the upgrade/payment section
      navigate(planId ? `/dashboard?plan=${planId}` : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Tell us who you are and where to install."
    >
      {plan && (
        <div className="mb-5 rounded-2xl bg-brand/5 p-4 text-sm">
          <p className="text-slate-500">Selected plan</p>
          <p className="font-bold text-brand">
            {plan.name} · {plan.speed} Mbps · ₦{plan.finalPrice.toLocaleString()}
            /month
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full name"
          required
          className={inputClass}
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email address"
          required
          className={inputClass}
        />
        <input
          name="houseAddress"
          value={form.houseAddress}
          onChange={handleChange}
          placeholder="House address"
          required
          className={inputClass}
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password (min. 6 characters)"
          minLength={6}
          required
          className={inputClass}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand hover:underline">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
};

export default Signup;