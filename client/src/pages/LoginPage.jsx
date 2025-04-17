import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {login, session} from "../routes/routes";
import styled from 'styled-components';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !password) {
            setError('All fields are required !');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            if (response.ok) {
                const user = await response.json();

                // Redirect based on user's role .
                if (user.role === 'admin') {
                    navigate('/adminMain', {state: {user}});
                } else {
                    const sessionResponse = await fetch(session);

                    if (sessionResponse.ok) {
                        const sessionData = await sessionResponse.json();
                        if (sessionData.active) {
                            console.log('There is an active session .');
                            navigate('/live', {state: { user, song: sessionData.song}});
                            return;
                        }
                    }
                    navigate('/playerMain', {state: { user }});
                }
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (error) {
            setError('An error occurred , Please try again .');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h1>Welcome to JaMoveo !</h1>
            <h2>Log In</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging In ...' : 'Log In'}
                </button>
            </form>
            {error && <p>{error}</p>}
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
  background: linear-gradient(180deg, #ffffff, #646464);

  h1 {
    font-family: 'Poppins', sans-serif;
    font-size: 3rem;
    color: #646464;
  }

  h2 {
    font-family: 'Poppins', sans-serif;
    font-size: 2rem;
    color: #646464;
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
  }

  label {
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
    color: #646464;
  }

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

  p {
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
    color: #ffffff;
    text-align: center;

    &:last-of-type {
      color: #ff0000;
      font-size: 1.2rem;
    }
  }
`;

export default LoginPage;