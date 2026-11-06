import Logo from "./Logo";
import siteConfig from "../config/siteConfig";

const Footer = () => (
  <footer className="bg-ink text-slate-300">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
      <div>
        <Logo light />
        <p className="mt-2 text-sm">{siteConfig.tagline}</p>
      </div>
      <div className="text-sm">
        <p>Call/WhatsApp: {siteConfig.phone}</p>
        <p>Email: {siteConfig.email}</p>
      </div>
    </div>
    <div className="border-t border-slate-700 py-4 text-center text-xs">
      © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
    </div>
  </footer>
);

export default Footer;