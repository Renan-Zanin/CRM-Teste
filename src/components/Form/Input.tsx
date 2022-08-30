import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";

interface InputProps extends ChakraInputProps {
  idName: string;
  type?: string;
  label?: string;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { idName, label, ...rest },
  ref
) => {
  return (
    <FormControl>
      {label && (
        <FormLabel display={"inline-block"} htmlFor={idName}>
          {label}
        </FormLabel>
      )}
      <ChakraInput
        id={idName}
        name={idName}
        variant="filled"
        focusBorderColor="brand.500"
        backgroundColor={"gray.900"}
        _hover={{
          backgroundColor: "gray.900",
        }}
        size="lg"
        ref={ref}
        {...rest}
      />
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
