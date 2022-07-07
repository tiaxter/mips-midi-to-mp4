import {useState} from 'react'
import {useEffect} from 'react'
import {Composition, continueRender, delayRender, staticFile} from 'remotion';
import {MyComposition} from './Composition';
import MidUtil from "./utils/MidUtil";

export const RemotionVideo: React.FC = () => {
	const [ handle ] = useState(() => delayRender());

	const [fps] = useState(120);
	const [durationInFrames, setDurationInFrames] = useState(1);

	useEffect(() => {
		const init = async () => {
			const code = await fetch(staticFile("input.asm")).then(res => res.text());
			const durationMs = MidUtil.calculateAssemblyExecutionDuration(code);

			setDurationInFrames(Math.round((durationMs / 1000) * fps));
			continueRender(handle);
		};

		init();
	}, [handle]);
	
	
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={durationInFrames}
				fps={fps}
				width={1280}
				height={720}
			/>
		</>
	);
};
