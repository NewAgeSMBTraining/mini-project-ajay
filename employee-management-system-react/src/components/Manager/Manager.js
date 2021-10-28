import { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { HTTP } from "../../packages/axios";
import { unAuthorize } from "../../utils/utils";
import ToolBar from "../UI/ToolBar";
import ChangePassword from "./ChangePassword";
import ManageUser from "./ManageUser";
import UpdateManager from "./UpdateManager";
import UserLeaveRequests from "./UserLeaveRequests";
import style from "./Manager.module.css";
import ManagerProfile from "./ManagerProfile";

const Manager = (props) => {
  const history = useHistory();

  const [manager, setManager] = useState(null);
  const [index, setIndex] = useState(0);

  const fetchManager = async () => {
    try {
      const response = await HTTP.get("/manager/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.data.manager)
        throw new Error("an error occured while loading");
      setManager(response.data.manager);
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
    fetchManager();
    if (props.location.state && props.location.state.manager)
      setManager(props.location.state.manager);
    else fetchManager();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, props.location]);

  const logoutHandler = async () => {
    try {
      await HTTP.post(
        "/manager/logout",
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
      {manager && (
        <div className={style["container"]}>
          <div className={style["sidebar"]}>
            <div>
              <button
                onClick={() => {
                  changeIndexHandler(0);
                }}
              >
                View Profile
              </button>

              <button
                onClick={() => {
                  changeIndexHandler(1);
                }}
              >
                Edit Profile
              </button>

              <button
                onClick={() => {
                  changeIndexHandler(2);
                }}
              >
                Change Password
              </button>

              <button
                onClick={() => {
                  changeIndexHandler(3);
                }}
              >
                View Leave Requests
              </button>

              <button
                onClick={() => {
                  changeIndexHandler(4);
                }}
              >
                Manage User
              </button>
            </div>
          </div>
          <div className={style["content"]}>
            {index === 0 && <ManagerProfile manager={manager} />}
            {index === 1 && (
              <UpdateManager manager={manager} fetchManager={fetchManager} />
            )}
            {index === 2 && <ChangePassword manager={manager} />}
            {index === 3 && <UserLeaveRequests manager={manager} />}
            {index === 4 && <ManageUser manager={manager} />}
          </div>
        </div>
      )}

      {!manager && <div>Loading...</div>}
    </Fragment>
  );
};

export default Manager;
