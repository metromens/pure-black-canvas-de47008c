
-- Delete existing admin user
DELETE FROM user_roles WHERE user_id = (SELECT id FROM profiles WHERE email = 'admin@techverse.com');
DELETE FROM profiles WHERE email = 'admin@techverse.com';
