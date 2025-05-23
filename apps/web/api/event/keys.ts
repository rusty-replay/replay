export const eventKeys = {
  list: (projectId: number, queryParams?: URLSearchParams) => {
    const baseUrl = `/api/projects/${projectId}/events`;
    if (queryParams && queryParams.toString()) {
      return `${baseUrl}?${queryParams.toString()}`;
    }
    return baseUrl;
  },
  detail: (projectId: number, eventId: number) =>
    `/api/projects/${projectId}/events/${eventId}`,
  priority: (projectId: number) => `/api/projects/${projectId}/events/priority`,
  assignee: (projectId: number) => `/api/projects/${projectId}/events/assignee`,
  status: (projectId: number) => `/api/projects/${projectId}/events/status`,
};
