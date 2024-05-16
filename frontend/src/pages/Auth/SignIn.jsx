import { FormControl, Heading, FormLabel, Input, Center, Button, Text, Link as ChakraLink, Box } from "@chakra-ui/react";
import { Link as ReactRouterLink } from 'react-router-dom'
import { useState } from "react";

const SignIn = () => {
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const handleSignIn = () => {
        
    };
    
    return (
        <Box my="25%">
            
            <Heading textAlign={"center"} mb="1rem">Sign In</Heading>
          
            
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='email' mb="1rem" value={emailInput} placeholder='Email' onChange={e => setEmailInput(e.target.value)}/>
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" mb="1rem" placeholder='Password' value={passwordInput}   onChange={e => setPasswordInput(e.target.value)}/>
            </FormControl>

            <Center>
                <Button mb={"1rem"} onClick={handleSignIn}>Sign In</Button>
            </Center>

            
            <Text textAlign={"center"}>Don&apos;t have an account already? <ChakraLink as={ReactRouterLink} to="/sign-up">Sign up now!</ChakraLink></Text>

        </Box>
    
    );
}
 
export default SignIn;