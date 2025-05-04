export const projectKeys = {
  list: () => `/api/projects`,
  userList: (projectId: number) => `/api/projects/${projectId}/users`,
};
