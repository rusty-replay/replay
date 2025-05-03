export const eventKeys = {
  priority: (projectId: number, eventId: number) =>
    `/api/projects/${projectId}/events/${eventId}/priority`,
};
// /projects/{project_id}/events/{id}/priority
