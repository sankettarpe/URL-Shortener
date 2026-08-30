import React from 'react'

const Contact = () => {
  const handleSend = (e) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you soon.");
  }
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-slate-50 via-white to-slate-100 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Get in touch</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900">Contact the URL Shortener team</h1>
            <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
              Have a question about how to shorten links, manage your dashboard, or build your own custom experience? Send us a message and we’ll get back to you soon.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Support</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">support@urlshortener.app</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Office</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Remote-first, global team</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Response</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Typically within 1 business day</p>
              </div>
            </div>

            <form className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                <input id="name" type="text" placeholder="Your name" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                <input id="email" type="email" placeholder="you@example.com" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
                <textarea id="message" rows="5" placeholder="Tell us how we can help" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"></textarea>
              </div>
              <button onClick={handleSend} type="submit" className="w-full rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Contact
