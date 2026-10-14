
import { useEffect, useState } from "react";
import { LogOut, RefreshCw, ShieldCheck, Inbox, AlertCircle } from "lucide-react";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const STATUSES = ["new", "contacted", "qualified", "closed"];

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("ethixweb_admin_token") || "");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const text = await response.text();
    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`API returned HTML instead of JSON (${response.status}). Check the API URL and route.`);
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("ethixweb_admin_token");
        setToken("");
      }
      throw new Error(data.message || `Request failed (${response.status})`);
    }

    return data;
  }

  async function login(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const response = await request("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (!response.token) throw new Error("Login response did not contain a token.");

      sessionStorage.setItem("ethixweb_admin_token", response.token);
      setToken(response.token);
      setPassword("");
      setNotice("Logged in successfully.");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function loadLeads() {
    setError("");
    setLoading(true);

    try {
      const data = await request("/api/admin/leads");
      setLeads(Array.isArray(data) ? data : data.leads || []);
    } catch (err) {
      setError(err.message || "Could not load enquiries.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    setError("");
    setNotice("");

    try {
      await request(`/api/admin/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setLeads((current) =>
        current.map((lead) => (lead._id === id ? { ...lead, status } : lead))
      );
      setNotice("Enquiry status updated.");
    } catch (err) {
      setError(err.message || "Could not update status.");
    }
  }

  function logout() {
    sessionStorage.removeItem("ethixweb_admin_token");
    setToken("");
    setLeads([]);
    setError("");
    setNotice("");
  }

  useEffect(() => {
    if (token) loadLeads();
  }, [token]);

  return (
    <main className="min-h-screen bg-[#10090b] text-[#f5f0ef]">
      <header className="border-b border-white/10 bg-[#160d0f]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <a href="/" className="text-xl font-bold tracking-tight">
            ETHIX<span className="text-red-500">WEB</span>
            <span className="ml-3 text-sm font-normal text-white/45">Admin</span>
          </a>
          {token && (
            <button onClick={logout} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:border-red-400">
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
        {!token ? (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#160d0f] p-7 sm:p-9">
            <ShieldCheck className="mb-5 text-red-400" size={32} />
            <h1 className="text-3xl font-semibold">Admin sign in</h1>
            <p className="mt-2 text-sm leading-6 text-white/50">Sign in to manage website enquiries.</p>

            <form onSubmit={login} className="mt-7 space-y-5">
              <label className="block text-sm text-white/70">
                Username
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#10090b] px-4 py-3 text-white outline-none focus:border-red-400"
                />
              </label>

              <label className="block text-sm text-white/70">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#10090b] px-4 py-3 text-white outline-none focus:border-red-400"
                />
              </label>

              {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

              <button disabled={loading} className="w-full rounded-full bg-[#ed3945] px-5 py-3.5 font-semibold hover:bg-[#ff4b56] disabled:opacity-60">
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">Dashboard</p>
                <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Enquiries</h1>
                <p className="mt-2 text-sm text-white/50">Review and manage messages submitted through your website.</p>
              </div>
              <button onClick={loadLeads} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-3 text-sm hover:border-red-400 disabled:opacity-60">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#160d0f] p-5">
                <Inbox className="text-red-400" size={22} />
                <p className="mt-4 text-sm text-white/50">Total enquiries loaded</p>
                <p className="mt-1 text-3xl font-semibold">{leads.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#160d0f] p-5">
                <ShieldCheck className="text-red-400" size={22} />
                <p className="mt-4 text-sm text-white/50">New enquiries</p>
                <p className="mt-1 text-3xl font-semibold">{leads.filter((lead) => (lead.status || "new") === "new").length}</p>
              </div>
            </div>

            {error && <p role="alert" className="mt-6 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"><AlertCircle size={18} className="shrink-0" />{error}</p>}
            {notice && <p role="status" className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">{notice}</p>}

            <div className="mt-7 space-y-4">
              {!loading && leads.length === 0 && !error && (
                <div className="rounded-2xl border border-white/10 bg-[#160d0f] p-8 text-center text-white/50">No enquiries found yet.</div>
              )}

              {leads.map((lead) => (
                <article key={lead._id} className="rounded-2xl border border-white/10 bg-[#160d0f] p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <h2 className="text-lg font-semibold">{lead.name || "Unnamed enquiry"}</h2>
                      <p className="mt-1 break-all text-sm text-white/60">{lead.email}</p>
                      {lead.phone && <p className="mt-1 text-sm text-white/50">{lead.phone}</p>}
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs uppercase tracking-wider text-red-400">{lead.service || "General enquiry"}</p>
                      <p className="mt-2 text-xs text-white/40">{lead.createdAt ? new Date(lead.createdAt).toLocaleString() : ""}</p>
                    </div>
                  </div>

                  {lead.company && <p className="mt-4 text-sm text-white/60">Company: {lead.company}</p>}
                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-white/75">{lead.message}</p>

                  <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
                    <label className="text-xs text-white/45" htmlFor={`status-${lead._id}`}>Status</label>
                    <select
                      id={`status-${lead._id}`}
                      value={lead.status || "new"}
                      onChange={(event) => updateStatus(lead._id, event.target.value)}
                      className="rounded-lg border border-white/10 bg-[#10090b] px-3 py-2 text-sm text-white outline-none focus:border-red-400"
                    >
                      {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <a href={`mailto:${lead.email}`} className="sm:ml-auto rounded-full border border-white/15 px-4 py-2 text-center text-sm hover:border-red-400">Reply by email</a>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
