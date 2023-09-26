import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import Layout from './components/layout';
import LoadingScreen from './components/loading-screen';
import CreateAccount from './routes/create-account';
import Home from './routes/home';
import Login from './routes/login';
import Profile from './routes/profile';
import { auth } from './firebase';
import { styled } from 'styled-components';
import ProtectedRoute from './routes/protected-route';

const router = createBrowserRouter([
  {
    // 프로텍트 라우트 때문에 기본값이 Login 페이지
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>, //Layout이 홈과 프로필을 감싸고 있어서
    children: [
      // 사용자가 로그인하지 않은 경우에는 Home이나 Profile을 포함
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  { path: '/create-account', element: <CreateAccount /> },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;

  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
     await auth.authStateReady(); //사용자가 로그인했는지 안 했는지, 누구인지에 대한 정보를 기다림
    setLoading(false); // 정보를 받은 다음 setLoading을 false로 설정하고 사용자를 router로 보냄
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
