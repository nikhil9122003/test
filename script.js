const slides = document.querySelectorAll('.question-slide');
let currentSlide = 0;
let timeLeft = 60;
let interval;
const answeredSlides = new Set(); // To keep track of slides where all questions have been answered

function showSlide(n) {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === n);
    });
    updateProgressBar();
    
    validateSlide(); // Ensure that next/submit buttons are correctly enabled/disabled
    togglePreviousButton(n);
    toggleSubmitButton(n);
}

function updateProgressBar() {
    const progress = document.querySelector('.progress');
    const progressPercent = ((currentSlide + 1) / slides.length) * 100;
    progress.style.width = progressPercent + '%';
}

function validateSlide() {
    const currentSlideInputs = slides[currentSlide].querySelectorAll('input[type="radio"]');
    const questions = new Set();

    currentSlideInputs.forEach(input => {
        if (input.name) {
            questions.add(input.name);
        }
    });

    const answeredQuestions = Array.from(questions).filter(qName => {
        return document.querySelector(`input[name="${qName}"]:checked`) !== null;
    });

    const allAnswered = answeredQuestions.length === questions.size;

    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Enable buttons based on question answering status
    if (allAnswered) {
        nextBtn.disabled = false;
        nextBtn.classList.remove('disabled');
        nextBtn.classList.add('enabled');

        // Enable submit button only on last slide
        if (currentSlide === slides.length - 1) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('disabled');
            submitBtn.classList.add('enabled');
            submitBtn.classList.add('green-button'); // Turn it green when all answered
        } else {
            submitBtn.classList.remove('green-button'); // Ensure it doesn't stay green on non-final slides
        }
    } else {
        nextBtn.disabled = true;
        nextBtn.classList.remove('enabled');
        nextBtn.classList.add('disabled');

        // Disable submit button if not all questions answered on last slide
        if (currentSlide === slides.length - 1) {
            submitBtn.disabled = true;
            submitBtn.classList.remove('enabled');
            submitBtn.classList.add('disabled');
            submitBtn.classList.remove('green-button'); // Ensure it doesn't stay green
        }
    }

    // Mark the current slide as answered if all questions are answered
    if (allAnswered) {
        answeredSlides.add(currentSlide);
    }
}

function togglePreviousButton(n) {
    const prevBtn = document.getElementById('prevBtn');
    if (n === 0) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }
}

function toggleSubmitButton(n) {
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    if (n === slides.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}

function startTimer() {
    interval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(interval);
            alert('Time is up! Submitting test.');
            submitTest();
        }
    }, 1000);
}

function nextQuestion() {
    if (document.getElementById('nextBtn').classList.contains('enabled') || answeredSlides.has(currentSlide)) {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
    } else {
        alert('Please answer all questions on this slide.');
    }
}

function prevQuestion() {
    if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
    }
}

function calculateScore() {
    let totalScore = 0;
    const radioButtons = document.querySelectorAll('input[type="radio"]:checked');
    radioButtons.forEach(rb => {
        totalScore += parseInt(rb.value); // Assuming radio button values represent scores
    });
    return totalScore;
}







function displayDepressionLevel(score) {
    let level = '';
    if (score >= 0 && score <= 9) {
        level = 'Low Depression';
    } else if (score >= 10 && score <= 14) {
        level = 'Mild Depression';
    } else if (score >= 15 && score <= 19) {
        level = 'Moderate Depression';
    } else if (score >= 20 && score <= 24) {
        level = 'Moderately Severe Depression';
    }  else if (score >= 25 && score <= 27) {
        level = 'Severe Depression';
    }
    alert(`Your depression level is: ${level}`);
}



function submitTest() {
    clearInterval(interval);
    const score = calculateScore();
    alert(`Your Depression score is: ${score}`);
    displayDepressionLevel(score);
}

function selectOption(button, questionName, value) {
    const allOptions = button.parentElement.querySelectorAll('.option-btn');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    button.classList.add('selected');

    const hiddenInput = document.querySelector(`input[name="${questionName}"][value="${value}"]`);
    if (hiddenInput) {
        hiddenInput.checked = true;
        validateSlide();
    }
}

// Initialize the first slide, progress bar, and timer
document.getElementById('nextBtn').addEventListener('click', nextQuestion);
document.getElementById('prevBtn').addEventListener('click', prevQuestion);
document.getElementById('submitBtn').addEventListener('click', () => {
    if (document.getElementById('submitBtn').classList.contains('enabled')) {
        submitTest();
    } else {
        alert('Please answer all questions on the last slide.');
    }
});
showSlide(currentSlide);
startTimer();
