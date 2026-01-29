// Test script for Strategy Fundamentals External Registration API

const EXTERNAL_API_URL = "https://www.strategyfundamentals.com";
const EXTERNAL_API_KEY = "Ef8ZNmHaC1Zq87b5HNLdOb2puROkoVV7";

async function testRegistrationAPI() {
  const apiUrl = `${EXTERNAL_API_URL}/api/external/register`;
  
  console.log("Testing API endpoint:", apiUrl);
  console.log("Using API Key:", EXTERNAL_API_KEY);
  console.log("---");

  const testPayload = {
    email: "test@example.com",
    password: "testpassword123",
    disclaimerAccepted: true,
    clientIp: "127.0.0.1"
  };

  console.log("Request payload:", JSON.stringify(testPayload, null, 2));
  console.log("---");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": EXTERNAL_API_KEY
      },
      body: JSON.stringify(testPayload)
    });

    console.log("Response status:", response.status);
    console.log("Response headers:");
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    console.log("---");

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Response JSON:", JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log("Response text:", text.substring(0, 1000));
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testRegistrationAPI();
