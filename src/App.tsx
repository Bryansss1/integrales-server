import HomePage from "./pages/home/Home.page";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route } from "react-router";

function App() {
  return (
    <MantineProvider>
      <Router>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </Router>
    </MantineProvider>
  );
}

export default App;
