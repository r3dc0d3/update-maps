import Map from "./Map";
import {useLoadScript, StandaloneSearchBox, LoadScript, GoogleMap} from '@react-google-maps/api';
import {useRef, useState} from "react";

const GoogleApiKey = 'AIzaSyALMbC5xz211_-9JmCRTx-0melFO4WQI3M';
const PlacesApiKey = '"AIzaSyD8gUOjZHDNhs1cTnptLLeuIqMklpbVTxU"';

export default function MapWrapper(props) {
	const [zoom, setZoom] = useState(10);
	const [center, setCenter] = useState({ lat: 51.5072178, lng: -0.1275862 })
	const refs = {};

	const onPlaceChanged = function (){
		const places = refs.searchBox.getPlaces();
		if( places.length === 0 ) return;
		const place = places[0];

		setCenter({
			lat: place.geometry.location.lat(),
			lng: place.geometry.location.lng()
		});
		setZoom(14);
	}

	const afterLoaded = function (){
		const libraries = ["drawing", "places"];
		return (
			<LoadScript id="script-loader" googleMapsApiKey={GoogleApiKey} libraries={libraries}>
				<GoogleMap
					zoom={zoom}
					center={center}
					id="map"
					options={{
						disableDefaultUI: true,
					}}
				>
					<StandaloneSearchBox
						onLoad={ref => refs.searchBox = ref}
						onPlacesChanged={onPlaceChanged}
					>
						<input
							type="text"
							className={"form-control"}
							placeholder="Search on map"
							id={"search-box"}
							value={props.postcode}
						/>
					</StandaloneSearchBox>
				</GoogleMap>
			</LoadScript>
		)
	}

	return (
		<div id="map-container">
			{ afterLoaded() }
		</div>
	);
}
