import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://bookmyfield-production.up.railway.app/api/v1";

export async function GET(request: NextRequest) {
  return handleProxyRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return handleProxyRequest(request, "POST");
}

export async function PUT(request: NextRequest) {
  return handleProxyRequest(request, "PUT");
}

export async function DELETE(request: NextRequest) {
  return handleProxyRequest(request, "DELETE");
}

async function handleProxyRequest(request: NextRequest, method: string) {
  try {
    // Get the path after /api/proxy/
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const proxyPathIndex = pathSegments.indexOf("proxy");
    const targetPath = pathSegments.slice(proxyPathIndex + 1).join("/");

    // Build target URL
    const targetUrl = `${BACKEND_URL}/${targetPath}${url.search}`;

    console.log(`Proxying ${method} request to:`, targetUrl);

    // Prepare headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
    };

    // Add body for POST, PUT requests
    if (method === "POST" || method === "PUT") {
      const body = await request.text();
      if (body) {
        requestOptions.body = body;
      }
    }

    // Make the request to backend
    const response = await fetch(targetUrl, requestOptions);

    console.log(`Backend response:`, response.status, response.statusText);

    // Get response data
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Return response with CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        error: "Proxy request failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
