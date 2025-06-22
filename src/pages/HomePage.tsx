import React from 'react';
import { NavbarMain } from '../components/layout/NavbarMain';
import { ContainerTextFlip } from '../components/ui/container-text-flip';
import { TimelineMain } from '../components/layout/TimelineMain';
import Footer from '../components/layout/Footer';


const HomePage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen text-center p-10">
        <div>
          <NavbarMain />
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
    
         <TimelineMain/>

      {/* Placeholder Section 3 */}
      <div className="py-20 px-10">
        <div className="max-w-4xl mx-auto text-center">
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
