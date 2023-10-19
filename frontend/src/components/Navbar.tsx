import { Flex, Link, Text, Input, Button } from "@chakra-ui/react";

type navbarProps = {
  openModal: () => void;
  onDateChange: (date: Date) => void;
};

export default function Navbar({ openModal, onDateChange }: navbarProps) {

  const currentDate = new Date();
  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + 6);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    onDateChange(date);
  };

  return (
    <Flex
      as="nav"
      align="center"
      gap={10}
      padding="1.5rem"
      backgroundColor="#FFFFFF"
    >
      <Flex justify="space-between">
        <Text color="#0E487D" fontWeight={"bold"} fontSize={35}>
          Tableau de bord
        </Text>
      </Flex>
      <Flex>
        <Input
          onChange={(e) => handleDateChange(new Date(e.target.value))}
          border={"2px"}
          borderColor={"#2583DA"}
          _hover={{ borderColor: "#0E487D" }}
          placeholder="Select Date and Time"
          size="md"
          m={"auto"}
          type="datetime-local"
        />
      </Flex>
      <Flex justify="space-between">
        <Link onClick={openModal} color="white" textDecoration="none">
          <Button 
            mr={10} 
            fontSize={20} 
            bgGradient={"linear(to-r, #2583DA, #0E487D)"}
            _hover={{
              bgGradient: "linear(to-r, #2583DA, #0E487D)",
              transform: "scale(1.05)",
            }}
            _active={{ transform: "scale(0.9)" }}
            color={"#FFFFFF"}
            
            >
            Inviter
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
}
