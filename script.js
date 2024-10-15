const hamMenu = document.querySelector('.ham-menu');
const offScreenMenu = document.querySelector('.off-screen-menu');

// Toggle del menú al hacer clic en el icono
hamMenu.addEventListener('click', (event) => {
    hamMenu.classList.toggle('active');
    offScreenMenu.classList.toggle('active');
    event.stopPropagation(); // Prevenir que el clic en el icono cierre el menú
});

const menuLinks = document.querySelectorAll('.off-screen-menu a');

// Añadir un evento a cada enlace del menú
menuLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        hamMenu.classList.remove('active');
        offScreenMenu.classList.remove('active');

        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Cerrar el menú al hacer clic fuera de él
document.addEventListener('click', (event) => {
    // Verificar si el clic ocurrió fuera del menú y del icono de hamburguesa
    if (!offScreenMenu.contains(event.target) && !hamMenu.contains(event.target)) {
        hamMenu.classList.remove('active');
        offScreenMenu.classList.remove('active');
    }
});

// Añadir un evento a cada enlace del menú
menuLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        // Prevenir el comportamiento predeterminado del enlace
        event.preventDefault();

        // Cerrar el menú después de seleccionar un enlace
        hamMenu.classList.remove('active');
        offScreenMenu.classList.remove('active');

        // Obtener el destino del enlace (el id de la sección)
        const targetId = link.getAttribute('href');
        
        // Asegurarse de que el destino sea un id interno
        if (targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Desplazar suavemente hacia la sección correspondiente
                window.scrollTo({
                    top: targetElement.offsetTop,  // Posición de la sección
                    behavior: 'smooth'  // Desplazamiento suave
                });
            }
        }
    });
});
