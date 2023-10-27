import {
  Button,
  Flex,
  Grid,
  GridItem,
  Modal,
  StepNumber,
  useDisclosure,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
  Center,
  Badge,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios, { isCancel } from "axios";
import CategoryTag from "./CategoryTag";

const IP_ADDRESS = process.env.NEXT_PUBLIC_IP_ADDRESS;

const Question = ({
  inputValues,
  setInputValues,
  isCreate,
  setIsCreate,
  colorMode,
  userMode,
  questions,
  fetchQuestions,
}) => {
  // const [questions, setQuestions] = useState(null);
  const [description, setDescription] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [category, setCategory] = useState(null);

  const [title, setTitle] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const fetchQuestions = async () => {
  //   try {
  //     const res = await axios.get(`${IP_ADDRESS}:3001/questions/getall`);

  //     setQuestions(res.data.qns);
  //   } catch (error) {
  //     console.log("ERROR: ", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchQuestions();
  // }, []);

  const handleEdit = async ({
    qn_num,
    title,
    description,
    category,
    complexity,
  }) => {
    setInputValues({
      qn_num,
      title,
      description,
      category,
      complexity,
    });
    setIsCreate(false);
  };

  const deleteQuestion = async ({
    qn_num,
    title,
    description,
    category,
    complexity,
  }) => {
    await axios.delete(`${IP_ADDRESS}:3001/questions/${qn_num}`);
    fetchQuestions();
  };

  const handleModal = (question, index) => {
    console.log(index);
    setDescription(question.description);
    setTitle(question.title);
    setDifficulty(question.complexity);
    setCategory(question.category);

    if (openQuestion === question) {
      if (isOpen) {
        onClose(); // Close the modal if it's open
      }
    } else {
      setOpenQuestion(question);
      onOpen(); // Open the modal if it's closed
    }
  };

  const htmlContent = { __html: description };

  return (
    <Box
      height={userMode == "user" ? "80%" : "55%"}
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          width: "0.2rem",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor:
            colorMode == "light" ? "rgba(0,0,0,0.5)" : "RGBA(20, 20, 20, 0.76)",
        },
      }}
    >
      {questions &&
        questions.map((question, index) => (
          <Grid
            templateColumns={
              userMode == "admin" ? "repeat(13, 1fr)" : "repeat(11, 1fr)"
            }
            key={`grid_${question.qn_num}`}
            backgroundColor={
              index % 2 === 0
                ? colorMode == "light"
                  ? "gray.300"
                  : "gray.700"
                : colorMode == "light"
                ? "gray.400"
                : "gray.800"
            }
          >
            <GridItem key={`grid_item_id_${question.qn_num}`} colSpan={1}>
              <Flex
                justifyContent="flex-start"
                alignItems="center"
                height="100%"
                key={`flex_id_${question.qn_num}`}
                fontSize={{ lg: "md", xl: "md", "2xl": "lg" }}
                pl={2}
              >
                {question.qn_num}
              </Flex>
            </GridItem>
            <GridItem
              key={`grid_item_title${question.title}`}
              onClick={() => handleModal(question, index)}
              colSpan={4}
            >
              <Flex
                justifyContent="flex-start"
                pl={2}
                alignItems="center"
                height="100%"
                key={`flex_title_${question.title}`}
              >
                <Text
                  _hover={{
                    color: colorMode == "light" ? "teal.500" : "teal.300",
                    fontWeight: "extrabold",
                    cursor: "pointer",
                  }}
                  fontSize={{ lg: "sm", xl: "sm", "2xl": "md" }}
                  fontWeight="semibold"
                  my={2}
                >
                  {question.title}
                </Text>
              </Flex>
            </GridItem>
            <GridItem
              key={`grid_item_category_${question.category}`}
              colSpan={4}
            >
              <Flex
                justifyContent="flex-start"
                pl={2}
                alignItems="center"
                height="100%"
                key={`flex_category_${question.category}`}
                fontSize={{ lg: "sm", xl: "sm", "2xl": "md" }}
              >
                {question.category}
              </Flex>
            </GridItem>
            <GridItem
              key={`grid_item_complexity_${question.complexity}`}
              colSpan={2}
            >
              <Flex
                justifyContent="flex-start"
                pl={2}
                alignItems="center"
                height="100%"
                key={`flex_complexity_${question.complexity}`}
                fontSize={{ lg: "sm", xl: "sm", "2xl": "md" }}
              >
                <Badge
                  variant="outline"
                  colorScheme={
                    question.complexity == "Easy"
                      ? "green"
                      : question.complexity == "Medium"
                      ? "orange"
                      : "red"
                  }
                  fontWeight="bold"
                >
                  {question.complexity}
                </Badge>
              </Flex>
            </GridItem>
            {userMode == "admin" && (
              <GridItem colSpan={2}>
                <Flex justifyContent="center" alignItems="center" height="100%">
                  <Button
                    size="sm"
                    my={1}
                    bgColor={
                      colorMode === "light" ? "purple.100" : "purple.200"
                    }
                    color="black"
                    mx={1}
                    onClick={() => handleEdit(question)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    my={1}
                    bgColor={colorMode === "light" ? "pink.200" : "pink.300"}
                    color="black"
                    mx={1}
                    onClick={() => deleteQuestion(question)}
                  >
                    Delete
                  </Button>
                </Flex>
              </GridItem>
            )}
          </Grid>
        ))}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent>
          <ModalHeader>
            {title}
            <Badge
              ml={3}
              colorScheme={
                String(difficulty).toLowerCase() == "easy"
                  ? "green"
                  : String(difficulty).toLowerCase() == "medium"
                  ? "orange"
                  : "red"
              }
            >
              {difficulty}
            </Badge>
            <CategoryTag categoryTag={category} />
          </ModalHeader>

          <ModalBody
            maxHeight="60vh"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": {
                width: "0.25em",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor:
                  colorMode == "light"
                    ? "RGBA(0, 0, 0, 0.7)"
                    : "RGBA(255, 255, 255, 0.48)",
              },
            }}
          >
            <div
              dangerouslySetInnerHTML={htmlContent}
              style={{ overflowWrap: "anywhere" }}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Question;
