import useCart from '../hooks/useCart.js';

export default function Cart() {
    const { items, removeItem, totalPrice, clearCart } = useCart();

    return (
        <section className="pagina-app">
            <div className="contenedor carrito-layout">
                <div>
                    <span className="etiqueta-plan">Reserva</span>
                    <h1 className="titulo-seccion">Carrito de viajes</h1>
                    <p className="subtitulo-seccion">Ejemplo de estado global con React Context.</p>
                </div>

                {items.length === 0 ? (
                    <div className="estado-vacio">Tu carrito esta vacio por ahora.</div>
                ) : (
                    <div className="lista-carrito">
                        {items.map((item) => (
                            <article className="item-carrito" key={item.id}>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.quantity} x ${item.price}</p>
                                </div>
                                <button className="boton boton-secundario" onClick={() => removeItem(item.id)}>Quitar</button>
                            </article>
                        ))}
                        <div className="resumen-carrito">
                            <strong>Total: ${totalPrice}</strong>
                            <button className="boton boton-primario">Continuar compra</button>
                            <button className="boton boton-secundario" onClick={clearCart}>Vaciar</button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
