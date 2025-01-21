import { SocketContextProvider } from "./providers/SocketProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ListenTogether from "./pages/ListenTogether";

function App() {

  return (
    <>
      <BrowserRouter>
        <SocketContextProvider>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/listentogether" element={<ListenTogether/>} />
          </Routes>
        </SocketContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
