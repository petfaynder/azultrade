CREATE OR REPLACE FUNCTION insert_contact_message(
    full_name_input TEXT,
    email_input TEXT,
    phone_number_input TEXT,
    subject_input TEXT,
    message_content_input TEXT,
    ip_address_input TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.messages (full_name, email, phone_number, subject, message_content, ip_address)
    VALUES (full_name_input, email_input, phone_number_input, subject_input, message_content_input, ip_address_input);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the anon role so it can be called from the public API
GRANT EXECUTE ON FUNCTION public.insert_contact_message(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;