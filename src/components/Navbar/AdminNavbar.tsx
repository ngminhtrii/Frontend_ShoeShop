import default_avatar from "../../assets/default_avatar.png";
import { IoIosArrowDown } from "react-icons/io";

const AdminNavbar = () => {
  return (
    <div className="w-full bg-[#1E304B] h-16 flex justify-between items-center sticky top-0 text-white px-6 shadow-md z-10">
      <div className="flex items-center gap-4">
        {/* <BiMenu className="rounded-full bg-purple-500 h-10 w-10 p-2 hover:bg-purple-400 cursor-pointer transition-all duration-300" onClick={toggleSidebar}/> */}
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-300">
          <img src="/image/logo.png" alt="logo" className="h-12" />
            <p className="text-xl font-bold hidden md:block">TECH GROUP</p>
        </div>
      </div>
      <div className="h-12 flex items-center gap-3 hover:bg-gray-600 cursor-pointer p-2 pr-4 rounded-full transition-all duration-300">
        <img src={default_avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" />
        <p className="text-lg font-semibold">Kolas</p>
        <IoIosArrowDown className="text-2xl transition-transform duration-300 hover:rotate-180" />
      </div>
    </div>
  );
};

export default AdminNavbar;