# Canvas LMS MCP Server

MCP Server for the Canvas LMS API, enabling access to Canvas LMS resources and course management.

## Features

- **Canvas LMS API Integration**: Access Canvas LMS resources using API tokens
- **Course Management**: Retrieve course information
- **Comprehensive Error Handling**: Clear error messages for common issues

## Tools

1. `get_canvas_courses`
   - Get all courses for the current user from Canvas LMS
   - Inputs:
     - `access_token` (string): Canvas LMS API token
   - Returns: List of courses with details

## Installation

```bash
npm install @modelcontextprotocol/server-canvas
```

## Usage

### As a command-line tool

```bash
mcp-server-canvas
```

### Environment Variables

- `CANVAS_LMS_API_TOKEN`: Canvas LMS API token (optional, can be provided in tool calls)

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode during development
npm run watch
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
