import {useEffect, useState} from 'react';
import StorefrontIcon from '@mui/icons-material/Storefront';

interface Props {
	src?: string | null;
	alt: string;
	size: number;
	borderRadius?: number | string;
}

/** Store photo that falls back to a storefront icon when there is no image or it fails to load. */
function StoreImage({src, alt, size, borderRadius = 10}: Props) {
	const [failed, setFailed] = useState(false);

	// A new URL gets a fresh chance to load.
	useEffect(() => setFailed(false), [src]);

	if (!src || failed) {
		return (
			<div
				role="img"
				aria-label={`${alt} (no photo available)`}
				style={{
					width: size,
					height: size,
					borderRadius,
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#f3e9ea',
					color: '#4e1d21',
				}}>
				<StorefrontIcon style={{fontSize: size * 0.5}} />
			</div>
		);
	}

	return (
		<img
			src={src}
			alt={alt}
			onError={() => setFailed(true)}
			style={{width: size, height: size, borderRadius, objectFit: 'cover', flexShrink: 0}}
		/>
	);
}

export default StoreImage;
