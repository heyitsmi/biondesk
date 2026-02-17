-- ============================================
-- Transactions (Midtrans Payments)
-- ============================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id),
    
    amount_usd DECIMAL(10, 2) NOT NULL, -- Original USD price
    amount_idr DECIMAL(15, 2) NOT NULL, -- Converted IDR amount
    exchange_rate DECIMAL(10, 2) NOT NULL, -- Rate used at time of transaction
    
    currency VARCHAR(3) DEFAULT 'IDR',
    status TEXT CHECK (status IN ('pending', 'paid', 'failed', 'canceled', 'refunded', 'expire')),
    
    midtrans_token TEXT,
    midtrans_order_id TEXT UNIQUE,
    midtrans_payment_type TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view all transactions" ON public.transactions
FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
);

-- Service role has full access (for webhooks)
CREATE POLICY "Service role full access transactions" ON public.transactions
FOR ALL USING (auth.role() = 'service_role');
