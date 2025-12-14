import { Link } from 'react-router-dom';

export default function Navbar(){
  const user = JSON.parse(localStorage.getItem('ihub_user') || 'null');

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-500 text-white flex items-center justify-center font-bold shadow-lg">
            IH
          </div>
          <div>
            <div className="text-lg font-bold gradient-text">I-Hub</div>
            <div className="text-xs text-gray-500">Campus Marketplace</div>
          </div>
        </Link>

        <nav className="ml-8 flex gap-6 text-sm font-medium">
          <Link to="/listings" className="hover:text-teal-600">Browse</Link>
          <Link to="/dashboard" className="hover:text-teal-600">Dashboard</Link>
          <Link to="/admin" className="hover:text-teal-600">Admin</Link>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <div className="text-sm">
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-gray-500">{user.department}</div>
              </div>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                className="btn-outline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
