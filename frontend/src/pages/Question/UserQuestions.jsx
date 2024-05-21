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
    Textarea
 } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { useNavigate, useParams } from "react-router-dom";

const UserQuestions = () => {
    const { user } = useAuth();
    const { username } = useParams();

    const [ errorMessage, setErrorMessage ] = useState("")
    const [ userQuestions, setUserQuestions ] = useState(null);

    const [ questionInput, setQuestionInput ] = useState("");
    const [ disabled, setDisabled ] = useState(false)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const navigate = useNavigate()

    if ( user.username === username ) {
        navigate("/user-profile")
    }

    const formatDate = date => {
        const newDate = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return newDate.toLocaleDateString('en-US', options);
    }

    const fetchQuestions = async () => {
        setDisabled(false)
        try {
            const response = await fetch(`http://localhost:8001/question/search/${username}`);

            if (!response.ok) {
                const data = await response.json();
                if ( response.status === 404 ) {
                    navigate(`/user-not-found/${username}`);
                    return;
                }
                throw new Error(data.message);
            }

            const data = await response.json();

            if ( data.questions.length < 1 ) {
                setErrorMessage(`${username} hasn't anwered any questions yet.`)
                setDisabled(true);
            }

            setUserQuestions(data.questions);
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    const askQuestion = async e => {
        e.preventDefault();

        try {
            const question = { questionBody: questionInput};

            const response = await fetch(`http://localhost:8001/question/ask/${username}`,{
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

            setQuestionInput("")

            onClose()
        } catch (error) {
            setErrorMessage(error.message)
        }

        
    }

    useEffect( () => {
        fetchQuestions();
    }, [])

    return (
          
        <Box
            width="100%"
            px={"15%"} 
            my={"2rem"}
        >
            <Heading
                textAlign="center"
                mb="2rem"
            >{username}</Heading>

            <Center 
                mb="2em"
            >
                <Button
                    onClick={onOpen}
                    background="teal.200"
                    disabled={disabled}
                >Ask Question</Button>
            </Center>

            <Box  
                minHeight="350px" // Ensures it stays at the top even when empty                  
            >
                {errorMessage && <Heading textAlign={"center"}>{errorMessage}</Heading>}
                {!errorMessage && userQuestions && userQuestions.map( question => (
                    <Box
                        key={question._id}
                        p="1rem"
                        boxShadow='base'
                        mb="1rem"
                    >
                        <Heading 
                            size="lg" 
                            mb="1rem" 
                        >{question.body}</Heading>

                        <Heading size="md" mb=".5rem">{question.recipient} answered: {question.answer}</Heading>

                        <Text>{formatDate(question.creationDate)}</Text>

                        <Modal isOpen={isOpen} onClose={onClose}>
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
                                        ></Textarea> 
                                </ModalBody>
                                <ModalFooter>
                                    <Button background="red.400" mr={3} onClick={onClose}>
                                    Close
                                    </Button>
                                    <Button 
                                        background="teal.200"
                                        type="submit"
                                    >Ask question</Button>
                                </ModalFooter>
                            </ModalContent>
                            </form>
                        </Modal>
                    </Box>

                ))}
            </Box>  
        </Box>
    );
}
 
export default UserQuestions;