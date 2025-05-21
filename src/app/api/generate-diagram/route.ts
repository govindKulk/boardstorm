// src/app/api/generate-diagram/route.ts
import { NextRequest, NextResponse } from 'next/server';

// --- Rate Limiting Configuration ---
// In-memory store for IP-based rate limiting
// In a production environment with multiple instances, use a distributed store like Redis.
const rateLimitStore = new Map<string, number>(); // Map<IP_Address, Last_Request_Timestamp_MS>
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute (60,000 milliseconds)
const ALLOWED_REQUESTS_PER_WINDOW = 1; // Allow only 1 request per minute

export async function POST(request: Request) {
  // Get the client's IP address
  // 'x-forwarded-for' is common when behind a proxy/load balancer (like Vercel)
  // 'remoteAddress' is a fallback for direct connections
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  const now = Date.now();
  const lastRequestTime = rateLimitStore.get(ip) || 0;

  // // Check if the current request is within the rate limit window
  if (now - lastRequestTime < RATE_LIMIT_WINDOW_MS) {
    const timeLeftSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - lastRequestTime)) / 1000);
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${timeLeftSeconds} seconds.` },
      { status: 429 } // HTTP 429: Too Many Requests
    );
  }

  // Update the last request time for this IP
  rateLimitStore.set(ip, now);

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set.");
      return NextResponse.json({ error: 'Server configuration error: API key missing' }, { status: 500 });
    }

    // You were using gemini-2.0-flash here. Adjust if you changed it back to 1.5-pro or another.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // --- System Prompt Definition (Keep this as is) ---
    const systemInstructions = `You are an IMAGE JSON GENERATOR BOT. Your task is to generate minified canvas.json files based on user requests for diagrams.
NOTE: GENERATE MINIFIED VERSION WITHOUT NEW LINES.
AVAILABLE SHAPES AND COLORS:

JavaScript

const toolsData = [
  { icon: BsCursorFill, name: "select" },
  { icon: FaRegHandSpock, name: "hand" },
  { icon: RiRectangleLine, name: "rectangle" },
  { icon: FaRegCircle, name: "circle" },
  { icon: CiText, name: "text" },
  { icon: MdModeEditOutline, name: "pencil" },
  { icon: BiEraser, name: "eraser" }
];
NOTE: USE THE NAME PROPERTY VALUE AS THE TYPE PROPERTY VALUE IN THE RESPONSE JSON AS TOOL TYPE. eg, type: circle, rectangle etc

const colors = [
  { class: 'bg-red-500', hex: '#ef4444' },
  { class: 'bg-cyan-400', hex: '#22d3ee' },
  { class: 'bg-sky-500', hex: '#0ea5e9' },
  { class: 'bg-indigo-500', hex: '#6366f1' },
  { class: 'bg-fuchsia-500', hex: '#d946ef' },
  { class: 'bg-slate-600', hex: '#475569' },
  { class: 'bg-zinc-600', hex: '#52525b' }
];
NOTE: USE THIS COLORS ONLY, AND TEXT COLOR AND THE SHAPE FILL COLOR SHOULD ALWAYS BE DIFFERENT.

SHAPE MODES: STROKE AND FILL.
NOTE: NEVER USE {fill: colorvalue} WITH type: text tool just use {stroke: colorvlaue}.

STROKE WIDTHS: 3, 6, 9.

RULES FOR GENERATING JSON:

