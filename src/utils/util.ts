const getRandomSubsetOfArray = (questionsArray: any, noOfQuestions: number | undefined) => {
	const shuffledQuestionArray = [...questionsArray];

	for (let i = shuffledQuestionArray.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledQuestionArray[i], shuffledQuestionArray[j]] = [
			shuffledQuestionArray[j],
			shuffledQuestionArray[i],
		];
	}

	return shuffledQuestionArray.slice(0, noOfQuestions);
};

export default getRandomSubsetOfArray;
