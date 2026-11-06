const WifiIcon = ({ className = "h-8 w-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <path
      className="wifi-arc wifi-arc-3"
      d="M8 24c13.3-12 34.7-12 48 0"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      className="wifi-arc wifi-arc-2"
      d="M16 33c8.8-8 23.2-8 32 0"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      className="wifi-arc wifi-arc-1"
      d="M24 42c5.3-4.5 10.7-4.5 16 0"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <circle cx="32" cy="52" r="4" fill="currentColor" />
  </svg>
);

export default WifiIcon;