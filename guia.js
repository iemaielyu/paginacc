document.addEventListener("DOMContentLoaded", () => {
    const guideContainer = document.getElementById("guide-container");

    // Fetch deficiencias.json and condiciones.json
    Promise.all([
        fetch('deficiencias.json').then(response => response.json()),
        fetch('condiciones.json').then(response => response.json())
    ]).then(([deficiencias, condiciones]) => {
        deficiencias.forEach((deficiencia, index) => {
            // Create each card
            const card = document.createElement("div");
            card.className = "guide-card";
            card.innerHTML = `
                <div class="card-icon">${deficiencia.icono}</div>
                <div class="card-content" id="content-${index}">
                    <h4>${deficiencia.nombre}</h4>
                    <p>${deficiencia.descripcion}</p>
                    <div class="related-conditions">
                        <p>Related:</p>
                        <ul id="related-${index}"></ul>
                    </div>
                    <div class="slideshow" id="slideshow-${index}">
                        <div class="slideshow-content"></div>
                        <div class="slideshow-nav">
                            <button onclick="prevSlide(${index})">Prev</button>
                            <button onclick="nextSlide(${index})">Next</button>
                        </div>
                    </div>
                    <button class="button-more-info" onclick="showMoreInfo(${index})">Ver más información</button>
                </div>
            `;
            
            guideContainer.appendChild(card);

            // Populate related conditions
            const relatedList = document.getElementById(`related-${index}`);
            condiciones
                .filter(cond => cond.categoria === deficiencia.tag)
                .forEach(cond => {
                    const listItem = document.createElement("li");
                    listItem.textContent = cond.nombre;
                    relatedList.appendChild(listItem);
                });

            // Populate slideshow with filtered conditions
            const slideshowContent = document.getElementById(`slideshow-${index}`).querySelector(".slideshow-content");
            condiciones
                .filter(cond => cond.categoria === deficiencia.tag)
                .forEach((cond, condIndex) => {
                    const slide = document.createElement("div");
                    slide.className = "slide";
                    slide.innerHTML = `
                        <h5>${cond.nombre}</h5>
                        <p><strong>Síntomas:</strong> ${cond.sintomas}</p>
                        <p><strong>Causas:</strong> ${cond.causas}</p>
                        <p><strong>Preclínico:</strong> ${cond.preclinico}</p>
                    `;
                    slide.classList.add(condIndex === 0 ? "active" : "");
                    slideshowContent.appendChild(slide);
                });

            // Toggle card expansion
            card.addEventListener("click", () => {
                const content = document.getElementById(`content-${index}`);
                content.style.display = content.style.display === "block" ? "none" : "block";
            });
        });
    });
});

function showMoreInfo(index) {
    document.getElementById(`slideshow-${index}`).style.display = 'block';
}

function prevSlide(index) {
    const slides = document.querySelector(`#slideshow-${index} .slideshow-content`).children;
    let activeIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    slides[activeIndex].classList.remove('active');
    activeIndex = (activeIndex - 1 + slides.length) % slides.length;
    slides[activeIndex].classList.add('active');
}

function nextSlide(index) {
    const slides = document.querySelector(`#slideshow-${index} .slideshow-content`).children;
    let activeIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    slides[activeIndex].classList.remove('active');
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add('active');
}
