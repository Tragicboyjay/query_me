import { Box, Text, Flex, Link as ChakraLink } from "@chakra-ui/react";
import { Link as ReactRouterLink } from 'react-router-dom'

const Footer = () => {
    return ( 
    <Box
        position="fixed"
        bottom="0"
        left="0"
        width="100%"
        backgroundColor="lightgray"
        padding="4"
        >
            
        <Flex justify={"center"} align={"center"} height={"100%"}>
            <Text>
                &copy; {new Date().getFullYear()} <ChakraLink as={ReactRouterLink} to="/">Query-Me.ca</ChakraLink>. All rights reserved. 
            </Text>
        </Flex>  
    </Box>
    );
}
 
export default Footer;