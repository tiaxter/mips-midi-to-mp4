/* eslint-disable react/no-danger */
import "./style.css";

import { continueRender, delayRender, staticFile} from "remotion";
import { TrackTitle } from "./components/TrackTitle";
import { useEffect, useState } from "react";
import { AssemblyRunPlayback } from "./components/AssemblyRunPlayback";
import MidUtil from "./utils/MidUtil";

export const MyComposition = () => {
	// States
	const [code, setCode] = useState('');
	const [timings, setTimings] = useState([]);
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
			const codeLines: any = fetchedCode.split("\n");

			// Make some process
			setTimings(() => {
					let lastCalledSyscallCode = 0;
					let setDelay = 0;

					return codeLines.map((currentLine: string) => {
						currentLine = currentLine.replace("\t", "");

						const [ isSyscallSet, syscallCode ] = MidUtil.syscallNumberSet(currentLine);

						if (isSyscallSet) {
							lastCalledSyscallCode = syscallCode;
						}

						const probablyDelay = MidUtil.returnSleepTime(currentLine, lastCalledSyscallCode);
						if (probablyDelay !== null) {
							setDelay = probablyDelay;
						}

						if (currentLine === "syscall") {
							const valueToReturn = setDelay;
							console.log(setDelay);
							console.log("syscall");
							setDelay = 0;
							return valueToReturn;
						}

						return 0;
					})
				});
			setCode(fetchedCode);

			continueRender(handle);
		};

		init();
	}, [handle]);


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
			<AssemblyRunPlayback code={code} timings={timings} />
		</div>
	);
};
