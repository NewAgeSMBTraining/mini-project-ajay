import style from "./Home.module.css";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import validator from "validator";
import { HTTP } from "../packages/axios";
import { authorize } from "../utils/utils";
import Card from "./UI/Card";

const Home = () => {
  const history = useHistory();

  const emailRef = useRef();
  const passwordRef = useRef();
  const userRef = useRef();
  const managerRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("token").trim()) {
      const validateToken = async () => {
        await HTTP.get("/user/validate", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then(() => {
            return history.push({
              pathname: "/user",
              state: {
                manager: null,
              },
            });
          })
          .catch(async () => {
            await HTTP.get("/manager/validate", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }).then(() => {
              return history.push({
                pathname: "/manager",
                state: {
                  manager: null,
                },
              });
            });
          });
      };
      validateToken();
    }
  }, [history]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validator.isEmail(emailRef.current.value))
      return alert("enter valid credentils");

    const body = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      let response = null;

      //manager
      if (managerRef.current.checked) {
        response = await HTTP.post("/manager/login", body);

        if (!response || !response.data.token || !response.data.manager)
          throw new Error("unable to login");
      }
      //user
      if (userRef.current.checked) {
        response = await HTTP.post("/user/login", body);

        if (!response || !response.data.token || !response.data.user)
          throw new Error("unable to login");
      }

      await authorize(response.data.token);
      setIsLoading(false);

      if (managerRef.current.checked)
        return history.push({
          pathname: "/manager",
          state: {
            manager: response.data.manager,
          },
        });
      if (userRef.current.checked)
        return history.push({
          pathname: "/user",
          state: {
            user: response.data.user,
          },
        });
    } catch (e) {
      //   setIsLoading(false);
      if (e.response) alert(e.response.data.message);
      else alert(e.message);
    }
  };

  const forgotFormHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validator.isEmail(emailRef.current.value))
      return alert("enter valid credentils");

    const body = {
      email: emailRef.current.value,
    };

    try {
      await HTTP.post("/admin/forgot_password", body);

      alert("please check your inbox");

      setIsLoading(false);
    } catch (e) {
      //   setIsLoading(false);
      if (e.response) alert(e.response.data.message);
      else alert(e.message);
    }
  };

  const pageIndexHandler = (num) => {
    setPageIndex(num);
  };

  return (
    <div className={style["container"]}>
      {pageIndex === 0 && (
        <Card className={style["ncard"]}>
          <div className={style["title"]}>EMP-MANAGER SYSYEM</div>
          <form onSubmit={submitHandler}>
            <label htmlFor="email">Email : </label>
            <input
              type="email"
              placeholder="example@yourmail.com"
              ref={emailRef}
              name="email"
              required
            />
            <label htmlFor="email">Password : </label>
            <input
              type="password"
              placeholder="password"
              ref={passwordRef}
              required
            />
            <div>
              <input
                type="radio"
                id="manager"
                name="type"
                value="manager"
                ref={managerRef}
                defaultChecked
              />
              <label htmlFor="manager">Manager</label>
              <input
                type="radio"
                id="user"
                name="type"
                value="user"
                ref={userRef}
              />
              <label htmlFor="user">User</label>
            </div>
            <button type="submit">Login</button>
          </form>
        </Card>
      )}
      {pageIndex === 1 && (
        <Card className={style["ncard"]}>
          <div className={style["title"]}>EMP-MANAGER SYSYEM</div>
          <form onSubmit={forgotFormHandler}>
            <div className={style["text"]}>
              Please input your email. You will get a link to reset your
              password if your email is valid
            </div>
            <div></div>
            <label htmlFor="email">Email : </label>
            <input
              type="email"
              placeholder="example@yourmail.com"
              ref={emailRef}
              name="email"
              required
            />
            <button type="submit">Send</button>
          </form>
        </Card>
      )}
      <div className={style["footer"]}>
        <div
          className={style["link"]}
          onClick={() => {
            pageIndex === 0 ? pageIndexHandler(1) : pageIndexHandler(0);
          }}
        >
          {pageIndex === 0 ? "forgot password?" : "login"}
        </div>
        <div>|</div>
        <div className={style["link"]}>privacy policy</div>
        <div>|</div>
        <div className={style["link"]}>contact</div>
      </div>
    </div>
  );
};

export default Home;
