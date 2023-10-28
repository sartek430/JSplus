import { Box, Button, Flex, Spinner, Text, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import React from "react";

interface WidgetCreationProps {
  loadingCreateWidgets: boolean;
  createWidget: (e: any) => Promise<void>;
  taille: string;
  setTaille: (taille: string) => void;
  ville: string;
  setVille: (ville: string) => void;
}

const WidgetCreation: React.FC<WidgetCreationProps> = ({ loadingCreateWidgets, createWidget, setTaille, setVille }) => {
  return (
    <Box
      bg={"#FFFFFFA0"}
      borderRadius={20}
      p={4}
      width="20%"
      h="200px"
      textAlign="center"
      display="flex"
      margin="50px"
      flexDirection="column"
      justifyContent="space-evenly"
    >
      <Box style={{ marginLeft: "10px" }}>
        <Text fontWeight="bold" color={"#0E487D"} fontSize={15}>
          Créer un Widget
        </Text>
        {loadingCreateWidgets ? (
          <Spinner />
        ) : (
          <Flex flexDirection={"column"}>
            <FormControl>
              <FormLabel fontSize={10}>Ville</FormLabel>
              <Input
                size={"xs"}
                type="text"
                placeholder="Nom de la ville"
                borderColor={"#0E487D"}
                focusBorderColor="#0E487D"
                _hover={{ borderColor: "#0E487D" }}
                onChange={(e) => setVille(e.target.value)}
              />

              <FormLabel fontSize={10} mt={2}>
                Taille
              </FormLabel>
              <Select
                size={"xs"}
                placeholder="Choisir la taille"
                borderColor={"#0E487D"}
                focusBorderColor="#0E487D"
                _hover={{ borderColor: "#0E487D" }}
                onChange={(e) => setTaille(e.target.value)}
              >
                <option value="SMALL">Petit</option>
                <option value="MEDIUM">Grand</option>
              </Select>
            </FormControl>

            <Button
              size={"sm"}
              mt={4}
              bgGradient={"linear(to-r, #2583DA, #0E487D)"}
              color={"#FFFFFF"}
              _hover={{
                bgGradient: "linear(to-r, #2583DA, #0E487D)",
                transform: "scale(1.05)",
              }}
              _active={{ transform: "scale(0.9)" }}
              boxShadow={"-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"}
              fontSize={10}
              onClick={createWidget}
            >
              Ajouter
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default WidgetCreation;
