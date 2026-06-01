import { assets } from "../assets/assets";
import { FiPhone, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="mt-40 border-t border-accent/10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 py-20 text-sm">
        <div>
          <p className="text-earth-gray font-bold text-2xl tracking-tighter uppercase mb-6">
            ELITE WEAR<span className="text-accent">.</span>
          </p>
          <p className="w-full md:w-2/3 text-earth-gray/60 leading-relaxed">
            Curating timeless pieces for the modern individual. ELITE WEAR brings together everyday essentials and standout styles so
            you can shop confidently for every occasion.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-accent mb-8 uppercase">COMPANY</p>
          <ul className="flex flex-col gap-3 text-earth-gray/70">
            <li>
              <Link className="hover:text-accent transition-colors" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent transition-colors" to="/about">
                About us
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent transition-colors" to="/delivery">
                Delivery
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent transition-colors" to="/contact">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-accent mb-8 uppercase">GET IN TOUCH</p>
          <ul className="flex flex-col gap-4 text-earth-gray/70">
            <li className="flex items-center gap-3 group">
              <div className="p-2 rounded-full border border-accent/20 group-hover:bg-accent group-hover:text-white transition-all">
                <FiPhone />
              </div>
              <a className="hover:text-accent transition-colors" href="tel:+919348657780">
                +91 93486 57780
              </a>
            </li>
            <li className="flex items-center gap-3 group">
              <div className="p-2 rounded-full border border-accent/20 group-hover:bg-accent group-hover:text-white transition-all">
                <FiMail />
              </div>
              <a
                className="hover:text-accent transition-colors"
                href="mailto:abhisekpanigrahy79@gmail.com"
              >
                contact@elitewear.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-accent/5">
        <p className="py-8 text-[10px] tracking-[0.3em] text-center text-earth-gray/40 uppercase font-bold">
          &copy; {new Date().getFullYear()} ELITE WEAR. Designed for Elegance.
        </p>
      </div>
    </div>
  );
};

export default Footer;
