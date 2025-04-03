import { z } from "zod";
// Canvas LMS types
export const CanvasCourseSchema = z.object({
    id: z.number(),
    name: z.string(),
    course_code: z.string(),
    workflow_state: z.string(),
    account_id: z.number(),
    start_at: z.string().nullable(),
    end_at: z.string().nullable(),
    enrollments: z.array(z.any()).optional(),
    calendar: z.object({
        ics: z.string()
    }).optional(),
    default_view: z.string().optional(),
    syllabus_body: z.string().nullable().optional(),
    needs_grading_count: z.number().optional(),
    term: z.object({
        id: z.number(),
        name: z.string(),
        start_at: z.string().nullable(),
        end_at: z.string().nullable()
    }).optional(),
    course_progress: z.object({
        requirement_count: z.number(),
        requirement_completed_count: z.number(),
        next_requirement_url: z.string().nullable(),
        completed_at: z.string().nullable()
    }).nullable().optional(),
    apply_assignment_group_weights: z.boolean().optional(),
    permissions: z.record(z.boolean()).optional(),
    is_public: z.boolean().optional(),
    is_public_to_auth_users: z.boolean().optional(),
    public_syllabus: z.boolean().optional(),
    public_syllabus_to_auth: z.boolean().optional(),
    public_description: z.string().nullable().optional(),
    storage_quota_mb: z.number().optional(),
    storage_quota_used_mb: z.number().optional(),
    hide_final_grades: z.boolean().optional(),
    license: z.string().optional(),
    allow_student_assignment_edits: z.boolean().optional(),
    allow_wiki_comments: z.boolean().optional(),
    allow_student_forum_attachments: z.boolean().optional(),
    open_enrollment: z.boolean().optional(),
    self_enrollment: z.boolean().optional(),
    restrict_enrollments_to_course_dates: z.boolean().optional(),
    course_format: z.string().optional(),
    access_restricted_by_date: z.boolean().optional(),
    time_zone: z.string().optional(),
    blueprint: z.boolean().optional(),
    blueprint_restrictions: z.record(z.boolean()).optional(),
    blueprint_restrictions_by_object_type: z.record(z.record(z.boolean())).optional(),
});
