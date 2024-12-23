document.addEventListener("DOMContentLoaded", () => {
    // Load deficiencies and conditions data
    Promise.all([
        fetch("deficiencias.json").then(response => response.json()),
        fetch("condiciones.json").then(response => response.json())
    ]).then(([deficiencias, condiciones]) => {
        const container = document.getElementById("cards-container");

        // Generate deficiency cards
        deficiencias.forEach(deficiencia => {
            // Create the card
            const card = document.createElement("div");
            card.classList.add("card");

            // Card image
            const img = document.createElement("img");
            img.src = deficiencia.icon;
            img.alt = deficiencia.nombre;
            card.appendChild(img);

            // Card content
            const content = document.createElement("div");
            content.classList.add("card-content");

            // Title and description
            const title = document.createElement("h3");
            title.textContent = deficiencia.nombre;
            content.appendChild(title);

            const description = document.createElement("p");
            description.textContent = deficiencia.descripcion;
            content.appendChild(description);

            // "Ver Condiciones" button
            const button = document.createElement("button");
            button.textContent = "Ver condiciones";
            button.addEventListener("click", () => openModal(deficiencia.tag, condiciones));
            content.appendChild(button);

            card.appendChild(content);
            container.appendChild(card);
        });
    }).catch(error => console.error("Error loading data:", error));

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
                <p>Síntomas: ${condition.sintomas}</p>
                <p>Causas: ${condition.causas}</p>
                <p>Preclínico: ${condition.preclinico}</p>
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
});
