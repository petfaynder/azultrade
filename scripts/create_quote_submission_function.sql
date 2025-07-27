-- Function to handle a new quote submission within a single transaction
CREATE OR REPLACE FUNCTION create_quote_with_items(
    customer_name_in TEXT,
    customer_email_in TEXT,
    company_name_in TEXT,
    phone_number_in TEXT,
    message_in TEXT,
    items_in JSONB
)
RETURNS UUID AS $$
DECLARE
    new_quote_id UUID;
    item JSONB;
BEGIN
    -- Insert into the quotes table and get the new ID
    INSERT INTO quotes (customer_name, customer_email, company_name, phone_number, message)
    VALUES (customer_name_in, customer_email_in, company_name_in, phone_number_in, message_in)
    RETURNING id INTO new_quote_id;

    -- Loop through the items and insert them into the quote_items table
    FOR item IN SELECT * FROM jsonb_array_elements(items_in)
    LOOP
        INSERT INTO quote_items (quote_id, product_id, quantity, notes)
        VALUES (
            new_quote_id,
            (item->>'product_id')::UUID,
            (item->>'quantity')::INT,
            item->>'notes'
        );
    END LOOP;

    -- Return the ID of the newly created quote
    RETURN new_quote_id;
END;
$$ LANGUAGE plpgsql;