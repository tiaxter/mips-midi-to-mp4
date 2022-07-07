import {useEffect} from 'react'
import {Composition} from 'remotion';
import {MyComposition} from './Composition';

export const RemotionVideo: React.FC = () => {
	useEffect(() => {
		
	}, []);
	
	
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={600}
				fps={120}
				width={1280}
				height={720}
			/>
		</>
	);
};
