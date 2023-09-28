import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { styled } from 'styled-components';
import { auth, db } from '../firebase';

const Form = styled.form`
  //div로 해뒀어서 onSumbit 작동이 안됐었음
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none; //AttachFileInput을 숨기고 싶어서
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetFrom() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState('');
  const [file, setFile] = useState<File | null>(null); //타입스크립트 구문
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  //타입이 file인 input이 변경될 때맏 ㅏ파일의 배열을 받게 됨, 어떤 input은 복수의 파일을 업로드하게 해 줌
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      // input에서 파일 추출 파일이 딱 하나만 있는지 확인, 유저가 단 하나의 파일만 업로드하도록
      setFile(files[0]); // 배열의 첫 번째 파일을 file state에 저장
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(onSubmit);
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === '' || tweet.length > 180) return;

    try {
      setLoading(true);
      await addDoc(collection(db, 'tweets'), {
        tweet,
        createAt: Date.now(), //트윗이 생성된 시간
        username: user.displayName || 'Anonymous', //일부 sns는 로그인해도 타인에게 보이는 이름은 제공 안하기도 해서
        userId: user.uid,
      }); // 처음은 어떤 컬렉션에 도큐먼트를 생성하고 싶은지
    } catch (e) {
      console.log(e); //유저에게 에러 보여주려고
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="what is happening?"
      />
      <AttachFileButton htmlFor="file">
        {file ? 'Photo added ✅' : 'Add photo'}
      </AttachFileButton>{' '}
      {/*유저가 파일 첨부 */}
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />{' '}
      {/*이미지 파일이기만 하면 어떤 확장자라도 가능 */}
      <SubmitBtn
        type="submit"
        value={isLoading ? 'Posting...' : 'Post Tweet'}
      />
    </Form>
  );
}

//레포지토리 수정
