import { useRef } from "react";
import { HTTP } from "../../packages/axios";
import validator from "validator";
import style from "./ChangePassword.module.css";

const ChangePassword = (props) => {
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const newPasswordConfirmRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const button = document.getElementById("password-submit");
    button.disabled = "true";

    if (!oldPasswordRef.current.value.trim()) {
      button.removeAttribute("disabled");
      return alert("please enter old password");
    }

    if (!validator.isStrongPassword(newPasswordRef.current.value.trim())) {
      button.removeAttribute("disabled");
      return alert("please enter strong password");
    }

    if (
      newPasswordConfirmRef.current.value.trim() !==
      newPasswordRef.current.value.trim()
    ) {
      button.removeAttribute("disabled");
      return alert("password do not match");
    }

    const password = {
      oldpassword: oldPasswordRef.current.value.trim(),
      newpassword: newPasswordRef.current.value.trim(),
    };

    try {
      await HTTP.patch("/user/change_password", password, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("password changed successfully");
    } catch (e) {
      if (e.response.data.message) alert(e.response.data.message);
      else if (e.message) alert(e.message);
    }

    button.removeAttribute("disabled");
  };

  return (
    <div className={style["container"]}>
      {props.user && (
        <form onSubmit={onSubmitHandler}>
          <div className={style["item"]}>
            <label htmlFor="oldPassword">Old Password</label>{" "}
            <input
              type="password"
              name="oldPassword"
              ref={oldPasswordRef}
              required
            />
          </div>
          <div className={style["item"]}>
            <label htmlFor="newPassword">New Password</label>{" "}
            <input
              type="password"
              name="newPassword"
              ref={newPasswordRef}
              required
            />
          </div>
          <div className={style["item"]}>
            <label htmlFor="newPasswordConfirm">Confirm New Password</label>{" "}
            <input
              type="password"
              name="newPasswordConfirm"
              ref={newPasswordConfirmRef}
              required
            />
          </div>
          <button type="submit" id="password-submit">
            Confirm
          </button>
        </form>
      )}
      {!props.user && <div>Loading....</div>}
    </div>
  );
};

export default ChangePassword;
