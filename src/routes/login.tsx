import React, { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  Input,
  Switcher,
  Title,
  Wrapper,
  Error,
  Form,
} from '../components/auth-components';
import GithubButton from '../components/github-btn';

// 로그인 페이지가 하는 일은 form으로 부터 이메일과 암호를 가져오는 것

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //화면이 새로고침 되지 않도록
    setError('');
    if (isLoading || email === '' || password === '') return;
    try {
      setLoading(true);

      //계정 생성을 간단히 할 수 있음
      // ↓ 이 함수에 필요한 건 firebase 파일에서 온 Auth 인스턴스, 이메일, 비밀번호
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
      // redirect to the home page
    } catch (e) {
      // 비밀번호가 잘못되었으면 state 설정해서 알려줌
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
      // setError
    } finally {
      setLoading(false);
    }

    console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>Log Into ❌</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input type="submit" value={isLoading ? 'Loading...' : 'Log in'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?{' '}
        <Link to="/create-account">Create one &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
