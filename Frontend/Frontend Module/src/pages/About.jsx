import React from 'react'

const About = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <section className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">About URL Shortener</p>
            <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900">Fast links for modern teams.</h1>
            <p className="max-w-2xl text-lg text-slate-600 leading-8">
              Our URL Shortener app makes it easy to create memorable, shareable links in seconds. Built for teams who need cleaner links, real-time analytics, and secure access controls — all with a polished, responsive interface.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Built for speed</p>
                <p className="mt-3 text-slate-700">Create short links instantly and share them across apps with a smooth workflow and modern UI.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Secure access</p>
                <p className="mt-3 text-slate-700">Login-protected dashboards keep your shortened links and analytics safe and easy to manage.</p>
              </div>
            </div>
          </section>

          <section className="rounded-4xl border border-slate-200 bg-linear-to-br from-indigo-600 to-violet-500 p-10 text-white shadow-2xl">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Why it matters</p>
              <h2 className="text-3xl font-semibold">A polished experience for every link.</h2>
              <p className="text-slate-100 leading-7">
                Short URLs should be more than a utility. They should feel confident, brand-safe, and easy for your team to use. That’s why this app pairs clean design with intuitive controls and a clear dashboard experience.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-200">Track clicks</p>
                  <p className="mt-2 text-slate-100">See which links are performing, right from your dashboard.</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-200">Stay organized</p>
                  <p className="mt-2 text-slate-100">Manage your links and account from one centralized, user-friendly app.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default About
