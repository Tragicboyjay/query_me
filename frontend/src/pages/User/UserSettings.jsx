import { 
    Box, 
    Heading,
    Flex,
    Button,
    Text,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from "@chakra-ui/react";

import { useAuth } from "../../contexts/authContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react";


const UserSettings = () => {
    const { user, logoutUser, updateUsername, updateEmail } = useAuth();

    const navigate = useNavigate();

    const [ deleteUserError, setDeleteUserError ] = useState(null);
    const [ deletePasswordInput, setDeletePasswordInput ] = useState("")

    const [ editField, setEditField ] = useState("");
    const [ newEditInput, setNewEditInput ] = useState("");
    const [ editPasswordInput, setEditPasswordInput ] = useState("");
    const [ editError, setEditError ] = useState("");

    const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure();
    const { isOpen: editIsOpen, onOpen: editOnOpen, onClose: editOnClose } = useDisclosure();

    const deleteUser = async e => {
        try {
            e.preventDefault();

            setDeleteUserError("");

            const password = { password: deletePasswordInput }

            const response = await fetch("http://localhost:8001/user/", {
                method: "DELETE",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(password)
            })

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message)
            }

            deletePasswordInput("");

            logoutUser();
            navigate("/");
    
        } catch (error) {
            setDeleteUserError(error.message)
        }
    }

    const handleEditModal = field => {
        setEditError("");
        setEditPasswordInput("")
        setNewEditInput("")
        setEditField(field);
        editOnOpen();
    }

    const editUser = async e => {
        try {
            e.preventDefault();

            setEditError("");
            const body = { password: editPasswordInput, newValue: newEditInput };

            const response = await fetch(`http://localhost:8001/user/${editField.toLowerCase()}`, {
                method: "PATCH",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message)
            }

            if (editField === "Username" ) {
                updateUsername(newEditInput)
            } else if (editField === "Email" ) {
                updateEmail(newEditInput)
            }

            setNewEditInput("");
            setEditPasswordInput("");

            editOnClose();
        } catch (error) {
            setNewEditInput("");
            setEditPasswordInput("");
            setEditError(error.message);
        }
    }

    return (  
        <Box
            width="100%"
            display="flex"
            flexDir="column"
            alignItems="center"
        >
            <Heading
                textAlign="center" 
                mb="2rem"
            >User Settings</Heading>
            <Box
                width="70%"
                minHeight="500px"
            >
                <TableContainer>
                <Table 
                    variant='simple' 
                    size={["sm","md", "lg", "lg"]}
                >
                    <TableCaption>Click &quot;Edit&quot; to edit the coresponding field.</TableCaption>
                    <Thead>
                    <Tr>
                        <Th textAlign="center">Field</Th>
                        <Th textAlign="center">Value</Th>
                        <Th textAlign="center">Action</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    <Tr>
                        <Td textAlign="center">Username</Td>
                        <Td textAlign="center">{user.username}</Td>
                        <Td textAlign="center">
                            <Button 
                                size="sm"
                                onClick={() => handleEditModal("Username")}
                            >Edit</Button>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td textAlign="center">Email</Td>
                        <Td textAlign="center">{user.email}</Td>
                        <Td textAlign="center">
                            <Button 
                                size="sm"
                                onClick={() => handleEditModal("Email")}
                            >Edit</Button>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td textAlign="center">Password</Td>
                        <Td textAlign="center">********</Td>
                        <Td textAlign="center">
                            <Button 
                                size="sm"
                                onClick={() => handleEditModal("Password")}
                            >Edit</Button>
                        </Td>
                    </Tr>

                    </Tbody>
                </Table>
                </TableContainer>


                <Flex 
                    mt="2rem"
                    width="100%"
                    justifyContent="Center"
                    flexDir={["column-reverse", "row"]}
                    gap="1rem"
                >
                    <Button 
                        background="teal.200"
                        onClick={() => navigate("/user-profile")}
                    >Back</Button>
                    <Button 
                        background="red.400"
                        onClick={deleteOnOpen}
                    >Delete User</Button>
                </Flex>

                {/* Delete Modal */}
                <Modal isOpen={deleteIsOpen} onClose={deleteOnClose}>
                    <ModalOverlay />
                    <form onSubmit={deleteUser}>
                        <ModalContent>
                        <ModalHeader>Delete User</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody> 
                            {deleteUserError && <Text textAlign="center" color="red" >{deleteUserError}</Text>}
                            <Heading mb="1rem" textAlign="center" size="sm">Enter your password to confirm.</Heading>
                            <Input 
                                placeholder='Password'
                                type="password"
                                onChange={ e => setDeletePasswordInput(e.target.value) }
                                value={deletePasswordInput}
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button background="teal.200" mr={3} onClick={deleteOnClose}>
                            Close
                            </Button>
                            <Button 
                                background="red.400"
                                type="submit"
                            >Delete</Button>
                        </ModalFooter>
                        </ModalContent>
                    </form>
                </Modal>

                {/* Edit Modal */}
                <Modal isOpen={editIsOpen} onClose={editOnClose}>
                    <ModalOverlay />
                    <form onSubmit={editUser}>
                        <ModalContent>
                        <ModalHeader>Edit {editField}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody> 
                            {editError && <Text textAlign="center" color="red" >{editError}</Text>} 
                            <Heading mb="1rem" textAlign="center" size="sm">Enter the new {editField}</Heading>

                            <Input
                                mb="1rem"
                                placeholder={ editField === "Username" ? "New Username": editField === "Email" ? "New Email" : "New Password" }
                                onChange={ e => setNewEditInput(e.target.value) }
                                type={ editField === "Username" ? "text": editField === "Email" ? "email" : "password" }
                                value={newEditInput}
                            />
                            <Heading mb="1rem" textAlign="center" size="sm">Enter your password to confirm</Heading>
                            <Input 
                                placeholder='Password'
                                type="password"
                                onChange={ e => setEditPasswordInput(e.target.value) }
                                value={editPasswordInput}
                                required
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button background="lightgrey" mr={3} onClick={editOnClose}>
                            Close
                            </Button>
                            <Button 
                                background="teal.200"
                                type="submit"
                            >Save</Button>
                        </ModalFooter>
                        </ModalContent>
                    </form>
                </Modal>
                
            </Box>
        </Box>
    );
}
 
export default UserSettings;