import { NextRequest, NextResponse } from 'next/server';
interface BunnyFile {
  Guid: string;
  ObjectName: string;
  Length: number;
  LastChanged: string;
  IsDirectory: boolean;
}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'phleghm-website';
    const storageZone = process.env.BUNNY_STORAGE_ZONE;
    const apiKey = process.env.BUNNY_STORAGE_API_KEY;
    const cdnHostname = process.env.BUNNY_CDN_HOSTNAME;
    if (!storageZone || !apiKey || !cdnHostname) {
      return NextResponse.json({ error: 'Bunny CDN not configured' }, { status: 500 });
    }
    const listUrl = `https://storage.bunnycdn.com/${storageZone}/${folder}/`;
    
    const response = await fetch(listUrl, {
      method: 'GET',
      headers: {
        'AccessKey': apiKey,
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bunny list failed:', errorText);
      return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
    }
    const files: BunnyFile[] = await response.json();
    
    const mediaFiles = files
      .filter(f => !f.IsDirectory && /\.(mp4|mov|webm|jpg|jpeg|png|gif|webp)$/i.test(f.ObjectName))
      .map(f => ({
        name: f.ObjectName,
        url: `https://${cdnHostname}/${folder}/${f.ObjectName}`,
        size: f.Length,
        modified: f.LastChanged,
        isVideo: /\.(mp4|mov|webm)$/i.test(f.ObjectName),
      }))
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
    return NextResponse.json({ files: mediaFiles });
  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
