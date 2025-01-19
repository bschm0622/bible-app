"use client"

import { useState, useEffect } from 'react'
import { signup, emailPasswordSignup } from '../actions'
import Link from 'next/link'

// Password strength criteria
const hasLength = (password: string) => password.length >= 8
const hasUpperCase = (password: string) => /[A-Z]/.test(password)
const hasLowerCase = (password: string) => /[a-z]/.test(password)
const hasNumber = (password: string) => /[0-9]/.test(password)
const hasSpecialChar = (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password)

export default function SignUpPage() {
    const [useMagicLink, setUseMagicLink] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)

    // Calculate password strength
    useEffect(() => {
        if (!password) {
            setPasswordStrength(0)
            return
        }

        let strength = 0
        if (hasLength(password)) strength += 20
        if (hasUpperCase(password)) strength += 20
        if (hasLowerCase(password)) strength += 20
        if (hasNumber(password)) strength += 20
        if (hasSpecialChar(password)) strength += 20

        setPasswordStrength(strength)
    }, [password])

    const getStrengthColor = () => {
        if (passwordStrength <= 20) return 'bg-red-500'
        if (passwordStrength <= 40) return 'bg-orange-500'
        if (passwordStrength <= 60) return 'bg-yellow-500'
        if (passwordStrength <= 80) return 'bg-blue-500'
        return 'bg-green-500'
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            if (useMagicLink) {
                const result = await signup(email)
                if (result?.error) {
                    setError(result.error)
                    setIsLoading(false)
                    return
                }
            } else {
                const result = await emailPasswordSignup(email, password)
                if (result?.error) {
                    setError(result.error)
                    setIsLoading(false)
                    return
                }
            }
        } catch (e) {
            setError('An unexpected error occurred. Please try again.')
            setIsLoading(false)
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
                                src="/logo.png" // Replace with your logo path
                                alt="Page Pacer Logo"
                                className="h-8 w-8 mr-2"
                            />
                            Page Pacer
                        </Link>
                    </div>
                    <h1 className="text-3xl font-extrabold text-center mb-6">
                        Create an Account
                    </h1>
                    
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

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
                                {password && (
                                    <div className="mt-2">
                                        <div className="h-2 w-full bg-gray-200 rounded-full">
                                            <div
                                                className={`h-full rounded-full transition-all ${getStrengthColor()}`}
                                                style={{ width: `${passwordStrength}%` }}
                                            />
                                        </div>
                                        <div className="text-sm mt-1">
                                            {passwordStrength <= 20 && 'Very Weak'}
                                            {passwordStrength > 20 && passwordStrength <= 40 && 'Weak'}
                                            {passwordStrength > 40 && passwordStrength <= 60 && 'Medium'}
                                            {passwordStrength > 60 && passwordStrength <= 80 && 'Strong'}
                                            {passwordStrength > 80 && 'Very Strong'}
                                        </div>
                                        <ul className="text-sm mt-2 space-y-1 text-gray-600">
                                            <li className={hasLength(password) ? 'text-green-600' : ''}>
                                                ✓ At least 8 characters
                                            </li>
                                            <li className={hasUpperCase(password) ? 'text-green-600' : ''}>
                                                ✓ At least one uppercase letter
                                            </li>
                                            <li className={hasLowerCase(password) ? 'text-green-600' : ''}>
                                                ✓ At least one lowercase letter
                                            </li>
                                            <li className={hasNumber(password) ? 'text-green-600' : ''}>
                                                ✓ At least one number
                                            </li>
                                            <li className={hasSpecialChar(password) ? 'text-green-600' : ''}>
                                                ✓ At least one special character
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="form-control mt-6">
                            <button 
                                type="submit" 
                                className="btn btn-primary w-full py-3"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    useMagicLink ? 'Send Magic Link' : 'Sign Up'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary">
                                Log in
                            </Link>
                        </p>
                        <div className="mt-4">
                            <button
                                onClick={() => setUseMagicLink(!useMagicLink)}
                                className="text-sm text-primary hover:underline"
                            >
                                {useMagicLink ? 'Sign up with Email and Password' : 'Sign up with Magic Link'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
