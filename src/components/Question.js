import Options from "./Options";
import { useQuiz } from "../contexts/QuizContext";

const Question = () => {
	const { questions, index } = useQuiz();

	const question = questions[index];

	return (
		<div className="">
			<h2 className="sub-min-title">{question.question}</h2>
			<Options />
		</div>
	);
};

export default Question;
