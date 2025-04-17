import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {searchSongs} from "../routes/routes";
import socket from '../services/socket';
import styled from 'styled-components';

const ResultsPage = () => {
    const location = useLocation();
    const {user, query} = location.state || {};
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (query) {
            fetchSongs();
        }
    }, [query]);

    const fetchSongs = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(searchSongs(query));

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSongSelection = (song) => {
        socket.emit("adminSongSelected", song);
        navigate('/live', {state: {user, song}});
    };

    return (
        <Container>
            <Title>Results</Title>
            <Subtitle>Search Results for - <strong>{query}</strong> :</Subtitle>
            {error && <ErrorText>{error}</ErrorText>}
            <SongList>
                {results.map((song, index) => (
                    <SongCard key={index} onClick={() => handleSongSelection(song)}>
                        <h3>{song.title} - {song.artist}</h3>
                        {song.image && <img src={song.image} alt={`${song.title} cover`} />}
                    </SongCard>
                ))}
            </SongList>
        </Container>
    );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #646464, #ffffff);
  overflow-y: auto;
`;

const Title = styled.h2`
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  font-size: 2.5rem;
`;

const Subtitle = styled.h3`
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  font-size: 2rem;

  strong {
    color: #ffffff;
  }
`;

const ErrorText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 1.2rem;
  color: #ff0000;
  margin: 1rem 0;
`;

const SongList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
`;

const SongCard = styled.div`
  background: #afafaf;
  border-radius: 8px;
  box-shadow: 0 0 5px rgb(255, 255, 255);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background-color: #ff0000;
    color: #ffffff;
  }

  h3 {
    font-family: 'Poppins', sans-serif;
    font-size: 1.2rem;
  }

  img {
    margin-top: 0.5rem;
    max-width: 100%;
    border-radius: 4px;
  }
`;

export default ResultsPage;