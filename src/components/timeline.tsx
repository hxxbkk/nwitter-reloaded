import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
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

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);

  // const snapshot = await getDocs(tweetsQuery);
  // const tweets = snapshot.docs.map((doc) => {
  //   const { tweet, createdAt, userId, username, photo } = doc.data(); //데이터 추출
  //   return {
  //     tweet,
  //     createdAt,
  //     userId,
  //     username,
  //     photo,
  //     id: doc.id,
  //   };
  // });
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, 'tweets'),
        orderBy('createAt', 'desc'), //내림차순
        limit(25) // 첫 25개만 불러오도록 제한
      );

      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
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
        setTweet(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe(); //유저가 언마운트, 즉 이 컴포넌트를 안 보일 때 clean up 실행
      //유저가 로그아웃했거나 다른 화면에 있을 때 굳이 이벤트를 들을 필요가 없기 때문에
      // useEffect 훅의 teardown이 실행될 때 구독 취소
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
      {/* 트윗마다 Tweet 컴포넌트를 렌더링할건데 key는 트윗의 ID가 될거임 */}
    </Wrapper>
  ); //tweets를 문자로 나타냄
}
