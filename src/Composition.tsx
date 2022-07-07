/* eslint-disable react/no-danger */
import "./style.css";

import { continueRender, delayRender, staticFile} from "remotion";
import { TrackTitle } from "./components/TrackTitle";
import { useEffect, useState } from "react";
import { AssemblyRunPlayback } from "./components/AssemblyRunPlayback";

export const MyComposition = () => {
	// States
	const [code, setCode] = useState('');
	const [metadata, setMetadata] = useState<any>(null);
	const [handle] = useState(() => delayRender());

	// On init
	useEffect(() => {
		const init = async () => {
			// Retrieve title from metadata
			const fetchedMetadata = await fetch(staticFile("metadata.json")).then(res => res.json());
			setMetadata(fetchedMetadata);

			// Retrieve code from online
			const fetchedCode = await fetch(staticFile("input.asm")).then(res => res.text());
			setCode(fetchedCode);

			continueRender(handle);
		};

		init();
	}, []);


	return (
		<div
			className="flex flex-col"
			style={{
				background: '#1e1f22',
				width: '100%',
				height: '100vh'
			}}
		>
			<TrackTitle title={metadata?.title ?? ""} artist={metadata?.artist ?? ""} />
			<AssemblyRunPlayback code={code} />
		</div>
	);
};
