import styled from 'styled-components';

const MainPage = () => {
    return (
        <Container>
            <h1>Welcome to JaMoveo !</h1>
            <p>
                <a href="/login">
                    Log in
                </a>
            </p>
            <p>
                <a href="/adminRegistration">
                    Sign up as an admin
                </a>
            </p>
            <p>
                <a href="/playerRegistration">
                    Sign up as a player
                </a>
            </p>
        </Container>
    );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  align-items: center;
  background: linear-gradient(180deg, #646464, #ffffff);

  h1 {
    color: #ffffff;
    font-family: 'Poppins', sans-serif;
    font-size: 3rem;
    margin: 0;
  }

  p {
    color: #ffffff;
    font-family: 'Roboto', sans-serif;
    font-size: 1.7rem;

    a {
      color: #646464;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s ease;

      &:hover {
        color: #ff0000;
      }
    }
  }
`;

export default MainPage;