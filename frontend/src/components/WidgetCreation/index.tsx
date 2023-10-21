import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";

interface WidgetCreationProps {
  loadingCreateWidgets: boolean;
  createWidget: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  taille: string;
  setTaille: (taille: string) => void;
  ville: string;
  setVille: (ville: string) => void;
}

const WidgetCreation: React.FC<WidgetCreationProps> = ({
  loadingCreateWidgets,
  createWidget,
  taille,
  setTaille,
  ville,
  setVille,
}) => {
  return (
    <Box
      bg={"#FFFFFFA0"}
      borderRadius={20}
      p={4}
      width="15%"
      h="200px"
      textAlign="center"
      display="flex"
      margin="50px"
      flexDirection="column"
      justifyContent="space-evenly"
    >
      <Box style={{ marginLeft: "10px" }}>
        <Text fontWeight="bold" mb={1}>Créer un Widget</Text>
        {loadingCreateWidgets ? (
          <Spinner />
        ) : (
          <form onSubmit={createWidget}>
            <Flex flexDirection="column">
              <label htmlFor="ville">Ville</label>
              <input
                type="text"
                name="ville"
                id="ville"
                placeholder="Nom de la ville"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
              />
            </Flex>

            <Flex flexDirection="column">
              <label htmlFor="taille">Taille</label>
              <select
                name="taille"
                id="taille"
                value={taille}
                onChange={(e) => setTaille(e.target.value)}
              >
                <option value="SMALL">Petit</option>
                <option value="MEDIUM">Grand</option>
              </select>
            </Flex>

            <Button type="submit" mt={4}>
              Ajouter
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default WidgetCreation;
