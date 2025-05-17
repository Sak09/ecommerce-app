import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import context from "../context";

const AdminPanel = () => {
  const { fetchUserDetails } = useContext(context); 
  const [userData, setUserData] = useState(null); 
  const [allUsers, setAllUsers] = useState([]); 


  const getUserData = async () => {
    try {
      const user = await fetchUserDetails();
      if (user && user.data) {
        setUserData(user.data); 
        setAllUsers(user.data.users || []); 
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      <div
        style={{
          width: "300px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {userData ? (
          <>
            <div style={{ textAlign: "center" }}>
              <img
                src={`http://localhost:8000${userData.profilePic}`}
                alt="Profile"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "20px",
                }}
              />
            </div>

            <div>
              <h3 style={{ marginBottom: "10px", textAlign: "center" }}>
                {userData.name || "No Name"}
              </h3>
              <p style={{ margin: "10px 0" }}>
                <strong>Email:</strong> {userData.email || "No Email"}
              </p>

        
              <nav
                style={{
                  marginTop: "20px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <ul
                  style={{
                    display: "flex",
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <li>
                    <Link
                      to={"all-users"}
                      style={{
                        textDecoration: "none",
                        color: "#007bff",
                        fontWeight: "bold",
                        padding: "8px 16px",
                        borderRadius: "5px",
                      }}
                    >
                      All Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"all-products"}
                      style={{
                        textDecoration: "none",
                        color: "#007bff",
                        fontWeight: "bold",
                        padding: "8px 16px",
                        borderRadius: "5px",
                      }}
                    >
                      All Products
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

  
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
