import {useEffect, useRef} from 'react';

const useRotatingText = (text: string) => {
	const textRef = useRef<HTMLHeadingElement | null>(null);
	null;

	useEffect(() => {
		if (textRef.current) {
			const transformedText = text
				.split('')
				.map((char, i) => `<span style="display:inline-block; transform:rotate(${i * (360 / text.length)}deg)">${char}</span>`)
				.join('');

			textRef.current.innerHTML = transformedText;
		}
	}, [text]);

	return textRef;
};

export default useRotatingText;
