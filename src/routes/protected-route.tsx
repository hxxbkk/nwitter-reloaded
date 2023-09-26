import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

// 프로텍트 라우트는 firebase에게 로그인한 사용자가 누구인지 물어보는 route

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser; // 파이어베이스에 유저 정보 요청, 사용자의 정보를 얻을 수 있음
  if (user === null) {
    return <Navigate to="/login" />; //Navigate는 user를 다른 곳으로 리다이렉트 해주는 컴포넌트
  }
  return children;
}

// 만약 로그인 되지 않았다면 사용자가 Protected route의 하위 페이지를 못 보게 막고있음