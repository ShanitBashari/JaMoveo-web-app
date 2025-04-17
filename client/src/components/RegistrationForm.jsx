import {useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from 'styled-components';

const RegistrationForm = ({role, apiEndpoint}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [instrument, setInstrument] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !password || !confirmPassword || !instrument) {
            setError("All fields are required !");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match !");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, password, role, instrument}),
            });

            if (response.ok) {
                navigate("/login");
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (error) {
            setError("An error occurred during registration , Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h2>{role === "admin" ? "Admin registration page" : "Player registration page"}</h2>
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
                <div>
                    <label htmlFor="confirmPassword">Confirm Password </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="instrument">Instrument </label>
                    <select
                        id="instrument"
                        value={instrument}
                        onChange={(e) => setInstrument(e.target.value)}
                    >
                        <option value="">Select an Instrument</option>
                        <option value="Drums">Drums</option>
                        <option value="Guitar">Guitar</option>
                        <option value="Bass">Bass</option>
                        <option value="Saxophone">Saxophone</option>
                        <option value="Keyboards">Keyboards</option>
                        <option value="Vocals">Vocals</option>
                    </select>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Signing Up ..." : "Sign Up"}
                </button>
                <p>
                    <a href="/login">ALREADY HAVE AN ACCOUNT?</a>
                </p>
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

  h2 {
    color: #646464;
    font-family: 'Poppins', sans-serif;
    font-size: 2rem;
  }

  form {
    background: #afafaf;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 0 25px rgb(255, 255, 255);
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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

  select {
    width: 100%;
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
    text-align: center; /* Centers the text horizontally */

    a {
      color: #646464;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s ease;

      &:hover {
        color: #ff0000;
      }
    }

    &:last-of-type {
      color: #ff0000;
      font-size: 1.2rem;
    }
  }

`;


export default RegistrationForm;
