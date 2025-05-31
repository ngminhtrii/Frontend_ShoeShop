import default_avatar from "../../assets/default_avatar.png";
import { IoIosArrowDown } from "react-icons/io";
// @ts-ignore
import "@fontsource/lobster";

const AdminNavbar = () => {
  return (
    <div className="w-full bg-[#1E304B] h-16 flex justify-between items-center sticky top-0 text-white px-6 shadow-md z-10">
      <div className="flex items-center gap-4">
        {/* <BiMenu className="rounded-full bg-purple-500 h-10 w-10 p-2 hover:bg-purple-400 cursor-pointer transition-all duration-300" onClick={toggleSidebar}/> */}
        <div className="h-10 flex items-center">
          {/*<img className="w-auto h-full" src="/image/logo.png" alt="logo" />*/}
          <h1
            style={{
              fontFamily: "'Lobster', cursive",
              fontSize: "3rem",
              color: "white",
            }} // Tăng kích thước chữ và đổi màu
            className="text-2xl"
          >
            ShoeStore
          </h1>
        </div>
      </div>
      <div className="h-12 flex items-center gap-3 hover:bg-gray-600 cursor-pointer p-2 pr-4 rounded-full transition-all duration-300">
        <img
          src={default_avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        <p className="text-lg font-semibold">Admin</p>
        <IoIosArrowDown className="text-2xl transition-transform duration-300 hover:rotate-180" />
      </div>
    </div>
  );
};

export default AdminNavbar;
