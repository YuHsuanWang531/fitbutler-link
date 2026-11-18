"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, CalendarDays, UserRound } from "lucide-react"

import { cn } from "@/lib/utils"
import { DropdownSelect } from "@/components/ui/dropdown-select"
import { Button } from "@/components/ui/button"
import { markReplace } from "@/components/member/nav-depth"
import { isEmail } from "@/lib/invoice-setting"
import {
  getContractProfile,
  isIdNumber,
  isPhone,
  updateContractProfile,
  type ContractProfile,
} from "@/lib/contract-profile"
import { fetchDistricts, TW_CITIES } from "@/lib/tw-districts"

type Key = keyof ContractProfile

const pad = (n: number) => String(n).padStart(2, "0")
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const yearsAgo = (years: number) => {
  const d = new Date()
  return isoDate(new Date(d.getFullYear() - years, d.getMonth(), d.getDate()))
}

/** Each field's check; null = fine. */
const CHECKS: Record<Key, (v: string) => string | null> = {
  avatar: (v) => (v ? null : "請上傳頭像"),
  birthday: (v) => (v ? null : "請選擇生日"),
  phone: (v) => (isPhone(v) ? null : "請輸入正確的電話號碼"),
  lastName: (v) => (v.trim() ? null : "請輸入姓氏"),
  firstName: (v) => (v.trim() ? null : "請輸入名字"),
  gender: (v) => (v ? null : "請選擇性別"),
  idNumber: (v) => (isIdNumber(v) ? null : "請輸入正確的身分證字號或護照號碼"),
  email: (v) => (isEmail(v) ? null : "請輸入正確的電子信箱"),
  city: (v) => (v ? null : "請選擇城市"),
  district: (v) => (v ? null : "請選擇行政區"),
  address: (v) => (v.trim() ? null : "請輸入地址"),
  emergencyName: (v) => (v.trim() ? null : "請輸入緊急聯絡人姓名"),
  emergencyRelation: (v) => (v.trim() ? null : "請輸入關係"),
  emergencyPhone: (v) => (isPhone(v) ? null : "請輸入正確的聯絡電話"),
}

const INPUT =
  "h-11 w-full rounded-[10px] border bg-white px-4 text-sm outline-none placeholder:text-neutral-400 focus:border-black"

/**
 * 合約文件資料補件: 基本資料 and 緊急聯絡人, all required. 下一步 checks every field, saves them (mock 更新個人資料
 * API) and goes on to the contract, replacing this page so the contract's 同意並簽署 returns to the plan page.
 */
