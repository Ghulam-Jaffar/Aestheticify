import { NextResponse } from "next/server";

let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  // Fetch token if expired
  if (!cachedToken || Date.now() >= tokenExpiry) {
    const auth = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await res.json();
    cachedToken = tokenData.access_token;
    tokenExpiry = Date.now() + tokenData.expires_in * 1000 - 60_000; // renew a bit early
  }

  // Search for track
  const spotifyRes = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${cachedToken}`,
      },
    }
  );

  const data = await spotifyRes.json();
  const track = data?.tracks?.items?.[0] || null;

  return NextResponse.json({ track });
}
