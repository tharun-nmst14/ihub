import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Landing() {
  const [activeTab, setActiveTab] = useState('guidance');

  return (
    <div className="relative w-full min-h-screen">

      {/* BACKGROUND IMAGE */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            "url('https://res.cloudinary.com/dkfuo3dcx/image/upload/v1765690442/Ihub-bg_bj8siw.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(231, 245, 244, 0.94)'
          }}
        />
      </div>

      {/* CONTENT */}
      <div style={{ paddingTop: '120px' }} className="flex flex-col items-center">

        {/* HERO */}
        <div className="max-w-6xl mx-auto px-6 fade-in text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Buy & Sell <span className="text-teal-500">Campus Essentials</span>
          </h1>

          <p className="mt-5 text-lg text-gray-700 max-w-2xl mx-auto">
            A trusted student marketplace to exchange books, lab kits, and
            daily essentials — affordable, verified, and simple.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap" style={{margin:50}}>
            <Link to="/listings" className="btn btn-info">
              Explore Items
            </Link>
            <Link to="/register" className="btn btn-warning text-gray-900">
              Join Now
            </Link>
          </div>
        </div>

        {/* TOGGLE BUTTONS */}
        <div className="mt-16 flex gap-4 fade-in" style={{}} >
          <button style={{}}
            onClick={() => setActiveTab('guidance')}
            className={`btn ${activeTab === 'guidance' ? 'btn-primary' : 'btn-outline'}`}
          >
            Guidance
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-outline'}`}
          >
            Admin Controls
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`btn ${activeTab === 'terms' ? 'btn-primary' : 'btn-outline'}`}
          >
            Terms & Conditions
          </button>  

           <Link to="/suggestions" className="hover:underline btn btn-info">
  Feedback
</Link>

        </div>

        {/* CONTENT AREA */}
        <div className="max-w-4xl  mt-8 px-6 fade-in" style={{marginTop:50}}>
          <div className="card space-y-4 text-gray-700">

            {activeTab === 'guidance' && (
              <>
                <h2 className="text-xl font-bold gradient-text">How to Use I-Hub</h2>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Browse items without login</li>
                  <li>Sign up using college email</li>
                  <li>Wait for admin verification</li>
                  <li>Login and post items with images</li>
                  <li>Chat securely with buyers/sellers</li>
                  <li>Mark items as sold or remove them</li>
                  <li>Logout after use</li>
                </ul>
              </>
            )}

            {activeTab === 'admin' && (
              <>
                <h2 className="text-xl font-bold gradient-text">Admin Controls</h2>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Verify student accounts</li>
                  <li>Remove inappropriate listings</li>
                  <li>View sold items history</li>
                  <li>Maintain platform integrity</li>
                  <li>No involvement in transactions</li>
                </ul>
              </>
            )}

            {activeTab === 'terms' && (
              <>
                <h2 className="text-xl font-bold gradient-text">Terms & Conditions</h2>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Platform is for students only</li>
                  <li>Item quality is seller’s responsibility</li>
                  <li>No illegal or prohibited items</li>
                  <li>Admin may remove content if required</li>
                  <li>Data used only for platform operations</li>
                </ul>
              </>
            )}

          </div>
        </div>

      


      </div>
    </div>
  );
}
