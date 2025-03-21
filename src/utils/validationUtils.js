/**
 * Utility functions for validation of argument map statements
 */

/**
 * Validates if a statement meets the criteria for an argument node
 * @param {string} statement - The statement to validate
 * @returns {boolean} Whether the statement is valid
 */
export const validateStatement = (statement) => {
    if (!statement) return false;
    
    // Trim whitespace
    const trimmedStatement = statement.trim();
    
    // Must have at least 3 words
    const wordCount = countWords(trimmedStatement);
    if (wordCount < 3) return false;
    
    // Should be a complete sentence (basic check)
    if (!isCompleteSentence(trimmedStatement)) return false;
    
    // Maximum length check (prevents extremely long statements)
    if (trimmedStatement.length > 300) return false;
    
    return true;
  };
  
  /**
   * Count words in a string
   * @param {string} text - The text to count words in
   * @returns {number} The number of words
   */
  const countWords = (text) => {
    // Remove extra whitespace and split by spaces
    return text.replace(/\s+/g, ' ').split(' ').length;
  };
  
  /**
   * Check if a string resembles a complete sentence
   * @param {string} text - The text to check
   * @returns {boolean} Whether the text appears to be a complete sentence
   */
  const isCompleteSentence = (text) => {
    // Basic sentence check: starts with uppercase and ends with punctuation
    const startsWithUppercase = /^[A-Z]/.test(text);
    const endsWithPunctuation = /[.!?]$/.test(text);
    
    // More complex checks could be added here
    // For example:
    // - Contains a verb (would require NLP)
    // - Has subject-predicate structure
    
    // For now, just check that it starts with uppercase and ends with punctuation
    return startsWithUppercase && endsWithPunctuation;
  };
  
  /**
   * Validates if a resolution statement is appropriate
   * @param {string} resolution - The resolution statement
   * @returns {Object} Result object with valid flag and message
   */
  export const validateResolution = (resolution) => {
    // Basic statement validation
    if (!validateStatement(resolution)) {
      return { 
        valid: false, 
        message: 'Resolution must be a complete sentence with at least 3 words.' 
      };
    }
    
    // Check that the resolution isn't too short
    if (resolution.length < 15) {
      return {
        valid: false,
        message: 'Resolution should be more substantive (at least 15 characters).'
      };
    }
    
    // Check that it doesn't start with "because", "but", or "however"
    const lowerRes = resolution.toLowerCase();
    if (lowerRes.startsWith('because') || 
        lowerRes.startsWith('but') || 
        lowerRes.startsWith('however')) {
      return {
        valid: false,
        message: 'Resolution should not start with "because", "but", or "however".'
      };
    }
    
    // Suggestion for improvement if resolution is valid but could be better
    if (resolution.length < 30) {
      return {
        valid: true,
        suggestion: 'Consider making your resolution more detailed for a better argument map.'
      };
    }
    
    return { valid: true };
  };
  
  /**
   * Get a sample resolution from the predefined list
   * @returns {string} A sample resolution
   */
  export const getRandomSampleResolution = () => {
    const samples = [
      "Universal basic income should be implemented globally.",
      "Remote work should be the default for all office jobs.",
      "Space exploration deserves more public funding.",
      "Artificial intelligence will benefit humanity overall.",
      "Climate change is the most pressing issue of our time.",
      "Social media has a net negative effect on society.",
      "Standardized testing should be eliminated from schools.",
      "Nuclear energy is essential for addressing climate change.",
      "The four-day work week should become the standard.",
      "Cryptocurrency will eventually replace traditional banking."
    ];
    
    return samples[Math.floor(Math.random() * samples.length)];
  };
  
  /**
   * Returns a suggestion for the given node type
   * @param {string} nodeType - The type of node
   * @returns {string} A suggestion message
   */
  export const getNodeTypeSuggestion = (nodeType) => {
    const suggestions = {
      resolution: "State your main claim or proposition clearly.",
      because: "Support your point with evidence or reasoning.",
      but: "Present a counterargument or limitation.",
      however: "Provide additional context or a qualifying statement."
    };
    
    return suggestions[nodeType] || "Add your statement here.";
  };