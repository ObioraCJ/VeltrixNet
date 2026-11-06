import { Link } from "react-router-dom";

const Logo = ({ light = false }) => (
  <Link to="/" className="flex items-center gap-2">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">
      V
    </span>
    <span
      className={`text-xl font-bold tracking-tight ${
        light ? "text-white" : "text-ink"
      }`}
    >
      Veltrix<span className="text-accent">Net</span>
    </span>
  </Link>
);

export default Logo;