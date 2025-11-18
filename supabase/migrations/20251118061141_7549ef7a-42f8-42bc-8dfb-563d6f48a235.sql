
-- Insert admin user
INSERT INTO profiles (name, email, password_hash)
VALUES ('Admin User', 'admin@techverse.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9')
ON CONFLICT (email) DO NOTHING;

-- Insert admin role
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role 
FROM profiles 
WHERE email = 'admin@techverse.com'
ON CONFLICT (user_id, role) DO NOTHING;
