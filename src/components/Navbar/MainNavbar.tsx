import { BiSearch } from "react-icons/bi";
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
// @ts-ignore
import "@fontsource/lobster";

const MainNavbar = () => {
  return (
    <nav className="flex items-center justify-between px-12 py-4 shadow-xl sticky top-0 bg-white z-50">
      {/* logo */}
      <div className="h-10 flex items-center">
        {/*<img className="w-auto h-full" src="/image/logo.png" alt="logo" />*/}
        <Link to="/">
          <h1
            style={{
              fontFamily: "'Lobster', cursive",
              fontSize: "3rem",
              color: "black",
            }}
            className="text-2xl"
          >
            ShoeStore
          </h1>
        </Link>
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
      </div>

      <ul className="flex gap-2">
        {/* Giỏ hàng */}
        <li>
          <Link to="/cart" className="relative">
            <AiOutlineShoppingCart className="text-2xl text-gray-700 hover:text-blue-600 transition" />
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
