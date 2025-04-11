# 🎓 Canvas LMS MCP Server 🎓

MCP Server for the Canvas LMS API, enabling access to Canvas LMS resources for students. 🚀

## Tools

1. `get_courses` 📚
   - Get all courses for the current user
2. `get_announcements` 📣
   - Get all announcements from a specific course, made after a specific date
3. `get_assignments` 📝
   - Get all assignments from a specific course, due before a specific date

## Installation

```json
{
  "mcpServers": {
    "canvas-mcp-server": {
      "command": "npx",
      "args": ["-y", "mcp-canvas-lms"],
      "env": {
        "CANVAS_ACCESS_TOKEN": "key",
        "CANVAS_BASE_URL": "https://..."
      },
      "transportType": "stdio"
    }
  }
}
```

## Usage

### Environment Variables

- `CANVAS_ACCESS_TOKEN`: Canvas LMS API token
- `CANVAS_BASE_URL`: Base URL for the canvas API (e.g. `https://canvas.ust.hk`)

Create your access token at **sidebar** > **Profile** > **Settings** (`/profile/settings`) > **Approved Integrations** > **New Access Token**

You might not be able to create a new access token if your admin has disabled this setting.

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build
```
