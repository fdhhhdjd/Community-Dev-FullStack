import React, { Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRouterAuth from "./Components/Authentication/CheckAuth/index";
import { Login, Home } from "./utils/ShareHandle/LazyRouteHandle";
import Register from "./Pages/Authentications/Register/index";
import NotFound from "./Pages/NotFound/index";
import { ToastContainer } from "react-toastify";
import CheckPageNotAuth from "./Components/Authentication/CheckPageNotAuth/index";
function App() {
  return (
    <React.Fragment>
      <Suspense fallback={<h1>Loading...</h1>}>
        <ToastContainer position="top-center" />
        <Routes>
          {/* ********* Auth ********* */}
          {/* <Route element={<PrivateRouterAuth />}> */}
          <Route path="/register" element={<Register />} />
          {/* </Route> */}
          {/* <Route element={<PrivateRouterAuth />}> */}
          <Route path="/login" element={<Login newUser={false} />} />
          {/* </Route> */}

          {/* ********* Home ********* */}
          {/* <Route element={<CheckPageNotAuth />}> */}
          <Route path="/" element={<Home />} />
          {/* </Route> */}
          {/* ********* Page Note Found********* */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </React.Fragment>
  );
}

export default App;
