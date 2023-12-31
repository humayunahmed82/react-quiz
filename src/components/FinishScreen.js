import { useQuiz } from "../contexts/QuizContext";

const FinishScreen = () => {
	const { points, maxPoint, highScore, dispatch } = useQuiz();

	const percentage = (points / maxPoint) * 100;

	let emoji;

	if (percentage === 100) emoji = "🥇";
	if (percentage >= 80 && percentage < 100) emoji = "🎉";
	if (percentage >= 50 && percentage < 80) emoji = "😀";
	if (percentage >= 0 && percentage < 50) emoji = "🤔";
	if (percentage === 0) emoji = "🤦‍♂️";

	return (
		<>
			<p className="result">
				<span>{emoji}</span> You scored <strong>{points}</strong> {maxPoint} (
				{Math.ceil(percentage)}
				%)
			</p>
			<p className="highscore">(highScore: {highScore} Points)</p>
			<button
				className="btn btn-ui"
				onClick={() => dispatch({ type: "restart" })}
			>
				Restart Quiz
			</button>
		</>
	);
};

export default FinishScreen;
