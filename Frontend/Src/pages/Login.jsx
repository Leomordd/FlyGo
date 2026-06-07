import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const returnTo = location.state?.returnTo || '/';

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(form);
            navigate(returnTo);
        } catch (loginError) {
            setError(loginError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="pagina-app pagina-auth">
            <form className="formulario-plan auth-card" onSubmit={handleSubmit}>
                <span className="etiqueta-plan">Acceso</span>
                <h1>Iniciar Sesion</h1>
                <label>
                    Email
                    <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" placeholder="tu@email.com" required />
                </label>
                <label>
                    Contrasena
                    <input value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} type="password" placeholder="********" required />
                </label>
                <p className="nota-auth">Te enviaremos un email de seguridad cuando ingreses.</p>
                {error && <p className="mensaje-error">{error}</p>}
                <button className="boton boton-primario" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </section>
    );
}
