import { useState } from 'react'

interface UseForm<T> {
  form: T
  errors: Partial<Record<keyof T, string>>
  setField: (name: keyof T, value: string) => void
  setFields: (changes: Partial<T>) => void
  setError: (name: keyof T, message: string) => void
  clearError: (name: keyof T) => void
  setErrors: (
    errors: Partial<Record<keyof T, string>>
  ) => void
  resetForm: () => void
}

const useForm = <T>(model: T): UseForm<T> => {
  const [form, setForm] = useState(model)
  const [errors, setErrorsState] = useState<
    Partial<Record<keyof T, string>>
  >({})

  const setField = (name: keyof T, value: string) => {
    setForm({ ...form, [name]: value })
  }

  const setFields = (changes: Partial<T>) => {
    setForm({ ...form, ...changes })
  }

  const resetForm = () => setForm(model)

  const setError = (name: keyof T, message: string) => {
    setErrorsState((prev) => ({ ...prev, [name]: message }))
  }

  const clearError = (name: keyof T) => {
    setErrorsState((prev) => {
      const copy = { ...prev }
      delete copy[name]
      return copy
    })
  }

  const setErrors = (
    newErrors: Partial<Record<keyof T, string>>
  ) => {
    setErrorsState(newErrors)
  }

  return {
    form,
    errors,
    resetForm,
    setField,
    setFields,
    setError,
    clearError,
    setErrors
  }
}

export { useForm }
