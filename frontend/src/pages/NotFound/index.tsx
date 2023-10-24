import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <Text>404</Text>
      <Text>Page not found</Text>
      <Button onClick={() => navigate("/accueil")}>Retour en arrière</Button>
    </Box>
  );
};

export default NotFound;
