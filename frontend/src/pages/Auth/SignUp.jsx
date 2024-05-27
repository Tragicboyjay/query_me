import { FormControl, Heading, FormLabel, Input, Center, Button, Text, Link as ChakraLink, Box, useToast } from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate} from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { Helmet } from "react-helmet";

const SignUp = () => {
    const [emailInput, setEmailInput] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { loginUser, user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        
        if (user) {
            navigate("/user-profile");
        }
    }, [])


    const handleSignUp = async e => {
        e.preventDefault(); 
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const usernameRegex = /^[a-zA-Z0-9]{1,12}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

        try {
            if (!emailInput || !usernameInput || !passwordInput) {
                throw new Error("All fields must be filled in.");
            }

            if (!emailRegex.test(emailInput)) {
                throw new Error("Please enter a valid email address.");
            }

            if (!usernameRegex.test(usernameInput)) {
                throw new Error("Username must be 1-12 characters long and can only contain letters and numbers.");
            }

            if (!passwordRegex.test(passwordInput)) {
                throw new Error("Password must be at least 8 characters long and contain at least one uppercase, lowercase letter, one number, and one special character (@$!%*?&#).");
            }

            const newUser = {
                email: emailInput,
                username: usernameInput,
                password: passwordInput
            };

        
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

            toast({
                title: 'Account created.',
                description: data.message,
                position: "top",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
           
            loginUser(data.user);
            navigate("/feed")

        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        
            <Box
                width="70%"
                maxWidth="400px"
            >
                <Helmet>
                    <title>Sign Up | Query-Me</title>
                    <meta name="description" content="Create a new account on Query-Me to start accessing personalized content and engaging with the community." />
                    <meta name="keywords" content="sign up, register, Query-Me, create account, community" />
                    <meta property="og:title" content="Sign Up | Query-Me" />
                    <meta property="og:description" content="Create a new account on Query-Me to start accessing personalized content and engaging with the community." />
                    <meta property="og:type" content="website" />
                    {/* <meta property="og:url" content="http://yourwebsite.com/sign-up" />
                    <meta property="og:image" content="http://yourwebsite.com/path-to-your-image.jpg" /> */}
                </Helmet>

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
