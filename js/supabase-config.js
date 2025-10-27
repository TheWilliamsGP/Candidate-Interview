// Supabase Configuration
const SUPABASE_URL = 'https://gxvyfqfdmalosocxionc.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4dnlmcWZkbWFsb3NvY3hpb25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MDEyOTMsImV4cCI6MjA3NzA3NzI5M30.iBb9IxSp9zyD6X4Vw137sZdUg95Nkh-Zlx5FIa0KpGA'; 
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4dnlmcWZkbWFsb3NvY3hpb25jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUwMTI5MywiZXhwIjoyMDc3MDc3MjkzfQ.J9Vff2fbKMud_NYdxi3X1iOjO0Ko7w5TYwHiFkpcekI'; 

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database schema
const DATABASE_SCHEMA = `
-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    submission_status TEXT DEFAULT 'in_progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Video responses table
CREATE TABLE IF NOT EXISTS video_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    video_url TEXT,
    storage_path TEXT,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE
    ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

// Storage bucket configuration
const STORAGE_BUCKET = 'video-responses';

// Admin credentials (in production, use environment variables)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123' // Change this in production!
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        supabaseClient,
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_KEY,
        DATABASE_SCHEMA,
        STORAGE_BUCKET,
        ADMIN_CREDENTIALS
    };
}