import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Globe2,
  Code2,
  TrendingUp,
  Search,
  Sparkles,
  Check,
  Layers3,
  Send,
  LoaderCircle,
  Bot,
  BrainCircuit,
  Workflow,
  LifeBuoy,
  Database,
  Accessibility,
  BarChart3,
  Rocket,
  Network,
  ShieldCheck,
} from "lucide-react";


const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");


const robustSolutions = [
  {
    icon: Bot,
    title: "AI Receptionists",
    description: "Voice and chat agents that answer, qualify, route, and book leads while your team stays focused.",
  },
  {
    icon: BrainCircuit,
    title: "AI Automation",
    description: "Workflow automation, internal copilots, data syncs, and operational systems built for real teams.",
  },
  {
    icon: Globe2,
    title: "Websites",
    description: "Fast, premium websites with sharp positioning, conversion paths, analytics, and SEO foundations.",
  },
  {
    icon: Code2,
    title: "Web Applications",
    description: "Custom portals, dashboards, booking flows, and software tools engineered for daily operations.",
  },
  {
    icon: Network,
    title: "CRM Integrations",
    description: "Connect CRM tools, forms, calls, calendars, and pipelines into one clear operating system.",
  },
  {
    icon: Search,
    title: "SEO",
    description: "Technical SEO, local SEO, content systems, and measurement that compound into durable demand.",
  },
  {
    icon: LifeBuoy,
    title: "Maintenance & Support",
    description: "Fast fixes, uptime care, site updates, reporting, and a responsive team when something needs attention.",
  },
  {
    icon: Workflow,
    title: "Digital Operations",
    description: "A senior tech team for your digital stack, from strategy through launch, support, and optimisation.",
  },
];

const catalog = [
  {
    icon: Globe2,
    title: "Website",
    count: "4 services",
    description: "Redesigns, headless builds, landing pages, and ongoing maintenance.",
    services: ["Website strategy & design", "Website development", "Landing pages", "Website maintenance"],
  },
  {
    icon: Bot,
    title: "AI",
    count: "4 services",
    description: "Chatbots and AI receptionists that qualify and route leads around the clock.",
    services: ["AI receptionists", "AI chatbots", "Workflow automation", "AI integrations"],
  },
  {
    icon: Rocket,
    title: "Growth",
    count: "6 services",
    description: "SEO, Google and Meta ads, social, and email working as one engine.",
    services: ["Technical SEO", "Local SEO", "Google Ads", "Meta Ads", "Social media", "Email campaigns"],
  },
  {
    icon: BarChart3,
    title: "Data",
    count: "3 services",
    description: "Live dashboards, analytics, and monthly reporting for every channel.",
    services: ["Analytics setup", "Reporting dashboards", "Conversion tracking"],
  },
  {
    icon: Accessibility,
    title: "Accessibility",
    count: "2 services",
    description: "Improvements and testing reviewed against recognised standards.",
    services: ["Accessibility audits", "Accessibility improvements"],
  },
  {
    icon: ShieldCheck,
    title: "Support",
    count: "3 services",
    description: "A real team for technical support, content, and API maintenance.",
    services: ["Technical support", "Content updates", "API maintenance"],
  },
];

const steps = [
  ["01", "Discover", "We learn about your business, audience, and what success looks like."],
  ["02", "Strategise", "We build a focused roadmap around your goals, market, and resources."],
  ["03", "Create", "We design, develop, and launch with attention to every detail."],
  ["04", "Optimise", "We measure results, find opportunities, and keep improving."],
];

const principles = [
  ["01", "Business-first thinking", "We start with your customers and objectives, not a template."],
  ["02", "Built for real users", "Responsive experiences designed for the devices people use every day."],
  ["03", "Clarity at every step", "Straightforward communication and clearly defined deliverables."],
  ["04", "Growth beyond launch", "A foundation you can measure, improve, and build on."],
];

