# Canvas LMS MCP Server

MCP Server for the Canvas LMS API, enabling access to Canvas LMS resources for students.

## Tools

1. `get_courses`
   - Get all courses for the current user
2. `get_announcements`
   - Get all announcements from a specific course, made after a specific date
3. `get_assignments`
   - Get all assignments from a specific course, due before a specific date

## Installation

```bash
npm install @modelcontextprotocol/server-canvas
```

## Usage

### Environment Variables

- `CANVAS_ACCESS_TOKEN`: Canvas LMS API token
- `CANVAS_BASE_URL`: Base URL for the canvas API (e.g. `https://canvas.ust.hk`)

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build
```
