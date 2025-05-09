'use client'

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Container,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  HStack,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import Link from 'next/link'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const inputBg = useColorModeValue('white', 'gray.700')
  const inputBorder = useColorModeValue('gray.200', 'gray.600')
  const inputHoverBorder = useColorModeValue('gray.400', 'gray.500')
  const inputFocusBorder = useColorModeValue('red.500', 'red.400')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your login logic here
    toast({
      title: 'Login attempt',
      description: 'Login functionality to be implemented',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Box
        py={{ base: '0', sm: '8' }}
        px={{ base: '4', sm: '10' }}
        bg={bgColor}
        boxShadow={{ base: 'none', sm: 'md' }}
        borderRadius={{ base: 'none', sm: 'xl' }}
        borderWidth="1px"
        borderColor={borderColor}
      >
        <VStack spacing="6">
          <VStack spacing="3" align="center">
            <Heading size="lg" color={textColor}>Welcome back</Heading>
            <Text color="gray.500" fontSize="sm">
              Don't have an account?{' '}
              <Link href="/signup" style={{ color: '#F56565' }}>
                Sign up
              </Link>
            </Text>
          </VStack>

          <form onSubmit={handleSubmit} style={{ width: '100%', backgroundColor: 'red' }} >
            <VStack spacing="5">
              <FormControl isRequired>
                <FormLabel color={textColor}>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg={inputBg}
                  borderColor={inputBorder}
                  _hover={{ borderColor: inputHoverBorder }}
                  _focus={{ borderColor: inputFocusBorder, boxShadow: 'none' }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg={inputBg}
                    borderColor={inputBorder}
                    _hover={{ borderColor: inputHoverBorder }}
                    _focus={{ borderColor: inputFocusBorder, boxShadow: 'none' }}
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="red"
                width="full"
                bg="#F56565"
                _hover={{ bg: '#E53E3E' }}
                size="lg"
              >
                Sign in
              </Button>
            </VStack>
          </form>

          <Divider />

          <HStack spacing="4" width="full">
            <Button
              variant="outline"
              width="full"
              borderColor={borderColor}
              _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
            >
              <img
                src="/assets/imgs/template/icons/google.svg"
                alt="Google"
                style={{ marginRight: '8px', width: '20px', height: '20px' }}
              />
              Google
            </Button>
            <Button
              variant="outline"
              width="full"
              borderColor={borderColor}
              _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
            >
              <img
                src="/assets/imgs/template/icons/facebook.svg"
                alt="Facebook"
                style={{ marginRight: '8px', width: '20px', height: '20px' }}
              />
              Facebook
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Container>
  )
}

export default Login
