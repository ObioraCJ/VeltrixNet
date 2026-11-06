import siteConfig from "../config/siteConfig";

const Contact = () => (
  <section id="contact" className="bg-soft">
    <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
      <h2 className="text-3xl font-bold md:text-4xl">Talk to us</h2>
      <p className="mx-auto mt-3 max-w-md text-slate-500">
        Have a question or ready to get connected? Reach us by phone, WhatsApp
        or email.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a
          href={`tel:${siteConfig.phone}`}
          className="rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Call {siteConfig.phone}
        </a>
        <a
          href={siteConfig.whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-emerald-500 px-7 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Chat on WhatsApp
        </a>
        <a
          href={`mailto:${siteConfig.email}`}
          className="rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold hover:border-brand hover:text-brand"
        >
          Send an email
        </a>
      </div>
    </div>
  </section>
);

export default Contact;