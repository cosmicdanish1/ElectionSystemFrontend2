import React, { useState, useEffect } from 'react';
// import { NavbarMain } from '../components/layout/NavbarMain';
import { ContainerTextFlip } from '../components/ui/container-text-flip';
import { TimelineMain } from '../components/layout/TimelineMain';
import Footer from '../components/layout/Footer';
import { BackgroundBeams } from '../components/ui/background-beams';
import { ThreeDCardDemo } from '../components/layout/ThreeDCardDemo';
import LoadingScreen from '../components/common/LoadingScreen';



const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the loader has already been shown in this session
    const hasLoaded = sessionStorage.getItem('hasLoaded');

    if (hasLoaded) {
      setLoading(false);
    } else {
      // If not, show the loader and set the flag in sessionStorage
      sessionStorage.setItem('hasLoaded', 'true');
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000); // Display loader for 3 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {loading && <LoadingScreen />}
      <div className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-white text-gray-800">
          {/* Hero Section */}
          <div className="flex items-center justify-center min-h-screen text-center p-10">
            <div>
              {/* <NavbarMain /> */}
              <h1 className="text-6xl font-extrabold">
                <span className="text-black">
                  The Ultimate Platform for
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mr-2">
                  Secure
                </span>
                &
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent ml-2">
                  Transparent
                </span> <ContainerTextFlip/>
              </h1>
            </div>
          </div>
          <ThreeDCardDemo/>
          <TimelineMain/>
          {/* Placeholder Section 3 */}
          <div className="py-20 px-10">
            <div className="max-w-4xl mx-auto text-center">
              <p>
              
              </p>
            </div>
          </div>
          <BackgroundBeams/>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomePage;
