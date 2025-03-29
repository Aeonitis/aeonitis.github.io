/**
 * Sample resolutions for the argument mapping tool
 */

const sampleResolutions = [
    {
      text: "Universal basic income should be implemented globally.",
      tags: ["economics", "social policy", "global"]
    },
    {
      text: "Remote work should be the default for all office jobs.",
      tags: ["work", "technology", "society"]
    },
    {
      text: "Space exploration deserves more public funding.",
      tags: ["science", "technology", "government"]
    },
    {
      text: "Artificial intelligence will benefit humanity overall.",
      tags: ["technology", "ethics", "future"]
    },
    {
      text: "Climate change is the most pressing issue of our time.",
      tags: ["environment", "politics", "global"]
    },
    {
      text: "Social media has a net negative effect on society.",
      tags: ["technology", "psychology", "society"]
    },
    {
      text: "Standardized testing should be eliminated from schools.",
      tags: ["education", "policy", "assessment"]
    },
    {
      text: "Nuclear energy is essential for addressing climate change.",
      tags: ["energy", "environment", "technology"]
    },
    {
      text: "The four-day work week should become the standard.",
      tags: ["work", "economics", "society"]
    },
    {
      text: "Cryptocurrency will eventually replace traditional banking.",
      tags: ["finance", "technology", "future"]
    },
    {
      text: "Voting should be mandatory for all eligible citizens.",
      tags: ["politics", "civic duty", "democracy"]
    },
    {
      text: "Fast fashion is unsustainable and should be heavily regulated.",
      tags: ["environment", "business", "consumerism"]
    },
    {
      text: "Physical books are superior to e-books for deep reading.",
      tags: ["education", "technology", "psychology"]
    },
    {
      text: "Zoos are unethical and should be abolished.",
      tags: ["animals", "ethics", "conservation"]
    },
    {
      text: "Autonomous vehicles will make roads safer overall.",
      tags: ["technology", "transportation", "safety"]
    }
  ];
  
  /**
   * Get a random sample resolution
   * @returns {string} A random resolution text
   */
  export const getRandomSampleResolution = () => {
    const randomIndex = Math.floor(Math.random() * sampleResolutions.length);
    return sampleResolutions[randomIndex].text;
  };
  
  /**
   * Get all sample resolutions
   * @returns {Array} All sample resolutions
   */
  export const getAllSampleResolutions = () => {
    return sampleResolutions.map(sample => sample.text);
  };
  
  /**
   * Get sample resolutions filtered by tags
   * @param {Array} tags - Tags to filter by
   * @returns {Array} Filtered sample resolutions
   */
  export const getSampleResolutionsByTags = (tags) => {
    if (!tags || !tags.length) return getAllSampleResolutions();
    
    return sampleResolutions
      .filter(sample => tags.some(tag => sample.tags.includes(tag)))
      .map(sample => sample.text);
  };
  
  export default sampleResolutions;