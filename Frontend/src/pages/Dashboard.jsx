import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import QRCodeGenerator from "qrcode";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [url, setUrl] = useState("");
  const [shorturl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const backendBase = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleCopy = () => {
    navigator.clipboard.writeText(shorturl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handleShorten = async () => {
    if (!url) return alert("Please enter a URL");
    if (!user || !user.token) return alert("You must be logged in to shorten URLs.");

    try {
      const res = await axios.post(
        `${backendBase}/api/urls/shorten`,
        { originalUrl: url },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const shortId = res.data.shortUrl;
      const newShortUrl = `${backendBase}/api/urls/${shortId}`;
      setShortUrl(newShortUrl);
      setCopied(false);

      const qrcode = await QRCodeGenerator.toDataURL(res.data.shortUrl);
      setQrImage(qrcode);
    } catch (error) {
      console.error("Error shortening URL", error);
      alert(error?.response?.data?.message || "Unable to shorten the URL. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl rounded-32px bg-white p-8 shadow-2xl ring-1 ring-slate-200">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] bg-linear-to-r from-sky-500 via-indigo-500 to-violet-500 p-8 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-100">Dashboard</p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Create short links in seconds</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-100 sm:text-base">
              Paste any long URL below, then copy and share the generated short link instantly.
            </p>
          </div>
          <div className="rounded-24px bg-white/10 px-5 py-4 text-right backdrop-blur-sm sm:text-left">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-200">Logged in as</p>
            <p className="mt-2 text-lg font-semibold text-white">{user?.name || "Guest"}</p>
            <p className="text-sm text-slate-100/90">{user?.email || "No email available"}</p>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <section className="space-y-6 rounded-[28px] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Shorten a URL</h2>
                <p className="mt-2 text-sm text-slate-600">Enter a valid web address and press the button to generate a protected short link.</p>
              </div>
              <Link
                to="/history"
                className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View history
              </Link>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Long URL</label>
              <input
                type="text"
                placeholder="https://example.com/very/long/url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <button
              onClick={handleShorten}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Shorten URL
            </button>

            {shorturl ? (
              <div className="space-y-5 rounded-24px border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Your short link</p>
                    <a href={shorturl} target="_blank" rel="noreferrer" className="break-all text-lg font-semibold text-sky-600 hover:text-sky-700">
                      {shorturl}
                    </a>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`rounded-3xl px-5 py-3 text-sm font-semibold text-white transition ${copied ? "bg-emerald-600" : "bg-slate-800 hover:bg-slate-900"}`}
                  >
                    {copied ? "Copied" : "Copy link"}
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_0.8fr]">
                  <div className="rounded-3xl bg-slate-50 p-4 text-slate-700">
                    <p className="font-semibold text-slate-900">URL Preview</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Your shortened URL is ready. You can click it to open the target in a new tab.</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 text-slate-700">
                    <p className="font-semibold text-slate-900">QR Code</p>
                    <div className="mt-4 flex items-center justify-center rounded-3xl bg-white p-3 shadow-sm">
                      <QRCodeCanvas value={shorturl} size={160} />
                    </div>
                  </div>
                </div>

                {qrImage && (
                  <a
                    download="qr-code.png"
                    href={qrImage}
                    className="inline-flex w-full items-center justify-center rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Download QR Code
                  </a>
                )}
              </div>
            ) : null}
          </section>

          <aside className="space-y-6 rounded-[28px] border border-slate-200 bg-slate-900 p-8 text-slate-100 shadow-sm">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Quick tips</p>
              <h3 className="mt-3 text-2xl font-semibold">How it works</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The app stores your link and returns a short identifier. Only authenticated users can create short URLs, so make sure you are logged in.
              </p>
            </div>

            <div className="space-y-4 rounded-3xl bg-slate-800/90 p-5">
              <div>
                <p className="font-semibold text-white">Secure endpoint</p>
                <p className="mt-2 text-sm text-slate-400">The shorten route requires a valid bearer token from login.</p>
              </div>
              <div>
                <p className="font-semibold text-white">Copy fast</p>
                <p className="mt-2 text-sm text-slate-400">Use the copy button to save the generated short URL to your clipboard.</p>
              </div>
              <div>
                <p className="font-semibold text-white">Share quickly</p>
                <p className="mt-2 text-sm text-slate-400">Download the QR code and share it on mobile or print it for easy access.</p>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
