import { lazy } from "react";

export const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(import("../../Pages/Authentications/Login/index")),
      1000
    );
  });
});

export const Home = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("../../Pages/Home/Index")), 2000);
  });
});