Output Format: Always provide a complete, minified canvas.json object. Do not include comments in the JSON.
Unique IDs: Every shape and text object must have a unique id (e.g., "circle-id-uuid", "text-id-uuid").
Color Rule: The fill color of a text object MUST be different from the fill or stroke color of the shape it is associated with. Use hex codes from the colors list.
Shape Properties (Rectangle & Circle):
x, y: Center coordinates of the shape.
type: "rectangle" or "circle".
fill or stroke: Hex color from colors. Use only stroke with text
strokeWidth: (Optional, for stroke mode) 3, 6, or 9.
radius: (For circles) Typically 50.
width, height: (For rectangles)
width: (For circles) Should be at least 250 for readability with a font size of 25.
Spacing for Horizontal Layouts (Circles): If width is 250, maintain a 50-unit gap between shapes. The x coordinate of the next shape's center should be current_shape_x + 300.
Spacing for Vertical Layouts (Rectangles): If height is 70, maintain a 25-unit gap between shapes. The y coordinate of the next shape's center should be current_shape_y + 95.
Text Object Properties:
x, y: Coordinates for the text.
For text associated with a shape: x = shape.x - 130 (approximate offset for centering text within a 250px wide shape), y = shape.y - 30 (approximate offset). Adjust these offsets slightly if text is longer or shorter to ensure it's visually centered.
fontSize: Use 25 for main labels, 20 for arrows.
type: "text".
text: The actual text content.
radius, width, height: These properties have no effect for text objects, but can be included if present in the skeleton.
CANVAS.JSON SKELETON:

JSON

{
    "shapes": [
        // Array of shape and text objects
    ],
    "position": {
        "x": 0,
        "y": 0
    },
    "scale": 1
}
1. User Prompt:

create a rectangle with color close to blue and label name "rectangle" inside it with different color.
2. Expected AI Response (JSON):

JSON

{"shapes":[{"id":"rectangle-id-1","x":200,"y":200,"width":250,"height":100,"type":"rectangle","fill":"#0ea5e9"},{"id":"text-id-1","x":70,"y":170,"fontSize":25,"type":"text","text":"rectangle","fill":"#ef4444"}],"position":{"x":0,"y":0},"scale":1}
Example 2: Circle with label
1. User Prompt:

create a circle with color close to cyan and label name "circle" inside it with different color.
2. Expected AI Response (JSON):

JSON

{"shapes":[{"id":"circle-id-1","x":200,"y":200,"radius":50,"width":250,"type":"circle","fill":"#22d3ee"},{"id":"text-id-1","x":70,"y":170,"fontSize":25,"type":"text","text":"circle","fill":"#d946ef"}],"position":{"x":0,"y":0},"scale":1}
Example 3: Heading
1. User Prompt:

create a heading with strokewidth 9 and color close to cyan with text osi model
2. Expected AI Response (JSON):

JSON

{"shapes":[{"id":"text-id-1","x":100,"y":100,"fontSize":45,"type":"text","text":"OSI MODEL","stroke":"#22d3ee"}],"position":{"x":0,"y":0},"scale":1}`
    // --- End System Prompt Definition ---

    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstructions }]
      },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "shapes": {
              "type": "ARRAY",
              "items": {
                "type": "OBJECT",
                "properties": {
                  "id": { "type": "STRING" },
                  "x": { "type": "NUMBER" },
                  "y": { "type": "NUMBER" },
                  "radius": { "type": "NUMBER" },
                  "fontSize": { "type": "NUMBER" },
                  "strokeWidth": { "type": "NUMBER" },
                  "type": { "type": "STRING" },
                  "fill": { "type": "STRING" },
                  "stroke": { "type": "STRING" },
                  "width": { "type": "NUMBER" },
                  "height": { "type": "NUMBER" },
                  "text": { "type": "STRING" }
                },
                "required": ["id", "x", "y", "type", "stroke", "fill", "strokeWidth"]
              }
            },
            "position": {
              "type": "OBJECT",
              "properties": {
                "x": { "type": "NUMBER" },
                "y": { "type": "NUMBER" }
              },
              "required": ["x", "y"]
            },
            "scale": { "type": "NUMBER" }
          },
          "required": ["shapes", "position", "scale"]
        }
      }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json({ error: 'Failed to generate diagram from AI', details: errorData }, { status: response.status });
    }

    const result = await response.json();
    console.log("result", result);

    if (result.candidates && result.candidates.length > 0 &&
      result.candidates[0].content && result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0) {
      const jsonString = result.candidates[0].content.parts[0].text;
      const parsedJson = JSON.parse(jsonString); // Parse the stringified JSON
      return NextResponse.json(parsedJson);
    } else {
      return NextResponse.json({ error: 'Unexpected response structure from AI' }, { status: 500 });
    }

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}