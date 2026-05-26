export default function Register() {
    return (
        <section className="pagina-app pagina-auth">
            <form className="formulario-plan auth-card">
                <span className="etiqueta-plan">Nueva cuenta</span>
                <h1>Registrarse</h1>
                <label>
                    Nombre
                    <input type="text" placeholder="Tu nombre" />
                </label>
                <label>
                    Email
                    <input type="email" placeholder="tu@email.com" />
                </label>
                <label>
                    Contrasena
                    <input type="password" placeholder="Minimo 8 caracteres" />
                </label>
                <button className="boton boton-registrarse" type="button">Crear cuenta</button>
            </form>
        </section>
    );
}
