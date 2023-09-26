import { auth } from '../firebase';

export default function Home() {
  const logOut = () => {
    // auth는 firebase 파일에서 온거임
    auth.signOut(); // 파이어베이스에서 auth 인스턴스 호출한 다음에 signOut만 해주면 됨
  };
  return (
    <h1>
      <button onClick={logOut}>Log Out</button>
    </h1>
  );
}
