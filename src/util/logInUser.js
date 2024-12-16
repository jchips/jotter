import axios from 'axios';

const logInUser = async (login, formData, setLoading, setError, setUser, setToken, setIsLoggedIn) => {
  try {
    console.log('formData:', formData); // delete later
    setLoading(true);
    setError('');
    const encodedToken = login(formData.email, formData.password);
    axios.defaults.headers.common['Authorization'] = `Basic ${encodedToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    let requestUrl = `${import.meta.env.VITE_SERVER}/jotter/login`;
    console.log('requestUrl:', requestUrl); // delete later
    let response = await axios.post(requestUrl);
    console.log('response:', response.data); // delete later
    setUser(response.data.user);
    setToken(response.data.token);
    if (response.data.message) {
      return setError(response.data.message);
    }
    setIsLoggedIn(true);
    console.log('logged in successfully'); // delete later
  } catch (err) {
    setIsLoggedIn(false);
    setError('Incorrect email or password');
    console.error(err);
  }
}

export default logInUser;