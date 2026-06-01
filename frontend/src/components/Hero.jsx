import { assets } from './../assets/assets';
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-accent/20 bg-white/50 backdrop-blur-sm rounded-sm overflow-hidden">
      {/* Hero left side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-0">
        <div className="text-earth-gray px-6">
          <div className="flex items-center gap-2 mb-4">
            <p className="w-8 md:w-11 h-[1px] bg-accent"></p>
            <p className="font-medium text-xs md:text-sm tracking-[0.3em] text-accent">OUR BESTSELLERS</p>
          </div>

          <h1 className="serif-regular text-4xl sm:py-3 lg:text-6xl leading-tight mb-6">
            Timeless <br /> Elegance
          </h1>

          <Link to="/collection" className="group flex items-center gap-3 w-fit">
            <p className="font-bold text-xs md:text-sm tracking-widest group-hover:text-accent transition-colors">SHOP THE COLLECTION</p>
            <div className="w-8 md:w-12 h-[1px] bg-earth-gray group-hover:bg-accent group-hover:w-16 transition-all duration-500"></div>
          </Link>
        </div>
      </div>


      {/* Hero right side */}
      <div className="w-full sm:w-1/2 overflow-hidden">
        <img src={assets.hero_img} alt="Hero_img" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"/>
      </div>
    </div>
  );
};

export default Hero;
