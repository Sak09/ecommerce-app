import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";

import Context from "./context/index";
// import Cookies from "js-cookie";

function App() {
  // const { fetchUserDetails } = useContext(Context);
  // const fetchUserDetails = async () => {
  //   try {
  //     // const token = Cookies.get("access-token");
  //     const token = document.cookie
  //     .split('; ')
  //     .find(row => row.startsWith('access-token='))
  //     ?.split('=')[1];
  //     const dataResponse = await fetch(summaryapi.current_user.url, {
  //       method: summaryapi.current_user.method,
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: token,
  //       },
  //     });

  //     if (!dataResponse.ok) {
  //       throw new Error(
  //         `Error fetching user details: ${dataResponse.status} ${dataResponse.statusText}`
  //       );
  //     }
  //     const dataApi = await dataResponse.json();

  //     return dataApi;
  //   } catch (error) {
  //     console.error("Error fetching user details:", error.message);
  //   }
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await fetchUserDetails();
  //   };

  //   fetchData();
  // }, []);

  return (
    <>
      {/* <Context.Provider
        value={{
          fetchUserDetails,
        }}
      > */}
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      {/* </Context.Provider> */}
    </>
  );
}

export default App;
