import { GoogleLogin } from '@react-oauth/google';
import ObtenerDatosPostLogin from '../utils/obtenerDatosLogin';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { obtenerIdUsuarioDesdeMail } from '../services/usuariosApi';

export default function Login() {
    const { user, setUser, setUsuarioId } = useContext(UserContext);
    const navigate = useNavigate();

    function handleError() {
        console.log("Login failed");
    }

    function handleSuccess(credentialsResponse) {
        const { payload } = ObtenerDatosPostLogin(credentialsResponse.credential);
        setUser(payload);
        navigate("/Bienvenido");
    }

    useEffect(() => {
        const fetchUserId = async () => {
            if (user) {
                try {
                    const idUsuario = await obtenerIdUsuarioDesdeMail(user.email);
                    console.log('ID de Usuario:', idUsuario);
                    setUsuarioId(idUsuario); // Guarda el ID en el contexto
                } catch (error) {
                    console.error('Error al obtener el ID de Usuario:', error);
                }
            }
        };

        fetchUserId();
    }, [user, setUsuarioId]);

    return (
        <div>
            <GoogleLogin onError={handleError} onSuccess={handleSuccess} />
        </div>
    );
}
