import useCart from '../hooks/useCart.js';
import useAuth from '../hooks/useAuth.js';
import useCurrency from '../hooks/useCurrency.js';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/apiClient.js';

export default function Cart() {
    const { items, removeItem, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const { currency, formatPrice, convertPrice } = useCurrency();
    const navigate = useNavigate();
    const [checkout, setCheckout] = useState({
        paymentMethod: 'mercado_pago',
        travelersCount: 1,
        travelDate: '',
        specialRequests: '',
        cardName: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        billingEmail: user?.email || '',
        billingDocument: ''
    });
    const [checkoutMessage, setCheckoutMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const paypalOrderId = params.get('token');

        if (params.get('payment') !== 'approved' || !paypalOrderId || !user) return;

        setIsSubmitting(true);
        api.capturePaypalPayment(paypalOrderId)
            .then(() => {
                clearCart();
                setCheckoutMessage('Pago confirmado. Tu reserva ya quedo registrada.');
                window.history.replaceState({}, '', '/carrito');
            })
            .catch((error) => setCheckoutMessage(error.message))
            .finally(() => setIsSubmitting(false));
    }, [clearCart, user]);

    const handleCheckout = async (event) => {
        event.preventDefault();
        setCheckoutMessage('');

        if (!user) {
            navigate('/login', { state: { returnTo: '/carrito' } });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.createBooking({
                ...checkout,
                currency,
                items: items.map((item) => ({
                    ...item,
                    price: convertPrice(item.price)
                }))
            });

            if (response.payment?.approvalUrl) {
                clearCart();
                window.location.href = response.payment.approvalUrl;
                return;
            }

            setCheckoutMessage(response.payment?.failureReason || 'Reserva registrada. Falta configurar las credenciales del proveedor de pago.');
        } catch (error) {
            setCheckoutMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="pagina-app">
            <div className="contenedor carrito-layout">
                <div>
                    <span className="etiqueta-plan">Reserva</span>
                    <h1 className="titulo-seccion">Carrito de viajes</h1>
                    <p className="subtitulo-seccion">Completa los datos de tu viaje y paga de forma segura.</p>
                </div>

                {items.length === 0 ? (
                    <div className="estado-vacio">Tu carrito esta vacio por ahora.</div>
                ) : (
                    <div className="checkout-grid">
                        <div className="lista-carrito">
                            {items.map((item) => (
                                <article className="item-carrito" key={item.id}>
                                    <img src={item.image || item.heroImage} alt="" />
                                    <div className="item-carrito__contenido">
                                        <h3>{item.title}</h3>
                                        <p>{item.description || item.destination}</p>
                                        <dl className="item-carrito__detalles">
                                            <div>
                                                <dt>Destino</dt>
                                                <dd>{item.destination || 'A definir'}</dd>
                                            </div>
                                            <div>
                                                <dt>Duracion</dt>
                                                <dd>{item.days ? `${item.days} dias` : 'A definir'}</dd>
                                            </div>
                                            <div>
                                                <dt>Cantidad</dt>
                                                <dd>{item.quantity}</dd>
                                            </div>
                                            <div>
                                                <dt>Precio unitario</dt>
                                                <dd>{formatPrice(item.price)}</dd>
                                            </div>
                                            <div>
                                                <dt>Subtotal</dt>
                                                <dd>{formatPrice(item.price * item.quantity)}</dd>
                                            </div>
                                        </dl>
                                        {(item.includes?.length || item.aiPlan?.itinerary?.length) && (
                                            <details className="item-carrito__extra">
                                                <summary>Ver detalles del pedido</summary>
                                                {item.includes?.length ? (
                                                    <ul>{item.includes.map((detail) => <li key={detail}>{detail}</li>)}</ul>
                                                ) : (
                                                    <ul>{item.aiPlan.itinerary.slice(0, 5).map((day) => <li key={day.day}>Dia {day.day}: {day.title}</li>)}</ul>
                                                )}
                                            </details>
                                        )}
                                    </div>
                                    <button className="boton boton-secundario" onClick={() => removeItem(item.id)}>Quitar</button>
                                </article>
                            ))}
                        </div>
                        <form className="resumen-carrito checkout-panel" onSubmit={handleCheckout}>
                            <div className="precio-reserva">
                                <span>Precio de la reserva</span>
                                <strong>{formatPrice(totalPrice)}</strong>
                                <small>Moneda seleccionada: {currency === 'USD' ? 'US dolares' : 'pesos argentinos'}</small>
                            </div>
                            <label>
                                Viajeros
                                <input
                                    min="1"
                                    type="number"
                                    value={checkout.travelersCount}
                                    onChange={(event) => setCheckout((current) => ({ ...current, travelersCount: event.target.value }))}
                                />
                            </label>
                            <label>
                                Fecha estimada
                                <input
                                    type="date"
                                    value={checkout.travelDate}
                                    onChange={(event) => setCheckout((current) => ({ ...current, travelDate: event.target.value }))}
                                />
                            </label>
                            <label>
                                Metodo de pago
                                <select
                                    value={checkout.paymentMethod}
                                    onChange={(event) => setCheckout((current) => ({ ...current, paymentMethod: event.target.value }))}
                                >
                                    <option value="mercado_pago">Mercado Pago</option>
                                    <option value="paypal">PayPal</option>
                                </select>
                            </label>
                            <div className="checkout-security">
                                <span>Pago seguro</span>
                                <p>PayPal y Mercado Pago procesan la tarjeta. FlyGo solo prepara la reserva y no guarda CVV.</p>
                            </div>
                            <label>
                                Email de facturacion
                                <input
                                    type="email"
                                    value={checkout.billingEmail}
                                    onChange={(event) => setCheckout((current) => ({ ...current, billingEmail: event.target.value }))}
                                    placeholder="tu@email.com"
                                />
                            </label>
                            <label>
                                Nombre en la tarjeta
                                <input
                                    value={checkout.cardName}
                                    onChange={(event) => setCheckout((current) => ({ ...current, cardName: event.target.value }))}
                                    placeholder="Como figura en la tarjeta"
                                    required
                                />
                            </label>
                            <label>
                                Numero de tarjeta
                                <input
                                    inputMode="numeric"
                                    maxLength="19"
                                    value={checkout.cardNumber}
                                    onChange={(event) => setCheckout((current) => ({ ...current, cardNumber: event.target.value }))}
                                    placeholder="0000 0000 0000 0000"
                                    required
                                />
                            </label>
                            <div className="checkout-card-row">
                                <label>
                                    Vencimiento
                                    <input
                                        value={checkout.cardExpiry}
                                        onChange={(event) => setCheckout((current) => ({ ...current, cardExpiry: event.target.value }))}
                                        placeholder="MM/AA"
                                        required
                                    />
                                </label>
                                <label>
                                    CVV
                                    <input
                                        inputMode="numeric"
                                        maxLength="4"
                                        value={checkout.cardCvv}
                                        onChange={(event) => setCheckout((current) => ({ ...current, cardCvv: event.target.value }))}
                                        placeholder="123"
                                        required
                                    />
                                </label>
                            </div>
                            <label>
                                Documento / CUIT
                                <input
                                    value={checkout.billingDocument}
                                    onChange={(event) => setCheckout((current) => ({ ...current, billingDocument: event.target.value }))}
                                    placeholder="Para factura o comprobante"
                                />
                            </label>
                            <label>
                                Solicitudes
                                <textarea
                                    rows="3"
                                    value={checkout.specialRequests}
                                    onChange={(event) => setCheckout((current) => ({ ...current, specialRequests: event.target.value }))}
                                    placeholder="Hotel, horarios, necesidades especiales"
                                />
                            </label>
                            {checkoutMessage && <p className="mensaje-error">{checkoutMessage}</p>}
                            <button className="boton boton-primario" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Preparando pago...' : 'Pagar reserva'}
                            </button>
                            <button className="boton boton-secundario" type="button" onClick={clearCart}>Vaciar</button>
                            {!user && <Link className="enlace-auth" to="/login" state={{ returnTo: '/carrito' }}>Inicia sesion para guardar la reserva</Link>}
                        </form>
                    </div>
                )}
            </div>
        </section>
    );
}
