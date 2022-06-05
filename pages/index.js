import {useCallback, useEffect, useRef, useState} from 'react';
import Head from 'next/head';
import html2canvas from "html2canvas";
import MapWrapper from "../components/MapWrapper";

const exportAsImage = async (elements, imageFileName) => {
	const searchBox = document.getElementById("search-box");
	if( searchBox ) searchBox.style.display = "none";

	for (let el of elements) {
		let canvas = await html2canvas(el, {
			useCORS: true,
		});
		let image = canvas.toDataURL("image/png", 1.0);
		downloadImage(image, imageFileName);
	}

	if( searchBox ) searchBox.style.display = "block";
};
const downloadImage = (blob, fileName) => {
	const fakeLink = window.document.createElement("a");
	fakeLink.style = "display:none;";
	fakeLink.download = fileName;

	fakeLink.href = blob;

	document.body.appendChild(fakeLink);
	fakeLink.click();
	document.body.removeChild(fakeLink);

	fakeLink.remove();
};
const convertToBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = () => {
			resolve(fileReader.result);
		};
		fileReader.onerror = (error) => {
			reject(error);
		};
	});
};

function SelectedImage() {
	const containerRef = useRef([]);
	let [imagesLinks, setImages] = useState([]);
	const [postcode, setPostcode] = useState('');
	const [quantity, setQuantity] = useState('');
	const [title, setTitle] = useState('BLACK-WHITE-LEAFLETS');

	// Margins
	const [paddingLeft, setPaddingLeft] = useState('20');
	const [paddingRight, setPaddingRight] = useState('20');
	const [paddingTop, setPaddingTop] = useState('20');
	const [paddingBottom, setPaddingBottom] = useState('20');


	const handleFileUpload = async (e) => {
		let files = [];
		for (let fileObject of e.target.files) {
			const base64 = await convertToBase64(fileObject);
			files.push(base64)
		}
		setImages(files);
	};

	const imagesList = function () {
		return (
			imagesLinks.map((image, index) => (<div
				className="images-wrap"
				key={`image-wrapper-${index}`}
				ref={el => containerRef.current[index] = el}
				style={{
					position: 'relative',
					display: "inline-block",
					paddingLeft: `${paddingLeft}px`,
					paddingRight: `${paddingRight}px`,
					paddingTop: `${paddingTop}px`,
					paddingBottom: `${paddingBottom}px`,
				}}
			>
				<img src={image} id={"imagewrap"} />
				<div className={"white-card"}>
					<p>{title}</p>
					<p className={"full-width-flex"}>
						<span className="text">Start:</span>
						<span className="fillIn">test</span>
					</p>
					<p className={"full-width-flex"}>
						<span className="text">Finish:</span>
						<span className="fillIn">test</span>
					</p>
					<p className={"full-width-flex"}>
						<span className="text">Tracker:</span>
						<span className="fillIn">test</span>
					</p>
					<p>
						Postcode: {postcode} <br />
						{quantity && <span>Quantity: {quantity}</span>}
					</p>
				</div>
			</div>))
		)
	}

	return (
		<div>
			<Head>
				<title>Update Map Image</title>
				<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
			</Head>
			<div id={"page-wrap"} className={"container mt-5"}>
				<div className="card">
					<div className="card-header">
						<h1 className="title">Export Maps V1.0.9</h1>
					</div>
					<div className="card-body">
						<input
							type={"file"}
							accept=".jpeg, .png, .jpg"
							onChange={handleFileUpload}
							multiple={true}
							className={"form-control"}
						/>
						<h3>Map</h3>

						<div>
							<button className={"btn btn-dark w-100 mb-2"}
									onClick={() => exportAsImage(containerRef.current, 'map.jpg')}
							>Download
							</button>

							<div className="card">
								<div className="card-header">Details</div>
								<div className="card-body">
									<div className="row">
										<div className="col">
											<h2>Details</h2>
											<div className="row my-3">
												<div className="col">
													<label>Title</label>
													<input type="text" className={"form-control"} placeholder={"Title"}
														   defaultValue={title} onChange={e => setTitle(e.target.value)}
													/>
												</div>
											</div>

											<div className="row my-3">
												<div className="col">
													<label>PostCode</label>
													<input type="text" className={"form-control"}
														   placeholder={"Post Code"} defaultValue={postcode}
														   onChange={e => setPostcode(e.target.value)}
													/>
												</div>
												<div className="col">
													<label>Quantity</label>
													<input type="text" className={"form-control"}
														   placeholder={"Quantity"} defaultValue={quantity}
														   onChange={e => setQuantity(e.target.value)}
													/>
												</div>
											</div>
										</div>
										<div className="col">
											<h2>Margins</h2>
											<div className="row">
												<div className="col">
													<div className={"form-group"}>
														<label>Left</label>
														<input type="text" className={"form-control"}
															   placeholder={"Quantity"} defaultValue={paddingLeft}
															   onChange={e => setPaddingLeft(e.target.value)}
														/>
													</div>
													<div className={"form-group"}>
														<label>Right</label>
														<input type="text" className={"form-control"}
															   placeholder={"Quantity"} defaultValue={paddingRight}
															   onChange={e => setPaddingRight(e.target.value)}
														/>
													</div>
												</div>
												<div className="col">
													<div className={"form-group"}>
														<label>Top</label>
														<input type="text" className={"form-control"}
															   placeholder={"Quantity"} defaultValue={paddingTop}
															   onChange={e => setPaddingTop(e.target.value)}
														/>
													</div>
													<div className={"form-group"}>
														<label>Right</label>
														<input type="text" className={"form-control"}
															   placeholder={"Quantity"} defaultValue={paddingBottom}
															   onChange={e => setPaddingBottom(e.target.value)}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div id="images-wrap">
								{ imagesLinks.length > 0 ? imagesList() : <div
									ref={el => containerRef.current[0] = el}
									className={"map-wrapper"}
								>
									<MapWrapper />
									<div className={"white-card"}>
										<p>{title}</p>
										<p className={"full-width-flex"}>
											<span className="text">Start:</span>
											<span className="fillIn">test</span>
										</p>
										<p className={"full-width-flex"}>
											<span className="text">Finish:</span>
											<span className="fillIn">test</span>
										</p>
										<p className={"full-width-flex"}>
											<span className="text">Tracker:</span>
											<span className="fillIn">test</span>
										</p>
										<p>
											Postcode: {postcode} <br />
											{quantity && <span>Quantity: {quantity}</span>}
										</p>
									</div>
								</div>}
							</div>
						</div>
					</div>
				</div>
			</div>

			<footer className="text-center">
				built for Petruta Ailenei
			</footer>
		</div>
	);
}

export default SelectedImage;
