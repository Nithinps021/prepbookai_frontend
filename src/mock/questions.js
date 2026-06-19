export const questions = [
  {
    id: 'q1',
    subject: 'English Language',
    difficulty: 'Medium',
    topic: 'Error Spotting',
    topic_block: 'Grammar & Usage',
    sub_topic: 'Error Spotting',
    verified_quality_score: 'A',
    direction: 'Read the following sentence to find out whether there is any grammatical error in it. The error, if any, will be in one part of the sentence.',
    question: 'He is one of the best players who **has ever played** the game.',
    options: ['He is', 'one of the best players', 'who has ever played', 'the game', 'No Error'],
    answer: 'who has ever played',
    explanation: 'The relative pronoun "who" refers to "players" (plural). So, the verb should be plural "have" instead of "has". Correct: "...who have ever played..."'
  },
  {
    id: 'q2',
    subject: 'English Language',
    difficulty: 'Easy',
    topic: 'Synonyms',
    topic_block: 'Vocabulary & Fillers',
    sub_topic: 'Synonyms',
    verified_quality_score: 'B+',
    direction: 'Choose the word which is most nearly the SAME in meaning to the word printed in bold as used in the passage.',
    question: 'What is the synonym of "**ABUNDANT**"?',
    options: ['Scarce', 'Plentiful', 'Rare', 'Limited', 'Meager'],
    answer: 'Plentiful',
    explanation: '"Abundant" means available in large quantities; plentiful.'
  },
  {
    id: 'q3',
    subject: 'English Language',
    difficulty: 'Hard',
    topic: 'Reading Comprehension',
    topic_block: 'Reading Comprehension',
    sub_topic: 'Passage Base',
    verified_quality_score: 'A',
    direction: 'Read the following passage carefully and answer the question given below.',
    question: 'The Reserve Bank of India (RBI) is the central bank of the country. The RBI was established on April 1, 1935, in accordance with the provisions of the Reserve Bank of India Act, 1934. The Central Office of the Reserve Bank was initially established in Calcutta but was permanently moved to Mumbai in 1937.\n\nAccording to the passage, when was the RBI established?',
    options: ['April 1, 1935', 'April 1, 1934', 'Mumbai in 1937', 'Calcutta in 1935', 'None of these'],
    answer: 'April 1, 1935',
    explanation: 'The passage explicitly states: "The RBI was established on April 1, 1935, in accordance with the provisions of the Reserve Bank of India Act, 1934."'
  }
];
