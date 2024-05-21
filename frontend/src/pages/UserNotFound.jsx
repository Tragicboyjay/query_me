import { Box, Heading, Image, Button, Center } from "@chakra-ui/react";
import gif from "../assets/404.gif"

import { useNavigate, useParams } from "react-router-dom";

const UserNotFound = () => {
    const { username } = useParams();

    const navigate = useNavigate();
    
    return (  
        <Box
            textAlign="center" 
        >
            <Center>
                <Image
                    src={gif} 
                    mb="1rem"
                />
            </Center>
    

            <Heading
                size="xl"
                mb="1rem"
            >
                User Not Found
            </Heading>
            
            <Heading
                size="md"
                mb="2rem"
            >
                Sorry, the user &quot;{username}&quot; you are looking for could not be found.
            </Heading>

            <Button 
                background="teal.200"
                onClick={() => navigate("/")}
            >
                Back to Home
            </Button>
        </Box>
    );
}
 
export default UserNotFound;