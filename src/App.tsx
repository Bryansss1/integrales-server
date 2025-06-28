import HomePage from "./pages/home/Home.page";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import MetricsPage from "./pages/metrics/Metrics.page";

function App() {
  return (
    <MantineProvider>
      <Router>
        <main className="flex-grow h-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/metrics" element={<MetricsPage />} />
          </Routes>
        </main>
      </Router>
    </MantineProvider>
  );
}

export default App;
