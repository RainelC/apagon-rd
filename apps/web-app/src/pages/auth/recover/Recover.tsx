import { useSearchParams } from 'react-router-dom'
import AuthService from '../../../services/authService'
import { ErrorMessage, Formik } from 'formik'
import { Input } from './components/input'
import * as Yup from 'yup'
import { Label } from './components/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from './components/card'
import { Button } from './components/button'
import { useState, useEffect } from 'react'
import { NotFound } from '../../error/NotFound'
import { Error403 } from './components/error403'
import { Spinner } from './components/spinner'
import { Successful } from './components/successful'

enum Status {
  LOADING = 100,
  LOADED = 150,
  SUCCESSFUL = 200,
  BAD_REQUEST = 400,
  FORBIDDEN = 403
}

const Recover = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState({
    error: false,
    code: Status.LOADING
  })

  useEffect(() => {
    const CINCO_MINUTES_MS: number = 5 * 60 * 1000

    const fetchData = async () => {
      const isValidated =
        await AuthService.validateRecoverToken(token || '')
      if (!isValidated)
        setStatus({ error: true, code: Status.FORBIDDEN })
      else setStatus({ error: false, code: Status.LOADED })
    }

    if (!token) {
      setStatus({ error: true, code: Status.BAD_REQUEST })
      return
    }

    fetchData()
    const intervalId = setInterval(
      fetchData,
      CINCO_MINUTES_MS
    )
    return () => clearInterval(intervalId)
  }, [token])

  return status.error ? (
    status.code === Status.BAD_REQUEST ? (
      <NotFound />
    ) : (
      <Error403 />
    )
  ) : status.code === Status.LOADING ? (
    <div className='flex items-center  justify-center gap-4 h-screen'>
      <Spinner className='size-8' />
    </div>
  ) : status.code === Status.SUCCESSFUL ? (
    <Successful />
  ) : (
    <Formik
      initialValues={{
        password: '',
        repeated: '',
        token: token || ''
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .min(
            8,
            'La contraseña debe contener al menos 8 caracteres'
          )
          .matches(
            /[A-Z]/,
            'La contraseña debe contener al menos una mayúscula'
          )
          .matches(
            /[a-z]/,
            'La contraseña debe contener al menos una minúscula'
          )
          .matches(
            /[0-9]/,
            'La contraseña debe contener al menos un numero'
          )
          .matches(
            /\W/g,
            'La contraseña debe contener al menos un carácter especial'
          )
          .required('La contraseña es requerida'),
        repeated: Yup.string()
          .oneOf(
            [Yup.ref('password')],
            'Las contraseñas deben coincidir'
          )
          .required('Debes confirmar la contreseña')
      })}
      onSubmit={async (
        values,
        { setSubmitting, resetForm }
      ) => {
        const status = await AuthService.recoverPasswd(
          values
        )
        if (status === 200) {
          setSubmitting(false)
          resetForm()
          setStatus({ error: false, code: 200 })
        }
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleReset,
        handleSubmit,
        isSubmitting
      }) => (
        <div
          id='container'
          className='bg-[#a2dafb] h-screen flex p-10'
        >
          <Card className='w-full max-w-sm m-auto'>
            <CardHeader>
              <CardTitle className='text-center text-2xl'>
                Crear una nueva contraseña
              </CardTitle>
              <h3>
                Tu nueva contraseña debería ser diferente a
                tu contraseña anterior.
              </h3>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                onReset={handleReset}
                className='text-center'
              >
                <div className='my-5'>
                  <Label className='my-2'>
                    Nueva contraseña
                  </Label>
                  <ErrorMessage
                    name='password'
                    component='div'
                    className='text-red-600'
                  />
                  <Input
                    type='password'
                    name='password'
                    placeholder='Contraseña'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                </div>
                <div className='my-5'>
                  <Label className='my-2'>
                    Confirma la contraseña
                  </Label>
                  <ErrorMessage
                    name='repeated'
                    component='div'
                    className='text-red-600'
                  />
                  <Input
                    type='password'
                    name='repeated'
                    placeholder='La misma contraseña'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.repeated}
                  />
                </div>

                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full bg-[#0091ff]'
                >
                  Enviar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </Formik>
  )
}

export default Recover
