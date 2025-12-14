import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="relative w-full min-h-screen">

      {/* BACKGROUND IMAGE */}
      <div
        style={{
          position: 'fixed',     // 🔑 ensures full screen
          inset: 0,
          backgroundImage:
            "url('https://res.cloudinary.com/dkfuo3dcx/image/upload/v1765690442/Ihub-bg_bj8siw.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1              // 🔑 pushes behind header & content
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(231, 245, 244, 0.94)'
          }}
        />
      </div>

      {/* CONTENT (PUSHED BELOW HEADER) */}
      <div
        style={{
          minHeight: '100vh',
          paddingTop: '120px' // 🔑 adjust if header height changes
        }}
        className="flex items-center"
      >
        <div className="max-w-6xl mx-auto px-6 text-white fade-in">

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Buy & Sell <br />
            <span className="text-teal-300">
              Campus Essentials
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-200 max-w-xl">
            A trusted student marketplace to exchange books, lab kits,
            and daily essentials — affordable, verified, and simple.
          </p>

          <div className="mt-6 pl-4 border-l-4 border-teal-400">
            <p className="italic text-gray-300">
              “One student’s unused item is another student’s need.”
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/listings" className="btn btn-primary text-base">
              Explore Items
            </Link>

            <Link
              to="/register"
              className="btn btn-warning text-gray-900 text-base"
            >
              Join Now
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
