// // Admin dashboard JavaScript
// document.addEventListener('DOMContentLoaded', function() {
//     initializeAdminDashboard();
// });

// let candidatesData = [];
// let currentCandidate = null;

// document.addEventListener('DOMContentLoaded', function() {
//     initializeAdminDashboard();
// });

// let candidatesData = [];
// let currentCandidate = null;

// async function initializeAdminDashboard() {
//     // Check if admin is logged in
//     if (!isAdminLoggedIn()) {
//         window.location.href = 'admin-login.html';
//         return;
//     }
    
//     // Setup event listeners
//     setupEventListeners();
    
//     // Load candidates data
//     await loadCandidatesData();
    
//     // Update statistics
//     updateStatistics();
    
//     // Render candidates list
//     renderCandidatesList();
// }

// function setupEventListeners() {
//     document.getElementById('logout-btn').addEventListener('click', handleLogout);
//     document.getElementById('download-all-btn').addEventListener('click', handleDownloadAll);
//     document.getElementById('close-modal').addEventListener('click', closeDownloadModal);
//     document.getElementById('download-single-btn').addEventListener('click', () => handleDownloadOption('single'));
//     document.getElementById('download-combined-btn').addEventListener('click', () => handleDownloadOption('combined'));
// }

// async function loadCandidatesData() {
//     try {
//         // Show loading state
//         document.getElementById('loading-state').classList.remove('hidden');
//         document.getElementById('empty-state').classList.add('hidden');
        
//         // Fetch candidates from Supabase
//         const { data: candidates, error } = await supabaseClient
//             .from('candidates')
//             .select(`
//                 *,
//                 video_responses (*)
//             `)
//             .order('created_at', { ascending: false });
        
//         if (error) throw error;
        
//         candidatesData = candidates || [];
        
//         // Hide loading state
//         document.getElementById('loading-state').classList.add('hidden');
        
//         if (candidatesData.length === 0) {
//             document.getElementById('empty-state').classList.remove('hidden');
//         }
        
//     } catch (error) {
//         console.error('Error loading candidates:', error);
//         document.getElementById('loading-state').classList.add('hidden');
//         document.getElementById('empty-state').classList.remove('hidden');
//         showNotification('Failed to load candidates', 'error');
//     }
// }

// function updateStatistics() {
//     const totalCandidates = candidatesData.length;
//     const completedSubmissions = candidatesData.filter(c => c.submission_status === 'completed').length;
//     const pendingSubmissions = totalCandidates - completedSubmissions;
    
//     document.getElementById('total-candidates').textContent = totalCandidates;
//     document.getElementById('completed-submissions').textContent = completedSubmissions;
//     document.getElementById('pending-submissions').textContent = pendingSubmissions;
// }

// function renderCandidatesList() {
//     const container = document.getElementById('candidates-list');
    
//     if (candidatesData.length === 0) {
//         container.innerHTML = '<div class="text-center py-8 opacity-80">No candidates found</div>';
//         return;
//     }
    
//     container.innerHTML = candidatesData.map(candidate => {
//         const videoCount = candidate.video_responses ? candidate.video_responses.length : 0;
//         const completedQuestions = videoCount;
//         const statusColor = candidate.submission_status === 'completed' ? 'text-green-400' : 'text-yellow-400';
//         const statusText = candidate.submission_status === 'completed' ? 'Completed' : 'In Progress';
        
//         return `
//             <div class="candidate-card glass-effect rounded-xl p-6">
//                 <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
//                     <div class="flex-1">
//                         <h3 class="text-lg font-semibold mb-2">${candidate.full_name}</h3>
//                         <p class="text-sm opacity-80 mb-2">${candidate.email}</p>
//                         <div class="flex flex-wrap gap-4 text-sm">
//                             <span class="${statusColor} font-medium">${statusText}</span>
//                             <span class="opacity-70">${completedQuestions}/5 Questions</span>
//                             <span class="opacity-70">${formatDate(candidate.created_at)}</span>
//                         </div>
//                     </div>
//                     <div class="mt-4 md:mt-0 flex space-x-3">
//                         ${candidate.video_responses && candidate.video_responses.length > 0 ? `
//                             <button onclick="downloadCandidateVideos('${candidate.id}')" 
//                                 class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300">
//                                 Download Videos
//                             </button>
//                         ` : ''}
//                         <button onclick="viewCandidateDetails('${candidate.id}')" 
//                             class="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300">
//                             View Details
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }).join('');
// }

