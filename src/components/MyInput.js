import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "../styles/components/MyInput.css";

const MyInput = ({ max, setValue, value, min }) => {
	function add() {
		acceptValue(value + 1);
	}
	function sub() {
		acceptValue(value - 1);
	}
	function acceptValue(e) {
		if (isNaN(e)) {
			return;
		}
		e = Number(e);
		if (e < min) return setValue(min);
		else if (e > max) return setValue(max);
		else return setValue(e);
	}
	function change(e) {
		acceptValue(e.target.value);
	}
	return (
		<span className="button" id="inputContainer">
			<FaMinus className="plusMinus" onClick={sub} />
			<input
				type="number"
				onChange={change}
				value={Number(value)}
				min={min}
				max={max}
			></input>
			<FaPlus className="plusMinus" onClick={add} />
		</span>
	);
};

export default MyInput;
