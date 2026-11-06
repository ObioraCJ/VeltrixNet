const AuthCard = ({ title, subtitle, children }) => (
  <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-soft px-4 py-12">
    <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />

    <div className="relative w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  </div>
);

export default AuthCard;