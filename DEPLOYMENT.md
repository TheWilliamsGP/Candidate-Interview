# Video Interview Platform - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Video Interview Platform with Supabase backend.

## Prerequisites
- Node.js (v14 or higher)
- Supabase account (https://supabase.com)
- Modern web browser with WebRTC support

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to https://supabase.com and create a new project
2. Note down your project URL and API keys
3. Copy these values to `js/supabase-config.js`:
   ```javascript
   const SUPABASE_URL = 'YOUR_PROJECT_URL';
   const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
   const SUPABASE_SERVICE_KEY = 'YOUR_SERVICE_KEY';
   ```

### 1.2 Set Up Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the following SQL commands:

```sql
-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    submission_status TEXT DEFAULT 'in_progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create video responses table
CREATE TABLE IF NOT EXISTS video_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    video_url TEXT,
    storage_path TEXT,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE
    ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust for production)
CREATE POLICY "Public read access" ON candidates FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON candidates FOR UPDATE USING (true);
CREATE POLICY "Public read access" ON video_responses FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON video_responses FOR INSERT WITH CHECK (true);
```

### 1.3 Set Up Storage Bucket
1. Go to Storage section in Supabase dashboard
2. Create a new bucket named `video-responses`
3. Configure bucket policies:
   ```sql
   -- Allow public uploads
   CREATE POLICY "Public upload access" ON storage.objects FOR INSERT 
   WITH CHECK (bucket_id = (SELECT id FROM storage.buckets WHERE name = 'video-responses'));
   
   -- Allow public read access
   CREATE POLICY "Public read access" ON storage.objects FOR SELECT 
   USING (bucket_id = (SELECT id FROM storage.buckets WHERE name = 'video-responses'));
   ```

## Step 2: Local Development

### 2.1 Install Dependencies
```bash
# Install a simple HTTP server for local development
npm install -g http-server
```

### 2.2 Configure Environment
1. Update `js/supabase-config.js` with your Supabase credentials
2. Update admin credentials in the same file (recommended for production: use environment variables)

### 2.3 Start Local Server
```bash
# Navigate to project directory
cd video-interview-platform

# Start HTTP server
http-server -p 8080
```

### 2.4 Test Locally
1. Open browser and go to `http://localhost:8080`
2. Test candidate flow
3. Test admin dashboard (login with credentials from supabase-config.js)

## Step 3: Video Files Setup

### 3.1 Create Question Videos
1. Create 5 question videos (recommended: MP4 format, 720p resolution)
2. Name them: `question-1.mp4`, `question-2.mp4`, etc.
3. Create an intro explanation video: `intro-explanation.mp4`
4. Place videos in appropriate directories or update video paths in HTML files

### 3.2 Update Video Paths
Update video source paths in:
- `index.html` (intro video)
- `question.html` (question videos)

## Step 4: Production Deployment

### 4.1 Static Hosting Options
The platform can be deployed to any static hosting service:

#### Netlify
1. Connect your GitHub repository
2. Set build command: (none)
3. Set publish directory: `/`
4. Deploy

#### Vercel
1. Import repository
2. Framework preset: Static
3. Deploy

#### GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select main branch

### 4.2 Environment Variables (Production)
For production deployment, move sensitive data to environment variables:
```javascript
// Instead of hardcoded values
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
```

## Step 5: Security Considerations

### 5.1 Update Admin Credentials
Change default admin credentials before production:
```javascript
const ADMIN_CREDENTIALS = {
    username: 'your-admin-username',
    password: 'your-secure-password'
};
```

### 5.2 Configure CORS
In Supabase dashboard, configure CORS settings for your domain.

### 5.3 Review Database Policies
Update RLS policies for production use:
```sql
-- More restrictive policies for production
CREATE POLICY "Authenticated users can insert" ON candidates 
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can only update own data" ON candidates 
FOR UPDATE USING (auth.uid() = user_id);
```

## Step 6: Testing Checklist

### 6.1 Candidate Flow
- [ ] Intro video plays correctly
- [ ] Form validation works
- [ ] Camera access requested
- [ ] Video recording functions
- [ ] Preview and retake options work
- [ ] Progress through all 5 questions
- [ ] Videos upload to Supabase
- [ ] Completion page displays

### 6.2 Admin Dashboard
- [ ] Login works with correct credentials
- [ ] Candidate list loads correctly
- [ ] Statistics display accurate numbers
- [ ] Individual video downloads work
- [ ] Bulk download works
- [ ] Candidate details modal displays correctly

### 6.3 Technical Tests
- [ ] Responsive design on mobile devices
- [ ] Video playback in different browsers
- [ ] WebRTC compatibility
- [ ] Upload progress indicators
- [ ] Error handling displays appropriate messages

## Step 7: Monitoring & Maintenance

### 7.1 Set Up Monitoring
- Monitor Supabase storage usage
- Set up alerts for failed uploads
- Track candidate completion rates

### 7.2 Regular Maintenance
- Review and clean old video files
- Update dependencies
- Monitor security advisories

## Troubleshooting

### Common Issues

1. **Camera not working**
   - Check browser permissions
   - Ensure HTTPS (required for production)
   - Verify WebRTC support

2. **Videos not uploading**
   - Check Supabase storage bucket policies
   - Verify network connectivity
   - Check file size limits

3. **Admin login not working**
   - Verify credentials in supabase-config.js
   - Check session storage in browser
   - Ensure JavaScript is enabled

4. **Database connection errors**
   - Verify Supabase URL and keys
   - Check network connectivity
   - Review database policies

## Support

For technical support:
1. Check browser console for error messages
2. Verify Supabase project settings
3. Review this deployment guide
4. Contact development team with error details

## License

This project is provided as-is for educational and commercial use. Please ensure you comply with all applicable laws and regulations regarding video recording and data privacy in your jurisdiction.