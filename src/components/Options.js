import { useQuiz } from "../contexts/QuizContext";

const Options = () => {
	const { questions, dispatch, answer, index } = useQuiz();

	const question = questions[index];

	const hasAnswered = answer !== null;

	return (
		<div className="options">
			{question.options.map((option, index) => (
				<button
					className={`btn btn-option ${
						hasAnswered
							? index === question.correctOption
								? "correct"
								: "wrong"
							: ""
					} ${index === answer ? "answer" : ""}`}
					key={option}
					disabled={hasAnswered}
					onClick={() => dispatch({ type: "newAnswer", payload: index })}
				>
					{option}
				</button>
			))}
		</div>
	);
};

export default Options;
