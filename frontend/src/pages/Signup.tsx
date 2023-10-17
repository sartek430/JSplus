import {
  Flex,
  Image,
  Text,
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import image from "../assets/image/Belle Nature 3560044.jpg";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const toast = useToast();

  const createAcount = (): void => {
    if (password !== repeatPassword) {
      toast({
        title: "Mot de passe pas pareil.",
        description: "Faut mettre les mêmes mot de passe partout !",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      const data = {
        email: email,
        password: password,
      };

      axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
      axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
      axios
        .post("https://226b-2a01-cb0c-1-3200-530-bf4d-5eb8-a411.ngrok-free.app/users", {
          data
        })
        .then((response) => {
          // Gérer la réponse réussie ici
          console.log("Utilisateur créé :", response.data);
          toast({
            title: "Utilisateur créé avec succès",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((error) => {
          console.error("Erreur lors de la création de l'utilisateur :", error);
          toast({
            title: "Erreur lors de la création de l'utilisateur",
            description: error.message, 
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  return (
    <Flex justifyContent={"space-between"}>
      <Flex
        flexDirection={"column"}
        alignItems={"center"}
        borderRadius={20}
        w={"45%"}
        h={"700px"}
        m={"auto"}
        bg={"#e0e0e0"}
        boxShadow={"-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"}
      >
        <Text
          bgClip="text"
          bgGradient={"linear(to-r, #2583DA, #0E487D)"}
          mt={"40px"}
          textAlign={"center"}
          fontSize={"35px"}
          fontWeight={700}
        >
          Bienvenue sur Météo+ !
        </Text>
        <Box
          w="45%"
          h={"3px"}
          bg={"#0E487D"}
          borderRadius={"full"}
          mt={"10px"}
        ></Box>
        <Input
          w={"50%"}
          mt={"60px"}
          variant="outline"
          placeholder="Email"
          h={"50px"}
          bg={"#FFFFFF"}
          borderColor={"#2583DA"}
          border={"2px"}
          color={"#2583DA"}
          _hover={{ borderColor: "#0E487D" }}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputGroup alignItems="center" justifyContent={"center"}>
          <Input
            mt={"60px"}
            mb={"40px"}
            h="50px"
            variant="outline"
            w={"50%"}
            bg={"#FFFFFF"}
            borderColor={"#2583DA"}
            _hover={{ borderColor: "#0E487D" }}
            border={"2px"}
            color={"#2583DA"}
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* affiche un bouton qui affiche ou non le mot de passe */}
          <InputRightElement width="auto" m="5px">
            <Button
              onClick={() => setShowPassword(!showPassword)}
              backdropFilter={"blur(10px)"}
              mr={"170px"}
              mt={"120px"}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <InputGroup
          alignItems="center"
          justifyContent={"center"}
          flexDirection={"column"}
        >
          <Text mr={130} fontWeight={"light"}>
            Répéter mot de passe
          </Text>
          <Input
            h="50px"
            variant="outline"
            w={"50%"}
            bg={"#FFFFFF"}
            borderColor={"#2583DA"}
            _hover={{ borderColor: "#0E487D" }}
            border={"2px"}
            color={"#2583DA"}
            type={showRepeatPassword ? "text" : "password"}
            placeholder="Mot de passe"
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          {/* affiche un bouton qui affiche ou non le mot de passe */}
          <InputRightElement width="auto" m="5px">
            <Button
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              backdropFilter={"blur(10px)"}
              mr={"170px"}
              mt={"50px"}
            >
              {showRepeatPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </Button>
          </InputRightElement>
        </InputGroup>

        <Button
          mt={"60px"}
          w={"50%"}
          h={"50px"}
          bgGradient={"linear(to-r, #2583DA, #0E487D)"}
          color={"#FFFFFF"}
          _hover={{
            bgGradient: "linear(to-r, #2583DA, #0E487D)",
            transform: "scale(1.05)",
          }}
          _active={{ transform: "scale(1)" }}
          boxShadow={"-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"}
          onClick={createAcount}
        >
          Créer ton compte !
        </Button>

        <Box
          w="45%"
          h={"3px"}
          bg={"#0E487D"}
          borderRadius={"full"}
          mt={"40px"}
        ></Box>
      </Flex>
      <Image src={image} h={"100vh"}></Image>
    </Flex>
  );
}
