import React, { useRef, useState, useEffect } from "react";
import {
  useDisclosure,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Box
} from "@chakra-ui/react";

function MessageContent({messageContent, messageIndex, socket, messageList, username, updateMessageList}) {
  const [newMessageList, setNewMessageList] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const deleteMessage = () => {
    const messages = messageList.splice(messageIndex, 1);
    setNewMessageList(messages);
    updateMessageList(newMessageList);
  }
  
  return (

    <div className="message-content">
      <Box
        as='button'
        padding="5px 2px"
        onClick={onOpen}
        variant="ghost"
        color="white"
        textAlign="left"
      >
        {messageContent.message}
      </Box>
      { messageContent.author === username ? (
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete Message?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete your message?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={() => {
              deleteMessage();
            }}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      ) : ("")
      }
    </div>
  );
}

export default MessageContent;