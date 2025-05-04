export const validateWord = async (word) => {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data = await response.json();

    if (response.ok) {
      const basePoints = word.length;
      let extraPoints = 0;

      if (word.length >= 6) {
        extraPoints += 2;
      }

      if (word.length >= 8) {
        extraPoints += 3;
      }

      if (word.length >= 10) {
        extraPoints += 5;
      }

      return {
        isValid: true,
        message: "Word is correct!",
        points: basePoints + extraPoints,
        extraPoints: extraPoints,
      };
    } else {
      return {
        isValid: false,
        message: "This word is not found in the English dictionary.",
        points: 0,
        extraPoints: 0,
      };
    }
  } catch (error) {
    return {
      isValid: false,
      message: "An error occurred while checking the word.",
      points: 0,
      extraPoints: 0,
    };
  }
};
