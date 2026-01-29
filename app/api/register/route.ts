import { NextResponse } from "next/server";

const EXTERNAL_API_URL = "https://www.strategyfundamentals.com";
const EXTERNAL_API_KEY = "Ef8ZNmHaC1Zq87b5HNLdOb2puROkoVV7";

export async function POST(request: Request) {
  try {

    const body = await request.json();
    const { email, password, disclaimerAccepted } = body as {
      email?: string;
      password?: string;
      disclaimerAccepted?: boolean;
    };

    // Validate required fields
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (!disclaimerAccepted) {
      return NextResponse.json(
        { error: "Disclaimer must be accepted" },
        { status: 400 }
      );
    }

    // Get client IP for trial abuse prevention
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : undefined;

    // Call the external registration API
    const apiUrl = `${EXTERNAL_API_URL}/api/external/register`;
    console.log("Calling external API:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": EXTERNAL_API_KEY
      },
      body: JSON.stringify({
        email,
        password,
        disclaimerAccepted,
        clientIp
      })
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response from external API:", text.substring(0, 500));
      return NextResponse.json(
        { error: "External registration service unavailable. Please try again later." },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Registration failed" },
        { status: response.status }
      );
    }

    // Return the login URL for redirect
    return NextResponse.json({
      success: true,
      loginUrl: `${EXTERNAL_API_URL}${data.loginUrl}`,
      userId: data.userId,
      email: data.email,
      trialEndsAt: data.trialEndsAt
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
