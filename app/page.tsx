import { supabase } from '@/lib/supabase';
import { HeroContent, UpcomingShow, PastShow } from '@/types/database';
import HamburgerMenu from '@/components/HamburgerMenu';
import HeroSection from '@/components/HeroSection';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import SocialLinks from '@/components/SocialLinks';
import SpotifyPlayer from '@/components/SpotifyPlayer';
import UpcomingShows from '@/components/UpcomingShows';
import PastShows from '@/components/PastShows';
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

async function getPastShows(): Promise<PastShow[]> {
  const { data } = await supabase
    .from('past_shows')
    .select('*')
    .order('show_date', { ascending: false });
  return data || [];
}

export const revalidate = 60;

export default async function Home() {
  const [heroContent, upcomingShows, pastShows] = await Promise.all([
    getHeroContent(),
    getUpcomingShows(),
    getPastShows(),
  ]);

  return (
    <main className="min-h-screen bg-black text-white">
      <HamburgerMenu />
      <HeroSection content={heroContent} />
      <AnnouncementBanner />
      <SocialLinks />
      <SpotifyPlayer />
      {upcomingShows.length > 0 && <UpcomingShows shows={upcomingShows} />}
      {pastShows.length > 0 && <PastShows shows={pastShows} />}
      <Footer />
    </main>
  );
}