export type SignInResponseDTO = {
  token: string
  userId: string,
};


export enum SignInErrors {
  CREDENTIA_INVALID = "auth/invalid-credential",
}

export const signInErrorsMessages = {
  [SignInErrors.CREDENTIA_INVALID]: "Username ou senha estão incorretos!",
}