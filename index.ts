#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { getCourses, GetCoursesSchema } from "./operations/courses.js";
import {
  getAnnouncements,
  GetAnnouncementsSchema,
} from "./operations/announcements.js";
import {
  getAssignments,
  GetAssignmentsSchema,
} from "./operations/assignments.js";
import { CanvasAPIError } from "./common/utils.js";
import { VERSION } from "./common/version";

const server = new Server(
  {
    name: "canvas-mcp-server",
    version: VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

function formatCanvasError(error: CanvasAPIError): string {
  return `Canvas API Error (${error.status}): ${error.message}`;
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_courses",
        description: "Get all courses for the current user from Canvas LMS",
        inputSchema: zodToJsonSchema(GetCoursesSchema),
      },
      {
        name: "get_announcements",
        description:
          "Get all announcements for a specific course from Canvas LMS",
        inputSchema: zodToJsonSchema(GetAnnouncementsSchema),
      },
      {
        name: "get_assignments",
        description:
          "Get all assignments for a specific course from Canvas LMS",
        inputSchema: zodToJsonSchema(GetAssignmentsSchema),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }

    switch (request.params.name) {
      case "get_courses":
        const coursesResponse = await getCourses(
          request.params.arguments as z.infer<typeof GetCoursesSchema>
        );
        return {
          content: [{ type: "text", text: coursesResponse }],
        };
      case "get_announcements":
        const announcementsResponse = await getAnnouncements(
          request.params.arguments as z.infer<typeof GetAnnouncementsSchema>
        );
        return {
          content: [{ type: "text", text: announcementsResponse }],
        };
      case "get_assignments":
        const assignmentsResponse = await getAssignments(
          request.params.arguments as z.infer<typeof GetAssignmentsSchema>
        );
        return {
          content: [{ type: "text", text: assignmentsResponse }],
        };
      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: `Invalid input: ${JSON.stringify(error.errors)}`,
      };
    }
    if (error instanceof CanvasAPIError) {
      return {
        error: formatCanvasError(error),
      };
    }
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: String(error),
      };
    }
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
