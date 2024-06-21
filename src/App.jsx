

import { ConfigProvider, message } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";

import "https://kit.fontawesome.com/0d3ce04075.js";

function App() {
  const [api, contextHolder] = message.useMessage();
  return (
    <ConfigProvider>
      <main>
        {/* <ProgressBar /> */}
        <BrowserRouter>
          <Routes>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/' element={<Welcome />} />
          </Routes>
        </BrowserRouter>
      </main>
    </ConfigProvider>
  );
}

export default App
