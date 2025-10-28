import AuthService from '../../../services/authService'
import { ErrorMessage, Formik } from 'formik'
import { Input } from './components/input'
import * as Yup from 'yup'
import { Label } from './components/label'
import { Button } from './components/button'
import {
  Alert,
  AlertDescription,
  AlertTitle
} from './components/alert'
import { useState } from 'react'
import { CheckCircleIcon } from 'lucide-react'

const SendRecover = () => {
  const [openAlert, setOpenAlert] = useState(false)

  return (
    <Formik
      initialValues={{
        username: ''
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required(
          'Debes introducir tu nombre de usuario'
        )
      })}
      onSubmit={async (
        values,
        { setSubmitting, resetForm, setFieldError }
      ) => {
        try {
          await AuthService.sendRecoverEmail(values)
          setOpenAlert(true)
          setSubmitting(false)
          resetForm()
        } catch (error: any) {
          if (error.status === 404)
            setFieldError(
              'username',
              'Usuario no encontrado. Verifique el nombre de usuario y vuelva a intertar'
            )
        }
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        isSubmitting
      }) => (
        <div
          id='container'
          className='h-screen flex justify-center p-10'
        >
          <Alert
            className={`fixed w-lg mt-5 text-green-500 ${
              !openAlert ? 'hidden' : ''
            }`}
          >
            <CheckCircleIcon />
            <AlertTitle>Enlance enviado</AlertTitle>
            <AlertDescription className='text-green-500'>
              ¡Te hemos enviado un correo de recuperación!
              Si no lo encuentras, revisa tu bandeja de
              spam, a veces se enconden ahí! ;)
            </AlertDescription>
          </Alert>
          <div className='m-auto w-md text-center'>
            <h2 className='scroll-m-20  pb-2 text-3xl font-bold tracking-tight first:mt-0 '>
              Restablecer contraseña
            </h2>
            <p>
              Por favor, introduce tu nombre de usuario para
              recibir al correo electrónico un enlace de
              verificación
            </p>
            <form
              method='post'
              onSubmit={handleSubmit}
              onReset={handleReset}
            >
              <div className='my-5'>
                <Label
                  htmlFor='username'
                  className='my-2 mr-4'
                >
                  Nombre de usuario
                </Label>
                <ErrorMessage
                  name='username'
                  component='div'
                  className='text-red-600'
                />
                <Input
                  type='text'
                  name='username'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                />
              </div>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-30 bg-[#0091ff] text-lg'
              >
                Enviar
              </Button>
            </form>
          </div>
        </div>
      )}
    </Formik>
  )
}

export default SendRecover
