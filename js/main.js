document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const folderBody = document.getElementById('folderBody');
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.carousel-card');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (!folderBody) return;

    // --- 1. LÓGICA DE PESTAÑAS ---
    tabs.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            const selectedTab = document.getElementById(target);

            if (selectedTab) {
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = "none";
                    content.classList.remove("active");
                });
                tabs.forEach(btn => btn.classList.remove("active"));

                selectedTab.style.display = "block";
                selectedTab.classList.add("active");
                button.classList.add("active");

                const activeColor = getComputedStyle(button).getPropertyValue('--tab-color');
                folderBody.style.backgroundColor = activeColor;

                if (target === 'servicios') {
                    setTimeout(updateCarousel, 10);
                }
            }
        });
    });

    // --- 2. LÓGICA DE ACORDEONES ---
    document.querySelectorAll('.accordion-header').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.classList.toggle('active');
        });
    });

    // --- 3. LÓGICA DE CHECKBOXES (Servicios) ---
    document.querySelectorAll('.service-check').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            // Evita que el acordeón se abra/cierre al marcar el check
            e.stopPropagation();
            
            const card = checkbox.closest('.accordion-item');
            if (checkbox.checked) {
                card.classList.add('selected-package');
            } else {
                card.classList.remove('selected-package');
            }
        });
    });

    // --- 4. LÓGICA DE CARRUSEL ---
    let index = 0;

    function updateCarousel() {
        if (!cards.length || !track) return;

        const style = window.getComputedStyle(cards[0]);
        const marginRight = parseFloat(style.marginRight);
        const marginLeft = parseFloat(style.marginLeft);
        const cardWidth = cards[0].offsetWidth + marginRight + marginLeft;

        if (cardWidth === 0) return;

        const containerWidth = document.querySelector('.carousel-container').offsetWidth;
        const centerOffset = (containerWidth / 2) - (cardWidth / 2);

        const moveAmount = (-index * cardWidth) + centerOffset;
        track.style.transform = `translateX(${moveAmount}px)`;

        cards.forEach((card, i) => {
            card.classList.toggle('is-focused', i === index);
        });
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            index = (index + 1) % cards.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            index = (index - 1 + cards.length) % cards.length;
            updateCarousel();
        });
    }

    // --- 5. ESTADO INICIAL ---
    const initialBtn = document.querySelector('.tab-btn.active');
    if (initialBtn) {
        const target = initialBtn.getAttribute('data-target');
        const firstTab = document.getElementById(target);
        if (firstTab) {
            firstTab.style.display = "block";
            const color = getComputedStyle(initialBtn).getPropertyValue('--tab-color');
            folderBody.style.backgroundColor = color;
        }
    }

    window.addEventListener('resize', updateCarousel);
});

// --- 6. FUNCIÓN DE PRESUPUESTO (Fuera del DOMContentLoaded para ser accesible) ---
function prepararCotizacion() {
    const seleccionados = [];
    document.querySelectorAll('.service-check:checked').forEach(check => {
        // Obtenemos el texto del título (One Page, Sitio Base, etc)
        const titulo = check.closest('.accordion-header').querySelector('.item-title').innerText.trim();
        seleccionados.push(titulo);
    });

    if (seleccionados.length === 0) {
        alert("Por favor, selecciona al menos un servicio para cotizar.");
        return;
    }

    const mensaje = `Hola Edith, me interesa una cotización para: ${seleccionados.join(", ")}`;
    
    // Aquí puedes cambiar esto por tu link real de Telegram:
    // const telegramUrl = `https://t.me/TuUsuario?text=${encodeURIComponent(mensaje)}`;
    // window.open(telegramUrl, '_blank');

    window.location.href = `#contacto`; 
    alert("Has seleccionado: " + seleccionados.join(" + ") + ". ¡Cuéntame más en la sección de contacto!");
    console.log("Servicios elegidos:", mensaje);
}

// --- LÓGICA DEL MODAL Y COTIZACIÓN ---

function prepararCotizacion() {
    const modal = document.getElementById("modalCotizacion");
    const detalle = document.getElementById("detalleCotizacion");
    const totalElem = document.getElementById("precioTotal");
    
    let total = 0;
    let htmlDetalle = "";

    // Buscamos los checkboxes que el usuario marcó
    const seleccionados = document.querySelectorAll('.service-check:checked');

    if (seleccionados.length === 0) {
        alert("Por favor, selecciona al menos un servicio del catálogo.");
        return;
    }

    // Construimos el desglose del ticket con los precios reales
    seleccionados.forEach(check => {
        const nombre = check.getAttribute('data-name');
        const precio = parseInt(check.getAttribute('data-price'));
        
        total += precio;
        htmlDetalle += `
            <div class="price-row">
                <span>${nombre}</span>
                <span>$${precio.toLocaleString()}</span>
            </div>`;
    });

    // Insertamos el desglose en el HTML
    detalle.innerHTML = htmlDetalle;
    
    // Actualizamos el total (Precio base de la página)
    totalElem.innerText = `$${total.toLocaleString()} MXN`;
    
    // Mostramos el modal
    modal.style.display = "block";
}

// Función para cerrar el modal y manejar eventos de carga
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalCotizacion");
    const span = document.querySelector(".close-modal");

    // Cerrar con la X
    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }

    // Cerrar si hacen clic fuera del ticket (en el fondo oscuro)
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

// Función para enviar el correo con el formato solicitado
function enviarCorreo() {
    const seleccionados = [];
    let total = 0;

    document.querySelectorAll('.service-check:checked').forEach(check => {
        seleccionados.push(check.getAttribute('data-name'));
        total += parseInt(check.getAttribute('data-price'));
    });

    const emailDestino = "gonzalezeledith@gmail.com";
    const asunto = `Cotización Web - ${seleccionados[0]}`;
    
    // Cuerpo del mensaje que pediste
    const bodyText = `Buen día, quiero revisar esta cotización y la información que seleccioné:\n\n` +
                     `Servicios seleccionados: ${seleccionados.join(", ")}\n` +
                     `Presupuesto inicial estimado: $${total.toLocaleString()} MXN\n\n` +
                     `Quedo a la espera de sus comentarios para agendar una sesión.`;

    const mailtoLink = `mailto:${emailDestino}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(bodyText)}`;
    
    window.location.href = mailtoLink;
}
