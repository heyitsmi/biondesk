-- Insert Default Trial Settings
INSERT INTO public.app_settings (key, value, description)
VALUES 
(
    'trial_settings', 
    '{"days": 7}', 
    'Configuration for new user trial period'
)
ON CONFLICT (key) DO NOTHING;

-- Insert Default Plans
INSERT INTO public.plans (name, description, price, "interval", features)
VALUES 
('Pro Monthly', 'Perfect for freelancers and individual professionals.', 15, 'month', '["Unlimited Proposals", "Unlimited Invoices", "AI Writing Assistant", "Client Management", "Email Support"]'),
('Pro Yearly', 'Best value for long-term growth. Save 20%.', 150, 'year', '["All Pro Features", "Priority Support", "2 Months Free"]');
