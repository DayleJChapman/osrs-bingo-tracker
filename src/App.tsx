import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { Home, Edit, Tasks, Teams } from "@/pages";
import "./index.css";

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full flex flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/edit" element={<Edit />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
