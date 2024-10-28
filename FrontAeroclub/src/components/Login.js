import { GoogleLogin } from '@react-oauth/google';
import ObtenerDatosPostLogin from '../utils/obtenerDatosLogin';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { useUser } from '../context/UserContext';


export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useUser(); // Usa el hook para acceder a setUser

    function handleError() {
        console.log("login failed");
    }

    function handleSuccess(credentialsResponse) {
        const { payload } = ObtenerDatosPostLogin(credentialsResponse.credential);
        setUser(payload); 
        console.log(payload)
        navigate("/Bienvenido"); 
    }

    return (  
        <div>
            <GoogleLogin onError={handleError} onSuccess={handleSuccess} />
        </div>
    );
}