// function formatDate(dateString) {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//     });
// }

// function handleLogout() {
//     sessionStorage.removeItem('adminLoggedIn');
//     sessionStorage.removeItem('adminUsername');
//     window.location.href = 'admin-login.html';
// }

// function handleDownloadAll() {
//     if (candidatesData.length === 0) {
//         showNotification('No candidates to download', 'info');
//         return;
//     }
    
//     document.getElementById('download-modal').classList.remove('hidden');
// }

// function closeDownloadModal() {
//     document.getElementById('download-modal').classList.add('hidden');
// }

// async function handleDownloadOption(option) {
//     closeDownloadModal();
    
//     try {
//         if (option === 'single') {
//             await downloadIndividualVideos();
//         } else if (option === 'combined') {
//             await downloadCombinedZip();
//         }
//     } catch (error) {
//         console.error('Download error:', error);
//         showNotification('Failed to download videos', 'error');
//     }
// }

// async function downloadIndividualVideos() {
//     const zip = new JSZip();
//     let downloadCount = 0;
    
//     showNotification('Preparing download...', 'info');
    
//     for (const candidate of candidatesData) {
//         if (candidate.video_responses && candidate.video_responses.length > 0) {
//             const candidateFolder = zip.folder(candidate.full_name.replace(/\s+/g, '_'));
            
//             for (const video of candidate.video_responses) {
//                 try {
//                     const response = await fetch(video.video_url);
//                     const blob = await response.blob();
//                     candidateFolder.file(`Question${video.question_number}.webm`, blob);
//                     downloadCount++;
//                 } catch (error) {
//                     console.error(`Failed to download video ${video.id}:`, error);
//                 }
//             }
//         }
//     }
    
//     if (downloadCount > 0) {
//         const content = await zip.generateAsync({ type: 'blob' });
//         const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//         downloadBlob(content, `all_videos_${timestamp}.zip`);
//         showNotification(`Downloaded ${downloadCount} videos successfully`, 'success');
//     } else {
//         showNotification('No videos found to download', 'info');
//     }
// }

// async function downloadCombinedZip() {
//     // Similar to individual download but in a different structure
//     await downloadIndividualVideos();
// }

// async function downloadCandidateVideos(candidateId) {
//     const candidate = candidatesData.find(c => c.id === candidateId);
//     if (!candidate || !candidate.video_responses || candidate.video_responses.length === 0) {
//         showNotification('No videos found for this candidate', 'info');
//         return;
//     }
    
//     try {
//         const zip = new JSZip();
//         const candidateFolder = zip.folder(candidate.full_name.replace(/\s+/g, '_'));
        
//         showNotification('Preparing download...', 'info');
        
//         for (const video of candidate.video_responses) {
//             try {
//                 const response = await fetch(video.video_url);
//                 const blob = await response.blob();
//                 candidateFolder.file(`Question${video.question_number}.webm`, blob);
//             } catch (error) {
//                 console.error(`Failed to download video ${video.id}:`, error);
//             }
//         }
        
//         const content = await zip.generateAsync({ type: 'blob' });
//         const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//         downloadBlob(content, `${candidate.full_name.replace(/\s+/g, '_')}_videos_${timestamp}.zip`);
        
//         showNotification('Videos downloaded successfully', 'success');
        
//     } catch (error) {
//         console.error('Download error:', error);
//         showNotification('Failed to download videos', 'error');
//     }
// }

// function downloadBlob(blob, filename) {
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
// }

