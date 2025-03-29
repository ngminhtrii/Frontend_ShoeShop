import LikeProduct from "../../../components/User/LikeProduct";
import Sidebar from "../../../components/User/Sidebar";

const LikePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* <MainNavbar /> */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Nội dung chính */}
        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold text-center mb-6">
            Sản phẩm yêu thích
          </h1>
          <LikeProduct />
        </div>
      </div>
    </div>
  );
};

export default LikePage;
