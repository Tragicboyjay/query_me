import { 
    Box, 
    Flex, 
    Heading, 
    Spacer, 
    Button, 
    Select, 
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Textarea,
    useToast,
    Tooltip,
    useDisclosure
} from "@chakra-ui/react";
import { useAuth } from '../../contexts/authContext';
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import FollowingModal from "../../components/FollowingModal";
import CharacterInput from "../../components/CharacterInput";
import { Helmet } from "react-helmet";

const UserProfile = () => {
    const [selectValue, setSelectValue] = useState("new");
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState([]); // Default to an empty array
    const [questionAnswer, setQuestionAnswer] = useState("");
    const [questionErrorMessage, setQuestionErrorMessage] = useState("");
    const [questionModals, setQuestionModals] = useState({});

    // pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = data.slice( firstIndex, lastIndex );
    const npages = Math.ceil(data.length / recordsPerPage);
    const pageNumbers = [...Array(npages + 1).keys()].slice(1);

    // const questionsPerPage = 3;
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [ tooManyCharacters, setTooManyCharacters ] = useState(false)


    const handleLogOut = () => {
        logoutUser();
        navigate('/sign-in', { replace: true });
    };

    const formatDate = (date) => {
        const newDate = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return newDate.toLocaleDateString('en-US', options);
    };

    const fetchQuestions = async () => {
        try {
            const response = await fetch("http://localhost:8001/question/own", {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            const data = await response.json();

            let questions;
            switch (selectValue) {
                case "asked":
                    questions = data.questionsAsked
                    .filter(question => question.answer)
                    .sort((a, b) => new Date(b.answerDate) - new Date(a.answerDate));
                
                    questions.length < 1 ? setErrorMessage("No questions asked.") : setErrorMessage("");
                    setData(questions);
                    break;
                case "new":
                    questions = data.questionsRecieved
                    .filter(question => !question.answer)
                    .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
                    
                    questions.length < 1 ? setErrorMessage("No new questions") : setErrorMessage("");
                    setData(questions);
                    break;
                case "answered":
                    questions = data.questionsRecieved
                    .filter(question => question.answer)
                    .sort((a, b) => new Date(b.answerDate) - new Date(a.answerDate));

                    questions.length < 1 ? setErrorMessage("No questions answered.") : setErrorMessage("");
                    setData(questions);
                    break;
                default:
                    break;
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [selectValue]);

    useEffect(() => {
        document.title = "My Profile | Query-Me"
    })

    const toggleModal = (questionId) => {
        setQuestionModals(prevState => ({
            ...prevState,
            [questionId]: !prevState[questionId]
        }));

        setQuestionAnswer("")
    };

    const answerQuestion = async (e, questionId) => {
        e.preventDefault();

        try {
            setQuestionErrorMessage("");
            const answer = { questionAnswer };

            const response = await fetch(`http://localhost:8001/question/answer/${questionId}`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(answer)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            const data = await response.json();

            // Clear the answer and close the modal
            setQuestionAnswer("");
            toggleModal(questionId);

            toast({
                title: data.message,
                status: 'success',
                duration: 9000,
                position: "top",
                isClosable: true,
            });

            // Optionally refresh the questions list
            fetchQuestions();
        } catch (error) {
            setQuestionErrorMessage(error.message);
        }
    };

    const [ deleteId, setDeleteId ] = useState(null);

    const deleteQuestion = async () => {
        try {
            const id = deleteId;
            const response = await fetch(`http://localhost:8001/question/${id}`, {
                method: "DELETE",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })

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
            });

            deleteOnClose();
            fetchQuestions();
            
        } catch (error) {
            toast({
                title: data.message,
                status: 'error',
                duration: 9000,
                position: "top",
                isClosable: true,
            });

        }
    }

    const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure();

    const handleDeleteModal = id => {
        setDeleteId(id)
        deleteOnOpen()
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

    return (
        <Box w={"100%"} px={"15%"} my={"1rem"}>
            <Helmet>
                <title>My Profile | Query-Me</title>
                <meta name="description" content="View and manage your profile on Query-Me, including your questions and settings." />
                <meta name="keywords" content="my profile, Query-Me, questions, settings, log out" />
                <meta property="og:title" content="My Profile | Query-Me" />
                <meta property="og:description" content="View and manage your profile on Query-Me, including your questions and settings." />
                <meta property="og:type" content="website" />
            </Helmet>

            <Flex  
                direction={["column", "row", "row", "row"]} 
                width={"100%"}
                mb="2rem"
                textAlign={["center", "left", "left", "left"]}
                justify="center"
                align="center"
             >
                <Flex
                    align="center"
                    mb={["1rem", "", "", ""]}
                    gap="1rem"
                    direction={["column", "row", "row", "row"]} 
                >
                    <Heading 
                        textAlign="center"
                    >
                        {user.username} 
                    </Heading>
                    <FollowingModal />  
                </Flex>

                <Spacer />
                <Flex
                    align="center"
                    gap="1rem"
                >   
                    <Tooltip label="Settings">
                        <Heading size="lg">
                            <Link to="/user-profile/settings"><i style={{cursor: "pointer", color: "lightgrey"}} className="fa-solid fa-gear"></i></Link>
                        </Heading>
                        
                    </Tooltip>
                    
                    <Button onClick={handleLogOut} background={"red.400"}>Log out</Button>
                </Flex>

            </Flex>
            <Heading textAlign="center" mb="1rem">Questions</Heading>
            <Select
                mb="2rem"
                value={selectValue}
                onChange={e => setSelectValue(e.target.value)}
            >
                <option value="new">New Questions</option>
                <option value="asked">Asked Questions</option>
                <option value="answered">Answered Questions</option>
            </Select>

            <Box minHeight={["350px", "350px", "450px", "850px"]}>
                {errorMessage && <Heading textAlign={"center"}>{errorMessage}</Heading>}
                {!errorMessage && records.length > 0 && records.map(question => (
                    <Box 
                        key={question._id} 
                        p="1rem"
                        boxShadow='base'
                        mb="1rem"
                    >
                        <Heading size="lg" mb="1rem">{question.body}</Heading>
                        {selectValue === "asked" && <Heading size="md" mb=".5rem">{question.recipient} answered: {question.answer}</Heading>}
                        {selectValue === "answered" && <Heading size="md" mb=".5rem">You answered: {question.answer}</Heading>}

                        {selectValue === "asked" ? <Text>Answered: {formatDate(question.answerDate)}</Text> : 
                        selectValue === "new" ? <Text>Asked: {formatDate(question.creationDate)}</Text> : 
                        <Text>Asked: {formatDate(question.creationDate)} <br /> Answered: {formatDate(question.answerDate)}</Text>}

                        {selectValue === "new" && 
                            <Flex
                                mt="1rem"
                                gap="1rem"
                                alignItems="center"
                            >
                                <Button onClick={() => toggleModal(question._id)}  background="teal.200">Answer Question</Button>
                                <Tooltip label="Delete question">
                                    <Button
                                        onClick={() => handleDeleteModal(question._id)}
                                        background="red.400"
                                    ><i className="fa-solid fa-trash"></i></Button>
                                </Tooltip>
                            </Flex>

                        }

                        <Modal isOpen={deleteIsOpen} onClose={deleteOnClose}>
                            <ModalOverlay />
                            <ModalContent>
                            <ModalHeader>Comfirmation</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Heading textAlign="center" size="md">Are you sure you want to delete this question?</Heading>
                            </ModalBody>

                            <ModalFooter>
                                <Button background="lightgray" mr={3} onClick={deleteOnClose}>
                                No
                                </Button>
                                <Button
                                    onClick={deleteQuestion}
                                    background="red.400"
                                >Yes</Button>
                            </ModalFooter>
                            </ModalContent>
                        </Modal>

                        <Modal isOpen={questionModals[question._id]} onClose={() => toggleModal(question._id)}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Answer Question</ModalHeader>
                                <ModalCloseButton />
                                <form onSubmit={(e) => answerQuestion(e, question._id)}>
                                    <ModalBody>
                                        { questionErrorMessage && <Text color="red">{questionErrorMessage}</Text>}
                                        <Heading 
                                            textAlign="center"
                                            size="sm" 
                                            mb="1rem"
                                        >{question.body}</Heading>
                                        <Textarea
                                            placeholder="Question answer"
                                            value={questionAnswer}
                                            onChange={e => setQuestionAnswer(e.target.value)}
                                        ></Textarea> 
                                        <CharacterInput input={questionAnswer.length} func={setTooManyCharacters} />
                                    </ModalBody>
                                    <ModalFooter>
                                    <Button  mr={3} onClick={() => toggleModal(question._id)}>
                                        Close
                                    </Button>
                                        <Button 
                                            isDisabled={tooManyCharacters}
                                            type="submit"
                                            background="teal.200"
                                        >Answer Question</Button>
                                    </ModalFooter>
                                </form>
                            </ModalContent>
                        </Modal>
                    </Box>
                ))}
                {!errorMessage && data.length === 0 && (
                    <Heading textAlign={"center"}>No questions found.</Heading>
                )}


                {data.length > recordsPerPage && 
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
            
        </Box> 
    );
}

 
export default UserProfile;
