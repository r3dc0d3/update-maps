import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import html2canvas from "html2canvas";

const exportAsImage = async (elements, imageFileName) => {
	for(let el of elements) {
		let canvas = await html2canvas(el);
		let image = canvas.toDataURL("image/png", 1.0);
		downloadImage(image, imageFileName);
	}
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


	const handleFileUpload = async (e) => {
		let files = [];
		for(let fileObject of e.target.files){
			const base64 = await convertToBase64(fileObject);
			files.push(base64)
		}
		setImages(files);
	};

	return (
		<div>
			<Head>
				<title>Update Map Image</title>
				<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
			</Head>
			<div id={"page-wrap"} className={"container mt-5"}>
				<div className="card">
					<div className="card-header">
						<h1 className="title">Export Maps V1.0.7</h1>
					</div>
					<div className="card-body">
						<input
							type={"file"}
							accept=".jpeg, .png, .jpg"
							onChange={handleFileUpload}
							multiple={true}
							className={"form-control"}
						/>
						{
							imagesLinks.length > 0 && (<div>
								<button className={"btn btn-dark w-100 mb-2"} onClick={() => exportAsImage(containerRef.current, 'map.jpg')}>Download</button>
								{
									imagesLinks.map((image, index) => (<div
										className="images-wrap"
										key={`image-wrapper-${index}`}
										ref={el => containerRef.current[index] = el}
										style={{
											position: 'relative',
											display: "inline-block"
										}}
									>
										<img src={image} id={"imagewrap"} />
										<div className={"white-card"}>
											<p>BLACK-WHITE-LEAFLETS</p>
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
												Postcode: IG5 0 <br/>
												Quantity: 6,112
											</p>
										</div>
									</div>))
								}
							</div>)
						}
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
