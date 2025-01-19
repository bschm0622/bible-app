import Link from 'next/link'

export default function CheckYourEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12">
            <div className="card w-full max-w-md shadow-xl bg-base-100 rounded-xl p-8">
                <div className="card-body text-center">
                    <h1 className="text-3xl font-extrabold mb-6">
                        Check Your Email!
                    </h1>
                    <p className="text-lg mb-4">
                        We've sent a magic link to your email address. Click on the link to sign in or sign up.
                    </p>
                    <p className="text-sm text-gray-500">
                        If you didn't receive the email, check your spam folder or try again.
                    </p>
                    <div className="mt-6">
                        <Link href="/login" className="btn btn-primary">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
