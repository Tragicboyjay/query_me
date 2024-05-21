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
    Textarea
} from "@chakra-ui/react";
import { useAuth } from '../../contexts/authContext';
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState} from "react";


const UserProfile = () => {
    const [selectValue, setSelectValue] = useState("new");
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState(null);
    const [questionAnswer, setQuestionAnswer] = useState("");
    const [questionErrorMessage, setQuestionErrorMessage] = useState("");
    const [questionModals, setQuestionModals] = useState({});

    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogOut = () => {
        logoutUser();
        navigate('/sign-in', { replace: true })
    }

    const formatDate = date => {
        const newDate = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return newDate.toLocaleDateString('en-US', options);
    }

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
                    questions = data.questionsAsked.filter(question => question.answer);
                    questions.length < 1 ? setErrorMessage("No questions asked.") : setErrorMessage("");
                    setData(questions);
                    break;
                case "new":
                    questions = data.questionsRecieved.filter(question => !question.answer);
                    questions.length < 1 ? setErrorMessage("No new questions") : setErrorMessage("");
                    setData(questions);
                    break;
                case "answered":
                    questions = data.questionsRecieved.filter(question => question.answer);
                    questions.length < 1 ? setErrorMessage("No questions answered.") : setErrorMessage("");
                    setData(questions);
                    break;
                default:
                    break;
            }
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    useEffect(() => {
        fetchQuestions();
    }, [selectValue]);

    const toggleModal = (questionId) => {
        setQuestionModals(prevState => ({
            ...prevState,
            [questionId]: !prevState[questionId]
        }));
    };

    const answerQuestion = async (e, questionId) => {
        e.preventDefault();

        try {
            setQuestionErrorMessage("")
            const answer = { questionAnswer: questionAnswer }

            const response = await fetch(`http://localhost:8001/question/answer/${questionId}`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(answer)
            })

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            // Clear the answer and close the modal
            setQuestionAnswer("");
            toggleModal(questionId);

            // Optionally refresh the questions list
            fetchQuestions();
            
        } catch (error) {
            setQuestionErrorMessage(error.message)
        }
    }

    return (
        <Box w={"100%"} px={"15%"} my={"1rem"}>
            <Flex  
                direction={["column", "row", "row", "row"]} 
                width={"100%"}
                mb="2rem"
                textAlign={["center", "left","left","left"]}
                justify="center"
                align="center"
             >
                <Heading 
                    mb={["1rem", "", "", ""]}
                    textAlign="center"
                >{user.username} <Link to="/user-profile/settings"><i style={{cursor: "pointer", color: "lightgrey"}} className="fa-solid fa-gear"></i></Link></Heading>
                <Spacer />
                <Button onClick={handleLogOut} background={"red.400"}>Log out</Button>
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

            <Box
                minHeight="350px" // Ensures it stays at the top even when empty
            >
                {errorMessage && <Heading textAlign={"center"}>{errorMessage}</Heading>}
                {!errorMessage && data && data.map(question => (
                    <Box 
                        key={question._id} 
                        p="1rem"
                        boxShadow='base'
                        mb="1rem"
                    >
                        <Heading size="lg" mb="1rem">{question.body}</Heading>
                        {selectValue === "asked" && <Heading size="md" mb=".5rem">{question.recipient} answered: {question.answer}</Heading>}
                        {selectValue === "answered" && <Heading size="md" mb=".5rem">You answered: {question.answer}</Heading>}
                        <Text>{formatDate(question.creationDate)}</Text>

                        {selectValue === "new" && 
                            <Button onClick={() => toggleModal(question._id)} mt="1rem" background="teal.200">Answer Question</Button>
                        }

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
                                </ModalBody>
                                <ModalFooter>
                                    <Button 
                                        type="submit"
                                        background="teal.200"
                                    >Answer Question</Button>
                                </ModalFooter>
                            </form>
                            </ModalContent>
                        </Modal>
                        
                    </Box>
                ))}
            </Box>
        </Box> 
    );
}
 
export default UserProfile;
