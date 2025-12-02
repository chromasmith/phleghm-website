import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'phleghm-website';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    const storageZone = process.env.BUNNY_STORAGE_ZONE;
    const apiKey = process.env.BUNNY_STORAGE_API_KEY;
    const cdnHostname = process.env.BUNNY_CDN_HOSTNAME;
    if (!storageZone || !apiKey || !cdnHostname) {
      return NextResponse.json({ error: 'Bunny CDN not configured' }, { status: 500 });
    }
    // Generate unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${safeName}`;
    const filePath = `${folder}/${filename}`;
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Upload to Bunny Storage
    const uploadUrl = `https://storage.bunnycdn.com/${storageZone}/${filePath}`;
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': apiKey,
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: buffer,
    });
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Bunny upload failed:', errorText);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
    // Return the CDN URL
    const cdnUrl = `https://${cdnHostname}/${filePath}`;
    
    return NextResponse.json({ 
      success: true, 
      url: cdnUrl,
      filename: filename 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
