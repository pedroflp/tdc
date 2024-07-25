const subRouteFrom = (route: string, subRoute: string) => `/${route}/${subRoute}` 

export const routeNames = {
  HOME: '/',
  VIDEOS: '/videos',
  QUEUE: (queueId: string) => subRouteFrom('lol', `queue/${queueId}`),
  QUEUE_COMPOSITIONS: (queueId: string) => subRouteFrom('lol', `queue/${queueId}/compositions`),
  PROFILE: (username: string) => subRouteFrom('user', `${username}`),
  MATCHES: subRouteFrom('lol', 'matches'),
  LEADBOARD: subRouteFrom('lol', 'leadboard'),
  MATCH: (matchId: string) => subRouteFrom('lol', `match/${matchId}`),
  MATCH_HONOR: (matchId: string) => subRouteFrom('lol', `match/${matchId}/honor`),
}