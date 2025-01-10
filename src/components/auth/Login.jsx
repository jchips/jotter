import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { Button, Card, Input, Stack, Flex } from '@chakra-ui/react';
import { Alert } from '@/components/ui/alert';
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import { PasswordInput } from '@/components/ui/password-input';
import { LuLock, LuMail } from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/util/authUtil';
import jotterGif from '@/assets/ic/jotter4.gif';
import './auth.scss';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, setIsLoggedIn } = useAuth();
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

  // Navigate user to signup page
  const navigateToSignUp = () => {
    navigate('/signup');
  };

  /**
   * Logs user into Jotter
   * @param {Object} formData - The form data the user submits (email and password)
   */
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      let res = await login(formData.email, formData.password);
      if (res?.response?.data === 'Invalid login') {
        setIsLoggedIn(false);
        setError('Incorrect email or password');
      }
      if (getToken()) {
        navigate('/');
      }
    } catch (err) {
      setIsLoggedIn(false);
      setError(
        err.message === 'Request failed with status code 403'
          ? 'Incorrect email or password'
          : 'Sorry, there has been a server error :('
      );
      console.error(err);
    } finally {
      reset({
        email: '',
        password: '',
      });
      setLoading(false);
    }
  };

  return (
    <div className='auth-component'>
      <Flex
        className='header-container'
        direction={'row'}
        justify={'center'}
        align={'center'}
      >
        <img className='gif' src={jotterGif} alt='Jotter gif' />
        <h1>Jotter</h1>
      </Flex>
      <Card.Root className='login-form' variant={'elevated'}>
        {error ? (
          <div>
            <Alert status='error' title={error} />
          </div>
        ) : null}
        <Card.Header>
          <Card.Title>Log in</Card.Title>
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
                        // type='email'
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
                disabled={loading}
              >
                Log in
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
