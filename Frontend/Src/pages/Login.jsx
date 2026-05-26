import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function Login() {
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        login(email || 'usuario@flygo.com');
        navigate('/');
    };

    return (
        <section className="pagina-app pagina-auth">
            <form className="formulario-plan auth-card" onSubmit={handleSubmit}>
                <span className="etiqueta-plan">Acceso</span>
                <h1>Iniciar Sesion</h1>
                <label>
                    Email
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="tu@email.com" />
                </label>
                <label>
                    Contrasena
                    <input type="password" placeholder="********" />
                </label>
                <button className="boton boton-primario" type="submit">Entrar</button>
            </form>
        </section>
    );
}
