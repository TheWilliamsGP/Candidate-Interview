// let mediaRecorder = null;
// let recordedChunks = [];
// let recordingTimer = null;
// let recordingStartTime = null;
// let currentQuestionNumber = 1;
// const totalQuestions = 3; 
// let candidateInfo = null;

// document.addEventListener('DOMContentLoaded', async () => {
//     // Load candidate info
//     candidateInfo = JSON.parse(sessionStorage.getItem('candidateInfo'));
//     if (!candidateInfo) {
//         alert('Candidate information not found. Please start from the beginning.');
//         window.location.href = 'index.html';
//         return;
//     }

//     // Get current question number from URL
//     const urlParams = new URLSearchParams(window.location.search);
//     currentQuestionNumber = parseInt(urlParams.get('question')) || 1;
//     if (currentQuestionNumber < 1 || currentQuestionNumber > totalQuestions) {
//         currentQuestionNumber = 1;
//     }

//     updateProgressUI();
//     loadQuestionVideo();
//     await initializeCamera();
//     setupEventListeners();
// });

// // Load Question Video
// function loadQuestionVideo() {
//     const questionVideo = document.getElementById('question-video');
//     const questionSource = document.getElementById('question-source');

//     if (currentQuestionNumber > totalQuestions) {
//         questionVideo.innerHTML = '<p>No more question videos available.</p>';
//         return;
//     }

//     // Correct video path (based on your example)
//     const videoPath = `videos/question${currentQuestionNumber}.mp4`;
//     questionSource.src = videoPath;
//     questionSource.type = 'video/mp4';

//     questionVideo.load();

//     // Play when ready
//     questionVideo.oncanplay = () => {
//         questionVideo.play().catch(err => {
//             console.warn('Autoplay prevented:', err);
//         });
//     };

//     console.log(`Question ${currentQuestionNumber} video loaded`);
//     updateProgressUI();
// }

// // Camera Setup
// async function initializeCamera() {
//     const responseVideo = document.getElementById('response-video');
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
//         responseVideo.srcObject = stream;
//     } catch (err) {
//         console.error('Error accessing camera:', err);
//         alert('Unable to access camera. Please check permissions.');
//     }
// }

// // Event Listeners
// function setupEventListeners() {
//     document.getElementById('start-recording').addEventListener('click', startRecording);
//     document.getElementById('stop-recording').addEventListener('click', stopRecording);
//     document.getElementById('retake-recording').addEventListener('click', retakeRecording);
//     document.getElementById('save-response').addEventListener('click', saveAndContinue);
// }

// // Recording Functions
// function startRecording() {
//     const responseVideo = document.getElementById('response-video');
//     const startBtn = document.getElementById('start-recording');
//     const stopBtn = document.getElementById('stop-recording');
//     const status = document.getElementById('recording-status');
//     const timer = document.getElementById('recording-timer');

//     const stream = responseVideo.srcObject;
//     mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
//     recordedChunks = [];

//     mediaRecorder.ondataavailable = e => {
//         if (e.data.size > 0) recordedChunks.push(e.data);
//     };

//     mediaRecorder.onstop = () => {
//         const blob = new Blob(recordedChunks, { type: 'video/webm' });
//         const previewVideo = document.getElementById('preview-video');
//         const previewSection = document.getElementById('preview-section');
//         previewVideo.src = URL.createObjectURL(blob);
//         previewSection.classList.remove('hidden');
//     };

//     mediaRecorder.start();
//     recordingStartTime = Date.now();

//     startBtn.disabled = true;
//     stopBtn.disabled = false;
//     status.textContent = 'Recording...';
//     timer.classList.remove('hidden');

//     recordingTimer = setInterval(() => {
//         const elapsed = Date.now() - recordingStartTime;
//         const minutes = Math.floor(elapsed / 60000);
//         const seconds = Math.floor((elapsed % 60000) / 1000);
//         timer.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
//     }, 1000);
// }

// function stopRecording() {
//     if (mediaRecorder && mediaRecorder.state === 'recording') {
//         mediaRecorder.stop();
//         clearInterval(recordingTimer);

//         document.getElementById('start-recording').disabled = false;
//         document.getElementById('stop-recording').disabled = true;
//         document.getElementById('recording-status').textContent = 'Recording stopped';
//         document.getElementById('recording-timer').classList.add('hidden');
//     }
// }

// function retakeRecording() {
//     const previewVideo = document.getElementById('preview-video');
//     const previewSection = document.getElementById('preview-section');

//     if (previewVideo.src) URL.revokeObjectURL(previewVideo.src);
//     previewVideo.src = '';
//     previewSection.classList.add('hidden');
//     document.getElementById('recording-status').textContent = 'Click "Start Recording" to begin';
//     recordedChunks = [];
// }

// // Save & Next
// async function saveAndContinue() {
//     const blob = new Blob(recordedChunks, { type: 'video/webm' });
//     console.log(`Question ${currentQuestionNumber} response saved`);

//     if (currentQuestionNumber < totalQuestions) {
//         currentQuestionNumber++;
//         retakeRecording(); // reset recording UI
//         loadQuestionVideo();
//         history.replaceState(null, '', `question.html?question=${currentQuestionNumber}`);
//     } else {
//         alert('Interview complete!');
//         window.location.href = 'completion.html';
//     }
// }
// // Progress Bar
// function updateProgressUI() {
//     document.getElementById('current-question').textContent = currentQuestionNumber;
//     document.getElementById('progress-bar').style.width = `${(currentQuestionNumber / totalQuestions) * 100}%`;
// }

