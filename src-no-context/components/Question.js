import React from "react";
import Options from "./Options";

const Question = ({ question, dispatch, answer }) => {
	console.log(question);

	return (
		<div className="">
			<h2 className="sub-min-title">{question.question}</h2>
			<Options question={question} dispatch={dispatch} answer={answer} />
		</div>
	);
};

export default Question;
