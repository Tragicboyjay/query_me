import { Box, Heading, Image, Button, Center } from "@chakra-ui/react";
import gif from "../assets/404.gif"
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

const UserNotFound = () => {
    const { username } = useParams();

    const navigate = useNavigate();

    return (  
        <Box
            textAlign="center" 
        >
            <Helmet>
                <title>404 Page Not Found</title>
                <meta name="description" content="Sorry, the page you are looking for could not be found." />
                <meta name="keywords" content="404, page not found, error" />
                <meta property="og:title" content="404 Page Not Found" />
                <meta property="og:description" content="Sorry, the page you are looking for could not be found." />
                <meta property="og:type" content="website" />
            </Helmet>

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
                Sorry, the user &quot;{username}&quot; could not be found.
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