export function ContractInfoForm({ planId }: { planId: string }) {
  const router = useRouter()
  const [form, setForm] = useState<ContractProfile>(getContractProfile)
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({})
  const [districts, setDistricts] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  // 城市 → 行政區列表 API.
  useEffect(() => {
    if (!form.city) return
    let live = true
    fetchDistricts(form.city).then((list) => live && setDistricts(list))
    return () => {
      live = false
    }
  }, [form.city])

  const set = (key: Key, value: string) => {
    setForm((f) => ({ ...f, [key]: value, ...(key === "city" && { district: "" }) }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const next = async () => {
    const found = Object.fromEntries(
      (Object.keys(CHECKS) as Key[]).flatMap((k) => {
        const error = CHECKS[k](form[k])
        return error ? [[k, error]] : []
      })
    ) as Partial<Record<Key, string>>
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`profile-${first}`)?.focus()
      return
    }
    setSaving(true)
    await updateContractProfile({ ...form, idNumber: form.idNumber.trim().toUpperCase() })
    markReplace()
    router.replace(`/shop/${planId}/contract`)
  }

  const error = (key: Key) =>
    errors[key] && (
      <p id={`profile-${key}-error`} className="text-sm leading-5 text-destructive">
        {errors[key]}
      </p>
    )
  const inputProps = (key: Key) => ({
    id: `profile-${key}`,
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(key, e.target.value),
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `profile-${key}-error` : undefined,
    className: cn(INPUT, errors[key] ? "border-destructive" : "border-neutral-200"),
  })

  return (
    <div className="flex min-h-[calc(100dvh-61px-env(safe-area-inset-top))] flex-col md:min-h-full">
      <div className="flex flex-1 flex-col gap-8 px-4 pt-4 pb-8 lg:px-6">
        <section className="flex flex-col gap-6">
          <h2 className="text-xl leading-7 font-medium">基本資料</h2>

          <FormField label="頭像" htmlFor="profile-avatar">
            <AvatarUpload value={form.avatar} onChange={(v) => set("avatar", v)} invalid={!!errors.avatar} />
            {error("avatar")}
          </FormField>

          <FormField label="生日" htmlFor="profile-birthday">
            <BirthdayPicker value={form.birthday} onChange={(v) => set("birthday", v)} invalid={!!errors.birthday} />
            {error("birthday")}
          </FormField>

          <FormField label="電話號碼" htmlFor="profile-phone">
            <input type="tel" inputMode="tel" autoComplete="tel" placeholder="0912345678" {...inputProps("phone")} />
            {error("phone")}
          </FormField>

          <FormField label="姓名" htmlFor="profile-lastName">
            <div className="grid grid-cols-[2fr_3fr] gap-3">
              <input autoComplete="family-name" placeholder="姓" aria-label="姓" {...inputProps("lastName")} />
              <input autoComplete="given-name" placeholder="名" aria-label="名" {...inputProps("firstName")} />
            </div>
            {error("lastName")}
            {error("firstName")}
          </FormField>

          <FormField label="性別" group>
            <div
              id="profile-gender"
              role="radiogroup"
              aria-label="性別"
              tabIndex={-1}
              className={cn(
                "grid h-11 grid-cols-2 rounded-[10px] border p-1 outline-none",
                errors.gender ? "border-destructive" : "border-neutral-200"
              )}
            >
              {(
                [
                  ["male", "男性"],
                  ["female", "女性"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={form.gender === value}
                  onClick={() => set("gender", value)}
                  className={cn(
                    "rounded-[7px] text-sm",
                    form.gender === value ? "bg-black text-white" : "text-black hover:bg-neutral-100"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {error("gender")}
          </FormField>

          <FormField label="身分識別" htmlFor="profile-idNumber">
            <input autoCapitalize="characters" placeholder="身分證字號或護照號碼" {...inputProps("idNumber")} />
            {error("idNumber")}
          </FormField>

          <FormField label="電子信箱" htmlFor="profile-email">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="請輸入你的電子信箱"
              {...inputProps("email")}
            />
            {error("email")}
          </FormField>

          <FormField label="居住城市與行政區" htmlFor="profile-city">
            <div className="grid grid-cols-2 gap-3">
              <Select
                id="profile-city"
                label="城市"
                placeholder="選擇城市"
                options={TW_CITIES}
                value={form.city}
                onChange={(v) => set("city", v)}
                invalid={!!errors.city}
              />
              <Select
                id="profile-district"
                label="行政區"
                placeholder="選擇行政區"
                options={form.city ? districts : []}
                value={form.district}
                onChange={(v) => set("district", v)}
                invalid={!!errors.district}
                disabled={!form.city}
              />
            </div>
            {error("city")}
            {error("district")}
          </FormField>

          <FormField label="地址" htmlFor="profile-address">
            <input autoComplete="street-address" placeholder="路、街、巷弄、號、樓" {...inputProps("address")} />
            {error("address")}
          </FormField>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-xl leading-7 font-medium">緊急聯絡人</h2>
          <FormField label="姓名" htmlFor="profile-emergencyName">
            <input autoComplete="off" placeholder="請輸入緊急聯絡人姓名" {...inputProps("emergencyName")} />
            {error("emergencyName")}
          </FormField>
          <FormField label="關係" htmlFor="profile-emergencyRelation">
            <input autoComplete="off" placeholder="例如：父母、配偶、朋友" {...inputProps("emergencyRelation")} />
            {error("emergencyRelation")}
          </FormField>
          <FormField label="聯絡電話" htmlFor="profile-emergencyPhone">
            <input
              type="tel"
              inputMode="tel"
              autoComplete="off"
              placeholder="0912345678"
              {...inputProps("emergencyPhone")}
            />
            {error("emergencyPhone")}
          </FormField>
        </section>
      </div>

      <div className="sticky bottom-0 z-10 border-t border-neutral-200 bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:pb-3 lg:px-6">
        <Button className="h-11 w-full rounded-[10px] text-sm" disabled={saving} onClick={next}>
          下一步
        </Button>
      </div>
    </div>
  )
}

/** Small label with a red * (every field here is required), then the control. */
function FormField({
  label,
  htmlFor,
  group,
  children,
}: {
  label: string
  htmlFor?: string
  group?: boolean
  children: React.ReactNode
}) {
  const Label = group ? "p" : "label"
  return (
    <div className="flex flex-col gap-2">
      <Label {...(!group && { htmlFor })} className="text-sm font-medium">
        {label}
        <span className="ml-0.5 text-destructive" aria-hidden>
          *
        </span>
      </Label>
      {children}
    </div>
  )
}

/** 頭像: round preview and 上傳照片 / 更換照片, which opens the photo picker (camera or library on phones). */
function AvatarUpload({
  value,
  onChange,
  invalid,
}: {
  value: string
  onChange(value: string): void
  invalid: boolean
}) {
  return (
    <div className="flex items-center gap-4">
      <span
        className={cn(
          "flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-neutral-100",
          invalid ? "border-destructive" : "border-neutral-200"
        )}
      >
        {value ? (
          // A local blob preview, so a plain img (next/image can't optimise it).
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="頭像預覽" className="size-full object-cover" />
        ) : (
          <UserRound aria-hidden className="size-9 text-neutral-400" strokeWidth={1.5} />
        )}
      </span>
      <label className="relative flex h-11 cursor-pointer items-center gap-1.5 rounded-[10px] border border-neutral-200 px-4 text-sm font-medium hover:bg-neutral-50 has-focus-visible:border-black">
        <Camera aria-hidden className="size-4" strokeWidth={1.75} />
        {value ? "更換照片" : "上傳照片"}
        <input
          id="profile-avatar"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onChange(URL.createObjectURL(file))
            e.target.value = ""
          }}
        />
      </label>
    </div>
  )
}

/** 選擇日期: native picker from 100 to 3 years ago; opening it empty starts on 18 years ago today. */
function BirthdayPicker({
  value,
  onChange,
  invalid,
}: {
  value: string
  onChange(value: string): void
  invalid: boolean
}) {
  const min = yearsAgo(100)
  const max = yearsAgo(3)
  return (
    <label
      className={cn(
        "relative flex h-11 items-center justify-between rounded-[10px] border px-4 text-sm",
        invalid ? "border-destructive" : "border-neutral-200",
        !value && "text-neutral-500"
      )}
    >
      {value ? value.replaceAll("-", "/") : "選擇日期"}
      <CalendarDays aria-hidden className="size-5 text-neutral-500" strokeWidth={1.5} />
      <input
        id="profile-birthday"
        type="date"
        required
        min={min}
        max={max}
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        onClick={(e) => {
          // The picker opens on the input's value, so an empty one starts on the 18-years-ago default.
          if (!value) onChange(yearsAgo(18))
          try {
            e.currentTarget.showPicker()
          } catch {}
        }}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </label>
  )
}

function Select({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  invalid,
  disabled,
}: {
  id: string
  label: string
  placeholder: string
  options: string[]
  value: string
  onChange(value: string): void
  invalid: boolean
  disabled?: boolean
}) {
  return (
    <DropdownSelect
      id={id}
      label={label}
      placeholder={placeholder}
      options={options.map((o) => ({ value: o, label: o }))}
      value={value}
      onChange={onChange}
      invalid={invalid}
      disabled={disabled}
    />
  )
}
