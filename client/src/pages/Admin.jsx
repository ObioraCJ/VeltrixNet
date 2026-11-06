import { useEffect, useState } from "react";
import api from "../api/api";

const naira = (n) => `₦${Number(n || 0).toLocaleString()}`;
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

const badgeClass = {
  active: "bg-emerald-100 text-emerald-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  expired: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-700",
  none: "bg-slate-100 text-slate-600",
};

const Badge = ({ status }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
      badgeClass[status] || badgeClass.none
    }`}
  >
    {status === "none" ? "No plan" : status}
  </span>
);

const Stat = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-bold">{value}</p>
  </div>
);

const tabs = ["Payments", "Customers", "Packages", "Leads"];

const Admin = () => {
  const [tab, setTab] = useState("Payments");
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [msg, setMsg] = useState("");

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3000);
  };

  const loadStats = () =>
    api.get("/admin/stats").then((r) => setStats(r.data));

  const loadPayments = () =>
    api
      .get("/admin/payments", { params: filter ? { status: filter } : {} })
      .then((r) => setPayments(r.data.payments));

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadPayments();
  }, [filter]);

  useEffect(() => {
    if (tab === "Customers")
      api.get("/admin/customers").then((r) => setCustomers(r.data.customers));
    if (tab === "Packages")
      api.get("/admin/packages").then((r) => setPackages(r.data.packages));
    if (tab === "Leads")
      api.get("/admin/interests").then((r) => setLeads(r.data.interests));
  }, [tab]);

  const act = async (id, action) => {
    if (
      action === "confirm" &&
      !window.confirm("Confirm this payment and activate the subscription?")
    )
      return;
    try {
      const r = await api.patch(`/admin/payments/${id}/${action}`);
      flash(r.data.message);
      loadPayments();
      loadStats();
    } catch (err) {
      flash(err.response?.data?.message || "Action failed");
    }
  };

  const savePackage = async (p) => {
    try {
      await api.patch(`/admin/packages/${p.id}`, {
        basePrice: p.basePrice,
        markup: p.markup,
        isActive: p.isActive,
      });
      flash(`${p.name} updated`);
      const r = await api.get("/admin/packages");
      setPackages(r.data.packages);
    } catch (err) {
      flash(err.response?.data?.message || "Update failed");
    }
  };

  const editPackage = (id, field, value) =>
    setPackages(packages.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const markContacted = async (id) => {
    await api.patch(`/admin/interests/${id}/contacted`);
    api.get("/admin/interests").then((r) => setLeads(r.data.interests));
    loadStats();
  };

  const th = "pb-3 pr-4 text-xs uppercase text-slate-500";
  const td = "py-3 pr-4";
  const smallInput =
    "w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand";

  return (
    <div className="bg-soft">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <h1 className="text-2xl font-bold md:text-3xl">Admin panel</h1>

        {stats && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <Stat label="Customers" value={stats.customers} />
            <Stat label="Pending payments" value={stats.pendingPayments} />
            <Stat label="Active subscriptions" value={stats.activeSubs} />
            <Stat label="New leads" value={stats.newLeads} />
            <Stat label="Confirmed revenue" value={naira(stats.revenue)} />
          </div>
        )}

        {msg && (
          <p className="rounded-xl bg-brand/10 p-3 text-sm font-medium text-brand">
            {msg}
          </p>
        )}

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                tab === t
                  ? "bg-brand text-white"
                  : "bg-white text-slate-600 hover:text-brand"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          {/* PAYMENTS */}
          {tab === "Payments" && (
            <>
              <div className="mb-4 flex gap-2">
                {["pending", "confirmed", "rejected", ""].map((f) => (
                  <button
                    key={f || "all"}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize ${
                      filter === f
                        ? "bg-ink text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {f || "all"}
                  </button>
                ))}
              </div>
              {payments.length === 0 ? (
                <p className="text-sm text-slate-500">No payments here.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className={th}>Date</th>
                      <th className={th}>Customer</th>
                      <th className={th}>Plan</th>
                      <th className={th}>Amount</th>
                      <th className={th}>Reference</th>
                      <th className={th}>Status</th>
                      <th className={th}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-t border-slate-100">
                        <td className={td}>{fmtDate(p.createdAt)}</td>
                        <td className={td}>
                          <p className="font-medium">{p.User?.name}</p>
                          <p className="text-xs text-slate-500">{p.User?.email}</p>
                        </td>
                        <td className={td}>
                          {p.package?.name} ×{p.months}
                        </td>
                        <td className={td}>{naira(p.amount)}</td>
                        <td className={td}>{p.reference}</td>
                        <td className={td}>
                          <Badge status={p.status} />
                        </td>
                        <td className={`${td} whitespace-nowrap`}>
                          {p.status === "pending" && (
                            <>
                              <button
                                onClick={() => act(p.id, "confirm")}
                                className="mr-2 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => act(p.id, "reject")}
                                className="rounded-full bg-red-100 px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* CUSTOMERS */}
          {tab === "Customers" &&
            (customers.length === 0 ? (
              <p className="text-sm text-slate-500">No customers yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className={th}>Name</th>
                    <th className={th}>Email</th>
                    <th className={th}>Address</th>
                    <th className={th}>Plan</th>
                    <th className={th}>Expiry</th>
                    <th className={th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-t border-slate-100">
                      <td className={`${td} font-medium`}>{c.name}</td>
                      <td className={td}>{c.email}</td>
                      <td className={td}>{c.houseAddress}</td>
                      <td className={td}>{c.plan || "-"}</td>
                      <td className={td}>{fmtDate(c.expiryDate)}</td>
                      <td className={td}>
                        <Badge status={c.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}

          {/* PACKAGES */}
          {tab === "Packages" && (
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className={th}>Plan</th>
                  <th className={th}>Base price (₦)</th>
                  <th className={th}>Markup (₦)</th>
                  <th className={th}>Customer pays</th>
                  <th className={th}>Visible</th>
                  <th className={th}></th>
                </tr>
              </thead>
              <tbody>
                {packages.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className={`${td} font-medium`}>
                      {p.name} · {p.speed}Mbps
                    </td>
                    <td className={td}>
                      <input
                        type="number"
                        value={p.basePrice}
                        onChange={(e) =>
                          editPackage(p.id, "basePrice", e.target.value)
                        }
                        className={smallInput}
                      />
                    </td>
                    <td className={td}>
                      <input
                        type="number"
                        value={p.markup}
                        onChange={(e) =>
                          editPackage(p.id, "markup", e.target.value)
                        }
                        className={smallInput}
                      />
                    </td>
                    <td className={`${td} font-semibold`}>
                      {naira(Number(p.basePrice) + Number(p.markup))}
                    </td>
                    <td className={td}>
                      <input
                        type="checkbox"
                        checked={p.isActive}
                        onChange={(e) =>
                          editPackage(p.id, "isActive", e.target.checked)
                        }
                        className="h-4 w-4 accent-[#0b3d91]"
                      />
                    </td>
                    <td className={td}>
                      <button
                        onClick={() => savePackage(p)}
                        className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* LEADS */}
          {tab === "Leads" &&
            (leads.length === 0 ? (
              <p className="text-sm text-slate-500">No leads yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className={th}>Date</th>
                    <th className={th}>Name</th>
                    <th className={th}>Email</th>
                    <th className={th}>Address</th>
                    <th className={th}></th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} className="border-t border-slate-100">
                      <td className={td}>{fmtDate(l.createdAt)}</td>
                      <td className={`${td} font-medium`}>{l.name}</td>
                      <td className={td}>{l.email}</td>
                      <td className={td}>{l.houseAddress}</td>
                      <td className={td}>
                        {l.contacted ? (
                          <span className="text-xs text-emerald-600">Contacted</span>
                        ) : (
                          <button
                            onClick={() => markContacted(l.id)}
                            className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold hover:bg-slate-200"
                          >
                            Mark contacted
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;