import AuthService from '../../services/authService'
import { ErrorMessage, Formik } from 'formik'
import { Input } from './components/input'
import * as Yup from 'yup'
import { Label } from './components/label'
import { Button } from './components/button'

const SendRecover = () => {
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
      onSubmit={(values, { setSubmitting }) => {
        console.log('FETCH')
        setSubmitting(false)
        AuthService.sendRecoverEmail(values)
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        isSubmitting
      }) => (
        <div
          id='container'
          className='h-screen flex p-10'
        >
          <div className='m-auto lg:w-md text-center'>
            <h2 className='scroll-m-20  pb-2 text-3xl font-bold tracking-tight first:mt-0 '>
              Restablecer contraseña
            </h2>
            <p>
              Por favor, introduce tu nombre de usuario para
              recibir al correo electrónico un enlace de
              verificación
            </p>
            <form>
              <div className='my-5'>
                <Label htmlFor='username' className='my-2 mr-4'>
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
