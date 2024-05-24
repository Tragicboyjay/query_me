import {
    Box,
    Flex,
    HStack,
    Link,
    IconButton,
    useDisclosure,
    useColorModeValue,
    Stack,
    Text,
    Heading,
  } from '@chakra-ui/react';
  import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
  import PropTypes from 'prop-types'; // Import PropTypes
  import { Link as ReactRouterLink, useNavigate } from 'react-router-dom'; // Import Link from React Router
  import { useAuth } from '../contexts/authContext';
  import SearchModal from './SearchModal';


  const NavLink = ({ children, to }) => (
    <Link
      as={ReactRouterLink} // Use ReactRouterLink for routing
      to={to} // Specify the 'to' prop for React Router
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Link>
  );
  
  // Add propTypes validation for children and 'to' prop
  NavLink.propTypes = {
    children: PropTypes.node.isRequired, // Validate children prop
    to: PropTypes.string.isRequired, // Validate 'to' prop
  };
  
  export default function Simple() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { user } = useAuth();
    let Links;

    { user ? Links = [{ name: 'Home', to: '/' }, { name: "My feed", to: '/feed' }, { name: 'My profile', to: '/user-profile' }] : 
    Links = [{ name: 'Home', to: '/' }]}

    const navigate = useNavigate();
  
    return (
      <>
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px="3rem">
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <IconButton
              size={'md'}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={'center'}>
              <Box><Heading fontSize='3xl'><ReactRouterLink to="/">Query-Me</ReactRouterLink></Heading></Box>
              <HStack
                as={'nav'}
                spacing={4}
                display={{ base: 'none', md: 'flex' }}>
                {Links.map((link) => (
                  <NavLink key={link.name} to={link.to}>{link.name}</NavLink>
                ))}
                <SearchModal />
              </HStack>
            </HStack>
            <Flex alignItems={'center'}>
                {user ? <Text
                  onClick={() => navigate("/user-profile")}
                  display={["none", "block"]}
                  cursor="pointer"
                ><i className="fa-solid fa-user"></i> {user.username}</Text> :
                <Text
                  onClick={() => navigate("/sign-in")}
                  display={["none", "block"]}
                  cursor="pointer"
                >Sign in</Text>
                } 
            </Flex>
          </Flex>
  
          {isOpen ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as={'nav'} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link.name} to={link.to}>{link.name}</NavLink>
                ))}
                <SearchModal />
              </Stack>
              
            </Box>
          ) : null}
        </Box>
      </>
    );
  }
  