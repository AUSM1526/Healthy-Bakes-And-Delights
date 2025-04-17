import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from "react-icons/hi";

const Third = () => {
  return (
    <footer className="bg-chocolate-light text-gray-800 pt-12">
      {/* Top Section */}
      <div className="px-6 sm:px-12 lg:px-24 pb-10 flex flex-col md:flex-row justify-between gap-12">
        
        {/* Left: Brand Info */}
        <div className="flex-1 max-w-md">
          <h2 className="text-chocolate-dark font-playfair text-2xl font-semibold mb-3">Healthy Bakes & Delights</h2>
          <p className="mb-4 text-chocolate-dark">
            Artisanal treats crafted with organic ingredients for guilt-free indulgence.
          </p>
          <div className="flex gap-4 text-2xl text-chocolate-dark">
            <FaInstagram className="hover:text-chocolate-gold cursor-pointer" />
            <FaFacebookF className="hover:text-chocolate-gold cursor-pointer" />
            <FaTwitter className="hover:text-chocolate-gold cursor-pointer" />
          </div>
        </div>

        {/* Right: Contact Info */}
        <div className="flex-1 max-w-md">
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-chocolate-dark">
            <li className="flex items-start gap-3 ">
              <HiOutlineLocationMarker className="text-chocolate-dark text-xl mt-1" />
              <span>Ahmedabad, Gujarat</span>
            </li>
            <li className="flex items-center gap-3">
              <HiOutlinePhone className="text-chocolate-dark text-xl" />
              <span>+91 1234567890</span>
            </li>
            <li className="flex items-center gap-3">
              <HiOutlineMail className="text-chocolate-dark text-xl" />
              <span>healthybakes@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 py-4 px-6 sm:px-12 lg:px-24 text-center text-sm text-chocolate-dark">
        © {new Date().getFullYear()} Healthy Bakes & Delights. All rights reserved.
      </div>
    </footer>
  );
};

export default Third;
