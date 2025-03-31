import { NextRequest, NextResponse } from "next/server";

// Cache token to avoid unnecessary requests
let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing track ID" }, { status: 400 });
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

  // Fetch track details
  const spotifyRes = await fetch(
    `https://api.spotify.com/v1/tracks/${id}`,
    {
      headers: {
        Authorization: `Bearer ${cachedToken}`,
      },
    }
  );

  if (!spotifyRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch track details" },
      { status: spotifyRes.status }
    );
  }

  const track = await spotifyRes.json();
  return NextResponse.json({ track });
}
