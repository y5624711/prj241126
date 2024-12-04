import axios from "axios";
import { MemberLogin } from "./page/member/MemberLogin.jsx";
import React from "react";

import { LoginKakaoHandler } from "./page/kakao/LoginKakaoHandler.jsx";

import AuthenticationProvider from "./context/AuthenticationProvider.jsx";
import { BoardMain } from "./page/board/BoardMain.jsx";
import { RootLayout } from "./page/root/RootLayout.jsx";
import MemberSignup from "./page/member/memberSignup.jsx";
import BoardMap from "./page/board/BoardMap.jsx";
import { ManagementPage } from "./page/manager/ManagementPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BoardList } from "./page/board/BoardList.jsx";

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <BoardMain />,
      },
      {
        path: "board/map",
        element: <BoardMap />,
      },
      {
        path: "member/signup",
        element: <MemberSignup />,
      },
      {
        path: "member/login",
        element: <MemberLogin />,
      },
      {
        path: "kakao/auth",
        element: <LoginKakaoHandler />,
      },
      {
        path: "/memberList",
        element: <ManagementPage />,
      },
      {
        path: "board/list",
        element: <BoardList />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <AuthenticationProvider>
        <RouterProvider router={router} />
      </AuthenticationProvider>
    </>
  );
}

export default App;
