import { useContext } from "react";
import { AuthContext } from "../Context/Auth/index";
import { SearchContext } from "../Context/Search/index";
import { SocketContext } from "../Context/Socket/index";
export const useMyContext = () =>
  useContext(AuthContext, SearchContext, SocketContext);
