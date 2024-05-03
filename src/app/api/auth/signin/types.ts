export type SignInResponseDTO = {
  token: string
  userId: string,
};


export enum SignInErrors {
  CREDENTIA_INVALID = "auth/invalid-credential",
  TOO_MANY_REQUEST = "auth/too-many-requests"
}

export const signInErrorsMessages = {
  [SignInErrors.CREDENTIA_INVALID]: "Username ou senha estão incorretos!",
  [SignInErrors.TOO_MANY_REQUEST]: "Da uma segurada nas solicitações ai fela da puta (Tente novamente em 10s)",
}