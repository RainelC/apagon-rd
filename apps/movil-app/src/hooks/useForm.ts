import { useState } from 'react'

interface UseForm<T> {
  form: T
  resetForm: () => void
  handleChange: (name: keyof T, value: string) => void
}

const useForm = <T>(model: T): UseForm<T> => {
  const [form, setForm] = useState(model)

  const handleChange = (name: keyof T, value: string) => {
    setForm({ ...form, [name]: value })
  }

  const resetForm = () => setForm(model)

  return {
    form,
    handleChange,
    resetForm
  }
}

export { useForm }
