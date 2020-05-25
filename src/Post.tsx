import React from 'react';
import styled from 'styled-components';

const PostHeader = styled.div`
  display: flex;
  margin: 1rem;
`;

const HeaderDetails = styled.div``;

const Title = styled.div`
  font-weight: 600;
`;

const Subreddit = styled.div`
  font-style: italic;
`;

const Body = styled.div`
  display: flex;
  justify-content: center;
  background-color: #000;
`;

const BodyText = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: #353535;
`;

const Img = styled.img`
  max-width: 300px;
  max-height: 300px;
  @media (min-width: 425px) {
    max-width: 523px;
  }
`;

const Card = styled.div`
  max-width: 300px;

  @media (min-width: 425px) {
    max-width: 525px;
  }

  width: 100%;
  border-radius: 4px;
  border: 1.5px solid #000;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 525px;
  position: relative;
`;

const PlayPauseButton = styled.button<{ isPlaying: boolean }>`
  margin: 0;
  padding: 0;
  border: none;

  position: absolute;
  color: white;
  width: 100%;
  height: 100%;
  left: 0;

  background-color: ${p => (p.isPlaying ? 'rgba(0, 0, 0, 0.0)' : 'rgba(0, 0, 0, 0.5)')};
`;

interface MediaPlayerProps {
  audioSrc?: string;
  videoSrc?: string;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ audioSrc, videoSrc }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleClick = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      videoRef.current?.pause();
    } else {
      audioRef.current?.play();
      videoRef.current?.play();
    }
    setIsPlaying(prev => !prev);
  };

  return (
    <Container>
      <video ref={videoRef} src={videoSrc} />
      <audio ref={audioRef} src={audioSrc} />
      <PlayPauseButton onClick={handleClick} isPlaying={isPlaying}>
        {!isPlaying && 'Play'}
      </PlayPauseButton>
    </Container>
  );
};

export interface IPost {
  author: string;
  body: string;
  id: string;
  images: { url: string }[];
  secureMedia?: { redditVideo?: { fallbackUrl?: string } };
  subreddit: string;
  title: string;
}

interface PostProps {
  post: IPost;
}

export const Post: React.FC<PostProps> = ({ post }) => (
  <Card>
    <PostHeader>
      <HeaderDetails>
        <Title>{post.title}</Title>
        <Subreddit>{`r/${post.subreddit}`}</Subreddit>
      </HeaderDetails>
    </PostHeader>
    <Body>
      {post.secureMedia ? (
        <MediaPlayer
          videoSrc={post.secureMedia?.redditVideo?.fallbackUrl}
          audioSrc={post.secureMedia?.redditVideo?.fallbackUrl?.replace(/DASH[\s\S]+/, 'audio')}
        />
      ) : post.images ? (
        <Img src={post.images[0].url} alt="" />
      ) : (
        <BodyText>{post.body}</BodyText>
      )}
    </Body>
  </Card>
);
