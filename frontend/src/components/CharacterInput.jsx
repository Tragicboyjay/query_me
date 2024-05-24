import { 
    Box,
    Text
} from "@chakra-ui/react";
 import PropTypes from 'prop-types';
import { useEffect } from "react";

const CharacterInput = ( { input, func } ) => {
    const maxCharacters = 75;

    const checkCharacters = () => {

        return input > maxCharacters;
    }

    useEffect( () => {
        func(checkCharacters());
    }, [input])
    

    return (
        <Box
            width="100%"
        >
            { !checkCharacters() ? <Text>{input}/{maxCharacters} characters</Text> : <Text textAlign="center" color="red">You have entered too many characters</Text> }
            
        </Box>
    );
};

CharacterInput.propTypes = {
    input: PropTypes.number.isRequired,
    func: PropTypes.func.isRequired
};
 
export default CharacterInput;