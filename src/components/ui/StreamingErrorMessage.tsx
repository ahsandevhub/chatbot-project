import { useEffect, useState } from "react";

const StreamingErrorMessage = () => {
  const fullMessage = "Sorry, I encountered an error.";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText(""); // Reset message before streaming starts
    let index = 0;

    const interval = setInterval(() => {
      if (index < fullMessage.length) {
        setDisplayedText((prev) => prev + fullMessage[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Adjust speed of character rendering

    return () => clearInterval(interval); // Cleanup on unmount
  }, [fullMessage]);

  return <span>{displayedText}</span>;
};

export default StreamingErrorMessage;
