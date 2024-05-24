import {
    Box,
    Heading,
    useToast,
    Text,
    Flex,
    Spacer,
    Button,
    Tooltip
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext"
import { useNavigate } from "react-router-dom" ;

const MyFeed = () => {
    const { user } = useAuth();
    const [ feedQuestions, setFeedQuestions ] = useState({ message: "", data: []});
    const [ feedQuestionError, setFeedQuestionError ] = useState(null);

    // pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = feedQuestions.data.slice( firstIndex, lastIndex );
    const npages = Math.ceil(feedQuestions.data.length / recordsPerPage);
    const pageNumbers = [...Array(npages + 1).keys()].slice(1);
    
    const toast = useToast();
    const navigate = useNavigate()

    useEffect( () => {
        document.title = "My Feed | Query-Me"
        getFeedQuestions()
    }, [])

    const getFeedQuestions = async () => {
        try {
            const response = await fetch("http://localhost:8001/question/feed-questions", {
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

            const feed = {
                message: data.message,
                data: data.questions.filter( q => q.answerDate)
            }

            setFeedQuestions(feed)

        } catch (error) {
            setFeedQuestionError(true)

            toast({
                title: error.message,
                status: 'error',
                duration: 9000,
                position: "top",
                isClosable: true,
            })
        }
    }

    const formatDate = date => {
        const newDate = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return newDate.toLocaleDateString('en-US', options);
    };

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
        <Box
            width="100%"
            px="15%" 
            my="2rem"
        >
            <Flex
                alignItems="center"
                mb="2rem"
            >
                <Heading>My Feed</Heading>
                <Spacer />
                <Tooltip label="Refresh">
                    <Button
                        onClick={getFeedQuestions}
                    >
                        <i style={{fontSize: "2rem"}} className="fa-solid fa-arrows-rotate"></i>
                    </Button>
                </Tooltip>

            </Flex>
            

            <Box
                minH={["350px", "350px", "450px", "850px"]}
            >
                {!feedQuestionError && feedQuestions.data.length < 1 && <Heading textAlign="center">{feedQuestions.message}</Heading>}
                {!feedQuestionError && feedQuestions.data.length > 0 && records.map(question => (
                    <Box 
                        key={question._id} 
                        p="1rem" 
                        boxShadow='base' 
                        mb="1rem"
                        cursor="pointer"
                        onClick={() => navigate(`/user/${question.recipient}`)}
                    >
                        <Heading size="lg" mb="1rem">{question.body}</Heading>
                        <Heading size="md" mb=".5rem">{question.recipient} answered: {question.answer}</Heading>
                        <Text>Answered: {formatDate(question.answerDate)}</Text>
                    </Box>
                ))}

                {/* pagination */}
                {feedQuestions.length > recordsPerPage && 
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

                {/* pagination */}
                {feedQuestions.data.length > recordsPerPage && 
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
 
export default MyFeed;