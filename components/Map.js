import {GoogleMap} from "@react-google-maps/api";

export default function Map(){
	return(
		<GoogleMap
			zoom={10}
			center={{lat: 44, lng: -80}}
			mapContainerClassName={"map-container"}
		/>
	)
}
