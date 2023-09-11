function StartScreen({ numQuestions, dispatch }) {
	return (
		<div className="start">
			<h2 className="main-title">Welcome to the React quize</h2>
			<h3 className="sub-title">
				{numQuestions} Questions to test your React mastery
			</h3>
			<button
				onClick={() => dispatch({ type: "start" })}
				className="btn btn-ui"
			>
				Let's Start
			</button>
		</div>
	);
}

export default StartScreen;
