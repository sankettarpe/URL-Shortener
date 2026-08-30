import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import { FaSearch } from "react-icons/fa";

const History = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const backendBase = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchHistory = async () => {
    if (!user?.token) return;
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${backendBase}/api/urls/myurls`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Include the token in the Authorization header for authentication
        },
      });
      setHistory(response.data);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Unable to load your link history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const filteredHistory = history.filter((item) => {
    const shortCode = item.shortUrl.toLowerCase();
    const fullShortLink = `${backendBase}/api/urls/${item.shortUrl}`.toLowerCase();
    return (
      shortCode.includes(searchTerm.toLowerCase()) || fullShortLink.includes(searchTerm.toLowerCase())
    );
  });

  const copyLink = async (link) => {
    await navigator.clipboard.writeText(link);
  };

  const handleDelete = async (linkId) => {
    if (!window.confirm("Delete this short link from your history? This cannot be undone.")) {
      return;
    }
    if (!user?.token) return;

    setDeletingId(linkId);
    setError("");
    setSuccess("");

    try { 
      await axios.delete(`${backendBase}/api/urls/${linkId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setHistory((prev) => prev.filter((item) => item._id !== linkId));
      setSuccess("Short link removed from your history.");
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || "Unable to delete this link.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-6xl rounded-32px bg-white p-8 shadow-2xl ring-1 ring-slate-200">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] bg-linear-to-r from-violet-600 via-sky-500 to-cyan-500 p-8 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-100">History</p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Your shortened links</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-100 sm:text-base">
              Search and manage your personal short links from one place. Original destinations are hidden for a cleaner history view.
            </p>
          </div>
          <div className="rounded-24px bg-white/10 px-5 py-4 text-right backdrop-blur-sm sm:text-left">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-200">Logged in as</p>
            <p className="mt-2 text-lg font-semibold text-white">{user?.name || "Guest"}</p>
            <p className="text-sm text-slate-100/90">{user?.email || "No email available"}</p>
          </div>
        </header>

        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by short link or code"
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl"><FaSearch /></span>
          </div>
          <button
            onClick={fetchHistory}
            className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Refresh history
          </button>
        </div>

        {success && (
          <div className="mb-4 rounded-3xl bg-emerald-50 p-5 text-sm text-emerald-700">{success}</div>
        )}
        {error && (
          <div className="mb-4 rounded-3xl bg-rose-50 p-5 text-sm text-rose-700">{error}</div>
        )}

        {loading ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-600"><Loader/></div>
        ) : error ? (
          <div className="rounded-3xl bg-rose-50 p-8 text-center text-rose-700">{error}</div>
        ) : filteredHistory.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-600">
            {history.length === 0 ? "You have not shortened any links yet." : "No links match your search."}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => {
              const shortLink = `${backendBase}/api/urls/${item.shortUrl}`;
              return (
                <div key={item._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Short URL</p>
                      <a href={shortLink} target="_blank" rel="noreferrer" className="mt-2 block break-all text-lg font-semibold text-sky-600 hover:text-sky-700">
                        {shortLink}
                      </a>
                      <p className="mt-2 text-sm text-slate-500">Destination hidden for a clean history view.</p>
                    </div>
                    <div className="grid gap-3 text-right sm:text-left sm:grid-cols-[auto_auto]">
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Clicks</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{item.clicks}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Created</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => copyLink(shortLink)}
                      className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Copy short link
                    </button>
                    <a
                      href={shortLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      Open short URL
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === item._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
