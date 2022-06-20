import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
} from "react";
import { io } from "socket.io-client";
import "../Styles/Global.css";
import { AuthContext } from "./Context/Auth/index";
import { SearchContext } from "./Context/Search/index";
import { SocketContext } from "./Context/Socket/index";
const AppProviders = ({ children }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const socket = useRef();

  useEffect(() => {}, []);

  return (
    <AuthContext.Provider value={{ searchValue }}>
      <SearchContext.Provider value={{}}>
        <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>
      </SearchContext.Provider>
    </AuthContext.Provider>
  );
};

export default AppProviders;
