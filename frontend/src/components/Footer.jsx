
import { Box, Flex, Link, Text, IconButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      bg="#333"
      color="#fff"
      padding="2rem"
      marginTop="2rem"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Box>
        <Flex justifyContent="center" alignItems="center" mb={4}>
          <Link href="#" mr={4}>
            Home
          </Link>
          <Link href="#" mr={4}>
            About
          </Link>
          <Link href="#" mr={4}>
            Services
          </Link>
          <Link href="#" mr={4}>
            Contact
          </Link>
        </Flex>
        <Flex justifyContent="center" alignItems="center" mb={4}>
          <Text>&copy; 2023-24 workREwork. All rights reserved.</Text>
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <Box display="flex" alignItems="center">
            <IconButton
              as={Link}
              href="#"
              aria-label="Facebook"
              icon={<FaFacebook />}
              mr={2}
            />
            <IconButton
              as={Link}
              href="#"
              aria-label="Twitter"
              icon={<FaTwitter />}
              mr={2}
            />
            <IconButton
              as={Link}
              href="#"
              aria-label="Instagram"
              icon={<FaInstagram />}
              mr={2}
            />
            <IconButton
              as={Link}
              href="#"
              aria-label="LinkedIn"
              icon={<FaLinkedin />}
            />
          </Box>
        </Flex>
      </Box>
    </motion.footer>
  );
};

export default Footer;
