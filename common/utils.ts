import { getUserAgent } from "universal-user-agent";
import { VERSION } from "./version";

// Default base URL if environment variable is not set
const BASE_URL = process.env.CANVAS_BASE_URL || "https://canvas.ust.hk";

export const divider =
  " ------------------ NEXT ITEM BELOW ---------------------- ";

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | undefined>;
};

/**
 * Parse response body based on content type
 */
async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

/**
 * Build URL with query parameters
 */
export function buildUrl(
  baseUrl: string,
  params: Record<string, string | number | undefined>
): string {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  return url.toString();
}

const USER_AGENT = `modelcontextprotocol/servers/canvas/v${VERSION} ${getUserAgent()}`;

/**
 * Canvas API Error class
 */
export class CanvasAPIError extends Error {
  status: number;
  response: unknown;

  constructor(status: number, message: string, response: unknown) {
    super(message);
    this.name = "CanvasAPIError";
    this.status = status;
    this.response = response;
  }
}

/**
 * Make a request to the Canvas LMS API
 */
export async function canvasRequest(
  path: string,
  options: RequestOptions = {}
): Promise<unknown> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT,
    ...options.headers,
  };

  if (process.env.CANVAS_ACCESS_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.CANVAS_ACCESS_TOKEN}`;
  }

  // Construct full URL with base URL
  const url = path.startsWith("http")
    ? path
    : `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;

  const response = await fetch(buildUrl(url, options.params || {}), {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    let errorMessage = "Canvas API Error";
    if (
      typeof responseBody === "object" &&
      responseBody !== null &&
      "errors" in responseBody
    ) {
      errorMessage = JSON.stringify(responseBody);
    } else if (typeof responseBody === "string") {
      errorMessage = responseBody;
    }
    throw new CanvasAPIError(response.status, errorMessage, responseBody);
  }

  return responseBody;
}

/**
 * Parse Link header to extract pagination URLs
 * @param linkHeader The Link header from a Canvas API response
 * @returns Object with URLs for different pagination relations
 */
export function parseLinkHeader(
  linkHeader: string | null
): Record<string, string> {
  const result: Record<string, string> = {};

  if (!linkHeader) {
    return result;
  }

  // Split parts by comma
  const parts = linkHeader.split(",");

  // Process each part
  for (const part of parts) {
    // Match the URL and rel value
    const match = part.match(/<([^>]*)>; rel="([^"]*)"/i);
    if (match && match.length === 3) {
      const url = match[1];
      const rel = match[2].toLowerCase(); // Case insensitive as per Canvas docs
      result[rel] = url;
    }
  }

  return result;
}

/**
 * Make a paginated request to the Canvas LMS API and fetch all pages
 * @param path API endpoint path
 * @param options Request options
 * @returns Combined results from all pages
 */
export async function canvasRequestAllPages<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T[]> {
  let url = path.startsWith("http")
    ? path
    : `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
  let allResults: T[] = [];
  let hasNextPage = true;

  // Continue fetching until there are no more pages
  while (hasNextPage) {
    // Make the request to the current URL
    const response = await fetch(buildUrl(url, options.params || {}), {
      method: options.method || "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
        ...(process.env.CANVAS_ACCESS_TOKEN
          ? { Authorization: `Bearer ${process.env.CANVAS_ACCESS_TOKEN}` }
          : {}),
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    // Check for errors
    if (!response.ok) {
      const responseBody = await parseResponseBody(response);
      let errorMessage = "Canvas API Error";
      if (
        typeof responseBody === "object" &&
        responseBody !== null &&
        "errors" in responseBody
      ) {
        errorMessage = JSON.stringify(responseBody);
      } else if (typeof responseBody === "string") {
        errorMessage = responseBody;
      }
      throw new CanvasAPIError(response.status, errorMessage, responseBody);
    }

    // Parse the response body
    const results = (await response.json()) as T[];

    // Add the results to our collection
    allResults = allResults.concat(results);

    // Check for Link header to see if there's a next page
    const linkHeader = response.headers.get("link");
    const links = parseLinkHeader(linkHeader);

    if (links.next) {
      // Update the URL to the next page
      url = links.next;

      // If the next URL doesn't include the access token and we have one, we need to add it
      if (process.env.CANVAS_ACCESS_TOKEN && !url.includes("access_token")) {
        const urlObj = new URL(url);
        urlObj.searchParams.append(
          "access_token",
          process.env.CANVAS_ACCESS_TOKEN
        );
        url = urlObj.toString();
      }
    } else {
      // No more pages
      hasNextPage = false;
    }
  }

  return allResults;
}