// function viewCandidateDetails(candidateId) {
//     const candidate = candidatesData.find(c => c.id === candidateId);
//     if (!candidate) return;
    
//     // Create and show modal with candidate details
//     const modal = document.createElement('div');
//     modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50';
//     modal.innerHTML = `
//         <div class="flex items-center justify-center min-h-screen p-4">
//             <div class="glass-effect rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//                 <h3 class="text-xl font-semibold mb-4">Candidate Details</h3>
//                 <div class="space-y-4">
//                     <div>
//                         <strong>Name:</strong> ${candidate.full_name}
//                     </div>
//                     <div>
//                         <strong>Email:</strong> ${candidate.email}
//                     </div>
//                     <div>
//                         <strong>Status:</strong> ${candidate.submission_status}
//                     </div>
//                     <div>
//                         <strong>Submitted:</strong> ${formatDate(candidate.created_at)}
//                     </div>
//                     <div>
//                         <strong>Videos:</strong> ${candidate.video_responses ? candidate.video_responses.length : 0}/5
//                     </div>
//                     ${candidate.video_responses && candidate.video_responses.length > 0 ? `
//                         <div>
//                             <strong>Recorded Questions:</strong>
//                             <ul class="mt-2 space-y-2">
//                                 ${candidate.video_responses.map(video => `
//                                     <li class="flex justify-between items-center p-2 bg-white/10 rounded">
//                                         <span>Question ${video.question_number}</span>
//                                         <span class="text-sm opacity-70">${video.duration || 0}s</span>
//                                     </li>
//                                 `).join('')}
//                             </ul>
//                         </div>
//                     ` : ''}
//                 </div>
//                 <div class="mt-6 flex space-x-4">
//                     <button onclick="downloadCandidateVideos('${candidate.id}')" 
//                         class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300">
//                         Download Videos
//                     </button>
//                     <button onclick="closeModal(this)" 
//                         class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300">
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     `;
    
//     document.body.appendChild(modal);
    
//     // Animate in
//     anime({
//         targets: modal,
//         opacity: [0, 1],
//         duration: 300,
//         easing: 'easeOutQuart'
//     });
// }

// function closeModal(button) {
//     const modal = button.closest('.fixed');
//     anime({
//         targets: modal,
//         opacity: [1, 0],
//         duration: 300,
//         easing: 'easeInQuart',
//         complete: () => {
//             document.body.removeChild(modal);
//         }
//     });
// }

// function isAdminLoggedIn() {
//     return sessionStorage.getItem('adminLoggedIn') === 'true';
// }

// function showNotification(message, type = 'info') {
//     const notification = document.createElement('div');
//     notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
//         type === 'success' ? 'bg-green-500' : 
//         type === 'error' ? 'bg-red-500' : 'bg-blue-500'
//     }`;
//     notification.textContent = message;
    
//     document.body.appendChild(notification);
    
//     anime({
//         targets: notification,
//         opacity: [0, 1],
//         translateX: [100, 0],
//         duration: 300,
//         easing: 'easeOutQuart'
//     });
    
//     setTimeout(() => {
//         anime({
//             targets: notification,
//             opacity: [1, 0],
//             translateX: [0, 100],
//             duration: 300,
//             easing: 'easeInQuart',
//             complete: () => {
//                 document.body.removeChild(notification);
//             }
//         });
//     }, 3000);
// }

// admin-dashboard.js

// Use service key for admin operations
const supabaseAdmin = supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// DOM elements
const candidatesList = document.getElementById('candidates-list');
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');
const downloadModal = document.getElementById('download-modal');
const downloadSingleBtn = document.getElementById('download-single-btn');
const downloadCombinedBtn = document.getElementById('download-combined-btn');
const closeModalBtn = document.getElementById('close-modal');
const downloadAllBtn = document.getElementById('download-all-btn');

let candidates = [];
let selectedCandidateId = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadCandidates();
});

