fetch("/getDatabase")
	.then((res) => {
		console.log(res);
		return res.json();
	})
	.then((data) => {
		let tbody = document.querySelector("#table_result");
		data.table.forEach((tuple) => {
			let tr = document.createElement("tr");
			tbody.appendChild(tr);
			tuple.forEach((element) => {
				let td = document.createElement("td");
				tr.appendChild(td);
				td.innerText = element;
			});
		});
	});
