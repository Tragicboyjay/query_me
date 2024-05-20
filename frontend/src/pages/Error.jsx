import { Flex, Heading } from "@chakra-ui/react";

const Error = () => {
    return (  
        <Flex
            // height="100dvh"
            width="100%"
            direction="column"
            // justify="center"
            align="center"
        >
            <Heading
                size="xl"
                mb="1rem"
            >404 - Page Not Found</Heading>
            
            <Heading
                size="md"
                textAlign="center"
            >Sorry, the page you are looking for could not be found.</Heading>
        </Flex>
    );
}
 
export default Error;