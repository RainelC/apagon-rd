interface recoverPasswdProps {
  password: string
  repeated: string
  token: string
}

interface changePasswdProps {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type { recoverPasswdProps, changePasswdProps }
