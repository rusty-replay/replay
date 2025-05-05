export const routes = {
  home: () => `/`,
  event: {
    detail: (projectId: number, issueId: number) =>
      `/project/${projectId}/issues/${issueId}`,
    list: (projectId: number) => `/project/${projectId}/issues`,
  },
  project: {
    list: () => `/projects`,
    detail: (projectId: number) => `/project/${projectId}`,
  },
};
