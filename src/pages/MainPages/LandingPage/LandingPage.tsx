import CustomSwipper from "../../../components/Custom/CustomSwipper";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center">
      <CustomSwipper
        images={[
          {
            url: "https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc.jpg?alt=media&token=30fda9a4-0580-4f0a-8804-90bc66c92946",
          },
          {
            url: "https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc%20(1).jpg?alt=media&token=8d01ac71-bcf4-4a81-8a03-2e41dba04e6e",
          },
        ]}
        height={500}
        width="w-full"
        autoPlay={true}
        interval={3000}
        showPagination={true}
        showNavigation={true}
      />
      {/* event box */}
      {/*<div className="flex flex-col items-center justify-center w-full p-10 relative">
        <div className="flex justify-center gap-5 flex absolute">
          <img
            src="https://lh3.googleusercontent.com/uw9Ld5snWK_fdXmhM4i_e8Uonzeo25tFpyWCCHk4g9pF-BY0SAsxGZ6phCPE04pdAF5QS-GoaqTW_a78hvOAQURFqZIi7OGN=w308-rw"
            alt="event"
            className=" object-cover rounded-lg"
          />
          <img
            src="https://lh3.googleusercontent.com/-KyPHoUjMjLPF_RJN3sse0JHpDAsHuV06pUit4UwQFo7B6uyF8FVzT1vI273GjL6unD5pTARUFLpeC-4ooUTSFHWTbKmjNY=w308-rw"
            alt="event"
            className=" object-cover rounded-lg"
          />
          <img
            src="https://lh3.googleusercontent.com/s0Q6ru7op5eVKrQX6LCwz470sdzy77VnUqkkIL0OHDDieiz4U10uUXv6B8sbU0zDdHPNelNPYJUKR6c9VLTq8mkAGu9JsgQf=w308-rw"
            alt="event"
            className=" object-cover rounded-lg"
          />
          <img
            src="https://lh3.googleusercontent.com/M50KpWhdJpPB0IWs-a11u0QXOWusR_SrzZYMDZsqCpxNZF0OVFC5FU0QFpzY2-U_ZIYRlX2TNTBwW9dnizMKnrE_SBAyoo_Q=w308-rw"
            alt="event"
            className=" object-cover rounded-lg"
          />
        </div>
      </div>*/}
      {/* items */}
      <div className="flex flex-col items-center justify-center w-full p-10 mt-10">
        <h1 className="text-2xl ">SẢN PHẨM BÁN CHẠY</h1>
        <div className="w-full mt-5 flex justify-center gap-10">
          {/* Sản phẩm 1 */}
          <div
            className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition w-80"
            onClick={() => navigate("/product-detail")}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc%20(2).jpg?alt=media&token=79e7a687-b564-45c2-830e-58a4255de418"
              alt="product-1"
              className="w-full h-60 object-cover rounded-lg"
            />
            <h1
              className="text-xs mt-2 truncate"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Giày Sandal Nam 7081 - Sandal Nam Quai Ngang Chéo Phối Lót Dán
              Thời Trang, Sandal Nam Công Sở Năng Động, Trẻ Trung.
            </h1>
            <p className="text-xl font-bold text-center mt-2">1.000.000 đ</p>
            {/* Màu sắc */}
            <div className="flex justify-center items-center mt-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: "black" }}
              ></div>
              <div
                className="w-6 h-6 rounded-full ml-2 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(to right, #000000 50%, #D9D9D9 50%)",
                }}
              ></div>
            </div>
          </div>

          {/* Sản phẩm 2 */}
          <div
            className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition w-80"
            onClick={() => navigate("/product-detail-2")}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc%20(3).jpg?alt=media&token=caff3f3a-345f-432b-924f-d167d0a87cc3"
              alt="product-2"
              className="w-full h-60 object-cover rounded-lg"
            />
            <h1
              className="text-xs mt-2 truncate"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Giày Sneaker Nam 1234 - Sneaker Nam Thời Trang, Năng Động, Trẻ
              Trung.
            </h1>
            <p className="text-xl font-bold text-center mt-2">1.200.000 đ</p>
            {/* Màu sắc */}
            <div className="flex justify-center items-center mt-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: "#EED6B2" }}
              ></div>
              <div
                className="w-6 h-6 rounded-full ml-2 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(to right, #FFDAA3 50%, #000000 50%)",
                }}
              ></div>
            </div>
          </div>
          {/* Sản phẩm 3 */}
          <div
            className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition w-80"
            onClick={() => navigate("/product-detail-3")}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc%20(4).jpg?alt=media&token=e922507e-038b-41b0-82f9-77e5097642f9"
              alt="product-3"
              className="w-full h-60 object-cover rounded-lg"
            />
            <h1
              className="text-xs mt-2 truncate"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Giày Thể Thao Nam 5678 - Thời Trang, Năng Động, Phong Cách.
            </h1>
            <p className="text-xl font-bold text-center mt-2">1.500.000 đ</p>
            {/* Màu sắc */}
            <div className="flex justify-center items-center mt-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: "#000000" }}
              ></div>
              <div
                className="w-6 h-6 rounded-full ml-2 relative overflow-hidden"
                style={{ backgroundColor: "#eed6b2" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {/* SẢN PHẨM MỚI */}
      <div className="flex flex-col items-center justify-center w-full p-10 mt-10">
        <h1 className="text-2xl ">SẢN PHẨM MỚI</h1>
        <div className="w-full mt-5 flex justify-center gap-10">
          {/* Sản phẩm 1 */}
          <div
            className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition w-80"
            onClick={() => navigate("/product-detail")}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc%20(2).jpg?alt=media&token=79e7a687-b564-45c2-830e-58a4255de418"
              alt="product-1"
              className="w-full h-60 object-cover rounded-lg"
            />
            <h1
              className="text-xs mt-2 truncate"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Giày Sandal Nam 7081 - Sandal Nam Quai Ngang Chéo Phối Lót Dán
              Thời Trang, Sandal Nam Công Sở Năng Động, Trẻ Trung.
            </h1>
            <p className="text-xl font-bold text-center mt-2">1.000.000 đ</p>
            {/* Màu sắc */}
            <div className="flex justify-center items-center mt-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: "black" }}
              ></div>
              <div
                className="w-6 h-6 rounded-full ml-2 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(to right, #000000 50%, #D9D9D9 50%)",
                }}
              ></div>
            </div>
          </div>

          {/* Sản phẩm 2 */}
          <div
            className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition w-80"
            onClick={() => navigate("/product-detail-5")}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc%20(5).jpg?alt=media&token=c74a106e-a5af-440b-bd99-e4c1d9423306"
              alt="product-2"
              className="w-full h-60 object-cover rounded-lg"
            />
            <h1
              className="text-xs mt-2 truncate"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Giày Thể Thao Nam 7890 - Phong Cách, Thời Trang, Năng Động.
            </h1>
            <p className="text-xl font-bold text-center mt-2">1.300.000 đ</p>
            {/* Màu sắc */}
            <div className="flex justify-center items-center mt-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: "#7c5417" }}
              ></div>
              <div
                className="w-6 h-6 rounded-full ml-2 relative overflow-hidden"
                style={{ backgroundColor: "#000000" }}
              ></div>
            </div>
          </div>

          {/* Sản phẩm 3 */}
          <div
            className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition w-80"
            onClick={() => navigate("/product-detail-6")}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/5772.jpg?alt=media&token=d51720a7-e869-4bcd-9030-2d45754315c7"
              alt="product-3"
              className="w-full h-60 object-cover rounded-lg"
            />
            <h1
              className="text-xs mt-2 truncate"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Giày Lười Nam 5678 - Thoải Mái, Thời Trang, Hiện Đại.
            </h1>
            <p className="text-xl font-bold text-center mt-2">1.100.000 đ</p>
            {/* Màu sắc */}
            <div className="flex justify-center items-center mt-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, #ffffff 50%, #cea25f 50%)",
                }}
              ></div>
              <div
                className="w-6 h-6 rounded-full ml-2 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(to right, #ffffff 50%, #000000 50%)",
                }}
              ></div>
            </div>
          </div>

          {/* Sản phẩm 4 */}
          <div
            className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition w-80"
            onClick={() => navigate("/product-detail-7")}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/5779.jpg?alt=media&token=56db3d67-86f3-4940-829a-34e5016f1525"
              alt="product-4"
              className="w-full h-60 object-cover rounded-lg"
            />
            <h1
              className="text-xs mt-2 truncate"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Giày Cao Cổ Nam 3456 - Phong Cách, Cá Tính, Thời Trang.
            </h1>
            <p className="text-xl font-bold text-center mt-2">1.400.000 đ</p>
            {/* Màu sắc */}
            <div className="flex justify-center items-center mt-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: "#eed6b2" }}
              ></div>
              <div
                className="w-6 h-6 rounded-full ml-2 relative overflow-hidden"
                style={{ backgroundColor: "#64794b" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
