-- ============================================
-- App Settings (Global Config)
-- ============================================
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id)
);

-- RLS for App Settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage settings" ON public.app_settings
FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
);

-- Authenticated users can read settings (needed for trial info etc)
CREATE POLICY "Users can view settings" ON public.app_settings
FOR SELECT USING (auth.role() = 'authenticated');


-- ============================================
-- Plans (Subscription Plans)
-- ============================================
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    interval TEXT CHECK (interval IN ('month', 'year')),
    features JSONB, -- Array of strings
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Public/Auth users can view active plans
CREATE POLICY "Anyone can view active plans" ON public.plans
FOR SELECT USING (is_active = true);

-- Admins can manage plans
CREATE POLICY "Admins can manage plans" ON public.plans
FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
);


-- ============================================
-- Subscriptions (User Subscriptions)
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id), -- Nullable for generic trials? Prefer forcing a plan or null for 'trial'
    status TEXT CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'expired')),
    
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription" ON public.subscriptions
FOR SELECT USING (auth.uid() = user_id);

-- Admins can view/update all subscriptions
CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
