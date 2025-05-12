import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import './components/styles/Login.css'

export const CLIENT_ID = "398787169740-39s4aa9hmnolaeaogg020dc056m8hrkp.apps.googleusercontent.com";
export const REDIRECT_URI = 'https://18.226.94.236/callback';  

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