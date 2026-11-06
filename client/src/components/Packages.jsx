import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/packages")
      .then((res) => setPackages(res.data.packages))
      .catch(() => setError("Could not load packages. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="packages" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Pick the plan that fits you</h2>
        <p className="mt-3 text-slate-500">
         Every plan includes unlimited data, a free WiFi router and free installation.
        </p>
      </div>

      {loading && <p className="mt-12 text-center">Loading packages...</p>}
      {error && <p className="mt-12 text-center text-red-600">{error}</p>}

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((p) => (
          <div
            key={p.id}
            className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 transition hover:shadow-lg"
          >
            <p className="text-sm font-medium text-slate-500">{p.name}</p>
            <p className="mt-1 text-2xl font-bold text-brand">{p.speed} Mbps</p>

            <span className="mt-3 w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              {p.minimumMonths} months minimum
            </span>

            <p className="mt-5">
              <span className="text-3xl font-bold">
                ₦{p.finalPrice.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500">/month</span>
            </p>

            <hr className="my-5 border-slate-100" />

            <ul className="flex-1 space-y-3 text-sm text-slate-600">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-accent">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              to={`/signup?plan=${p.id}`}
              className="mt-6 block rounded-full border border-slate-300 py-3 text-center text-sm font-semibold hover:border-brand hover:bg-brand hover:text-white"
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Packages;