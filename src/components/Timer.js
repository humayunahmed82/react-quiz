import React, { useEffect } from "react";

const Timer = ({ dispatch, secondsRemaining }) => {
	const mins = Math.floor(secondsRemaining / 60);
	const second = secondsRemaining % 60;

	useEffect(() => {
		const id = setInterval(() => {
			dispatch({ type: "tick" });
		}, 1000);

		return () => clearInterval(id);
	}, [dispatch]);

	return (
		<div className="timer">
			{mins <= 9 ? `0${mins}` : mins}:{second <= 9 ? `0${second}` : second}
		</div>
	);
};

export default Timer;