// Load candidates from Supabase
async function loadCandidates() {
    try {
        const { data, error } = await supabaseAdmin
            .from('candidates')
            .select('id, full_name, email, submission_status');

        if (error) throw error;

        candidates = data;
        loadingState.classList.add('hidden');

        if (candidates.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        renderCandidates();
    } catch (err) {
        console.error('Error loading candidates:', err);
        loadingState.innerHTML = '<p class="opacity-80">Failed to load candidates.</p>';
    }
}

// Render candidate cards
function renderCandidates() {
    candidatesList.innerHTML = '';
    candidates.forEach(candidate => {
        const card = document.createElement('div');
        card.className = 'glass-effect p-4 rounded-xl candidate-card flex justify-between items-center';
        card.innerHTML = `
            <div>
                <h3 class="font-semibold text-lg">${candidate.full_name}</h3>
                <p class="text-sm opacity-80">${candidate.email}</p>
                <p class="text-sm opacity-80">Status: ${candidate.submission_status}</p>
            </div>
            <button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg" onclick="openDownloadModal('${candidate.id}')">Download Videos</button>
        `;
        candidatesList.appendChild(card);
    });
}

// Open modal for download options
function openDownloadModal(candidateId) {
    selectedCandidateId = candidateId;
    downloadModal.classList.remove('hidden');
}

// Close modal
closeModalBtn.addEventListener('click', () => {
    downloadModal.classList.add('hidden');
});

// Download individual videos
downloadSingleBtn.addEventListener('click', async () => {
    if (!selectedCandidateId) return;
    await downloadCandidateVideos(selectedCandidateId, false);
});

// Download combined ZIP
downloadCombinedBtn.addEventListener('click', async () => {
    if (!selectedCandidateId) return;
    await downloadCandidateVideos(selectedCandidateId, true);
});

// Download all candidates as ZIP
downloadAllBtn.addEventListener('click', async () => {
    if (candidates.length === 0) return;

    const zip = new JSZip();

    for (const candidate of candidates) {
        const folder = zip.folder(candidate.full_name.replace(/\s+/g, '_'));
        await addCandidateVideosToZip(candidate.id, folder);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_candidates_videos.zip';
    a.click();
    URL.revokeObjectURL(url);
});

// Helper: download candidate videos
async function downloadCandidateVideos(candidateId, asZip = false) {
    try {
        const { data: files, error } = await supabaseAdmin
            .storage
            .from(STORAGE_BUCKET)
            .list(`${candidateId}/`);

        if (error) throw error;
        if (!files || files.length === 0) {
            alert('No videos found for this candidate.');
            return;
        }

        if (asZip) {
            const zip = new JSZip();
            const candidate = candidates.find(c => c.id === candidateId);
            const folder = zip.folder(candidate.full_name.replace(/\s+/g, '_'));
            await addFilesToZip(files, candidateId, folder);
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${candidate.full_name.replace(/\s+/g, '_')}_videos.zip`;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            // Download files individually
            for (const file of files) {
                const { data: downloadData, error: downloadError } = await supabaseAdmin
                    .storage
                    .from(STORAGE_BUCKET)
                    .download(`${candidateId}/${file.name}`);
                if (downloadError) throw downloadError;

                const url = URL.createObjectURL(downloadData);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                a.click();
                URL.revokeObjectURL(url);
            }
        }

        downloadModal.classList.add('hidden');
    } catch (err) {
        console.error('Download error:', err);
        alert('Failed to download videos.');
    }
}

// Helper: add candidate videos to ZIP folder
async function addCandidateVideosToZip(candidateId, folder) {
    const { data: files } = await supabaseAdmin
        .storage
        .from(STORAGE_BUCKET)
        .list(`${candidateId}/`);

    if (files.length === 0) return;
    await addFilesToZip(files, candidateId, folder);
}

// Helper: add files to ZIP folder
async function addFilesToZip(files, candidateId, folder) {
    for (const file of files) {
        const { data: fileBlob } = await supabaseAdmin
            .storage
            .from(STORAGE_BUCKET)
            .download(`${candidateId}/${file.name}`);
        folder.file(file.name, fileBlob);
    }
}
