document.addEventListener('DOMContentLoaded', () => {
    const deficienciasContainer = document.getElementById('deficiencias-container');
    const gridContainer = document.getElementById('grid-container');
    const showCentersButton = document.getElementById('showCentersButton');

    // Cargar deficiencias desde el archivo JSON
    async function loadDeficiencias() {
        try {
            const response = await fetch('deficiencias.json');

            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
            }

            const deficiencias = await response.json();
            const selectedCategories = JSON.parse(sessionStorage.getItem('selectedCategories')) || [];
            const filteredDeficiencias = deficiencias.filter(def => selectedCategories.includes(def.tag));

            displayDeficiencias(filteredDeficiencias);
        } catch (error) {
            console.error('Error al cargar las deficiencias:', error);
            alert('Hubo un error al cargar las deficiencias. Revisa la consola para más detalles.');
        }
    }

    // Mostrar las deficiencias en el contenedor
    function displayDeficiencias(deficiencias) {
        deficienciasContainer.innerHTML = '';
    
        deficiencias.forEach(def => {
            const defDiv = document.createElement('div');
            defDiv.classList.add('deficiencia-item');
    
            defDiv.innerHTML = `
                <img src="${def.icon}" alt="${def.nombre}" class="deficiencia-icono">
                <h4>${def.nombre}</h4>
                <p>${def.descripcion}</p>
            `;
            deficienciasContainer.appendChild(defDiv);
        });
    }

    // Cargar entidades desde el archivo JSON
    async function loadEntities() {
        try {
            const response = await fetch('entidades.json');

            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
            }

            const entities = await response.json();
            const selectedCategories = JSON.parse(sessionStorage.getItem('selectedCategories')) || [];
            const filteredEntities = entities.filter(entity => 
                entity.categorias.some(cat => selectedCategories.includes(cat))
            );

            displayEntities(filteredEntities);
        } catch (error) {
            console.error('Error al cargar las entidades:', error);
            alert('Hubo un error al cargar las entidades. Revisa la consola para más detalles.');
        }
    }

    // Mostrar las entidades en el grid
    function displayEntities(entities) {
        gridContainer.innerHTML = '';

        entities.forEach(entity => {
            const entityDiv = document.createElement('div');
            entityDiv.classList.add('grid-item');
            entityDiv.setAttribute('data-categories', entity.categorias.join(','));

            entityDiv.innerHTML = `
                <img src="${entity.logo}" alt="Logo de ${entity.nombre}">
                <h4>${entity.nombre}</h4>
                <p>Dirección: ${entity.direccion}</p>
                <p>Teléfono: ${entity.telefono}</p>
                <p>Email: <a href="mailto:${entity.email}">${entity.email}</a></p>
            `;
            gridContainer.appendChild(entityDiv);
        });
    }

    // Función para imprimir la página
    document.getElementById('printButton').addEventListener('click', () => {
        window.print();
    });

    // Función para guardar los resultados como PDF
    document.getElementById('pdfButton').addEventListener('click', () => {
        const pdfContent = gridContainer.innerHTML; // Obtener el contenido a guardar
        const pdfWindow = window.open('', '_blank'); // Abrir nueva ventana para el PDF
        pdfWindow.document.write(`
            <html>
            <head>
                <title>Resultados</title>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Montserrat', sans-serif; padding: 20px; }
                    .grid-item { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
                    img { width: 100%; height: auto; }
                </style>
            </head>
            <body>
                <h1>Resultados de la Búsqueda</h1>
                <div>${pdfContent}</div>
            </body>
            </html>
        `);
        pdfWindow.document.close();
        pdfWindow.print(); // Imprimir la nueva ventana
    });

    // Al hacer clic en el botón, mostrar los centros de atención
    showCentersButton.addEventListener('click', () => {
        gridContainer.classList.toggle('hidden'); // Alternar la visibilidad del contenedor de resultados
        if (gridContainer.classList.contains('hidden')) {
            showCentersButton.textContent = 'Ver posibles centros de atención'; // Cambiar el texto
        } else {
            showCentersButton.textContent = 'Ocultar centros de atención'; // Cambiar el texto
            loadEntities(); // Cargar entidades si están visibles
        }
    });

    // Cargar las deficiencias al cargar la página
    loadDeficiencias();
});
