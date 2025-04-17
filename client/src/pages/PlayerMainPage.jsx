import {useEffect} from 'react';
import socket from '../services/socket';
import {useNavigate, useLocation} from 'react-router-dom';
import styled from 'styled-components';

const PlayerMainPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = location.state || {};

    useEffect(() => {
        const handleNavigateToLive = (song) => {
            navigate('/live', { state: { user, song } });
        };

        socket.on("navigateToLive", handleNavigateToLive);

        return () => {
            socket.off("navigateToLive", handleNavigateToLive);
        };
    }, [navigate, user]);

    return (
        <Container>
            <h1>Welcome , {user?.username} !</h1>
            <h2>Waiting for next song !</h2>
            <p>Stay tuned ! The admin will select a song shortly .</p>
        </Container>
    );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #646464, #ffffff);

  h1, h2 {
    font-family: 'Poppins', sans-serif;
    color: #ffffff;
  }

  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 2rem;
  }

  p {
    font-family: 'Roboto', sans-serif;
    font-size: 1.2rem;
    color: #646464;
    margin-top: 1rem;
    text-align: center;
  }
`;

export default PlayerMainPage;