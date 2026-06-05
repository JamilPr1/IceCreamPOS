import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UseToast from '../../customHook/UseToast';
import { API_URL } from '../../config/api';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const toastMsg = UseToast();


  const handleLogin = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toastMsg({
        title: "Please enter email and password",
        status: "warning"
      });
      return;
    }

    setLoading(true);
    const obj = {
      email: trimmedEmail,
      password: trimmedPassword
    };

    axios.post(`${API_URL}/login`, obj).then((res) => {
      setToken(res.data.token);
      sessionStorage.setItem('Rtoken', res.data.token);
      toastMsg({
        title: `Admin logged in successfully`,
        status: "success"
      });
      setEmail("");
      setPassword("");
      navigate("/inventory");
    }).catch((error) => {
      const message = error.response?.data?.error || "Invalid email or password";
      toastMsg({
        title: message,
        status: "error"
      });
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
          </Text>
          <Text fontSize={'sm'} color={'gray.500'} textAlign="center">
            Local dev: admin@icecream.com / admin123
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} placeholder='Your Email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} placeholder='Your Password' onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Link color={'blue.400'}>Forgot password?</Link>
              </Stack>
              {loading ? <Button
                isLoading
                loadingText='Submitting'
                colorScheme='teal'
                variant='outline'
              >
                Submit
              </Button> : <Button
                onClick={handleLogin}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign in
              </Button>}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
