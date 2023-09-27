import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import {
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
  Error,
} from '../components/auth-components';
import GithubButton from '../components/github-btn';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElment>) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //화면이 새로고침 되지 않도록
    setError('');
    if (isLoading || name === '' || email === '' || password === '') return;
    try {
      setLoading(true);
      // create an account
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user);
      // set the name of the user 사용자 프로필이 있고 거기에 이름이 필요하니까
      await updateProfile(credentials.user, {
        displayName: name,
      });
      navigate('/');
      // redirect to the home page
    } catch (e) {
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
      <Title>Join ❌</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
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
        <Input
          type="submit"
          value={isLoading ? 'Loading...' : 'CrateAccount'}
        />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account? <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}