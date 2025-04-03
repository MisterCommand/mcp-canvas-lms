import { z } from "zod";
import { canvasRequest } from "../common/canvas-utils.js";
// Schema for Canvas Course
export const CanvasCourseSchema = z.object({
    id: z.number(),
    name: z.string().nullable(),
    account_id: z.number().nullable(),
    uuid: z.string().nullable(),
    start_at: z.string().nullable(),
    grading_standard_id: z.number().nullable(),
    is_public: z.boolean().nullable(),
    created_at: z.string().nullable(),
    course_code: z.string().nullable(),
    default_view: z.string().nullable(),
    root_account_id: z.number().nullable(),
    enrollment_term_id: z.number().nullable(),
    license: z.string().nullable(),
    grade_passback_setting: z.string().nullable(),
    end_at: z.string().nullable(),
    public_syllabus: z.boolean().nullable(),
    public_syllabus_to_auth: z.boolean().nullable(),
    storage_quota_mb: z.number().nullable(),
    is_public_to_auth_users: z.boolean().nullable(),
    homeroom_course: z.boolean().nullable(),
    course_color: z.string().nullable(),
    friendly_name: z.string().nullable(),
    apply_assignment_group_weights: z.boolean().nullable(),
    calendar: z.object({
        ics: z.string().nullable()
    }).nullable(),
    time_zone: z.string().nullable(),
    blueprint: z.boolean().nullable(),
    template: z.boolean().nullable(),
    enrollments: z.array(z.object({
        type: z.string().nullable(),
        role: z.string().nullable(),
        role_id: z.number().nullable(),
        user_id: z.number().nullable(),
        enrollment_state: z.string().nullable(),
        limit_privileges_to_course_section: z.boolean().nullable()
    })).nullable(),
    hide_final_grades: z.boolean().nullable(),
    workflow_state: z.string().nullable(),
    restrict_enrollments_to_course_dates: z.boolean().nullable(),
    access_restricted_by_date: z.boolean().optional()
});
// Schema for getting courses
export const GetCoursesSchema = z.object({
    access_token: z.string().describe("Canvas LMS API access token")
});
/**
 * Get all courses for the current user
 * @param params Parameters including the access token
 * @returns Array of Canvas courses
 */
export async function getCourses(params) {
    const { access_token } = params;
    return canvasRequest("https://canvas.ust.hk/api/v1/courses", { headers: { Authorization: `Bearer ${access_token}` } });
}
