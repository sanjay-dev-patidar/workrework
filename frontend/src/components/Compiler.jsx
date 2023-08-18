import  React, { useState } from "react";
import { Box, Button, VStack } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const Compiler = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRunClick = async () => {
    setLoading(true);
    try {
      // Step 2: Create a new submission
      const submissionResponse = await axios.post(
        "https://9fd783d6.compilers.sphere-engine.com/api/v4/submissions?access_token=b3497ff1156046454be807e550ed19f5",
        {
          compilerId: 1, // Compiler ID for C++
          source: code,
          input: "input data",
        }
      );

      const submissionId = submissionResponse.data.id;

      // Step 3: Check the result
      const resultResponse = await axios.get(
        `https://9fd783d6.compilers.sphere-engine.com/api/v4/submissions/${submissionId}?access_token=b3497ff1156046454be807e550ed19f5	
        `
      );

      if (resultResponse.data.result && resultResponse.data.result.streams.output) {
        setOutput(resultResponse.data.result.streams.output.uri);
      } else {
        setOutput("No output available.");
      }
    } catch (error) {
      console.error("Error running code:", error);
      setOutput("An error occurred while running the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack align="start" spacing={4}>
      <Editor
        height="400px"
        theme="vs-dark"
        defaultLanguage="cpp"
        value={code}
        onChange={(value) => setCode(value)}
      />
      <Button onClick={handleRunClick} isLoading={loading}>
        Run
      </Button>
      <Box>
        <strong>Output URI:</strong>
        <pre>{output}</pre>
      </Box>
    </VStack>
  );
};

export default Compiler;
