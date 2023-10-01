import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { db } from '../firebase';
import Tweet from './tweet';

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);
  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, 'tweets'),
      orderBy('createAt', 'desc') //내림차순
    );
    const snapshot = await getDocs(tweetsQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data(); //데이터 추출
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweet(tweets); //추출한 트윗들을 setTweets을 이용해서 상태에 저장해주면 됨
  };
  useEffect(() => {
    fetchTweets();
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
      {/*트윗마다 Tweet 컴포넌트를 렌더링할건데 key는 트윗의 ID가 될거임*/}
    </Wrapper>
  ); //tweets를 문자로 나타냄
}
