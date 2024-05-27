import { 
    Box,
    Heading,
    useDisclosure,
    Tooltip,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Flex,
    Spacer,
    useToast,
    Input,
    Image
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import followingImg from "../assets/following.png"
import followerImg from "../assets/followers.png"
import unFollowImg from "../assets/delete-friend.png"


const FollowingModal = () => {
    const { user, unfollowUserX } = useAuth();

    const { isOpen: followingIsOpen, onOpen: followingOnOpen, onClose: followingOnClose } = useDisclosure();

    const [ followerCount, setFollowerCount ] = useState(0);
    const [ followingCount, setFollowingCount ] = useState(0);
    const [ followingData, setFollowingData ] = useState([]);
    const [ followError, setFollowError ] = useState(null);

    const [ selectedUsername, setSelectedUsername ] = useState(""); 

    const [searchInput, setSearchInput] = useState(null);
    const [usernameMatches, setUsernameMatches] = useState(null);

    const navigate = useNavigate();
    const toast = useToast();

    const getFollowerMetrics = async () => {
        try {
            const response = await fetch("https://query-me-api.onrender.com/user/follow-info", {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.messag);
            }

            const data = await response.json();

            setFollowingData(data.following)

            setFollowerCount(data.followers.length);

            setFollowingCount(data.following.length)

        } catch (error) {
            setFollowError(error.message)
        }

    }

    const unFollowUser = async (username) => {
        try {
            console.log(username)

            const response = await fetch(`https://query-me-api.onrender.com/user/unfollow/${username}`, {
                method: "PATCH",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }); 

            if (!response.ok){
                const data = await response.json();
                throw new Error(data.message)
            }

            
            unfollowUserX(username)

            getFollowerMetrics()

            toast({
                title: `${username} succesully unfollowed.`,
                status: 'success',
                position: "top",
                duration: 9000,
                isClosable: true,
            })

        } catch (error) {
            toast({
                title: error.message,
                status: 'error',
                position: "top",
                duration: 9000,
                isClosable: true,
            })
        }
    }

    const displayUsers = searchInput ? usernameMatches : followingData;

    const usernameSearch = (input) => {
        setFollowError(null)

        if (!input) {
            setUsernameMatches(null);
        } else {
            const matches = followingData.filter(username => username.startsWith(input));

            if ( matches.length > 0 ){
                setUsernameMatches(matches);
            } else {
                setFollowError("No users found")
            }
                 
        }
    };
        

    useEffect(() => {
        usernameSearch(searchInput);

        if (selectedUsername) {
            unFollowUser(selectedUsername)
            setSelectedUsername(null);
        }
    }, [selectedUsername, searchInput]);

    useEffect( () => {
        getFollowerMetrics()

    }, [])




    return (  
        <Box> 
            <Flex
                gap="1rem"
                align="center"
            >   
                <Tooltip label="Following">
                    <Flex
                        size="sm"
                        cursor="pointer"
                        onClick={followingOnOpen}
                        align="center" 
                        gap=".5rem"
                    >
                        <Image src={followingImg} boxSize="1.5rem" alt="following icon" />
                        <Heading size="md">{followingCount}</Heading>
                    </Flex>
                </Tooltip>
                <Tooltip label="Followers">
                    <Flex
                        size="sm"
                        align="center" 
                    >
                        <Image src={followerImg} boxSize="3rem" alt="follower icon" />
                        <Heading size="md">{followerCount}</Heading>
                    </Flex>
                </Tooltip>
            </Flex>

            
            <Modal isOpen={followingIsOpen} onClose={followingOnClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Following</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        mb="1rem"
                        placeholder="Search followers"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    ></Input>
                    <Box
                        borderColor="gray.200"
                        borderRadius="md"
                        maxHeight="400px"
                        overscrollY="scroll"
                        px="1rem"
                        py=".5rem"
                    >
                        { followError && <Heading size="md" textAlign="center">{followError}</Heading> }
                        { !followError && followingData && followingData.length < 1 && <Heading size="md" textAlign="center">No accounts followed</Heading>}
                        { !followError && displayUsers && displayUsers.map( username => (
                            <Box
                                p=".5rem"
                                width="100%"
                                key={username}
                                
                            >
                                <Flex>
                                    <Heading 
                                        size="md"
                                        cursor="pointer"
                                        onClick={() => navigate(`/user/${username}`)} 
                                    >
                                        {username}
                                    </Heading>
                                    <Spacer />
                                    <Button
                                        _hover={{background: "red.400"}}
                                        onClick={() => setSelectedUsername(username)}
                                    >
                                       <Image boxSize="1rem" src={unFollowImg} alt="unfollow icon" /> 
                                    </Button>
                                </Flex>
                            </Box>
                        ))}
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button 
                        onClick={followingOnClose}
                        background="teal.200"
                    >Close</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>

        </Box>
    );
}
 
export default FollowingModal;