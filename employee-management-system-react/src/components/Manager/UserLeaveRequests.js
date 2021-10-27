import { useEffect, useRef, useState } from "react";
import { HTTP } from "../../packages/axios";
import style from "./UserLeaveRequests.module.css";

const UserLeaveRequests = (props) => {
  const [leaves, setLeaves] = useState([]);

  const statusRef = useRef();
  const fromRef = useRef();
  const toRef = useRef();
  const emailRef = useRef();

  const filter = {
    skip: "",
    limit: "",
    email: "",
    status: "",
    from: "",
    to: "",
  };

  const fetchLeaveRequests = async (filters) => {
    let url = "/manager/leaves?";

    if (Object.keys(filters).length) {
      Object.keys(filters).forEach((f) => {
        if (filters[f].trim()) url = url + f + "=" + filters[f].trim() + "&";
      });
    }

    try {
      const response = await HTTP.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setLeaves(response.data);
    } catch (e) {
      if (e.response) alert(e.response.data.message);
      else if (e.message) alert(e.message);
    }
  };

  const statusChanger = async (body) => {
    if (!body.uId || !body.leaveId || !body.status)
      return alert("invalid status body");

    try {
      await HTTP.post("/manager/leave/status", body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const _leaves = leaves.filter((le) => le.leaveId !== body.leaveId);

      console.log(_leaves);
      // setLeaves(_leaves);
    } catch (e) {
      if (e.response) alert(e.response.data.message);
      else if (e.message) alert(e.message);
    }
  };

  useEffect(() => {
    fetchLeaveRequests({});
  }, []);

  const statusFilterChangeHandler = (e) => {
    filter["status"] = e.target.value;

    fetchLeaveRequests(filter);
  };

  const fromFilterChangeHandler = (e) => {
    filter["from"] = e.target.value;

    fetchLeaveRequests(filter);
  };

  const toFilterChangeHandler = (e) => {
    filter["to"] = e.target.value;

    fetchLeaveRequests(filter);
  };

  const emailFilterChangeHandler = (e) => {
    filter["email"] = e.target.value;

    fetchLeaveRequests(filter);
  };

  const statusChangeHandler = (e, uId, leaveId) => {
    if (!e.target.value === "approved" || !e.target.value === "rejected")
      return;

    const body = {
      uId: uId.toString().trim(),
      leaveId: leaveId.toString().trim(),
      status: e.target.value,
    };

    statusChanger(body);
  };

  return (
    <div className={style["container"]}>
      <div className={style["filters"]}>
        <div className={style["item"]}>
          <label htmlFor="status">Status</label>
          <select
            name="status"
            id="status"
            onChange={statusFilterChangeHandler}
            ref={statusRef}
          >
            <option value="pending">pending</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
          </select>
        </div>
        <div className={style["item"]}>
          <label htmlFor="from">Applied Date</label>
          <input
            type="datetime-local"
            name="from"
            id="from"
            ref={fromRef}
            onChange={fromFilterChangeHandler}
          />
          <div>-</div>
          <input
            type="datetime-local"
            name="to"
            id="to"
            ref={toRef}
            onChange={toFilterChangeHandler}
          />
        </div>
        <div className={style["item"]}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            ref={emailRef}
            onChange={emailFilterChangeHandler}
          />
        </div>
      </div>
      <br />

      <div className={`${style["item"]} ${style["heading"]}`}>
        <div>Email</div>
        <div>Summary</div>
        <div>Date From</div>
        <div>Date To</div>
        <div>Status</div>
        <div>Action</div>
      </div>

      {leaves.length > 0 &&
        leaves.map((leavereq) =>
          leavereq.leaveRequests.map((leave) => {
            return (
              <div key={leave._id} className={style["item"]}>
                <div className={style["email"]}>{leavereq.email}</div>
                <div className={style["value"]}>{leave.summary}</div>
                <div className={style["value"]}> {leave.dateFrom}</div>
                <div className={style["value"]}>{leave.dateTo}</div>
                <div
                  className={`
                    ${style["value"]} ${
                    leave.status === "approved"
                      ? style["approved"]
                      : leave.status === "rejected"
                      ? style["rejected"]
                      : style["pending"]
                  }
                    `}
                >
                  {leave.status}
                </div>
                <select
                  className={style["value"]}
                  name="decision"
                  onChange={(e) => {
                    statusChangeHandler(e, leavereq._id, leave._id);
                  }}
                >
                  <option>---</option>
                  <option>approved</option>
                  <option>rejected</option>
                </select>
              </div>
            );
          })
        )}
      {!leaves.length && (
        <div className={style["nothing"]}>no requests to show!</div>
      )}
    </div>
  );
};

export default UserLeaveRequests;
