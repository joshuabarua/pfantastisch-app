import {User} from "../@types";

type Props = {
	user: User;
};

function UserCard({user}: Props) {
	return (
		<div style={{border: "solid 1px black", padding: "0 1em", width: "300px"}}>
			<p>
				<b>{user.username}</b> - {user.email}
			</p>
		</div>
	);
}

export default UserCard;
