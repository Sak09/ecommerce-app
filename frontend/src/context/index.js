// import { createContext } from "react";
// const context =  createContext(null);
// export default context
import { createContext, useState, useEffect, useCallback } from "react";
import summaryapi from "../common";

const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null);
  
  const fetchUserDetails = useCallback(async () => {
    try {
      const token = document?.cookie
        .split("; ")
        .find(row => row.startsWith("access-token="))
        ?.split("=")[1];

      const response = await fetch(summaryapi.current_user.url, {
        method: summaryapi.current_user.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      setUserDetail(data); 
      return data;
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      setUserDetail(null);
    }
  });

  useEffect(() => {
    fetchUserDetails();
  }, []);
  const logout = async () => {
    try {
      const response = await fetch(summaryapi.logout.url, {
        method: summaryapi.logout.method,
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setUserDetail(null); 
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ userDetail, fetchUserDetails, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
