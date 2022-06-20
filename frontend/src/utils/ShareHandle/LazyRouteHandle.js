import { lazy } from "react";

export const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(import("../../Pages/Authentications/Login/index")),
      1500
    );
  });
});

export const Home = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("../../Pages/Home/Index")), 2000);
  });
});
