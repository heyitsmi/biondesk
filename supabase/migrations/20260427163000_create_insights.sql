-- ============================================
-- Insight Categories table
-- ============================================
CREATE TABLE insight_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Insights table
-- ============================================
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  category_id UUID REFERENCES insight_categories(id) ON DELETE SET NULL,
  tags JSONB,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published'
  published_at TIMESTAMPTZ,
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for insight_categories
ALTER TABLE insight_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view insight categories" ON insight_categories
  FOR SELECT USING (true);

CREATE POLICY "Service role has full access to insight categories" ON insight_categories
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for insights
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published insights" ON insights
  FOR SELECT USING (status = 'published');

CREATE POLICY "Service role has full access to insights" ON insights
  FOR ALL USING (auth.role() = 'service_role');
