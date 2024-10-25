import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "../styles/components/MyInput.css";

const MyInput = ({ max, setValue, value, min }) => {
	function add() {
		if (value < max) setValue(value + 1);
	}
	function sub() {
		if (value > min) setValue(value - 1);
	}
	function change(e) {
		if (e.target.value < min) setValue(min);
		else if (e.target.value > max) setValue(max);
		else setValue(parseInt(e.target.value));
	}
	return (
		<span className="button" id="inputContainer">
			<FaMinus className="plusMinus" onClick={sub} />
			<input
				type="number"
				onChange={change}
				value={value}
				min={min}
				max={max}
			></input>
			<FaPlus className="plusMinus" onClick={add} />
		</span>
	);
};

export default MyInput;
