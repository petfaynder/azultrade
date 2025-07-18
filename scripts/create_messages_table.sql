-- Drop table if it exists to start fresh
DROP TABLE IF EXISTS public.messages;

-- Create the messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message_content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Yeni' CHECK (status IN ('Yeni', 'Okundu', 'Cevaplandı', 'Arşivlendi')),
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments to columns for clarity
COMMENT ON COLUMN public.messages.status IS 'The current status of the message: Yeni, Okundu, Cevaplandı, Arşivlendi';

-- Create the trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_messages_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at on row modification
DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_messages_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public insert access" ON public.messages;
DROP POLICY IF EXISTS "Allow admin full access" ON public.messages;

-- Create policies
-- 1. Allow public (anonymous) users to insert new messages
CREATE POLICY "Allow public insert access" ON public.messages
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- 2. Allow admin users (service_role) to have full access
CREATE POLICY "Allow admin full access" ON public.messages
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
