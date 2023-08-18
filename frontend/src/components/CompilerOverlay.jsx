import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import Compiler from "./Compiler";

const CompilerOverlay = ({ onClose }) => {
  const [minimized, setMinimized] = useState(false);
  const [code, setCode] = useState(""); // Lifted state

  const handleMinimizeClick = () => {
    setMinimized(!minimized);
  };

  return (
    <Box
      position="fixed"
      top="180px"
      left="0"
      width="100%"
      height="100%"
      backgroundColor="rgba(0, 0, 0, 0.8)"
      zIndex="1000"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box width="80%" maxWidth="800px" backgroundColor="#2C2906" padding="20px">
        <Button onClick={handleMinimizeClick} variant="link">
          {minimized ? "Maximize" : "Minimize"}
        </Button>
        {!minimized && (
          <Compiler code={code} setCode={setCode} /> // Pass code and setCode as props
        )}
        <Button onClick={onClose} variant="link">
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default CompilerOverlay;
