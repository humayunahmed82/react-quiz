import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

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

const QuizProvider = ({ children }) => {
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
				const res = await fetch(`http://localhost:8000/questions`);
				const data = await res.json();
				dispatch({ type: "dataReceived", payload: data });
			} catch (error) {
				dispatch({ type: "dataFailed" });
			}
		};
		dateFetch();
	}, []);

	return (
		<QuizContext.Provider
			value={{
				questions,
				numQuestions,
				status,
				index,
				answer,
				points,
				highScore,
				secondsRemaining,
				maxPoint,
				dispatch,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
};

const useQuiz = () => {
	const context = useContext(QuizContext);
	if (context === undefined)
		throw new Error("QuizContext was used outside QuizProvider");
	return context;
};

export { QuizProvider, useQuiz };
