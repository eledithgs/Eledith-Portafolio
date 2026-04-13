document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const folderBody = document.getElementById('folderBody');
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.carousel-card');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (!folderBody) return;

    // --- LÓGICA DE PESTAÑAS ---
    tabs.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            const selectedTab = document.getElementById(target);

            if (selectedTab) {
                // Ocultar todos
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = "none";
                    content.classList.remove("active");
                });
                tabs.forEach(btn => btn.classList.remove("active"));

                // Mostrar seleccionado
                selectedTab.style.display = "block";
                selectedTab.classList.add("active");
                button.classList.add("active");

                // Color dinámico
                const activeColor = getComputedStyle(button).getPropertyValue('--tab-color');
                folderBody.style.backgroundColor = activeColor;

                // RECALCULAR CARRUSEL: Solo si entramos a servicios
                if (target === 'servicios') {
                    setTimeout(updateCarousel, 10); // Un pequeño delay para que el display block surta efecto
                }
            }
        });
    });

    // --- LÓGICA DE ACORDEONES ---
    document.querySelectorAll('.accordion-header').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.classList.toggle('active');
        });
    });

    // --- LÓGICA DE CARRUSEL ---
    let index = 0;

    function updateCarousel() {
        if (!cards.length || !track) return;

        const style = window.getComputedStyle(cards[0]);
        const marginRight = parseFloat(style.marginRight);
        const marginLeft = parseFloat(style.marginLeft);
        const cardWidth = cards[0].offsetWidth + marginRight + marginLeft;

        // Si el ancho es 0 (pestaña oculta), no hacemos nada todavía
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

    // --- ESTADO INICIAL ---
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