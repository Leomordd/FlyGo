import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function Register() {
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await register(form);
            navigate('/');
        } catch (registerError) {
            setError(registerError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="pagina-app pagina-auth">
            <form className="formulario-plan auth-card" onSubmit={handleSubmit}>
                <span className="etiqueta-plan">Nueva cuenta</span>
                <h1>Registrarse</h1>
                <label>
                    Nombre
                    <input value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} type="text" placeholder="Tu nombre" required />
                </label>
                <label>
                    Apellido
                    <input value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} type="text" placeholder="Tu apellido" />
                </label>
                <label>
                    Email
                    <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" placeholder="tu@email.com" required />
                </label>
                <label>
                    Contrasena
                    <input value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} type="password" placeholder="Minimo 8 caracteres" minLength="8" required />
                </label>
                {error && <p className="mensaje-error">{error}</p>}
                <button className="boton boton-registrarse" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear cuenta'}
                </button>
            </form>
        </section>
    );
}
