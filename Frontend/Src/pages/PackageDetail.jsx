import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import useCart from '../hooks/useCart.js';
import useAuth from '../hooks/useAuth.js';
import useCurrency from '../hooks/useCurrency.js';
import { packages } from '../data/packages.js';
import { api } from '../services/apiClient.js';

export default function PackageDetail() {
    const { packageId } = useParams();
    const { addItem } = useCart();
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();
    const [packageItem, setPackageItem] = useState(() => packages.find((item) => item.id === packageId));
    const [activeImage, setActiveImage] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [experienceMessage, setExperienceMessage] = useState('');
    const mapSrc = useMemo(() => {
        if (!packageItem) return '';
        return `https://www.google.com/maps?q=${encodeURIComponent(packageItem.mapQuery || packageItem.destination)}&output=embed`;
    }, [packageItem]);

    useEffect(() => {
        let isMounted = true;

        api.getPackage(packageId)
            .then((apiPackage) => {
                if (isMounted && apiPackage?.id) setPackageItem(apiPackage);
            })
            .catch(() => {});

        return () => {
            isMounted = false;
        };
    }, [packageId]);

    useEffect(() => {
        if (!packageItem) return;

        Promise.all([
            api.getReviews(packageItem.id),
            api.getComments(packageItem.id)
        ])
            .then(([apiReviews, apiComments]) => {
                setReviews(apiReviews);
                setComments(apiComments);
            })
            .catch((error) => setExperienceMessage(error.message));
    }, [packageItem?.id]);

    if (!packageItem) {
        return (
            <section className="pagina-app">
                <div className="contenedor bloque-centrado">
                    <span className="etiqueta-plan">Plan no encontrado</span>
                    <h1 className="titulo-seccion">Ese paquete no existe</h1>
                    <p className="subtitulo-seccion">Puede que el enlace este mal escrito o que el plan ya no este disponible.</p>
                    <Link className="boton boton-primario" to="/planes">Volver a planes</Link>
                </div>
            </section>
        );
    }

    const galleryImages = [packageItem.heroImage, ...packageItem.gallery];

    const averageRating = reviews.length
        ? (reviews.reduce((total, review) => total + Number(review.rating), 0) / reviews.length).toFixed(1)
        : '0.0';
    const goToLogin = () => navigate('/login', { state: { returnTo: `/planes/${packageItem.id}` } });
    const changeGalleryImage = (direction) => {
        setActiveImage((current) => (current + direction + galleryImages.length) % galleryImages.length);
    };
    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        setExperienceMessage('');

        if (!user) {
            goToLogin();
            return;
        }

        const text = commentText.trim();
        if (!text) return;

        try {
            const comment = await api.createComment({
                packageId: packageItem.id,
                name: user.firstName || user.email,
                text
            });
            setComments((current) => [comment, ...current]);
            setCommentText('');
        } catch (error) {
            setExperienceMessage(error.message);
        }
    };
    const handleReviewSubmit = async (event) => {
        event.preventDefault();
        setExperienceMessage('');

        if (!user) {
            goToLogin();
            return;
        }

        const text = reviewForm.text.trim();
        if (!text) return;

        try {
            const review = await api.createReview({
                packageId: packageItem.id,
                name: user.firstName || user.email,
                rating: Number(reviewForm.rating),
                text
            });
            setReviews((current) => [review, ...current]);
            setReviewForm({ rating: 5, text: '' });
        } catch (error) {
            setExperienceMessage(error.message);
        }
    };

    return (
        <section
            className="pagina-app pagina-detalle-viaje"
            style={{ '--detalle-hero': `url(${packageItem.heroImage})` }}
        >
            <div className="detalle-hero-destino">
                <div className="contenedor detalle-paquete">
                    <div className="detalle-paquete__hero">
                        <span className="etiqueta-plan">{packageItem.tag}</span>
                        <h1>{packageItem.title}</h1>
                        <p>{packageItem.description}</p>
                        <div className="detalle-paquete__acciones">
                            <button className="boton boton-primario" onClick={() => addItem(packageItem)}>Agregar al carrito</button>
                            <Link className="boton boton-secundario" to="/plan-personalizado">Personalizar parecido</Link>
                        </div>
                    </div>

                    <aside className="detalle-paquete__resumen tarjeta-3d">
                        <strong>Desde {formatPrice(packageItem.price)}</strong>
                        <span>{packageItem.destination}</span>
                        <span>{packageItem.days} dias</span>
                        <span>{averageRating}/5 valoracion</span>
                        <span>Asistencia incluida</span>
                    </aside>
                </div>
            </div>

            <div className="contenedor detalle-contenido">
                <div className="detalle-paquete__grid">
                    <article className="tarjeta-3d">
                        <h2>Incluye</h2>
                        <ul>
                            {packageItem.includes.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </article>
                    <article className="tarjeta-3d">
                        <h2>Ideal para</h2>
                        <ul>
                            {packageItem.idealFor.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </article>
                </div>

                <section className="galeria-destino escena-3d" aria-labelledby="galeria-destino-titulo">
                    <span className="etiqueta-plan">{packageItem.tag}</span>
                    <h2 id="galeria-destino-titulo">Galeria del destino</h2>
                    <div className="galeria-destino__visor">
                        <button className="galeria-flecha galeria-flecha--prev" type="button" onClick={() => changeGalleryImage(-1)} aria-label="Imagen anterior">
                            <span aria-hidden="true">&lt;</span>
                        </button>
                        <img src={galleryImages[activeImage]} alt={`${packageItem.title} vista ${activeImage + 1}`} />
                        <button className="galeria-flecha galeria-flecha--next" type="button" onClick={() => changeGalleryImage(1)} aria-label="Imagen siguiente">
                            <span aria-hidden="true">&gt;</span>
                        </button>
                        <div className="galeria-destino__controles" aria-label="Seleccionar imagen">
                            {galleryImages.map((image, index) => (
                                <button
                                    className={activeImage === index ? 'activo' : ''}
                                    key={image}
                                    onClick={() => setActiveImage(index)}
                                    aria-label={`Ver imagen ${index + 1}`}
                                    type="button"
                                >
                                    <img src={image} alt="" />
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mapa-destino" aria-labelledby="mapa-destino-titulo">
                    <div className="encabezado-bloque">
                        <span className="etiqueta-plan">Mapa interactivo</span>
                        <h2 id="mapa-destino-titulo">{packageItem.destination}</h2>
                    </div>
                    <div className="mapa-destino__frame escena-3d">
                        <iframe
                            title={`Mapa de ${packageItem.destination}`}
                            src={mapSrc}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                    </div>
                </section>

                <section className="experiencia-destino">
                    <div className="resenas-destino tarjeta-3d">
                        <div className="encabezado-bloque">
                            <span className="etiqueta-plan">Resenas</span>
                            <h2>Viajeros que ya fueron</h2>
                        </div>
                        {experienceMessage && <p className="mensaje-error">{experienceMessage}</p>}
                        <form className="resena-form" onSubmit={handleReviewSubmit}>
                            <div className="selector-estrellas" aria-label="Elegir estrellas">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        aria-label={`${rating} estrellas`}
                                        className={Number(reviewForm.rating) >= rating ? 'activo' : ''}
                                        key={rating}
                                        onClick={() => setReviewForm((current) => ({ ...current, rating }))}
                                        type="button"
                                    >
                                        &#9733;
                                    </button>
                                ))}
                            </div>
                            <textarea
                                placeholder={user ? 'Conta como fue tu experiencia' : 'Inicia sesion para dejar una resena'}
                                rows="3"
                                value={reviewForm.text}
                                onChange={(event) => setReviewForm((current) => ({ ...current, text: event.target.value }))}
                            />
                            <button className="boton boton-primario" type="submit">Publicar resena</button>
                        </form>
                        <div className="resenas-destino__grid">
                            {reviews.length === 0 && <p className="estado-vacio">Todavia no hay resenas para este viaje.</p>}
                            {reviews.map((review, index) => (
                                <article key={`${review.name}-${index}`}>
                                    <strong>{review.name}</strong>
                                    <span>{Number(review.rating)}/5</span>
                                    <p>{review.text}</p>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="comentarios-destino tarjeta-3d">
                        <div className="encabezado-bloque">
                            <span className="etiqueta-plan">Comentarios</span>
                            <h2>Preguntas y experiencias</h2>
                        </div>
                        <form className="comentarios-form" onSubmit={handleCommentSubmit}>
                            <textarea
                                placeholder={user ? 'Escribe un comentario' : 'Inicia sesion para comentar'}
                                rows="4"
                                value={commentText}
                                onChange={(event) => setCommentText(event.target.value)}
                            />
                            <button className="boton boton-primario" type="submit">Publicar comentario</button>
                        </form>
                        <div className="comentarios-lista">
                            {comments.length === 0 && <p className="estado-vacio">Todavia no hay comentarios para este viaje.</p>}
                            {comments.map((comment, index) => (
                                <article key={`${comment.name}-${index}`}>
                                    <strong>{comment.name}</strong>
                                    <p>{comment.text}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}
