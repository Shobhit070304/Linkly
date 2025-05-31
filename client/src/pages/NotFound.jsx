import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-100 opacity-20"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-400 animate-pulse"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-8 space-y-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-gray-800 relative">
              <span className="text-blue-500">4</span>
              <span className="text-gray-300">0</span>
              <span className="text-blue-500">4</span>
              <span className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <span className="animate-pulse opacity-20 text-9xl">✖</span>
              </span>
            </h1>
            
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Lost in the Digital Void
            </h2>
            
            <p className="mt-4 text-lg text-gray-600">
              The page you're seeking has vanished into the ether. Perhaps it never existed, or maybe it's just hiding.
            </p>
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-1"
            >
              Go Back
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 text-base font-medium rounded-full shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-1"
            >
              Return Home
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            "Not all those who wander are lost" — but you might be.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;