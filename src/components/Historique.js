import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const Historique = ({ histprincipal, histdetail }) => {
	const [detail, setDetail] = useState(false);
	useEffect((_) => {
		setDetail(false);
	}, []);
	function handleClick() {
		setDetail(!detail);
	}
	return (
		<div>
			<IoIosArrowDown className="clickable" onClick={handleClick} />
			<span>
				{" "}
				{histprincipal[0]}
				{histprincipal[1]}
				{histprincipal[2]}
				{histprincipal[3]}
			</span>
			{detail ? (
				<div>
					{histdetail.map((e, i) => (
						<div key={i}>
							{e[0]}
							{e[1]}
							{e[2]}
							{e[3]}
							{e[4]}{" "}
						</div>
					))}
				</div>
			) : (
				<span></span>
			)}
		</div>
	);
};
export default Historique;
