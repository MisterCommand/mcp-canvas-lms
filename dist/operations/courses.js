import { z } from "zod";
import { canvasRequestAllPages } from "../common/utils.js";
// Schema for Canvas Course API response
export const CanvasCourseSchema = z.object({
    id: z.number(),
    name: z.string().nullable(),
});
// Schema for getting courses
export const GetCoursesSchema = z.object({
    enrollment_state: z
        .enum(["active", "completed", ""])
        .describe("State of the course, can be 'active' (the user is currently enrolled to the course) or 'completed' (the user has completed the course), leave empty for all courses")
        .optional(),
});
/**
 * Get all courses for the current user
 * @param params Parameters including the access token
 * @returns Text of Canvas courses
 */
export async function getCourses(params) {
    const { enrollment_state } = params;
    // Use the pagination utility to get all courses
    const courses = await canvasRequestAllPages("/api/v1/courses", {
        params: {
            enrollment_state,
            per_page: "50", // Request larger page size to reduce number of API calls
        },
    });
    // Output: id\n name of course \n\n
    const output = courses
        .map((course) => `id: ${course.id}\n name: ${course.name}\n\n`)
        .join("");
    return output;
}
