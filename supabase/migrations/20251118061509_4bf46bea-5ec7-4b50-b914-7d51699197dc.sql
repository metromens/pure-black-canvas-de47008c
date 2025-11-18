
-- Add admin role for the newly created user
INSERT INTO user_roles (user_id, role)
VALUES ('fb439445-1319-4b19-8a9c-4a13e16fd127', 'admin'::app_role);
