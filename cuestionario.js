document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector('.start-button');
    const welcomeScreen = document.querySelector('.welcome-screen');
    const questionContainer = document.querySelector('.question-container');
    const questionScreens = document.querySelectorAll('.question-screen');
    const progress = document.querySelector('.progress');
    const progressBarContainer = document.querySelector('.progress-container'); // Contenedor del progress bar
    const keywords = ['cognitiva', 'cognitiva', 'cognitiva', 'visual', 'auditiva', 'fisica'];
    let currentQuestionIndex = 0;
    let queryConditions = [];

    // Oculta el contenedor de la barra de progreso inicialmente
    progressBarContainer.style.display = 'none';

    // Start questionnaire
    startButton.addEventListener('click', () => {
        welcomeScreen.style.opacity = '0';
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            questionContainer.style.display = 'flex';
            questionContainer.style.opacity = '1';
            // Mostrar la barra de progreso al iniciar el cuestionario
            progressBarContainer.style.display = 'block';
        }, 500);
    });

    // Handle question responses
    questionScreens.forEach((screen, index) => {
        const yesButton = screen.querySelectorAll('.response-button')[0];
        const noButton = screen.querySelectorAll('.response-button')[1];

        yesButton.addEventListener('click', () => handleAnswer(index, 'Yes'));
        noButton.addEventListener('click', () => handleAnswer(index, 'No'));
    });

    // Function to handle answers and build query
    function handleAnswer(index, answer) {
        if (answer === 'Yes') {
            // Get the keyword corresponding to the current question
            const keyword = keywords[index];
            queryConditions.push(keyword); // Store the keyword instead of the SQL condition
        }

        // Move to the next question or show the final query
        currentQuestionIndex++;
        if (currentQuestionIndex < questionScreens.length) {
            showNextQuestion(currentQuestionIndex);
        } else {
            showFinalQuery();
        }
    }

    // Show the next question
    function showNextQuestion(index) {
        questionScreens.forEach(screen => {
            screen.classList.remove('active');
            screen.style.opacity = '0';
        });

        setTimeout(() => {
            questionScreens[index].classList.add('active');
            questionScreens[index].style.opacity = '1';
            updateProgressBar(index);
        }, 300);
    }

    // Update the progress bar
    function updateProgressBar(index) {
        const progressPercentage = ((index + 1) / questionScreens.length) * 100;
        progress.style.width = `${progressPercentage}%`;
    }

    // Show the final query string and redirect to results page
    function showFinalQuery() {
        // Store the selected categories in sessionStorage
        sessionStorage.setItem('selectedCategories', JSON.stringify(queryConditions));

        // Redirect to results page
        window.location.href = 'resultados.html'; 
    }
});
