import React, {
  ChangeEvent,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
// import Modal from '@mui/material/Modal'; // Material-UI modal
import Button from "@mui/material/Button"; // Material-UI button
import TextField from "@mui/material/TextField"; // Material-UI text field
import { AuthContext } from "../context/AuthContext.js";
import Loader from "../components/Loader.js";

import InputAdornment from "@mui/material/InputAdornment/InputAdornment.js";
import ProfileDetails from "../components/ProfileDetails.js";
import ProfileForm from "../components/ProfileForm.js";
// import {emailValidation, passwordValidation} from '../utils/JSFunctions';
// import {deleteImage, uploadImage} from '../utils/imageMangement';
// import PasswordInput from './PasswordInput';
// import {baseURL} from '../utils/getServerURL';
// import getToken from '../utils/getToken';

interface updateFields {
  email?: string;
  password?: string;
  username?: string;
  profilePicFile?: File | null;
}

function Profile() {
  // update << Add to auth context part
  const { user, update } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // const [showModal, setShowModal] = useState(false);

  const [updatedFields, setUpdatedFields] = useState<updateFields>();

  function passwordValidation(password: string) {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return passwordRegex.test(password);
  }
  const validationBool = passwordValidation(newPassword);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedFields({ ...updatedFields, email: e.target.value });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedFields({ ...updatedFields, username: e.target.value });
  };

  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    setUpdatedFields({ ...updatedFields, profilePicFile: file });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validationBool)
      setUpdatedFields({ ...updatedFields, password: newPassword });

    // update(updatedFields);
    // setUser(updatedFields);
  };

  useEffect(() => {}, [editMode]);

  return (
    <div
      className="centeredDiv"
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "100vw",
      }}
    >
      {user && (
        <div
          className="centeredDiv"
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            width: "70vw",
            height: "70vh",
            backgroundColor: "whitesmoke",
            borderRadius: "25px",
          }}
        >
          {loading && <Loader />}

          <ProfileDetails
            user={user}
            editMode={editMode}
            setEditMode={setEditMode}
          />

          <ProfileForm
            editMode={editMode}
            validationBool={validationBool}
            updatedFields={updatedFields}
            handleEmailChange={handleEmailChange}
            handlePasswordChange={handlePasswordChange}
            handleUsernameChange={handleUsernameChange}
            handleProfilePicChange={handleProfilePicChange}
            handleUpdate={handleUpdate}
          />

          <Button
            variant="contained"
            color="warning"
            onClick={() => setEditMode(!editMode)}
            style={editMode ? { display: "none" } : {}}
          >
            Edit Profile
          </Button>

          <br />
          <br />
        </div>
      )}
    </div>
  );
}

export default Profile;
