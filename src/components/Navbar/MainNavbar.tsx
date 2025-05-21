import { BiSearch } from "react-icons/bi";
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai"; // Icon giỏ hàng
import { Link } from "react-router-dom";
// @ts-ignore
import "@fontsource/lobster";

const MainNavbar = () => {
  return (
    <nav className="flex items-center justify-between px-12 py-4 shadow-xl sticky top-0 bg-white z-50">
      {/* logo */}
      <div className="h-10 flex items-center">
        {/*<img className="w-auto h-full" src="/image/logo.png" alt="logo" />*/}
        <h1
          style={{
            fontFamily: "'Lobster', cursive",
            fontSize: "3rem",
            color: "black",
          }} // Tăng kích thước chữ và đổi màu
          className="text-2xl"
        >
          ShoeStore
        </h1>
      </div>
      {/* navigation links */}
      <ul className="flex gap-16">
        <li>
          <Link to="/">SẢN PHẨM MỚI</Link>
        </li>
        <li>
          <Link to="/">SẢN PHẨM BÁN CHẠY</Link>
        </li>
        <li>
          <Link to="/">GIÀY NAM</Link>
        </li>
        <li>
          <Link to="/">GIÀY NỮ</Link>
        </li>
      </ul>
      {/* search bar */}
      <div className="flex items-center w-1/8 relative">
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="border border-gray-300 p-2 px-5 rounded-3xl w-full"
        />
        <BiSearch className="absolute right-2 text-gray-500" />
        {/* search result */}
        {/*<div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md p-2 ">
          <ul>
            <li className="">
              <p>Result 1</p>
            </li>
            <li>Result 2</li>
            <li>Result 3</li>
          </ul>
        </div>*/}
      </div>

      <ul className="flex gap-2">
        {/* Giỏ hàng */}
        <li>
          <Link to="/cart" className="relative">
            <AiOutlineShoppingCart className="text-2xl text-gray-700 hover:text-blue-600 transition" />
            {/*<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              4
            </span>*/}
          </Link>
        </li>

        {/* Infor */}
        <li>
          <Link to="/user-information" className="relative">
            <AiOutlineUser className="text-2xl text-gray-700 hover:text-red-500 transition" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainNavbar;
