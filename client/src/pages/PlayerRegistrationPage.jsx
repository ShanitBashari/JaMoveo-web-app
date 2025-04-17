import RegistrationForm from "../components/RegistrationForm";
import {registerPlayer} from "../routes/routes";

const PlayerRegistrationPage = () => {
    return (
        <RegistrationForm role="player" apiEndpoint={registerPlayer}/>
    );
};

export default PlayerRegistrationPage;