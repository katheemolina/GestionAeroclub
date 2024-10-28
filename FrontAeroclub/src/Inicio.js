import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import './components/styles/Login.css'

export const CLIENT_ID = "1081356917813-3b09t79q645qlt5a1j3ftntgmsko6jrp.apps.googleusercontent.com";


export default function Inicio() {
    return (
                <GoogleOAuthProvider clientId={CLIENT_ID}>
                    <main>
                        <div className='login-container'>
                            <h1>Bienvenido al sistema de gestion del Aeroclub</h1>
                            <Login />
                        </div>
                    </main>
                </GoogleOAuthProvider>
    )
} 