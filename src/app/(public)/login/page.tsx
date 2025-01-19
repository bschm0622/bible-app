"use client"

import { useState } from 'react'
import { login, emailPasswordLogin } from '../actions'
import Link from 'next/link'

export default function LoginPage() {
  const [useMagicLink, setUseMagicLink] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (useMagicLink) {
      login(email)
    } else {
      emailPasswordLogin(email, password)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12">
      <div className="card w-full max-w-md shadow-xl bg-base-100 rounded-xl p-8">
        <div className="card-body">
          {/* Centered Homepage Link */}
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center text-xl font-bold text-primary">
              <img
                src="/logo.png"
                alt="Page Pacer Logo"
                className="h-8 w-8 mr-2"
              />
              Page Pacer
            </Link>
          </div>

          <h1 className="text-3xl font-extrabold text-center mb-6">
            Welcome Back!
          </h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text text-lg">Email</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="input input-bordered w-full rounded-lg py-3 px-6 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {!useMagicLink && (
              <div className="form-control">
                <label htmlFor="password" className="label">
                  <span className="label-text text-lg">Password</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="input input-bordered w-full rounded-lg py-3 px-6 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            )}

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full py-3">
                {useMagicLink ? 'Send Magic Link' : 'Log In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary">
                Sign up
              </Link>
            </p>
            <div className="mt-4">
              <button
                onClick={() => setUseMagicLink(!useMagicLink)}
                className="text-sm text-primary hover:underline"
              >
                {useMagicLink ? 'Log in with Email and Password' : 'Log in with Magic Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
