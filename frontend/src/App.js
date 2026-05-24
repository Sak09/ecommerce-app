import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Container } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f4f6fb",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg" sx={{ minHeight: "calc(100vh - 210px)", mt: 3, mb: 3 }}>
        <main className="app-main">
          <Outlet />
        </main>
      </Container>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
