import { login, signup } from './actions';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-lg bg-base-100">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center">Welcome!</h1>
          <form className="form-control space-y-4">
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control mt-4">
              <button
                formAction={login}
                className="btn btn-primary w-full"
              >
                Log In
              </button>
            </div>
            <div className="form-control">
              <button
                formAction={signup}
                className="btn btn-secondary w-full"
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
