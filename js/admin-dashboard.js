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
const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', async () => {
    try {
        // Log out using Supabase
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;

        // Redirect to login page
        window.location.href = 'login.html'; 
    } catch (err) {
        console.error('Logout failed:', err.message);
        alert('Logout failed. Please try again.');
    }
});
