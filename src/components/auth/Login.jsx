import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { Button, Card, Input, Stack } from '@chakra-ui/react';
import { Alert } from '@/components/ui/alert';
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import { PasswordInput } from '@/components/ui/password-input';
import { LuLock, LuMail } from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import logInUser from '@/util/logInUser';
import { setToken, getToken } from '@/util/authUtil';
import './auth.scss';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();
  const fieldRequired = 'This field is required';
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     navigate('/');
  //   }
  // }, [isLoggedIn, navigate]);

  const navigateToSignUp = () => {
    navigate('/signup');
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      await logInUser(
        login,
        formData,
        setLoading,
        setError,
        setUser,
        setToken,
        setIsLoggedIn
      );
      if (getToken()) {
        navigate('/');
      }
    } catch (err) {
      setIsLoggedIn(false);
      setError('Incorrect email or password');
      console.error(err);
    } finally {
      reset({
        email: '',
        password: '',
        confirmPassword: '',
      });
      setLoading(false);
    }
  };

  return (
    <div className='auth-component'>
      <h1>Jotter</h1>
      <Card.Root className='login-form' variant={'elevated'}>
        {error ? (
          <div>
            <Alert status='error' title={error} />
          </div>
        ) : null}
        <Card.Header>
          <Card.Title>Login</Card.Title>
          <Card.Description>Fill in the form below to log in</Card.Description>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap='4' w='full'>
              <Field
                label='Email'
                errorText={fieldRequired}
                invalid={errors.email}
              >
                <Controller
                  name='email'
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputGroup flex='1' startElement={<LuMail />}>
                      <Input
                        type='email'
                        value={value}
                        onChange={onChange}
                        placeholder='Email'
                      />
                    </InputGroup>
                  )}
                />
              </Field>
              <Field
                label='Password'
                errorText={fieldRequired}
                invalid={errors.password}
              >
                <Controller
                  name='password'
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputGroup flex='1' startElement={<LuLock />}>
                      <PasswordInput
                        value={value}
                        onChange={onChange}
                        placeholder='Password'
                      />
                    </InputGroup>
                  )}
                />
              </Field>
              <Button
                type='submit'
                className='auth-btn'
                colorPalette={'gray'}
                variant='solid'
                isDisabled={loading}
              >
                Log In
              </Button>
            </Stack>
          </form>
        </Card.Body>
        <Card.Footer justifyContent='center'>
          <div className='navigate'>
            <p>or</p>
            <Button
              variant='outline'
              className='navigate-btn'
              onClick={navigateToSignUp}
            >
              Create an account
            </Button>
          </div>
        </Card.Footer>
      </Card.Root>
    </div>
  );
};

export default Login;
