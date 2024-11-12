import { GoogleLogin } from '@react-oauth/google';
import ObtenerDatosPostLogin from '../utils/obtenerDatosLogin';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { obtenerIdUsuarioDesdeMail } from '../services/usuariosApi';
import { verificarOCrearUsuario } from '../services/ingresoApi';

export default function Login() {
    const { user, setUser, setUsuarioId } = useContext(UserContext);
    const navigate = useNavigate();

    function handleError() {
        console.log("Login failed");
    }

    async function handleSuccess(credentialsResponse) {
        const { payload } = ObtenerDatosPostLogin(credentialsResponse.credential);
        setUser(payload);

        // Envía los datos del usuario al backend para verificar o crear el registro en la base de datos
        try {
            await verificarOCrearUsuario({
                email: payload.email,
                nombre: payload.given_name,
                apellido: payload.family_name,
            });
        } catch (error) {
            console.error('Error al insertar usuario:', error);
        }
        navigate("/Bienvenido");
    }


    return (
        <div>
            <GoogleLogin onError={handleError} onSuccess={handleSuccess} />
        </div>
    );
}
