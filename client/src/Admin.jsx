
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, LogOut, RefreshCw, ShieldCheck } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#171717] px-4 py-3 text-white outline-none transition focus:border-red-500";
const buttonClass =
  "rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50";

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("ethixweb_admin_token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const logout = useCallback(() => {
    sessionStorage.removeItem("ethixweb_admin_token");
    setToken("");
    setLeads([]);
    setPassword("");
    setError("");
    setMessage("");
  }, []);

  const loadLeads = useCallback(async (authToken) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/leads`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("ethixweb_admin_token");
        setToken("");
        setLeads([]);
        setError("Your session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || "Could not load enquiries.");
      }

      setLeads(Array.isArray(data) ? data : data.leads || []);
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) loadLeads(token);
  }, [token, loadLeads]);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || "Invalid admin credentials.");
      }

      if (!data.token) {
        throw new Error("The server did not return an authentication token.");
      }

      sessionStorage.setItem("ethixweb_admin_token", data.token);
      setToken(data.token);
      setPassword("");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        logout();
        setError("Your session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || "Could not update lead.");
      }

      setLeads((current) =>
        current.map((lead) =>
          String(lead._id) === String(id) ? { ...lead, ...(data.lead || {}), status } : lead
        )
      );
      setMessage("Lead status updated.");
    } catch (err) {
      setError(err.message || "Could not update lead.");
    }
  }

  return (
    <main className="min-h-screen bg-[#0c0c0c] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-600 font-black">
              E
            </span>
            <span className="text-xl font-bold tracking-tight">
              ETHIX<span className="text-red-500">WEB</span>
            </span>
          </a>

          <a href="/" className="flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <ArrowLeft size={16} /> Back to website
          </a>
        </header>

        {!token ? (
          <section className="mx-auto mt-12 max-w-md rounded-3xl border border-white/10 bg-[#121212] p-7 sm:p-9">
            <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-red-500/10 text-red-400">
              <ShieldCheck size={25} />
            </div>
            <h1 className="text-3xl font-bold">Admin login</h1>
            <p className="mt-2 mb-7 text-sm leading-6 text-white/55">
              Sign in to securely manage website enquiries.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block text-sm text-white/70">
                Username
                <input
                  className={`${inputClass} mt-2`}
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </label>

              <label className="block text-sm text-white/70">
                Password
                <input
                  className={`${inputClass} mt-2`}
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>

              {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

              <button className={`${buttonClass} w-full`} disabled={loading}>
                {loading ? "Signing in..." : "Sign in securely"}
              </button>
            </form>
          </section>
        ) : (
          <>
            <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
                  Protected dashboard
                </p>
                <h1 className="text-3xl font-bold sm:text-4xl">Website enquiries</h1>
                <p className="mt-2 text-sm text-white/55">
                  Review incoming leads and track their progress.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => loadLeads(token)}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5"
                >
                  <RefreshCw size={16} /> Refresh
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5"
                >
                  <LogOut size={16} /> Log out
                </button>
              </div>
            </section>

            <section className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["Total leads", leads.length],
                ["New", leads.filter((lead) => lead.status === "new").length],
                ["Contacted", leads.filter((lead) => lead.status === "contacted").length],
                ["Qualified", leads.filter((lead) => lead.status === "qualified").length],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-[#121212] p-5">
                  <p className="text-sm text-white/50">{label}</p>
                  <p className="mt-2 text-3xl font-bold">{value}</p>
                </div>
              ))}
            </section>

            {error && <p role="alert" className="mb-4 text-sm text-red-400">{error}</p>}
            {message && <p role="status" className="mb-4 text-sm text-green-400">{message}</p>}

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#121212]">
              {loading && leads.length === 0 ? (
                <p className="p-8 text-white/60">Loading enquiries...</p>
              ) : leads.length === 0 ? (
                <p className="p-8 text-white/60">No enquiries found yet.</p>
              ) : (
                <div className="divide-y divide-white/10">
                  {leads.map((lead) => (
                    <article key={lead._id} className="p-5 sm:p-6">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row">
                        <div className="min-w-0">
                          <h2 className="break-words text-lg font-semibold">
                            {lead.name || "Unnamed lead"}
                          </h2>
                          <p className="mt-1 break-all text-sm text-red-400">{lead.email}</p>
                          {lead.phone && (
                            <p className="mt-1 text-sm text-white/65">{lead.phone}</p>
                          )}
                          {lead.company && (
                            <p className="mt-1 text-sm text-white/65">{lead.company}</p>
                          )}
                          <p className="mt-3 text-sm text-white/80">
                            Service: {lead.service || "Not specified"}
                          </p>
                          {lead.message && (
                            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-white/55">
                              {lead.message}
                            </p>
                          )}
                          <p className="mt-3 text-xs text-white/35">
                            {lead.createdAt
                              ? new Date(lead.createdAt).toLocaleString("en-IN")
                              : "Date unavailable"}
                          </p>
                        </div>

                        <div className="shrink-0 sm:w-44">
                          <label className="text-xs text-white/45">
                            Lead status
                            <select
                              className={`${inputClass} mt-2`}
                              value={lead.status || "new"}
                              onChange={(event) => updateStatus(lead._id, event.target.value)}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="closed">Closed</option>
                            </select>
                          </label>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
