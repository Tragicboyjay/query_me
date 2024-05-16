import { Box, Heading, Flex, Spacer } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (  
        <Box w="100%" px="4rem" py="1rem" bg="teal.200" >
            <Flex w="100%" alignItems="center" justifyContent="center">
                <Heading>Query-Me</Heading>
                <Spacer />
                <Link to="/sign-in">Sign In</Link>
            </Flex>
        </Box>
    );
}
 
export default Navbar;
