import { FormControl, Heading, FormLabel, Input, Center, Button, Text, Link as ChakraLink, Box } from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate} from 'react-router-dom';
import { useState } from "react";

const SignUp = () => {
    const [emailInput, setEmailInput] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault(); 

        if (!emailInput || !usernameInput || !passwordInput) {
            throw new Error("All fields must be filled in.");
        }

        const newUser = {
            email: emailInput,
            username: usernameInput,
            password: passwordInput
        };

        try {
            const response = await fetch("http://localhost:8001/auth/create-user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();

            if (!data.user) {
                setErrorMessage(data.message);
                return;
            }

            sessionStorage.setItem('user', JSON.stringify(data.user));

            navigate("/")

        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return ( 
        <Box my="25%">
            <form onSubmit={handleSignUp}>
                <Heading textAlign="center" mb="1rem">Sign Up</Heading>
                <Text textAlign="center" color="red">{errorMessage}</Text>

                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input type='email' mb="1rem" value={emailInput} placeholder='Email' onChange={e => setEmailInput(e.target.value)}/>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input type='text' mb="1rem" value={usernameInput} placeholder='Username' onChange={e => setUsernameInput(e.target.value)}/>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" mb="1rem" placeholder='Password' value={passwordInput} onChange={e => setPasswordInput(e.target.value)}/>
                </FormControl>

                <Center>
                    <Button background={"teal.200"} type="submit" mb="1rem">Sign Up</Button>
                </Center>

                <Text textAlign="center">
                    Already have an account?{' '}
                    <ChakraLink as={ReactRouterLink} to="/sign-in">Sign in!</ChakraLink>
                </Text>
            </form>
        </Box>
    );
};

export default SignUp;
