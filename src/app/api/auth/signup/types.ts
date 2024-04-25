export type SignUpResponseDTO = {
  token: string
  success: boolean
  userId: string,
  error?: string
};

export enum SignUpErrors {
  USER_ALREADY_EXISTS = "auth/email-already-in-use",
  PASSWORD_INVALID = "auth/weak-password",
}

export const signUpErrorsMessages = {
  [SignUpErrors.USER_ALREADY_EXISTS]: "Este username já está sendo usado em outra conta!",
  [SignUpErrors.PASSWORD_INVALID]: "A senha precisa ter no minimo 6 caracteres!",
}