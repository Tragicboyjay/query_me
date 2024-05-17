import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    Text
  } from '@chakra-ui/react';
  import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
  import PropTypes from 'prop-types'; // Import PropTypes
  import { Link as ReactRouterLink } from 'react-router-dom'; // Import Link from React Router

  const user = {
    username: "TragicBoyJay"
  }

    // const user = null;

    let Links;

    { user ? Links = [{ name: 'Home', to: '/' }, { name: 'My profile', to: '/user-profile' }] : Links = [{ name: 'Home', to: '/' }, { name: 'Sign in', to: '/sign-in' }]}

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
  
    return (
      <>
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <IconButton
              size={'md'}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={'center'}>
              <Box><Text fontSize='3xl'>Query-Me</Text></Box>
              <HStack
                as={'nav'}
                spacing={4}
                display={{ base: 'none', md: 'flex' }}>
                {Links.map((link) => (
                  <NavLink key={link.name} to={link.to}>{link.name}</NavLink>
                ))}
              </HStack>
            </HStack>
            <Flex alignItems={'center'}>
                {user && <Text>Hello, {user.username}</Text>}
              
            </Flex>
          </Flex>
  
          {isOpen ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as={'nav'} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link.name} to={link.to}>{link.name}</NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>
      </>
    );
  }
  