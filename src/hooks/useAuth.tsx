import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { authenticateApi } from "../services/AuthenticationService";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  avatar?: {
    url: string;
    public_id: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: any) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra token trong localStorage khi khởi tạo
    const initAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        console.log(
          "Initializing auth - Token:",
          !!token,
          "User data:",
          !!userData
        );

        if (token && userData && token !== "null" && userData !== "null") {
          try {
            const parsedUser = JSON.parse(userData);
            // Kiểm tra token có hợp lệ không (kiểm tra cơ bản)
            if (parsedUser && parsedUser._id) {
              setUser(parsedUser);
              console.log("User authenticated:", parsedUser.email);
            } else {
              throw new Error("Invalid user data");
            }
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
            // Xóa dữ liệu không hợp lệ
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("refreshToken");
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: any) => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!userData || !userData.token) {
        throw new Error("Invalid login data");
      }

      // Lưu token và user data
      localStorage.setItem("token", userData.token);

      if (userData.refreshToken) {
        localStorage.setItem("refreshToken", userData.refreshToken);
      }

      // Tạo user object sạch (không chứa token)
      const userToStore = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        isVerified: userData.isVerified,
        avatar: userData.avatar,
      };

      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Gọi API logout để vô hiệu hóa session trên server
      await authenticateApi.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Luôn xóa dữ liệu local dù API có lỗi
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      setUser(null);
      window.location.href = "/login";
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
