import { z } from "zod";
import { canvasRequestAllPages, divider } from "../common/utils.js";
import { NodeHtmlMarkdown } from "node-html-markdown";
// Schema for Canvas Announcement API response
export const CanvasAnnouncementSchema = z.object({
    id: z.number(),
    title: z.string().nullable(),
    message: z.string().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable(),
    url: z.string(),
});
// Schema for getting announcements
export const GetAnnouncementsSchema = z.object({
    course_id: z
        .number()
        .describe("ID of the course, can be obtained from tool 'get_courses'"),
    number_of_days: z
        .number()
        .describe("Number of days to look back, default to 90")
        .optional(),
});
/**
 * Get all announcements for the current user
 * @param params Parameters including the access token
 * @returns Text of Canvas courses
 */
export async function getAnnouncements(params) {
    const { course_id } = params;
    const now = new Date();
    // Use the pagination utility to get all announcements
    const announcements = await canvasRequestAllPages("/api/v1/announcements", {
        params: {
            context_codes: `course_${course_id}`,
            start_date: new Date(new Date().setDate(now.getDate() - (params.number_of_days ?? 90))).toISOString(),
            end_date: now.toISOString(),
            per_page: "50", // Request larger page size to reduce number of API calls
        },
    });
    // Output: id\n name of announcement \n\n
    const output = announcements
        .map((announcement) => `id: ${announcement.id} \n created_at: ${announcement.created_at} \n updated_at: ${announcement.updated_at} \n title: ${announcement.title} \n message: ${NodeHtmlMarkdown.translate(announcement.message ?? "")} \n url: ${announcement.url} \n ${divider} \n\n`)
        .join("");
    return output;
}
