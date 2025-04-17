import {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import styled from 'styled-components';

const AdminMainPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = location.state || {};

    const handleSearch = async (event) => {
        event.preventDefault();

        if (!searchQuery.trim()) {
            setError('Please enter a search query .');
            return;
        }

        setError('');

        setLoading(true);

        try {
            navigate('/results', {state: {user, query: searchQuery}});
        } catch (error) {
            setError('An error occurred while processing your request .');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h1>Welcome , {user?.username} !</h1>
            <h2>Search any song ...</h2>
            <form onSubmit={handleSearch}>
                <div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter a song title or an artist's name"
                        aria-label="Search for a song"
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Searching ...' : 'Search'}
                </button>
            </form>
            {error && <ErrorText>{error}</ErrorText>}
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

  form {
    background: #afafaf;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 0 15px rgb(255, 255, 255);
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    input {
      width: 94%;
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #ffffff;
      border-radius: 4px;
      outline: none;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #ffffff;
      }
    }

    button {
      padding: 0.7rem;
      font-size: 1rem;
      background-color: #646464;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #ff0000;
      }

      &:disabled {
        background-color: #646464;
        cursor: not-allowed;
      }
    }
  }
`;

const ErrorText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 1.2rem;
  color: #ff0000;
  margin-top: 1rem;
`;

export default AdminMainPage;