let mediaRecorder = null;
let recordedChunks = [];
let recordingTimer = null;
let recordingStartTime = null;
let currentQuestionNumber = 1;
const totalQuestions = 3; // Total number of question videos
let candidateInfo = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Load candidate info
    candidateInfo = JSON.parse(sessionStorage.getItem('candidateInfo'));
    if (!candidateInfo) {
        alert('Candidate information not found. Please start from the beginning.');
        window.location.href = 'index.html';
        return;
    }

    // Get current question number from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentQuestionNumber = parseInt(urlParams.get('question')) || 1;
    if (currentQuestionNumber < 1 || currentQuestionNumber > totalQuestions) {
        currentQuestionNumber = 1;
    }

    updateProgressUI();
    loadQuestionVideo();
    await initializeCamera();
    setupEventListeners();
});

// Load Question Video
function loadQuestionVideo() {
    const questionVideo = document.getElementById('question-video');
    const questionSource = document.getElementById('question-source');

    if (currentQuestionNumber > totalQuestions) {
        questionVideo.innerHTML = '<p>No more question videos available.</p>';
        return;
    }

    // Correct video path based on your filenames
    const videoPath = `videos/question${currentQuestionNumber}.mp4`;
    questionSource.src = videoPath;
    questionSource.type = 'video/mp4';

    questionVideo.load();

    // Play when ready
    questionVideo.oncanplay = () => {
        questionVideo.play().catch(err => {
            console.warn('Autoplay prevented:', err);
        });
    };

    console.log(`Question ${currentQuestionNumber} video loaded`);
    updateProgressUI();
}

// Camera Setup
async function initializeCamera() {
    const responseVideo = document.getElementById('response-video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
        responseVideo.srcObject = stream;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Unable to access camera. Please check permissions.');
    }
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('start-recording').addEventListener('click', startRecording);
    document.getElementById('stop-recording').addEventListener('click', stopRecording);
    document.getElementById('retake-recording').addEventListener('click', retakeRecording);
    document.getElementById('save-response').addEventListener('click', saveAndContinue);
    document.getElementById('previous-question').addEventListener('click', goToPreviousQuestion);
}

// Recording Functions
function startRecording() {
    const responseVideo = document.getElementById('response-video');
    const startBtn = document.getElementById('start-recording');
    const stopBtn = document.getElementById('stop-recording');
    const status = document.getElementById('recording-status');
    const timer = document.getElementById('recording-timer');

    const stream = responseVideo.srcObject;
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    recordedChunks = [];

    mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const previewVideo = document.getElementById('preview-video');
        const previewSection = document.getElementById('preview-section');
        previewVideo.src = URL.createObjectURL(blob);
        previewSection.classList.remove('hidden');
    };

    mediaRecorder.start();
    recordingStartTime = Date.now();

    startBtn.disabled = true;
    stopBtn.disabled = false;
    status.textContent = 'Recording...';
    timer.classList.remove('hidden');

    recordingTimer = setInterval(() => {
        const elapsed = Date.now() - recordingStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        timer.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    }, 1000);
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        clearInterval(recordingTimer);

        document.getElementById('start-recording').disabled = false;
        document.getElementById('stop-recording').disabled = true;
        document.getElementById('recording-status').textContent = 'Recording stopped';
        document.getElementById('recording-timer').classList.add('hidden');
    }
}

function retakeRecording() {
    const previewVideo = document.getElementById('preview-video');
    const previewSection = document.getElementById('preview-section');

    if (previewVideo.src) URL.revokeObjectURL(previewVideo.src);
    previewVideo.src = '';
    previewSection.classList.add('hidden');
    document.getElementById('recording-status').textContent = 'Click "Start Recording" to begin';
    recordedChunks = [];
}

// Save & Next
async function saveAndContinue() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    console.log(`Question ${currentQuestionNumber} response saved`);

    if (currentQuestionNumber < totalQuestions) {
        currentQuestionNumber++;
        retakeRecording(); // reset recording UI
        loadQuestionVideo();
        history.replaceState(null, '', `question.html?question=${currentQuestionNumber}`);
    } else {
        alert('Interview complete!');
        window.location.href = 'completion.html';
    }
}

// Previous Question
function goToPreviousQuestion() {
    if (currentQuestionNumber > 1) {
        currentQuestionNumber--;
        retakeRecording(); // Reset recording UI
        loadQuestionVideo(); // Load previous question video
        history.replaceState(null, '', `question.html?question=${currentQuestionNumber}`);
    } else {
        alert('You are on the first question.');
    }
}

// Progress Bar
function updateProgressUI() {
    document.getElementById('current-question').textContent = currentQuestionNumber;
    document.getElementById('progress-bar').style.width = `${(currentQuestionNumber / totalQuestions) * 100}%`;

    // Disable back button on first question
    const backBtn = document.getElementById('previous-question');
    if (currentQuestionNumber === 1) {
        backBtn.disabled = true;
        backBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        backBtn.disabled = false;
        backBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}
