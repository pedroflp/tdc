export const routeNames = {
  HOME: '/',
  QUEUE: (queueId: string) => `/queue/${queueId}`,
  QUEUE_COMPOSITIONS: (queueId: string) => `/queue/${queueId}/compositions`,
  PROFILE: (username: string) => `/${username}`,
  MATCHES: '/matches',
  MATCH: (matchId: string) => `/match/${matchId}`,
  MATCH_HONOR: (matchId: string) => `/match/${matchId}/honor`,
}