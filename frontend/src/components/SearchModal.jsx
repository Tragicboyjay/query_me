import { 
    Heading, 
    Box, 
    Input, 
    Button,
    Center,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchModal = () => {
    const [searchError, setSearchError] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [allUsernames, setAllUsernames] = useState(null);
    const [usernameMatches, setUsernameMatches] = useState(null);
    const [selectedUsername, setSelectedUsername] = useState(null); // Added state

    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const fetchUsernames = async () => {
        try {
            setSearchError("");
            const response = await fetch("https://query-me-api-1.onrender.com/user/all");

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            const data = await response.json();
            const allUsers = data.users;

            setAllUsernames(allUsers.map(user => user.username));
        } catch (error) {
            setSearchError(error.message);
        }
    };

    const usernameSearch = (input) => {
        fetchUsernames();
        if (input === "") {
            setUsernameMatches(null);
        } else {
            const matches = allUsernames.filter(username => username.startsWith(input));
            setUsernameMatches(matches);
        }
    };

    const handleUserClick = (username) => {
        setSelectedUsername(username);
        setSearchInput("")
        modalClose();
    };

    const modalOpen = () => {
        fetchUsernames();
        onOpen();
    }

    const modalClose = () => {
        setSearchInput("");
        onClose();

    }


    useEffect(() => {
        usernameSearch(searchInput);

        if (selectedUsername) {
            navigate(`user/${selectedUsername}`);
            setUsernameMatches(null);
            setSearchInput("");
            setSelectedUsername(null);
        }
    }, [selectedUsername, navigate, searchInput]);

    return (  
        <Box>
            <Button
                background="teal.200"
                onClick={modalOpen}
                size="sm"
            >
                {/* User search */}
                <i className="fa-solid fa-magnifying-glass"></i>
            </Button>
            <Modal isOpen={isOpen} onClose={modalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>User Search</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            placeholder="Search"
                            type="text"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            mb="1rem"
                        />
                        <Box
                            borderColor="gray.200"
                            borderRadius="md"
                            maxHeight="400px"
                            overscrollY="scroll"
                            px="1rem"
                            py=".5rem"
                        >
                            {searchError && <Heading>{searchError}</Heading>}
                            {usernameMatches && usernameMatches.length > 0 && usernameMatches.map(username => (
                                <Box
                                    p=".5rem"
                                    width="100%"
                                    key={username}
                                    borderRadius="md"
                                    _hover={{ color: "teal.200", shadow: "base" }}
                                    onClick={() => handleUserClick(username)}
                                    cursor="pointer"
                                    
                                >
                                    <Center>
                                        <Heading 
                                            size="md"
                                            cursor="pointer"
                                        >
                                            {username}
                                        </Heading>
                                    </Center>
                                </Box>
                            ))}
                            {usernameMatches && usernameMatches.length < 1 && <Center><Heading size="md">No users found</Heading></Center>}
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            background="teal.200"
                            onClick={modalClose}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box> 
    );
}
 
export default SearchModal;
