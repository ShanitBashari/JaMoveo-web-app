import {useState, useEffect, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import socket from '../services/socket';
import styled from 'styled-components';

const LivePage = () => {
    const location = useLocation();
    const {user, song} = location.state || {};
    const isSinger = user?.instrument === 'Vocals';
    const isAdmin = user?.role === 'admin';
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit('registerUser', {role: user?.role});
    }, [user]);

    const lyricsAndChords = Array.isArray(song?.lyricsAndChords) ? song.lyricsAndChords : [];

    const [isScrolling, setIsScrolling] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        let scrollInterval;

        if (isScrolling && scrollRef.current) {
            scrollInterval = setInterval(() => {
                scrollRef.current.scrollBy({
                    top: 1,
                    behavior: 'smooth',
                });
            }, 50);
        }

        return () => clearInterval(scrollInterval);
    }, [isScrolling]);

    const toggleScrolling = () => {
        setIsScrolling((prev) => !prev);
    };

    useEffect(() => {
        const handleAdminDisconnection = () => {
            if (isAdmin) {
                navigate('/adminMain', {state: {user}});
            } else {
                navigate('/playerMain', {state: {user}});
            }
        };

        socket.on('adminDisconnected', handleAdminDisconnection);

        return () => {
            socket.off('adminDisconnected', handleAdminDisconnection);
        };
    }, [isAdmin, navigate]);

    const handleQuit = () => {
        socket.emit('adminQuit');
        navigate('/adminMain', {state: {user}});
    };

    return (
        <Container>
            <Title>
                {`${song?.title || 'No Title Available'} - ${song?.artist || 'Unknown Artist'}`}
            </Title>
            <LyricsContainer ref={scrollRef}>
                {lyricsAndChords.length > 0 ? (
                    lyricsAndChords.map((line, lineIndex) => (
                        <Line key={lineIndex}>
                            {!isSinger && (
                                <Chords>
                                    {line.map((word, wordIndex) => (
                                        <span key={wordIndex}>
                                            {word.chords ? `${word.chords} ` : ''}
                                        </span>
                                    ))}
                                </Chords>
                            )}
                            <Lyrics>
                                {line.map((word, wordIndex) => (
                                    <span key={wordIndex}>{word.lyrics}{' '}</span>
                                ))}
                            </Lyrics>
                        </Line>
                    ))
                ) : (
                    <ErrorText>No lyrics and chords available .</ErrorText>
                )}
            </LyricsContainer>
            <Button onClick={toggleScrolling}>
                {isScrolling ? 'Stop Scrolling' : 'Start Scrolling'}
            </Button>
            {isAdmin && <Button onClick={handleQuit}>Quit</Button>}
        </Container>
    );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #ffffff, #646464);
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  color: #646464;
  font-size: 2.5rem;
  text-align: center;
`;

const LyricsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  overflow-y: auto;
  padding: 1rem;
  background: rgb(100, 100, 100);
  box-shadow: 0 0px 20px rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  align-items: center;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #969696;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #969696;
  }
`;

const Line = styled.div`
  margin-bottom: 2rem;
`;

const Chords = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 3rem;
  color: #0048ff;
`;

const Lyrics = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 3rem;
  color: #ffffff;
`;

const ErrorText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 1.2rem;
  color: #ff0000;
`;

const Button = styled.button`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  margin: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #646464;
  color: #ffffff;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    background-color: #ff0000;
  }
`;

export default LivePage;