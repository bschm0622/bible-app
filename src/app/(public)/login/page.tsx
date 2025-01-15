import { login, signup } from './actions';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12">
      <div className="card w-full max-w-md shadow-xl bg-base-100 rounded-xl p-8">
        <div className="card-body">
          <h1 className="text-3xl font-extrabold text-center mb-6">
            Welcome Back!
          </h1>
          <form className="space-y-6">
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text text-lg">Email</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="input input-bordered w-full rounded-lg py-3 px-6 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text text-lg">Password</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                className="input input-bordered w-full rounded-lg py-3 px-6 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="form-control mt-6">
              <button
                formAction={login}
                className="btn btn-primary w-full py-3"
              >
                Log In
              </button>
            </div>
            <div className="form-control">
              <button
                formAction={signup}
                className="btn btn-secondary w-full py-3"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
