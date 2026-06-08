import { assets } from './../assets/assets';
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative w-full bg-[#f4f4f4] overflow-hidden min-h-[500px] sm:min-h-[600px] flex items-center mb-16 px-4 sm:px-10 lg:px-20">
      {/* Decorative Background Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-10 select-none pointer-events-none opacity-[0.03] whitespace-nowrap hidden lg:block">
        <h2 className="text-[25rem] font-bold tracking-tighter italic">FOREVER</h2>
      </div>

      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-0">
        
        {/* Left Content Side */}
        <div className="w-full lg:w-1/2 z-10 animate-fadeIn">
          <div className="bg-white/80 backdrop-blur-sm p-8 sm:p-12 lg:p-16 lg:-mr-20 relative shadow-xl lg:shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[2px] w-10 bg-black"></span>
              <p className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-gray-500">
                Premium Essentials
              </p>
            </div>

            <h1 className="prata-regular text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] text-black mb-8">
              Timeless <br /> 
              <span className="text-gray-400">Elegance</span>
            </h1>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-10 max-w-sm">
              Explore our curated selection of high-quality fashion that transcends trends and celebrates your unique style.
            </p>

            <Link 
              to="/collection" 
              className="group inline-flex items-center justify-center bg-black text-white px-10 py-5 text-sm font-bold tracking-widest transition-all hover:bg-gray-800 active:scale-95"
            >
              DISCOVER NOW
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Image Side */}
        <div className="w-full lg:w-1/2 relative h-[400px] sm:h-[500px] lg:h-[700px]">
          <div className="absolute inset-0 bg-gray-200 translate-x-4 translate-y-4 -z-10"></div>
          <img
            src={assets.hero_img}
            alt="Editorial Fashion"
            className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 shadow-2xl"
            fetchpriority="high"
            loading="eager"
          />
          {/* Subtle Decorative element on image */}
          <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md px-4 py-2 text-[10px] tracking-widest text-white uppercase font-bold border border-white/20">
            Est. 2024 • Collection
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
