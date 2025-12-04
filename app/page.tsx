import { supabase } from '@/lib/supabase';
import { HeroContent, UpcomingShow } from '@/types/database';
import HamburgerMenu from '@/components/HamburgerMenu';
import HeroSection from '@/components/HeroSection';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import SocialLinks from '@/components/SocialLinks';
import SpotifyPlayer from '@/components/SpotifyPlayer';
import UpcomingShows from '@/components/UpcomingShows';
import Footer from '@/components/Footer';

async function getHeroContent(): Promise<HeroContent | null> {
  const { data } = await supabase
    .from('hero_content')
    .select('*')
    .single();
  return data;
}

async function getUpcomingShows(): Promise<UpcomingShow[]> {
  const { data } = await supabase
    .from('upcoming_shows')
    .select('*')
    .gte('show_date', new Date().toISOString().split('T')[0])
    .order('show_date', { ascending: true });
  return data || [];
}

export const revalidate = 60;

export default async function Home() {
  const [heroContent, upcomingShows] = await Promise.all([
    getHeroContent(),
    getUpcomingShows(),
  ]);

  return (
    <main className="min-h-screen bg-black text-white">
      <HamburgerMenu />
      <HeroSection content={heroContent} />
      <AnnouncementBanner />
      <SocialLinks />
      <SpotifyPlayer />
      {upcomingShows.length > 0 && <UpcomingShows shows={upcomingShows} />}
      <Footer />
    </main>
  );
}
