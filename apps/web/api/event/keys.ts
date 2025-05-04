export const eventKeys = {
  list: (projectId: number, queryParams?: URLSearchParams) => {
    const baseUrl = `/api/projects/${projectId}/events`;
    if (queryParams && queryParams.toString()) {
      return `${baseUrl}?${queryParams.toString()}`;
    }
    return baseUrl;
  },
  priority: (projectId: number, eventId: number) =>
    `/api/projects/${projectId}/events/${eventId}/priority`,
  assignee: (projectId: number, eventId: number) =>
    `/api/projects/${projectId}/events/${eventId}/assignee`,
};
