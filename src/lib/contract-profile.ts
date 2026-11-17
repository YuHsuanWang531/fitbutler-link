// 合約文件資料補件: the member's details the contract needs. Mock 更新個人資料 API: kept in memory until reload.

export type ContractProfile = {
  /** 頭像: a preview URL of the picked photo (the real API uploads the file). */
  avatar: string
  birthday: string
  phone: string
  lastName: string
  firstName: string
  gender: "male" | "female" | ""
  idNumber: string
  email: string
  city: string
  district: string
  address: string
  emergencyName: string
  emergencyRelation: string
  emergencyPhone: string
}

export const EMPTY_PROFILE: ContractProfile = {
  avatar: "",
  birthday: "",
  phone: "",
  lastName: "",
  firstName: "",
  gender: "",
  idNumber: "",
  email: "",
  city: "",
  district: "",
  address: "",
  emergencyName: "",
  emergencyRelation: "",
  emergencyPhone: "",
}

let profile: ContractProfile = EMPTY_PROFILE

export const getContractProfile = () => profile

/** Mock 更新個人資料 API. */
export function updateContractProfile(next: ContractProfile) {
  profile = next
  return Promise.resolve(next)
}

// ——— Validation ———

/** 手機 09xxxxxxxx, or a landline / international number of 8–15 digits (spaces, dashes, + and () allowed). */
export const isPhone = (v: string) => {
  const digits = v.replace(/[\s\-()+]/g, "")
  return /^09\d{8}$/.test(digits) || /^\d{8,15}$/.test(digits)
}

/** 身分證字號 (A123456789), 居留證 (A800000014 / AB12345678), or a passport number (6–9 letters/digits). */
export const isIdNumber = (v: string) => {
  const s = v.trim().toUpperCase()
  return /^[A-Z][1289]\d{8}$/.test(s) || /^[A-Z]{2}\d{8}$/.test(s) || /^[A-Z0-9]{6,9}$/.test(s)
}
