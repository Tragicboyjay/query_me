import { FormControl, Heading, FormLabel, Input, Center, Button, Text, Link as ChakraLink, Box } from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { Helmet } from 'react-helmet';

const SignIn = () => {
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { loginUser, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/user-profile");
        }
    }, [])

    const handleSignIn = async e => {
        e.preventDefault(); 

        try {
            if (!emailInput || !passwordInput) {
                throw new Error("All fields must be filled in.");
            }
    
            const credentials = {
                email: emailInput,
                password: passwordInput
            }
            
            
    
            const response = await fetch("http://localhost:8001/auth/authenticate", {
                method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials)
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
                <title>Sign In | Query-Me</title>
                <meta name="description" content="Sign in to your Query-Me account to access your personalized content and interact with the community." />
                <meta name="keywords" content="sign in, login, Query-Me, user account, community" />
                <meta property="og:title" content="Sign In | Query-Me" />
                <meta property="og:description" content="Sign in to your Query-Me account to access your personalized content and interact with the community." />
                <meta property="og:type" content="website" />
                {/* <meta property="og:url" content="http://yourwebsite.com/sign-in" />
                <meta property="og:image" content="http://yourwebsite.com/path-to-your-image.jpg" /> */}
            </Helmet>
        
            <Heading textAlign={"center"} mb="1rem">Sign In</Heading>
            <Text textAlign="center" color="red">{errorMessage}</Text>
        
            
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='email' mb="1rem" value={emailInput} placeholder='Email' onChange={e => setEmailInput(e.target.value)}/>
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" mb="1rem" placeholder='Password' value={passwordInput}   onChange={e => setPasswordInput(e.target.value)}/>
            </FormControl>

            <Center>
                <Button background="teal.200" mb={"1rem"} onClick={handleSignIn}>Sign In</Button>
            </Center>

            
            <Text textAlign={"center"}>Don&apos;t have an account already? <ChakraLink as={ReactRouterLink} to="/sign-up">Sign up now!</ChakraLink></Text>

        </Box>
        

    
    );
}
 
export default SignIn;