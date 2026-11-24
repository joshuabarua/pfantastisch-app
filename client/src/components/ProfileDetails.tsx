import {User} from '../@types';
import {styled} from '@mui/material/styles';

interface Props {
	user: User;
}

const ProfileContainer = styled('div')(({theme}) => ({
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(3),
	maxWidth: 600,
	margin: '0 auto',
	gap: '1rem',
}));

const ProfileContent = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: '1rem',
});

const ProfileImage = styled('img')({
	border: 'solid 2px rgba(0,0,0,0.1)',
	borderRadius: '50%',
	height: 150,
	width: 150,
	objectFit: 'cover',
});

const ProfileInfo = styled('div')({
	textAlign: 'center',
});

const InfoItem = styled('p')(({theme}) => ({
	margin: theme.spacing(1, 0),
	color: theme.palette.text.secondary,
}));

function ProfileDetails({user}: Props) {
	return (
		<ProfileContainer>
			<ProfileContent>
				<ProfileImage src={user.image_url} alt={`${user.username}'s profile`} />
				<ProfileInfo>
					<h3>{user.username}</h3>
					{user.email && <InfoItem>Email: {user.email}</InfoItem>}
					{user.createdAt && <InfoItem>Member since: {new Date(user.createdAt).toLocaleDateString()}</InfoItem>}
				</ProfileInfo>
			</ProfileContent>
		</ProfileContainer>
	);
}

export default ProfileDetails;
