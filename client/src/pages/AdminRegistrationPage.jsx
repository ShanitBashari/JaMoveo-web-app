import RegistrationForm from "../components/RegistrationForm";
import {registerAdmin} from "../routes/routes";

const AdminRegistrationPage = () => {
    return (
        <RegistrationForm role="admin" apiEndpoint={registerAdmin}/>
    );
};

export default AdminRegistrationPage;