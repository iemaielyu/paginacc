document.addEventListener("DOMContentLoaded", () => {
    // Cargar los datos de deficiencias.json, condiciones.json y entidades.json
    Promise.all([
        fetch("deficiencias.json").then(response => response.json()),
        fetch("condiciones.json").then(response => response.json()),
        fetch("entidades.json").then(response => response.json())
    ])
    .then(([deficiencias, condiciones, entidades]) => {
        const gridContainer = document.getElementById("grid-container");
        const showCentersButton = document.getElementById("showCentersButton");

        // Mostrar las deficiencias seleccionadas
        const selectedCategories = JSON.parse(sessionStorage.getItem("selectedCategories")) || [];
        const filteredDeficiencias = deficiencias.filter(def => selectedCategories.includes(def.tag));
        displayDeficiencias(filteredDeficiencias, condiciones);

        // Configurar el botón para mostrar centros de atención
        showCentersButton.addEventListener("click", () => {
            if (gridContainer.classList.contains("hidden")) {
                gridContainer.classList.remove("hidden");
                showCentersButton.textContent = "Ocultar centros de atención";
                loadEntities(entidades, selectedCategories, gridContainer);
            } else {
                gridContainer.classList.add("hidden");
                showCentersButton.textContent = "Ver posibles centros de atención";
            }
        });
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
        alert(`Hubo un error al cargar los datos: ${error.message}`);
    });
});

    // Modal logic
    const modal = document.getElementById("conditionModal");
    const modalContent = document.getElementById("modal-slideshow-container");
    const closeButton = document.querySelector(".close-button");

    // Function to open modal
    function openModal(tag, conditions) {
        // Filter conditions for the selected tag
        const relatedConditions = conditions.filter(condition => condition.categoria === tag);

        // Populate modal content
        modalContent.innerHTML = ""; // Clear previous content

        // Add prev and next buttons
        const prevButton = document.createElement("button");
        prevButton.classList.add("prev");
        prevButton.textContent = "❮";
        modalContent.appendChild(prevButton);

        relatedConditions.forEach((condition, index) => {
            const slide = document.createElement("div");
            slide.classList.add("slide");
            slide.style.display = index === 0 ? "block" : "none"; // Show only the first slide initially

            slide.innerHTML = `
                <img src="${condition.imagen}" alt="${condition.nombre}">
                <h4>${condition.nombre}</h4>
                <h3 class="h3-slide">Síntomas:</h3>  <p>${condition.sintomas}</p>
                <h3 class="h3-slide">Causas:</h3> <p>${condition.causas}</p>
                <h3 class="h3-slide">Preclínico:</h3> <p>${condition.preclinico}</p>
            `;
            modalContent.appendChild(slide);
        });

        const nextButton = document.createElement("button");
        nextButton.classList.add("next");
        nextButton.textContent = "❯";
        modalContent.appendChild(nextButton);

        // Show modal
        modal.style.display = "block";
    }

    // Close modal
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside of it
    window.addEventListener("click", event => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Handle slide navigation
    modalContent.addEventListener("click", event => {
        if (event.target.classList.contains("prev")) {
            navigateSlides(-1);
        } else if (event.target.classList.contains("next")) {
            navigateSlides(1);
        }
    });

    // Slide navigation logic
    function navigateSlides(direction) {
        const slides = modalContent.querySelectorAll(".slide");
        let currentIndex = Array.from(slides).findIndex(slide =>
            slide.style.display === "block"
        );
        slides[currentIndex].style.display = "none";
        currentIndex = (currentIndex + direction + slides.length) % slides.length;
        slides[currentIndex].style.display = "block";
    }

function loadEntities(entidades, selectedCategories, gridContainer) {
    gridContainer.innerHTML = ''; // Limpia el contenedor antes de agregar nuevas entidades

    const filteredEntities = entidades.filter(entity =>
        entity.categorias.some(cat => selectedCategories.includes(cat))
    );

    filteredEntities.forEach(entity => {
        const entityDiv = document.createElement('div');
        entityDiv.classList.add('grid-item');

        entityDiv.innerHTML = `
        <img src="${entity.logo}" alt="Logo de ${entity.nombre}">
        <h4>${entity.nombre}</h4>
        <h3>Área de cobertura:</h3> <p>${entity.area}</p>
        <h3>Dirección:</h3> <p>${entity.direccion}</p>
        <h3>Teléfono:</h3> <p> ${entity.telefono}</p>
        <h3>Email:</h3> <p> <a href="mailto:${entity.email}">${entity.email}</a></p>
        <h3>Horario:</h3> <p> ${entity.horario}</p>
        <h3>Servicios:</h3> <p> ${entity.servicios}</p>
        <h3>Condiciones atendidas:</h3> <p> ${entity.atendidas}</p>
        `;
        gridContainer.appendChild(entityDiv);
    });
}

function displayDeficiencias(deficiencias, condiciones) {
    const deficienciasContainer = document.getElementById("deficiencias-container");
    deficienciasContainer.innerHTML = ''; // Clear the container before adding new cards

    deficiencias.forEach(def => {
        // Create the card
        const card = document.createElement('div');
        card.classList.add('card');

        // Add image
        const img = document.createElement('img');
        img.src = def.icon;
        img.alt = def.nombre;
        card.appendChild(img);

        // Add title and description
        const title = document.createElement('h3');
        title.textContent = def.nombre;
        card.appendChild(title);

        const description = document.createElement('p');
        description.textContent = def.descripcion;
        card.appendChild(description);

        // Add "View Conditions" button
        const button = document.createElement('button');
        button.textContent = "Ver condiciones";
        button.addEventListener("click", () => openModal(def.tag, condiciones));
        card.appendChild(button);

        deficienciasContainer.appendChild(card);
    });
}