function SectionLabel({ children }) {
  return (
    <div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-red-400 sm:text-xs">
      <span className="h-px w-7 bg-red-500" />
      {children}
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function updateField(event) {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback(null);

    if (form.website) {
      setFeedback({ type: "error", text: "Unable to submit this enquiry." });
      return;
    }

    if (
      form.name.trim().length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
      !form.service ||
      form.message.trim().length < 10
    ) {
      setFeedback({
        type: "error",
        text: "Please complete all required fields. Your message must contain at least 10 characters.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
          message: form.message.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || "Unable to submit your enquiry.");

      setFeedback({ type: "success", text: "Thank you! Your enquiry has been received. We'll be in touch." });
      setForm({ name: "", email: "", phone: "", company: "", service: "", message: "", website: "" });
    } catch (error) {
      setFeedback({ type: "error", text: error.message || "Could not connect to the server. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-2 w-full rounded-xl border border-white/10 bg-[#10090b] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-red-400";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.09] bg-[#160d0f] p-6 sm:p-8">
      <h3 className="text-2xl font-semibold">Tell us about your project.</h3>
      <p className="mt-2 text-sm leading-6 text-white/45">Share a few details and we'll understand what you need.</p>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="text-sm text-white/75">Your name *
          <input name="name" value={form.name} onChange={updateField} required minLength={2} maxLength={100} autoComplete="name" placeholder="Full name" className={inputClass} />
        </label>
        <label className="text-sm text-white/75">Work email *
          <input name="email" type="email" value={form.email} onChange={updateField} required maxLength={254} autoComplete="email" placeholder="you@company.com" className={inputClass} />
        </label>
        <label className="text-sm text-white/75">Phone number
          <input name="phone" type="tel" value={form.phone} onChange={updateField} maxLength={20} autoComplete="tel" placeholder="+91" className={inputClass} />
        </label>
        <label className="text-sm text-white/75">Company
          <input name="company" value={form.company} onChange={updateField} maxLength={120} autoComplete="organization" placeholder="Company name" className={inputClass} />
        </label>
        <label className="text-sm text-white/75 sm:col-span-2">What can we help you with? *
          <select name="service" value={form.service} onChange={updateField} required className={inputClass}>
            <option value="" disabled>Select a service</option>
            <option value="Websites">Websites</option>
            <option value="Web Applications">Web Applications</option>
            <option value="AI Automation">AI Automation</option>
            <option value="CRM Integrations">CRM Integrations</option>
            <option value="Performance Marketing">Performance Marketing</option>
            <option value="SEO & Organic Growth">SEO & Organic Growth</option>
            <option value="Maintenance & Support">Maintenance & Support</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label className="text-sm text-white/75 sm:col-span-2">Tell us about your project *
          <textarea name="message" value={form.message} onChange={updateField} required minLength={10} maxLength={3000} rows={4} placeholder="Your goals, challenges, and what you'd like to build..." className={`${inputClass} resize-y`} />
        </label>
        <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
          <label>Leave this field empty
            <input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={updateField} />
          </label>
        </div>
      </div>
      {feedback && (
        <p role="status" aria-live="polite" className={`mt-5 rounded-xl border p-4 text-sm leading-6 ${feedback.type === "success" ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
          {feedback.text}
        </p>
      )}
      <button disabled={loading} type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#ed3945] px-6 py-4 text-sm font-semibold transition hover:bg-[#ff4b56] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
        {loading ? <><LoaderCircle size={18} className="animate-spin" /> Sending...</> : <>Send your enquiry <Send size={17} /></>}
      </button>
      <p className="mt-4 text-xs leading-5 text-white/35">Your details will be used to respond to your enquiry.</p>
    </form>
  );
}

function ProjectCard({ marketing = false }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/[0.09] bg-[#12090b]">
      <div className={`relative flex min-h-[300px] items-center justify-center overflow-hidden p-6 sm:min-h-[340px] ${marketing ? "bg-gradient-to-br from-[#24151c] via-[#171013] to-[#10090b]" : "bg-gradient-to-br from-[#40171d] via-[#211013] to-[#10090b]"}`}>
        <div className="absolute -right-10 -top-14 h-64 w-64 rounded-full border border-red-400/15 transition duration-700 group-hover:scale-110" />
        <div className="absolute -right-2 -top-6 h-48 w-48 rounded-full border border-white/10" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-red-600/15 blur-3xl" />
        <div className="relative w-full max-w-sm rounded-xl border border-white/15 bg-[#150e10]/95 p-6 shadow-2xl sm:p-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-sm font-bold">{marketing ? "GROWTH/LAB" : "NOVA."}</span>
            {marketing ? <TrendingUp className="text-red-400" /> : <Layers3 className="text-red-400" />}
          </div>
          <p className="mt-7 text-xs uppercase tracking-widest text-red-300">{marketing ? "Performance overview" : "Digital storefront"}</p>
          <h3 className="mt-3 text-3xl font-semibold leading-tight">{marketing ? <>Make every<br />click count.</> : <>A better way<br />to shop online.</>}</h3>
          <div className="mt-7 flex items-center justify-between">
            <span className="text-xs text-white/40">{marketing ? "Campaign insights" : "Product discovery"}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500"><ArrowUpRight size={17} /></span>
          </div>
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-red-400">Concept project · {marketing ? "Marketing" : "E-commerce"}</p>
        <h3 className="mt-3 text-xl font-semibold">{marketing ? "Growth with direction" : "The modern storefront"}</h3>
        <p className="mt-2 text-sm leading-7 text-white/45">{marketing ? "A sample marketing dashboard exploring campaign insights." : "A sample shopping experience focused on clear navigation."}</p>
        <span className="mt-5 inline-flex rounded-full border border-white/10 px-3 py-2 text-xs text-white/55">{marketing ? "Analytics" : "UI / UX"}</span>
      </div>
    </article>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Website");
  const [showAllServices, setShowAllServices] = useState(false);

  const navigation = [["Services", "#services"], ["Work", "#work"], ["About", "#about"], ["Our process", "#process"]];
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="overflow-hidden bg-[#10090b] text-[#f5f0ef] selection:bg-red-500/30 selection:text-white">
      <header className="relative z-50 border-b border-white/[0.07] bg-[#10090b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8 lg:px-14">
          <a href="#home" onClick={closeMenu} className="flex items-center gap-3" aria-label="Ethixweb home">
            <img src="/logo.png" alt="Ethixweb" className="h-9 w-auto max-w-[180px] object-contain" onError={(event) => { event.currentTarget.style.display = "none"; }} />
            <span className="hidden text-lg font-bold tracking-tight">ETHIX<span className="text-red-500">WEB</span></span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-white/60 lg:flex">
            {navigation.map(([label, href]) => <a key={href} href={href} className="transition hover:text-white">{label}</a>)}
          </nav>
          <a href="#contact" className="hidden items-center gap-2 rounded-full bg-[#ed3945] px-5 py-3 text-sm font-semibold transition hover:bg-[#ff4b56] sm:flex">Let's talk <ArrowUpRight size={16} /></a>
          
<a
  href="/admin"
  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
>
  Admin Login
</a>
```
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} className="rounded-lg border border-white/10 p-2 lg:hidden">{menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && <nav className="absolute left-0 right-0 top-full flex flex-col gap-5 border-b border-white/10 bg-[#160d0f] px-6 py-7 lg:hidden">{navigation.map(([label, href]) => <a key={href} href={href} onClick={closeMenu} className="transition hover:text-red-400">{label}</a>)}<a href="#contact" onClick={closeMenu} className="font-semibold text-red-400">Start a project ↗</a></nav>}
      </header>

      <section id="home" className="relative isolate scroll-mt-20">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-48 -top-28 h-[520px] w-[520px] rounded-full bg-red-700/[0.12] blur-[120px]" />
          <div className="absolute -left-40 top-64 h-80 w-80 rounded-full bg-red-900/[0.13] blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)", backgroundSize: "68px 68px", maskImage: "linear-gradient(to bottom, black, transparent 85%)" }} />
        </div>
        <div className="mx-auto grid min-h-[610px] max-w-[1400px] items-center gap-10 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[1.1fr_.9fr] lg:px-14">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/[0.07] px-4 py-2 text-xs text-red-200 sm:text-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />Digital growth, built around you</div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-6xl lg:text-[76px]">Senior operators for the systems that <span className="text-red-500">grow your business.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/55 sm:text-lg">Web, AI, and growth systems built to help ambitious businesses attract better leads, work smarter, and scale with confidence.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#contact" className="group inline-flex items-center gap-3 rounded-full bg-[#ed3945] px-6 py-4 text-sm font-semibold transition hover:bg-[#ff4b56]">Start your project <ArrowUpRight size={18} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
              <a href="#services" className="inline-flex items-center gap-2 px-4 py-4 text-sm text-white/70 transition hover:text-white">Explore services <ArrowDownRight size={17} /></a>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/45 sm:text-sm">{["Strategy first", "Built for performance", "One accountable team"].map((item) => <span key={item} className="flex items-center gap-2"><Check size={15} className="text-red-400" />{item}</span>)}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative mx-auto flex aspect-square w-full max-w-[460px] items-center justify-center">
            <div className="absolute inset-[5%] rounded-full border border-white/[0.07]" /><div className="absolute inset-[15%] rounded-full border border-red-500/20" /><div className="absolute inset-[25%] rounded-full border border-white/[0.08]" /><div className="absolute inset-[8%] animate-[spin_35s_linear_infinite] rounded-full border border-dashed border-red-400/25" />
            <svg viewBox="0 0 440 440" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => { const angle = (index * Math.PI) / 6; const x = 220 + Math.cos(angle) * 188; const y = 220 + Math.sin(angle) * 188; return <g key={index}><line x1="220" y1="220" x2={x} y2={y} stroke="#ed3945" strokeOpacity=".3" /><circle cx={x} cy={y} r="3" fill="#ed3945" /></g>; })}<circle cx="220" cy="220" r="115" stroke="#ed3945" strokeOpacity=".55" /><circle cx="220" cy="220" r="82" stroke="#ffffff" strokeOpacity=".12" /></svg>
            <div className="relative z-10 flex h-44 w-44 flex-col items-center justify-center rounded-full border border-red-400/30 bg-[#1d1114]/95 shadow-[0_0_90px_rgba(237,57,69,0.16)] sm:h-52 sm:w-52"><Globe2 size={43} strokeWidth={1.2} className="mb-3 text-red-400" /><span className="text-xl font-bold">ETHIX<span className="text-red-500">WEB</span></span><span className="mt-2 text-[10px] uppercase tracking-[0.24em] text-white/40">Think. Build. Grow.</span></div>
            <div className="absolute right-0 top-[18%] rounded-xl border border-white/10 bg-[#1b1114] p-3 shadow-2xl sm:p-4"><Sparkles size={19} className="text-red-400" /><p className="mt-2 text-xs font-medium">Built for growth</p></div>
            <div className="absolute bottom-[12%] left-0 rounded-xl border border-white/10 bg-[#1b1114] p-3 shadow-2xl sm:p-4"><TrendingUp size={19} className="text-red-400" /><p className="mt-2 text-xs font-medium">Made to perform</p></div>
          </motion.div>
        </div>
        <div className="border-y border-white/[0.07]"><div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-5 text-[10px] uppercase tracking-[0.16em] text-white/40 sm:px-8 sm:text-xs lg:px-14"><span>Strategy meets creativity</span><span className="hidden text-red-500 sm:inline">✳</span><span>Technology meets business</span><span className="hidden text-red-500 sm:inline">✳</span><span>Built for what comes next</span></div></div>
      </section>

      <section id="services" className="mx-auto max-w-[1400px] scroll-mt-20 px-5 py-20 sm:px-8 md:py-28 lg:px-14">
        <SectionLabel>Robust solutions</SectionLabel>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">The systems that grow the pipeline.</h2><p className="max-w-md text-sm leading-7 text-white/50 sm:text-base">A connected set of digital capabilities, designed around your customers, your team, and the next stage of growth.</p></div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{robustSolutions.map((service, index) => { const Icon = service.icon; return <motion.article key={service.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.35, delay: (index % 4) * 0.04 }} className="group min-h-[190px] rounded-2xl border border-white/[0.09] bg-[#160d0f]/90 p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500/35 hover:bg-[#1b0d10] sm:p-6"><Icon size={20} strokeWidth={1.5} className="text-red-500 transition group-hover:scale-110" /><h3 className="mt-5 text-base font-semibold">{service.title}</h3><p className="mt-3 text-xs leading-5 text-white/50">{service.description}</p></motion.article>; })}</div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#130b0d]">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28 lg:px-14">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><SectionLabel>Full service catalog</SectionLabel><h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">22 services, one accountable team.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-white/50">From website builds to AI receptionists, campaigns, reporting, accessibility, and ongoing support — every capability run, grouped by category.</p></div><button onClick={() => setShowAllServices((value) => !value)} className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-semibold transition hover:border-red-500/40 hover:text-red-300 md:self-end">{showAllServices ? "Hide service list" : "See all services"} <ArrowUpRight size={15} /></button></div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{catalog.map((category) => { const Icon = category.icon; const active = activeCategory === category.title; return <button key={category.title} onClick={() => setActiveCategory(active ? "" : category.title)} className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition sm:p-6 ${active ? "border-red-500/40 bg-[#211013]" : "border-white/[0.09] bg-[#180d10] hover:border-red-500/30"}`}><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-800 text-white"><Icon size={19} /></span><h3 className="font-semibold">{category.title}</h3><span className="ml-auto rounded-full border border-white/10 px-2.5 py-1 text-[9px] text-white/55">{category.count}</span></div><p className="mt-4 min-h-[40px] text-xs leading-5 text-white/50">{category.description}</p><div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-4 text-[11px] font-medium text-red-400">{active ? "Hide services" : "See services"}<ArrowUpRight size={14} /></div>{active && <ul className="mt-4 space-y-2 text-xs text-white/65">{category.services.map((service) => <li key={service} className="flex items-start gap-2"><Check size={13} className="mt-0.5 shrink-0 text-red-400" />{service}</li>)}</ul>}<div className="pointer-events-none absolute -bottom-10 -right-8 opacity-[0.06]"><Icon size={110} strokeWidth={1} /></div></button>; })}</div>
          {showAllServices && <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#10090b] p-5 sm:p-7"><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{catalog.map((category) => <div key={category.title}><h3 className="font-semibold text-white">{category.title}</h3><ul className="mt-3 space-y-2">{category.services.map((service) => <li key={service} className="flex gap-2 text-xs leading-5 text-white/50"><ArrowRight size={13} className="mt-0.5 shrink-0 text-red-400" />{service}</li>)}</ul></div>)}</div><p className="mt-6 text-[10px] leading-5 text-white/30">Service counts and categories are part of this assessment concept and can be aligned to the final verified offering.</p></div>}
        </div>
      </section>

      <section id="work" className="scroll-mt-20 border-b border-white/[0.07] bg-[#10090b]"><div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28 lg:px-14"><SectionLabel>Selected work</SectionLabel><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Ideas into impact.<br /><span className="text-white/40">Built with purpose.</span></h2><p className="max-w-md text-sm leading-7 text-white/50 sm:text-base">Every business has a different challenge. We bring strategy, design, and technology together to solve the right one.</p></div><div className="mt-12 grid gap-5 md:grid-cols-2"><ProjectCard /><ProjectCard marketing /></div><p className="mt-6 text-xs text-white/35">Illustrative concept work created for this assessment, not client case studies.</p></div></section>

      <section id="about" className="scroll-mt-20 border-b border-white/[0.07] bg-[#160d0f]"><div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-14"><div><SectionLabel>Our perspective</SectionLabel><h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">Indian ambition.<br /><span className="text-red-400">Global standards.</span></h2><p className="mt-7 max-w-xl text-base leading-8 text-white/55">India's business landscape is moving fast. Customers expect better experiences, stronger brands, and effortless digital journeys. We help businesses meet those expectations with thoughtful design, dependable technology, and measurable strategy.</p><p className="mt-4 max-w-xl text-base leading-8 text-white/55">From mobile-first experiences to discoverability and practical automation, we focus on digital work that fits real business needs — without unnecessary complexity.</p><a href="#contact" className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-red-400 transition hover:text-red-300">Let's build something meaningful <ArrowRight size={17} /></a></div><div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#10090b] p-7 sm:p-10"><div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-red-600/10 blur-3xl" /><div className="relative"><span className="text-xs uppercase tracking-[0.2em] text-red-400">Our principles</span><div className="mt-7">{[["Clarity over complexity", "Every decision has a purpose."], ["People before pixels", "Great digital work starts with people."], ["Progress over promises", "Focus on outcomes, not empty claims."], ["Partnership over projects", "Build relationships that grow with you."]].map(([title, description], index) => <div key={title} className="flex gap-4 border-b border-white/[0.08] py-5 last:border-0"><span className="pt-1 text-xs text-red-400">0{index + 1}</span><div><h3 className="font-medium">{title}</h3><p className="mt-1 text-sm text-white/45">{description}</p></div></div>)}</div></div></div></div></section>

      <section id="why-us" className="mx-auto max-w-[1400px] scroll-mt-20 px-5 py-20 sm:px-8 md:py-28 lg:px-14"><SectionLabel>Why Ethixweb</SectionLabel><div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20"><div><h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">Not just another<br /><span className="text-red-400">digital agency.</span></h2><p className="mt-6 max-w-lg text-base leading-8 text-white/50">Your business deserves more than a collection of deliverables. It deserves a digital partner who understands your goals, respects your resources, and cares about the details.</p><a href="#contact" className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm font-medium transition hover:border-red-400/50 hover:text-red-400">Tell us your goals <ArrowUpRight size={17} /></a></div><div className="grid gap-3 sm:grid-cols-2">{principles.map(([number, title, description]) => <article key={number} className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-6 transition hover:border-red-500/30"><span className="text-xs font-medium text-red-400">{number}</span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-white/45">{description}</p></article>)}</div></div></section>

      <section id="process" className="scroll-mt-20 border-y border-white/[0.07] bg-[#130b0d]"><div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28 lg:px-14"><SectionLabel>How we work</SectionLabel><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">A better process.<br /><span className="text-white/40">A stronger outcome.</span></h2><p className="max-w-sm text-sm leading-7 text-white/50">Good work doesn't happen by accident. Here's how we move from your first conversation to continuous improvement.</p></div><div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([number, title, description]) => <article key={number} className="border-t border-white/15 pt-6"><span className="text-sm font-medium text-red-400">{number}</span><h3 className="mt-6 text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-white/50">{description}</p></article>)}</div></div></section>

      <section id="contact" className="mx-auto grid max-w-[1400px] scroll-mt-20 gap-10 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[.8fr_1.2fr] lg:gap-16 lg:px-14"><div className="pt-4"><SectionLabel>Your next chapter</SectionLabel><h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl lg:text-6xl">Have a big idea?<br /><span className="text-red-400">Let's make it happen.</span></h2><p className="mt-6 max-w-xl text-base leading-8 text-white/55">Tell us where you want to go. We'll help you figure out the digital steps to get there.</p><div className="mt-9 space-y-4 text-sm text-white/60"><p className="flex items-center gap-3"><Check size={17} className="text-red-400" />Tell us about your business</p><p className="flex items-center gap-3"><Check size={17} className="text-red-400" />Choose the service you need</p><p className="flex items-center gap-3"><Check size={17} className="text-red-400" />Your enquiry goes to our database</p></div></div><ContactForm /></section>

      <footer className="border-t border-white/[0.08] bg-[#160d0f]"><div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center lg:px-14"><div><a href="#home" className="text-lg font-bold tracking-tight">ETHIX<span className="text-red-500">WEB</span></a><p className="mt-2 text-xs text-white/40">Digital experiences. Meaningful growth.</p></div><div className="flex flex-wrap gap-5 text-sm text-white/50">{navigation.map(([label, href]) => <a key={href} href={href} className="hover:text-white">{label}</a>)}<a href="#contact" className="hover:text-white">Contact</a></div><p className="text-xs text-white/35">© {new Date().getFullYear()} Ethixweb. All rights reserved.</p></div></footer>
    </main>
  );
}

export default App;
