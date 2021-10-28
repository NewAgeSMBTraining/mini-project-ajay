import { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { HTTP } from "../../packages/axios";
import { unAuthorize } from "../../utils/utils";
import ToolBar from "../UI/ToolBar";
import ApplyForLeave from "./ApplyForLeave";
import ChangePassword from "./ChangePassword";
import LeaveRequests from "./LeaveRequests";
import UpdateUser from "./UpdateUser";
import style from "./User.module.css";
import UserProfile from "./UserProfile";

const User = (props) => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [index, setIndex] = useState(0);

  const fetchUser = async () => {
    try {
      const response = await HTTP.get("/user/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.data.user)
        throw new Error("an error occured while loading");
      setUser(response.data.user);
    } catch (e) {
      if (e.response.data.message) {
        if (e.response.status === 401) {
          alert(e.response.data.message);
          return history.push("/");
        }
      }
      if (e.message) alert(e.message);
    }
  };

  useEffect(() => {
    if (props.location.state && props.location.state.user)
      setUser(props.location.state.user);
    else fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location]);

  const logoutHandler = async () => {
    try {
      await HTTP.post(
        "/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      unAuthorize();
      history.push("/");
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  const changeIndexHandler = (num) => {
    if (num === 0) setIndex(0);
    if (num === 1) setIndex(1);
    if (num === 2) setIndex(2);
    if (num === 3) setIndex(3);
    if (num === 4) setIndex(4);
  };

  return (
    <Fragment>
      <ToolBar logoutHandler={logoutHandler} />
      {user && (
        <div className={style["container"]}>
          <div className={style["sidebar"]}>
            <button
              onClick={() => {
                changeIndexHandler(0);
              }}
            >
              View Profile
            </button>
            {"  "}
            <button
              onClick={() => {
                changeIndexHandler(1);
              }}
            >
              Edit Profile
            </button>
            {"  "}
            <button
              onClick={() => {
                changeIndexHandler(2);
              }}
            >
              View Leave Request
            </button>
            {"  "}
            <button
              onClick={() => {
                changeIndexHandler(3);
              }}
            >
              Apply For Leave
            </button>
            {"  "}
            <button
              onClick={() => {
                changeIndexHandler(4);
              }}
            >
              Change Password
            </button>
          </div>
          <div className={style["content"]}>
            {index === 0 && <UserProfile user={user} />}
            {index === 1 && <UpdateUser user={user} fetchUser={fetchUser} />}
            {index === 2 && <LeaveRequests user={user} />}
            {index === 3 && <ApplyForLeave user={user} fetchUser={fetchUser} />}
            {index === 4 && <ChangePassword user={user} />}
          </div>
        </div>
      )}
      {!user && <div>Loading...</div>}
    </Fragment>
  );
};

export default User;
