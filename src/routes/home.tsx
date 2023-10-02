import { styled } from 'styled-components';
import PostTweetForm from '../components/post-tweet-form';
import Timeline from '../components/timeline';
import { createGlobalStyle } from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll; //트윗 작성 양식은 그대로 고정되어 있는 상태에서 트윗들을 스크롤 할 수 있게
  grid-template-rows: 1fr 5fr;
`;

// ↓스크롤바 숨기기
const GlobalStyles = createGlobalStyle`
    * {
        ::-webkit-scrollbar {
            display: none;
        }
        -ms-overflow-style: none;  
        scrollbar-width: none;  
    }
`;
export default function Home() {
  return (
    <Wrapper>
      <GlobalStyles />
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}
