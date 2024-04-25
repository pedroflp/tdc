export const parseUsernameToEmail = (username: string) => {
  return `${username}@plol.tdc`;
}

export const parseEmailToUsername = (email: string) => {
  return email.split("@")[0];
}