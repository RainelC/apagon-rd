import { useSearchParams } from 'react-router-dom'
import AuthService from '../../services/authService'
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
import { Error400 } from '../../pages/error/error400'
import { Error403 } from './components/error403'

const Recover = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [error, setError] = useState({
    error: false,
    status: 200
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await AuthService.recoverPasswd({
          password: 'test',
          repeated: 'test',
          token: token ? token : ''
        })
        console.log('result', result)
      } catch (err: any) {
        // if (error.status === 400)
        setError({ error: true, status: err.status })
        console.log('error: ', error.status)
      }
    }
    fetchData()
  }, [token])

  return error.error ? (
    error.status === 400 ? (
      <Error400 />
    ) : (
      <Error403 />
    )
  ) : (
    <Formik
      initialValues={{
        password: '',
        repeated: '',
        token: token
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
      onSubmit={(values, { setSubmitting }) => {
        AuthService.recoverPasswd(values)
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleBlur,
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
              <form className='text-center'>
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
