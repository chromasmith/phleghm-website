import { NextResponse } from 'next/server';

const PLAUSIBLE_API_URL = 'https://plausible.io/api/v1/stats';
const SITE_ID = 'phlegm.music';

export async function GET(request: Request) {
  const apiKey = process.env.PLAUSIBLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Plausible API key not configured' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '30d';
  const metric = searchParams.get('metric') || 'aggregate';

  try {
    // Fetch aggregate stats (visitors, pageviews, bounce_rate, visit_duration)
    const aggregateRes = await fetch(
      `${PLAUSIBLE_API_URL}/aggregate?site_id=${SITE_ID}&period=${period}&metrics=visitors,pageviews,bounce_rate,visit_duration`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!aggregateRes.ok) {
      const errorText = await aggregateRes.text();
      return NextResponse.json(
        { error: `Plausible API error: ${errorText}` },
        { status: aggregateRes.status }
      );
    }

    const aggregateData = await aggregateRes.json();

    // Fetch top sources
    const sourcesRes = await fetch(
      `${PLAUSIBLE_API_URL}/breakdown?site_id=${SITE_ID}&period=${period}&property=visit:source&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const sourcesData = sourcesRes.ok ? await sourcesRes.json() : { results: [] };

    // Fetch top pages
    const pagesRes = await fetch(
      `${PLAUSIBLE_API_URL}/breakdown?site_id=${SITE_ID}&period=${period}&property=event:page&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const pagesData = pagesRes.ok ? await pagesRes.json() : { results: [] };

    // Fetch custom events (Social Clicks)
    const eventsRes = await fetch(
      `${PLAUSIBLE_API_URL}/breakdown?site_id=${SITE_ID}&period=${period}&property=event:name&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const eventsData = eventsRes.ok ? await eventsRes.json() : { results: [] };

    // Fetch Social Click breakdown by platform
    const socialClicksRes = await fetch(
      `${PLAUSIBLE_API_URL}/breakdown?site_id=${SITE_ID}&period=${period}&property=event:props:platform&filters=event:name==Social Click&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const socialClicksData = socialClicksRes.ok ? await socialClicksRes.json() : { results: [] };

    return NextResponse.json({
      aggregate: aggregateData.results,
      topSources: sourcesData.results,
      topPages: pagesData.results,
      events: eventsData.results,
      socialClicks: socialClicksData.results,
      period,
    });
  } catch (error) {
    console.error('Error fetching Plausible stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
