-- Legal content table (single row - feeds Footer, LegalModal, AboutModal when synced)
CREATE TABLE legal_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'PHLEGM®',
  trademark_text TEXT NOT NULL DEFAULT 'PHLEGM is a registered trademark under',
  trademark_link_text TEXT NOT NULL DEFAULT 'USPTO',
  trademark_url TEXT NOT NULL DEFAULT 'https://my.uspto.gov/',
  copyright_text TEXT NOT NULL DEFAULT 'All content on this website, including music, images, and videos, is owned by PHLEGM and may not be reproduced without permission.',
  rights_text TEXT NOT NULL DEFAULT 'All rights reserved.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row
INSERT INTO legal_content (title) VALUES ('PHLEGM®');

-- About content table (single row)
CREATE TABLE about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_video_url TEXT,
  hero_video_width INTEGER DEFAULT 576,
  hero_video_height INTEGER DEFAULT 758,
  use_legal_content BOOLEAN DEFAULT TRUE,
  title TEXT DEFAULT 'PHLEGM®',
  about_text TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row with sync enabled
INSERT INTO about_content (use_legal_content) VALUES (TRUE);

-- Enable RLS
ALTER TABLE legal_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read legal_content" ON legal_content FOR SELECT USING (true);
CREATE POLICY "Public read about_content" ON about_content FOR SELECT USING (true);
