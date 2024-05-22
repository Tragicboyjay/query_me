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
    Flex
 } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { useNavigate, useParams } from "react-router-dom";

const UserQuestions = () => {
    const { user } = useAuth();
    const { username } = useParams();

    const [ errorMessage, setErrorMessage ] = useState("");
    const [ userQuestions, setUserQuestions ] = useState([]);
    const [ questionInput, setQuestionInput ] = useState("");

    // pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const recordsPerPage = 3;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = userQuestions.slice( firstIndex, lastIndex );
    const npages = Math.ceil(userQuestions.length / recordsPerPage);
    const pageNumbers = [...Array(npages + 1).keys()].slice(1);

    const { isOpen: isOpenSearch, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure(); // made a mistake and added search to deferentiate the modoal on the nav and the ask question
    const navigate = useNavigate();
    const toast = useToast()

    if (user.username === username) {
        navigate("/user-profile");
    }

    const formatDate = date => {
        const newDate = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return newDate.toLocaleDateString('en-US', options);
    };

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`http://localhost:8001/question/search/${username}`);

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

            setUserQuestions(data.questions);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const askQuestion = async e => {
        e.preventDefault();

        try {
            const question = { questionBody: questionInput };

            const response = await fetch(`http://localhost:8001/question/ask/${username}`, {
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

    useEffect(() => {
        fetchQuestions();
    }, []);

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
        if (currentPage !== lastIndex ) {
            setCurrentPage(currentPage + 1)
        }
    }

    return (
        <Box width="100%" px={"15%"} my={"2rem"}>
            <Heading textAlign="center" mb="2rem">{username}</Heading>

            <Center mb="2em">
                <Button onClick={onOpenSearch} background="teal.200">Ask Question</Button>
            </Center>

            <Box minHeight="350px">
                {errorMessage && <Heading textAlign={"center"}>{errorMessage}</Heading>}
                {!errorMessage && userQuestions && records.map(question => (
                    <Box key={question._id} p="1rem" boxShadow='base' mb="1rem">
                        <Heading size="lg" mb="1rem">{question.body}</Heading>
                        <Heading size="md" mb=".5rem">{question.recipient} answered: {question.answer}</Heading>
                        <Text>{formatDate(question.creationDate)}</Text>
                    </Box>
                ))}

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

            <Modal isOpen={isOpenSearch} onClose={onCloseSearch}>
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
                        </ModalBody>
                        <ModalFooter>
                            <Button background="red.400" mr={3} onClick={onCloseSearch}>
                                Close
                            </Button>
                            <Button background="teal.200" type="submit">Ask question</Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>

        </Box>
    );
}

export default UserQuestions;
