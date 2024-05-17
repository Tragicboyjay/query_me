import { Box, Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from "react-router-dom";


const UserProfile = () => {
    const { user, logoutUser } = useAuth();

    const navigate = useNavigate()

    const handleLogOut = () => {
        logoutUser();
        navigate('/sign-in')

    }

    return (
        <Box w={"100%"} px={"15%"} mt={"2rem"}>
            <Flex  width={"100%"} >
                <Heading>{user.username}</Heading>
                <Spacer />
                <Button onClick={handleLogOut} background={"red.400"}>Log out</Button>
            </Flex>
        </Box> 

    );
}
 
export default UserProfile;