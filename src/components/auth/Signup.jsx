import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
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

const Signup = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, setIsLoggedIn, setUser } = useAuth();
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

  const navigateToSignUp = () => {
    navigate('/login');
  };

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
      console.log('signupInfo:', signupInfo); // delete later

      let requestUrl = `${import.meta.env.VITE_SERVER}/jotter/signup`;
      let response = await axios.post(requestUrl, signupInfo);
      console.log('response:', response.data); // delete later
      if (response.data.message) {
        return setError(response.data.message);
      }
      console.log('signed up successfully'); // delete later
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
          <Card.Title>Sign up</Card.Title>
          <Card.Description>
            Fill in the form below to create an account
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <form>
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
                        value={value}
                        onChange={onChange}
                        placeholder='Re-enter Password'
                      />
                    </InputGroup>
                  )}
                />
              </Field>
              <Button
                className='auth-btn'
                type='submit'
                colorPalette={'gray'}
                variant='solid'
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
              >
                Sign in
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
