import { assets } from "../assets/assets";
import { FiPhone, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-10 text-sm">
        <div>
          <img src={assets.logo} alt="logo" className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600">
            Forever brings together everyday essentials and standout styles so
            you can shop confidently for every occasion.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              <Link className="hover:text-black" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-black" to="/about">
                About us
              </Link>
            </li>
            <li>
              <Link className="hover:text-black" to="/delivery">
                Delivery
              </Link>
            </li>
            <li>
              <Link className="hover:text-black" to="/contact">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li className="flex items-center gap-2">
              <FiPhone className="text-gray-500" />
              <a className="hover:text-black" href="tel:+919348657780">
                +919348657780
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-gray-500" />
              <a
                className="hover:text-black"
                href="mailto:abhisekpanigrahy79@gmail.com"
              >
                abhisekpanigrahy79@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center text-gray-500">
          &copy; {new Date().getFullYear()} Forever. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
