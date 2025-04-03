import { z } from "zod";
import { canvasRequestAllPages, divider } from "../common/utils.js";
import { NodeHtmlMarkdown } from "node-html-markdown";

// Schema for Canvas Assignment API response
export const CanvasAssignmentSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  points_possible: z.number().nullable(),
  due_at: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  html_url: z.string().nullable(),
});

// Schema for getting assignments
export const GetAssignmentsSchema = z.object({
  course_id: z
    .number()
    .describe("ID of the course, can be obtained from tool 'get_courses'")
    .optional(),
  due_in: z
    .number()
    .describe(
      "Number of days until due date, default to 14, can be negative (due before today)"
    )
    .optional(),
});

/**
 * Get all assignments for the current user
 * @param params Parameters including the access token
 * @returns Text of Canvas courses
 */
export async function getAssignments(
  params: z.infer<typeof GetAssignmentsSchema>
): Promise<string> {
  const { course_id } = params;

  // Use the pagination utility to get all assignments
  const assignments = await canvasRequestAllPages<
    z.infer<typeof CanvasAssignmentSchema>
  >(`/api/v1/courses/${course_id}/assignments`, {
    params: {
      per_page: "10", // Request larger page size to reduce number of API calls
    },
  });

  // Filter the assignments base on due_in
  const filteredAssignments = assignments.filter((assignment) => {
    const dueDate = new Date(assignment.due_at ?? "");
    const createdAt = new Date(assignment.created_at ?? "");
    const updatedAt = new Date(assignment.updated_at ?? "");
    const now = new Date();
    const dueDateIn = new Date();

    // Filter by due_in
    const dueIn = params.due_in ?? 14;
    dueDateIn.setDate(dueDateIn.getDate() + dueIn);

    // Due date in the future and before due_in
    if (dueIn < 0) {
      return dueDate <= now && dueDate >= dueDateIn;
    }
    return dueDate >= now && dueDate <= dueDateIn;
  });

  // Output: id\n name of assignment \n\n
  const output = filteredAssignments
    .map(
      (assignment) =>
        `id: ${assignment.id} \n created_at: ${
          assignment.created_at
        } \n updated_at: ${assignment.updated_at}  \n due_at: ${
          assignment.due_at
        } \n name: ${
          assignment.name
        } \n description: ${NodeHtmlMarkdown.translate(
          assignment.description ?? ""
        )} \n 
        points_possible: ${assignment.points_possible} \n 
        url: ${assignment.html_url} \n 
        ${divider} \n\n`
    )
    .join("");

  return output;
}
