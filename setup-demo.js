// Demo setup script for Video Interview Platform
// This script creates placeholder video files for demonstration

const fs = require('fs');
const path = require('path');

console.log('Setting up demo files for Video Interview Platform...');

// Create directories
const dirs = [
    'questions',
    'videos'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Create demo README files
const demoContent = {
    'questions/README.md': `# Question Videos

Place your question videos here:
- question-1.mp4
- question-2.mp4
- question-3.mp4
- question-4.mp4
- question-5.mp4

These videos will be displayed to candidates during the interview.`,

    'videos/README.md': `# Video Storage

This directory is for local development video storage.
In production, videos are stored in Supabase Storage.`
};

Object.entries(demoContent).forEach(([filename, content]) => {
    fs.writeFileSync(filename, content);
    console.log(`Created: ${filename}`);
});

// Create placeholder HTML5 video files (these would be replaced with actual videos)
console.log('\nDemo setup complete!');
console.log('\nNext steps:');
console.log('1. Create your question videos and place them in the questions/ directory');
console.log('2. Create an intro explanation video and reference it in index.html');
console.log('3. Update js/supabase-config.js with your Supabase credentials');
console.log('4. Start a local server: npx http-server -p 8080');
console.log('5. Open http://localhost:8080 in your browser');

// Create a simple test page
const testHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Page - Video Interview Platform</title>
</head>
<body>
    <h1>Video Interview Platform - Test Page</h1>
    <p>This page helps you test if your setup is working correctly.</p>
    
    <h2>Test Checklist</h2>
    <ul>
        <li>✅ Project files are in place</li>
        <li>❓ Supabase configuration updated</li>
        <li>❓ Question videos created</li>
        <li>❓ Intro video created</li>
        <li>❓ Local server running</li>
    </ul>
    
    <h2>Quick Links</h2>
    <ul>
        <li><a href="index.html">Candidate Portal</a></li>
        <li><a href="admin-login.html">Admin Login</a></li>
        <li><a href="DEPLOYMENT.md">Deployment Guide</a></li>
    </ul>
</body>
</html>`;

fs.writeFileSync('test.html', testHTML);
console.log('Created test.html for quick testing');