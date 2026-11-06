import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import siteConfig from "../config/siteConfig";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const naira = (n) => `₦${Number(n).toLocaleString()}`;

const badge = {
  active: "bg-emerald-100 text-emerald-700",
  expired: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const Badge = ({ status }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
      badge[status] || "bg-slate-100 text-slate-600"
    }`}
  >
    {status}
  </span>
);

const Card = ({ title, children }) => (
  <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold">{title}</h2>
    <div className="mt-4">{children}</div>
  </section>
);

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

const Dashboard = () => {
  const { user } = useAuth();
  const [params] = useSearchParams();

  const [subscription, setSubscription] = useState(null);
  const [history, setHistory] = useState([]);
  const [payments, setPayments] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upgrade / payment form
  const [selectedId, setSelectedId] = useState(params.get("plan") || "");
  const [months, setMonths] = useState(1);
  const [reference, setReference] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadAll = async () => {
    try {
      const [s, h, p, pk] = await Promise.all([
        api.get("/subscriptions/me"),
        api.get("/subscriptions/history"),
        api.get("/payments/me"),
        api.get("/packages"),
      ]);
      setSubscription(s.data.subscription);
      setHistory(h.data.history);
      setPayments(p.data.payments);
      setPackages(pk.data.packages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const selected = packages.find((p) => String(p.id) === String(selectedId));

  const handlePay = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitting(true);
    try {
      const res = await api.post("/payments/transfer", {
        packageId: selectedId,
        months,
        reference,
      });
      setFormSuccess(res.data.message);
      setReference("");
      const p = await api.get("/payments/me");
      setPayments(p.data.payments);
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="bg-soft">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            Hello, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500">Manage your VeltrixNet subscription.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile */}
          <Card title="Your details">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Name</dt>
                <dd className="font-medium">{user.name}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              <div>
                <dt className="text-slate-500">House address</dt>
                <dd className="font-medium">{user.houseAddress}</dd>
              </div>
            </dl>
          </Card>

          {/* Current subscription */}
          <div className="lg:col-span-2">
            <Card title="Current subscription">
              {subscription ? (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold text-brand">
                        {subscription.package.name} ·{" "}
                        {subscription.package.speed} Mbps
                      </p>
                      <p className="text-sm text-slate-500">
                        {naira(subscription.package.finalPrice)}/month
                      </p>
                    </div>
                    <Badge status={subscription.status} />
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-soft p-4">
                      <p className="text-xs text-slate-500">Start date</p>
                      <p className="font-semibold">
                        {fmtDate(subscription.startDate)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-soft p-4">
                      <p className="text-xs text-slate-500">Expiry date</p>
                      <p className="font-semibold">
                        {fmtDate(subscription.expiryDate)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-soft p-4">
                      <p className="text-xs text-slate-500">Days left</p>
                      <p className="font-semibold">{subscription.daysLeft}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  You have no active subscription yet. Choose a plan below and
                  make a transfer to get started.
                </p>
              )}
            </Card>
          </div>
        </div>

        {/* Upgrade / pay */}
        <Card title={subscription ? "Upgrade or renew" : "Choose a plan"}>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Package list */}
            <div className="space-y-3">
              {packages.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
                    String(selectedId) === String(p.id)
                      ? "border-brand bg-brand/5"
                      : "border-slate-200 hover:border-brand/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="plan"
                      value={p.id}
                      checked={String(selectedId) === String(p.id)}
                      onChange={(e) => setSelectedId(e.target.value)}
                      className="accent-[#0b3d91]"
                    />
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.speed} Mbps</p>
                    </div>
                  </div>
                  <p className="font-bold">{naira(p.finalPrice)}/mo</p>
                </label>
              ))}
            </div>

            {/* Payment instructions */}
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Number of months</label>
                <select
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className={`${inputClass} mt-1`}
                >
                  {[1, 2, 3, 6, 12].map((m) => (
                    <option key={m} value={m}>
                      {m} month{m > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl bg-ink p-5 text-sm text-white">
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Transfer exactly
                </p>
                <p className="mt-1 text-3xl font-bold text-accent">
                  {selected ? naira(selected.finalPrice * months) : "₦0"}
                </p>
                <div className="mt-4 space-y-1 text-slate-300">
                  <p>Bank: <b className="text-white">{siteConfig.bank.bankName}</b></p>
                  <p>Account name: <b className="text-white">{siteConfig.bank.accountName}</b></p>
                  <p>Account number: <b className="text-white">{siteConfig.bank.accountNumber}</b></p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Transfer reference / narration
                </label>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. session ID or the name on the transfer"
                  required
                  className={`${inputClass} mt-1`}
                />
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}
              {formSuccess && (
                <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                  {formSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={!selected || submitting}
                className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "I have paid"}
              </button>
              {!selected && (
                <p className="text-center text-xs text-slate-500">
                  Select a plan on the left first.
                </p>
              )}
            </form>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Subscription record */}
          <Card title="Subscription record">
            {history.length === 0 ? (
              <p className="text-sm text-slate-500">No past subscriptions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500">
                    <tr>
                      <th className="pb-2">Plan</th>
                      <th className="pb-2">Start</th>
                      <th className="pb-2">Expiry</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id} className="border-t border-slate-100">
                        <td className="py-3">{h.package.name}</td>
                        <td>{fmtDate(h.startDate)}</td>
                        <td>{fmtDate(h.expiryDate)}</td>
                        <td><Badge status={h.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Payments */}
          <Card title="Payment history">
            {payments.length === 0 ? (
              <p className="text-sm text-slate-500">No payments submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500">
                    <tr>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Plan</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-t border-slate-100">
                        <td className="py-3">{fmtDate(p.createdAt)}</td>
                        <td>
                          {p.package.name} ×{p.months}
                        </td>
                        <td>{naira(p.amount)}</td>
                        <td><Badge status={p.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;