import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LuLock, LuMail } from 'react-icons/lu';
import { useForm, Controller } from 'react-hook-form';
import { Button, Card, Input, Stack, Flex } from '@chakra-ui/react';
import { Alert } from '@/components/ui/alert';
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import { PasswordInput } from '@/components/ui/password-input';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/util/authUtil';
import jotterGif from '@/assets/ic/jotter4.gif';
import './auth.scss';

const Signup = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, setIsLoggedIn } = useAuth();
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
      confirmPassword: '',
    },
  });

  // Navigate user to login page
  const navigateToSignUp = () => {
    navigate('/login');
  };

  /**
   * Creates a Jotter account for the user with their inputted credentials
   * @param {Object} formData - The form data the user submits (email and password)
   * @returns {Function} - Sets the error message
   */
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      if (formData.password !== formData.confirmPassword) {
        setLoading(false);
        return setError('Passwords do not match');
      }
      const signupInfo = {
        email: formData.email,
        password: formData.password,
      };
      let requestUrl = `${import.meta.env.VITE_SERVER}/jotter/signup`;
      let res = await axios.post(requestUrl, signupInfo);
      if (res.data.message) {
        return setError(res.data.message);
      }
      await login(signupInfo.email, signupInfo.password); // log user in
      if (getToken()) {
        navigate('/');
      }
    } catch (err) {
      setIsLoggedIn(false);
      setError('There has been a server error :( Please try again.');
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
          <Card.Title>Sign up</Card.Title>
          <Card.Description>
            Fill in the form below to create an account
          </Card.Description>
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
                        type='password'
                        value={value}
                        onChange={onChange}
                        placeholder='Password'
                      />
                    </InputGroup>
                  )}
                />
              </Field>
              <Field
                label='Confirm Password'
                errorText={fieldRequired}
                invalid={errors.confirmPassword}
              >
                <Controller
                  name='confirmPassword'
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputGroup flex='1' startElement={<LuLock />}>
                      <PasswordInput
                        type='password'
                        value={value}
                        onChange={onChange}
                        placeholder='Re-enter password'
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
                Sign up
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
              Log in to account
            </Button>
          </div>
        </Card.Footer>
      </Card.Root>
    </div>
  );
};

export default Signup;
