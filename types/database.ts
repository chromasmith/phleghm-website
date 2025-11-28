export interface HeroContent {
  id: string;
  video_url: string | null;
  tagline: string;
  updated_at: string;
}

export interface UpcomingShow {
  id: string;
  show_date: string;
  venue: string;
  city: string;
  ticket_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PastShow {
  id: string;
  show_date: string;
  venue: string;
  city: string;
  event_name: string | null;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      hero_content: {
        Row: HeroContent;
        Insert: Omit<HeroContent, 'id' | 'updated_at'>;
        Update: Partial<Omit<HeroContent, 'id'>>;
      };
      upcoming_shows: {
        Row: UpcomingShow;
        Insert: Omit<UpcomingShow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UpcomingShow, 'id' | 'created_at'>>;
      };
      past_shows: {
        Row: PastShow;
        Insert: Omit<PastShow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PastShow, 'id' | 'created_at'>>;
      };
    };
  };
}
