import {
    List,
    Heading,
    ListItem,
    Box,
    Flex,
    Text,
    Button,
    Center,
    Image
} from "@chakra-ui/react";

import questions2 from "../assets/questions2.svg";
import signUp from "../assets/signUp.svg";
import search from "../assets/search.svg";
import answer from "../assets/answer.svg";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; 


const Home = () => { 
    const navigate = useNavigate();

    useEffect( () => {
        document.title = "Home | Query-Me"
    })

    return (
        <Flex
            width={["100%", "80%", "70%", "70%"]}
            flexDir="column"
            alignItems="center"
            gap="2rem"
            padding="2rem"
        >
            {/* Main Banner Section */}
            <Box
                textAlign="center"
                mb="3rem"
                bg="teal.50"
                p="3rem"
                borderRadius="lg"
                shadow="md"
            >
                <Heading
                    mb="1rem"
                >What is Query-Me?</Heading>
                <Text fontSize="lg" mb="2rem">Query-Me is a question and answer platform where you can ask questions to your friends, followers, or the entire community. Whether you&apos;re seeking advice, looking for fun conversations, or just curious about something, Query-Me makes it easy to connect through questions.</Text>
                <Center><Image src={questions2} alt="People asking questions" borderRadius="lg" mb="2rem"/></Center>
                <Button size="lg" colorScheme="teal" onClick={ () => navigate("/sign-up") }>Get Started</Button>
                
            </Box>

            {/* Features Section */}
            <Box
                bg="white"
                p="3rem"
                borderRadius="lg"
                shadow="md"
                width="100%"
            >
                <Heading
                    textAlign="center"
                    color="teal.500"
                    mb="2rem"
                >Features</Heading>

                <Center>
                    <List spacing={4} >
                        <ListItem>
                            <Flex alignItems="center">
                                {/* <Image src="" alt="Feature 1" boxSize="50px" mr="1rem" /> */}
                                <i style={{fontSize: "50px", marginRight: "1rem"}} className="fa-solid fa-magnifying-glass"></i>
                                <Heading size="md">Search for users and ask them questions anonymously.</Heading>
                            </Flex>
                        </ListItem>
                        <ListItem>
                            <Flex alignItems="center">
                                {/* <Image src="path-to-feature-image2.jpg" alt="Feature 2" boxSize="50px" mr="1rem" /> */}
                                <i style={{fontSize: "50px", marginRight: "1rem"}} className="fa-solid fa-inbox"></i>
                                <Heading size="md">Receive and answer questions from friends and followers.</Heading>
                            </Flex>
                        </ListItem>
                        <ListItem>
                            <Flex alignItems="center">
                                {/* <Image src="path-to-feature-image3.jpg" alt="Feature 3" boxSize="50px" mr="1rem" /> */}
                                <i style={{fontSize: "50px", marginRight: "1rem"}} className="fa-solid fa-plus"></i>
                                <Heading size="md">Follow interesting profiles and stay updated with their answers.</Heading>
                            </Flex>
                        </ListItem>
                        <ListItem>
                            <Flex alignItems="center">
                                {/* <Image src="path-to-feature-image4.jpg" alt="Feature 4" boxSize="50px" mr="1rem" /> */}
                                <i style={{fontSize: "50px", marginRight: "1rem"}} className="fa-solid fa-user"></i>
                                <Heading size="md">Customize your profile with a bio, photo, and more.</Heading>
                            </Flex>
                        </ListItem>
                        <ListItem>
                            <Flex alignItems="center">
                                {/* <Image src="path-to-feature-image5.jpg" alt="Feature 5" boxSize="50px" mr="1rem" /> */}
                                <i style={{fontSize: "50px", marginRight: "1rem"}} className="fa-solid fa-envelope"></i>
                                <Heading size="md">Get notified when someone asks or answers a question.</Heading>
                            </Flex>
                        </ListItem>
                    </List>
                </Center>

            </Box>

            {/* How It Works Section */}
            <Box
                bg="teal.50"
                p="3rem"
                borderRadius="lg"
                shadow="md"
                width="100%"
            >
                <Heading
                    textAlign="center"
                    color="teal.500"
                    mb="2rem"
                >How It Works</Heading>

                <Flex flexDir="column" alignItems="center">
                    <Box textAlign="center" mb="2rem">
                        <Center>
                            <Image src={signUp} alt="Sign Up" boxSize="150px" mb="1rem" />
                        </Center>
                        <Heading size="md" mb="1rem">Sign Up</Heading>
                        <Text>Create your account and set up your profile.</Text>
                    </Box>
                    
                    <Box textAlign="center" mb="2rem">
                        <Center>
                            <Image src={search} alt="Search & Ask" boxSize="150px" mb="1rem" />
                        </Center>
                        <Heading size="md" mb="1rem">Search & Ask</Heading>
                        <Text>Use the search bar to find users and ask your questions.</Text>
                    </Box>

                    <Box textAlign="center" mb="2rem">
                        <Center>
                            <Image src={answer} alt="Answer & Engage" boxSize="150px" mb="1rem" />
                        </Center>
                        <Heading size="md" mb="1rem">Answer & Engage</Heading>
                        <Text>Answer questions you receive and engage with the community.</Text>
                    </Box>
                </Flex>
            </Box>
        </Flex>
    );
}

export default Home;
