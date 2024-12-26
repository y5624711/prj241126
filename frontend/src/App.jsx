import axios from "axios";
import { MemberLogin } from "./page/member/MemberLogin.jsx";
import React, { useEffect } from "react";

import AuthenticationProvider from "./context/AuthenticationProvider.jsx";
import { BoardMain } from "./page/board/BoardMain.jsx";
import { RootLayout } from "./page/root/RootLayout.jsx";
import MemberSignup from "./page/member/memberSignup.jsx";
import BoardMap from "./page/board/BoardMap.jsx";
import { ManagementPage } from "./page/manager/ManagementPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BoardList } from "./page/board/BoardList.jsx";
import { BoardAdd } from "./page/board/BoardAdd.jsx";
import BoardView from "./page/board/BoardView.jsx";
import BoardAnnouncement from "./page/board/BoardAnnouncement.jsx";
import BoardAnnouncementAdd from "./page/board/BoardAnnouncementAdd.jsx";
import BoardAnnouncementView from "./page/board/BoardAnnouncementView.jsx";
import BoardAnnouncementEdit from "./page/board/BoardAnnouncementEdit.jsx";
import { MemberInfo } from "./page/member/MemberInfo.jsx";
import { MemberEdit } from "./page/member/MemberEdit.jsx";
import { BoardWritten } from "./page/board/BoardWritten.jsx";
import { AddressProvider, useAddress } from "./context/AddressContext.jsx";
import { BoardEdit } from "./page/board/BoardEdit.jsx";
import { BoardQuestion } from "./page/board/BoardQuestion.jsx";
import { BoardQuestionAdd } from "./page/board/BoardQuestionAdd.jsx";
import { BoardQuestionView } from "./page/board/BoardQuestionView.jsx";
import { BoardQuestionEdit } from "./page/board/BoardQuestionEdit.jsx";

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
        path: "board/announcement",
        element: <BoardAnnouncement />,
      },
      {
        path: "board/annAdd",
        element: <BoardAnnouncementAdd />,
      },
      {
        path: "board/viewAnn/:id",
        element: <BoardAnnouncementView />,
      },
      {
        path: "board/editAnn/:id",
        element: <BoardAnnouncementEdit />,
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
        path: "/manager/List",
        element: <ManagementPage />,
      },
      {
        path: "board/list",
        element: <BoardList />,
      },
      {
        path: "board/add",
        element: <BoardAdd />,
      },
      {
        path: "board/view/:number",
        element: <BoardView />,
      },
      {
        path: "member/:id",
        element: <MemberInfo />,
      },
      {
        path: "member/edit/:id",
        element: <MemberEdit />,
      },
      {
        path: "board/written/:id",
        element: <BoardWritten />,
      },
      {
        path: "board/edit/:number",
        element: <BoardEdit />,
      },
      {
        path: "board/question",
        element: <BoardQuestion />,
      },
      {
        path: "board/questionAdd",
        element: <BoardQuestionAdd />,
      },
      {
        path: "board/questionView/:id",
        element: <BoardQuestionView />,
      },
      {
        path: "board/questionEdit/:id",
        element: <BoardQuestionEdit />,
      },
    ],
  },
]);

function App() {
  const { address } = useAddress();

  useEffect(() => {
    if (address) {
      console.log("주소가 변경되었습니다 app:", address); // address 값이 변경될 때마다 실행됨
    }
  }, [address]); // address 값이 변경될 때마다 실행됩니다.
  return (
    <AuthenticationProvider>
      <AddressProvider>
        <RouterProvider router={router} />
      </AddressProvider>
    </AuthenticationProvider>
  );
}

export default App;
