import style from "./ResetPassword.module.css";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import validator from "validator";
import { HTTP } from "../packages/axios";
import Card from "./UI/Card";

const ResetPassword = (props) => {
  const history = useHistory();

  const newpasswordRef = useRef();
  const repeatNewpasswordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const [TOKEN, setTOKEN] = useState(null);
  const [EMAIL, setEMAIL] = useState(null);

  useEffect(() => {
    const tokenValidator = async () => {
      const token = props.location.pathname.split("/")[2];

      let email = props.location.search
        .replace("?", "")
        .split("&")
        .filter((f) => f.includes("account="));

      if (email) email = email[0].split("=");

      if (email.length === 2 && email[1].trim()) email = email[1].trim();

      try {
        let response = await HTTP.get(
          `/admin/reset_password/token_validator/${token}?account=${email}`
        );

        setEMAIL(response.data.email);
        setTOKEN(response.data.token);

        setIsLoading(false);
      } catch (e) {
        //   setIsLoading(false);

        history.push("/");

        // if (e.response) alert(e.response.data.message);
        // else alert(e.message);
      }
    };
    tokenValidator();
  }, [history, props.location.pathname, props.location.search]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !validator.isStrongPassword(newpasswordRef.current.value.trim()) ||
      newpasswordRef.current.value.trim() !==
        repeatNewpasswordRef.current.value.trim()
    )
      return alert("invalid password or password do not match");

    const body = {
      email: EMAIL,
      token: TOKEN,
      password: newpasswordRef.current.value.trim(),
    };

    try {
      let response = await HTTP.post("/admin/reset_password", body);

      alert(response.data.message);

      history.push("/");

      setIsLoading(false);
    } catch (e) {
      //   setIsLoading(false);
      if (e.response) alert(e.response.data.message);
      else alert(e.message);
    }
  };

  return (
    <div className={style["container"]}>
      {
        <Card className={style["ncard"]}>
          <div className={style["title"]}>EMP-MANAGER SYSYEM</div>
          <form onSubmit={submitHandler}>
            <label htmlFor="password">New Password : </label>
            <input
              type="password"
              ref={newpasswordRef}
              placeholder="password"
              name="password"
              required
            />
            <label htmlFor="repeat">Repeat New Password : </label>
            <input
              type="password"
              placeholder="repeat password"
              ref={repeatNewpasswordRef}
              required
            />
            <button type="submit">Login</button>
          </form>
        </Card>
      }
      <div className={style["footer"]}>
        <div className={style["link"]}>login</div>
        <div>|</div>
        <div className={style["link"]}>privacy policy</div>
        <div>|</div>
        <div className={style["link"]}>contact</div>
      </div>
    </div>
  );
};

export default ResetPassword;
