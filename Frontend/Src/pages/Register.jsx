import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function Register() {
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        login(email || 'nuevo@flygo.com');
        navigate('/');
    };

    return (
        <section className="pagina-app pagina-auth">
            <form className="formulario-plan auth-card" onSubmit={handleSubmit}>
                <span className="etiqueta-plan">Nueva cuenta</span>
                <h1>Registrarse</h1>
                <label>
                    Nombre
                    <input type="text" placeholder="Tu nombre" />
                </label>
                <label>
                    Email
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="tu@email.com" />
                </label>
                <label>
                    Contrasena
                    <input type="password" placeholder="Minimo 8 caracteres" />
                </label>
                <button className="boton boton-registrarse" type="submit">Crear cuenta</button>
            </form>
        </section>
    );
}
