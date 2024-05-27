import { 
    Box, 
    Heading, 
    Button, 
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Center,
    useDisclosure,
    Textarea,
    useToast,
    Flex,
    Spacer,
    Image
 } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { useNavigate, useParams } from "react-router-dom";
import followerIcon from "../../assets/followers.png"
import CharacterInput from "../../components/CharacterInput";
import { Helmet } from "react-helmet";

const UserQuestions = () => {
    const { user, followUserX, unfollowUserX } = useAuth();
    const { username } = useParams();

    // question fetch
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ userQuestions, setUserQuestions ] = useState([]);
    const [ questionInput, setQuestionInput ] = useState("");

    // follow functionality 
    const [ following, setFollowing ] = useState(false);
    const [ followCount, setFollowCount ] = useState(0);

    // pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = userQuestions.slice( firstIndex, lastIndex );
    const npages = Math.ceil(userQuestions.length / recordsPerPage);
    const pageNumbers = [...Array(npages + 1).keys()].slice(1);

    const [ tooManyCharacters, setTooManyCharacters ] = useState(false)

    const { isOpen: isOpenSearch, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure(); // made a mistake and added search to deferentiate the modoal on the nav and the ask question
    const navigate = useNavigate();
    const toast = useToast()

    

    useEffect(() => {

        setFollowing(isFollowing());

        fetchQuestions();

        if (user && user.username === username) {
            navigate("/user-profile");
        }
    }, [])

    useEffect( () => {
        getFollowCount();
    }, [following])

    const formatDate = date => {
        const newDate = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return newDate.toLocaleDateString('en-US', options);
    };

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`https://query-me-api-1.onrender.com/question/search/${username}`);

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 404) {
                    navigate(`/user-not-found/${username}`);
                    return;
                }
                throw new Error(data.message);
            }

            const data = await response.json();

            if (data.questions.length < 1) {
                setErrorMessage(`${username} hasn't answered any questions yet.`);
            }

            const questions = data.questions.sort((a, b) => new Date(b.answerDate) - new Date(a.answerDate));
            setUserQuestions(questions);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const askQuestion = async e => {
        e.preventDefault();

        try {
            const question = { questionBody: questionInput };

            const response = await fetch(`https://query-me-api-1.onrender.com/question/ask/${username}`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(question)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            const data = await response.json();

            toast({
                title: data.message,
                status: 'success',
                duration: 9000,
                position: "top",
                isClosable: true,
            })

            setQuestionInput("");
            onCloseSearch();
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleModalClose = () => {
        setQuestionInput("")
        onCloseSearch()
    }

    // pagination function
    const previousPage = () => {
        if (currentPage !== 1 ) {
            setCurrentPage(currentPage - 1)
        }
    }

    const changePage = n => {
        setCurrentPage(n)
    }

    const nextPage = () => {
        if (currentPage !== npages ) {
            setCurrentPage(currentPage + 1)
        }
    }

    const isFollowing = () => {
        return user && user.following && user.following.includes(username);
    }

    const followUser = async () => {
        try {
            const response = await fetch(`https://query-me-api-1.onrender.com/user/follow/${username}`, {
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

            followUserX(username)
            setFollowing(true);

            toast({
                title: `${username} succesully followed.`,
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

    const unFollowUser = async () => {
        try {
            const response = await fetch(`https://query-me-api-1.onrender.com/user/unfollow/${username}`, {
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

            setFollowing(false);
            unfollowUserX(username)

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

    const getFollowCount = async () => {
        try {
            const response = await fetch(`https://query-me-api-1.onrender.com/user/follow-count/${username}`)

            if(!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            const data = await response.json();
            const count = data.followerCount;

            setFollowCount(count);
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

    return (
        <Box width="100%" px={"15%"} my={"2rem"}>
            <Helmet>
                <title>{username} | Query-Me</title>
                <meta name="description" content={`Explore questions answered by ${username} on Query-Me and ask your own questions to the community.`} />
                <meta name="keywords" content={`${username}, user questions, Query-Me, answers, community, ask questions`} />
                <meta property="og:title" content={`${username} | Query-Me`} />
                <meta property="og:description" content={`Explore questions answered by ${username} on Query-Me and ask your own questions to the community.`} />
                <meta property="og:type" content="website" />
            </Helmet>

            <Flex
                width="100%"
                align="center"
                mb="2rem"
            >
                <Heading size="md" textAlign="center">
                    {username} {user && (
                    <Button 
                        backgroundColor={following ? "teal.200" : ""}
                        size="sm"
                        onClick={ following ? unFollowUser : followUser}
                        
                    >
                        {!following ? (
                            <i className="fa-solid fa-user-plus"></i>
                        ) : (
                            <i className="fa-solid fa-check"></i>
                        )}
                    </Button>
                )}
                </Heading>
                <Spacer />
                <Flex
                    align="center"
                >
                    <Heading size="md">{followCount}</Heading>
                    <Image src={followerIcon} boxSize="3rem" alt="follower icon" />
                </Flex>
                
            </Flex>
            { user &&
                <Center mb="2em">
                    <Button onClick={onOpenSearch} background="teal.200">Ask Question</Button>
                </Center>
            }


            <Box minH={["350px", "350px", "450px", "850px"]}>
                {errorMessage && <Heading textAlign={"center"}>{errorMessage}</Heading>}
                {!errorMessage && userQuestions.length === 0 && (
                    <Heading textAlign={"center"}>No questions found.</Heading>
                )}
                {!errorMessage && userQuestions.length > 0 && records.map(question => (
                    <Box key={question._id} p="1rem" boxShadow='base' mb="1rem">
                        <Heading size="lg" mb="1rem">{question.body}</Heading>
                        <Heading size="md" mb=".5rem">{question.recipient} answered: {question.answer}</Heading>
                        <Text>Answered: {formatDate(question.answerDate)}</Text>
                    </Box>
                ))}

                {/* pagination */}
                {userQuestions.length > recordsPerPage && 
                    <Flex
                        width="100%"
                        justify="center"
                    >

                        <Button
                            onClick={previousPage}
                        >Prev</Button>

                        {
                            pageNumbers.map( (number, index) => (
                                <Button
                                    key={index}
                                    backgroundColor={number === currentPage && "teal.200"}
                                    onClick={() => changePage(number)}
                                >{number}</Button>
                            ))
                        }

                        
                        <Button
                            onClick={nextPage}
                        >Next</Button>
                        


                    </Flex>
                }
                
            </Box>

            <Modal isOpen={isOpenSearch} onClose={handleModalClose}>
                <ModalOverlay />
                <form onSubmit={askQuestion}>
                    <ModalContent>
                        <ModalHeader>{`Ask ${username} a Question`}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Textarea
                                placeholder="Question"
                                value={questionInput}
                                onChange={e => setQuestionInput(e.target.value)}
                            />
                            <CharacterInput input={questionInput.length} func={setTooManyCharacters}/>
                        </ModalBody>
                        <ModalFooter>
                            <Button  mr={3} onClick={handleModalClose}>
                                Close
                            </Button>
                            <Button
                             background="teal.200" 
                             type="submit"
                             isDisabled={tooManyCharacters ? true : false}
                            >Ask question</Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>

        </Box>
    );
}

export default UserQuestions;
