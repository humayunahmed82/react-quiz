// React Builtin Hooks
import { useReducer, useEffect } from "react";

// Components
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Progress from "./components/Progress";
import Question from "./components/Question";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
import NextButton from "./components/NextButton";
import FinishScreen from "./components/FinishScreen";

const SECS_PER_QUESTION = 30;

// Initial State
const initialState = {
	questions: [],

	// loading, error, ready, active, finished
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
	highScore: 0,
	secondsRemaining: null,
};

// Reducer Function
const reducer = (state, action) => {
	switch (action.type) {
		case "dataReceived":
			return { ...state, questions: action.payload, status: "ready" };
		case "dataFailed":
			return { ...state, status: "error" };
		case "start":
			return {
				...state,
				status: "active",
				secondsRemaining: state.questions.length * SECS_PER_QUESTION,
			};
		case "newAnswer":
			const question = state.questions.at(state.index);
			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question.correctOption
						? state.points + question.points
						: state.points,
			};
		case "nextQuestion":
			return {
				...state,
				index: state.index + 1,
				answer: null,
			};
		case "finish":
			return {
				...state,
				status: "finished",
				highScore:
					state.points > state.highScore ? state.points : state.highScore,
			};
		case "restart":
			return {
				...initialState,
				questions: state.questions,
				status: "ready",
				highScore: state.highScore,
			};
		// return {
		// 	...state,
		// 	status: "ready",
		// 	index: 0,
		// 	answer: null,
		// 	points: 0,
		// 	secondsRemaining: null,
		// };
		case "tick":
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status: state.secondsRemaining === 0 ? "finished" : state.status,
			};
		default:
			throw new Error("Unknown action");
	}
};

// App Function
const App = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const {
		questions,
		status,
		index,
		answer,
		points,
		highScore,
		secondsRemaining,
	} = state;

	const numQuestions = questions.length;
	const maxPoint = questions.reduce((prev, curr) => prev + curr.points, 0);

	useEffect(() => {
		const dateFetch = async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_API_HOST}/questions`);
				const data = await res.json();
				dispatch({ type: "dataReceived", payload: data });
			} catch (error) {
				dispatch({ type: "dataFailed" });
			}
		};
		dateFetch();
	}, []);

	console.log(status);

	return (
		<div className="app">
			<Header />
			<Main>
				{status === "loading" && <Loader />}
				{status === "error" && <Error />}
				{status === "ready" && (
					<StartScreen numQuestions={numQuestions} dispatch={dispatch} />
				)}
				{status === "active" && (
					<>
						<Progress
							index={index}
							numQuestions={numQuestions}
							points={points}
							maxPoint={maxPoint}
							answer={answer}
						/>
						<Question
							question={questions[index]}
							dispatch={dispatch}
							answer={answer}
						/>
						<Footer>
							<Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
							<NextButton
								dispatch={dispatch}
								answer={answer}
								index={index}
								numQuestions={numQuestions}
							/>
						</Footer>
					</>
				)}
				{status === "finished" && (
					<FinishScreen
						points={points}
						maxPoint={maxPoint}
						highScore={highScore}
						dispatch={dispatch}
					/>
				)}
			</Main>
		</div>
	);
};

export default App;
