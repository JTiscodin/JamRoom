import { SocketContextProvider } from "./providers/SocketProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ListenTogether from "./pages/ListenTogether";
import { RoomManagerProvider } from "./providers/RoomManager";

function App() {
  return (
    <>
      <BrowserRouter>
        <SocketContextProvider>
          <RoomManagerProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listentogether" element={<ListenTogether />} />
            </Routes>
          </RoomManagerProvider>
        </SocketContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
