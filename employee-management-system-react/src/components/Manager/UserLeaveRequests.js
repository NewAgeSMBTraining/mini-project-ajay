import { useEffect, useState } from "react";
import { HTTP } from "../../packages/axios";
import style from "./UserLeaveRequests.module.css";

const UserLeaveRequests = (props) => {
  const [leaves, setLeaves] = useState([]);

  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [email, setEmail] = useState("");

  let filter = {
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

      setLeaves(response.data.leaves);
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

      fetchLeaveRequests(filter);
    } catch (e) {
      if (e.response) alert(e.response.data.message);
      else if (e.message) alert(e.message);
    }
  };

  useEffect(() => {
    fetchLeaveRequests({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusFilterChangeHandler = (e) => {
    setStatus(e.target.value);
    filter = {
      status: e.target.value,
      email,
      from,
      to,
      limit: "",
      skip: "",
    };
    fetchLeaveRequests(filter);
  };

  const fromFilterChangeHandler = (e) => {
    setFrom(e.target.value);
    filter = {
      status,
      email,
      from: e.target.value,
      to,
      limit: "",
      skip: "",
    };
    fetchLeaveRequests(filter);
  };

  const toFilterChangeHandler = (e) => {
    setTo(e.target.value);
    filter = {
      status,
      email,
      from,
      to: e.target.value,
      limit: "",
      skip: "",
    };
    fetchLeaveRequests(filter);
  };

  const emailFilterChangeHandler = (e) => {
    setEmail(e.target.value);
    filter = {
      status,
      email: e.target.value,
      from,
      to,
      limit: "",
      skip: "",
    };
    fetchLeaveRequests(filter);
  };

  const statusChangeHandler = (e, uId, leaveId) => {
    if (e.target.value === "approved" || e.target.value === "rejected") {
      const body = {
        uId: uId.toString().trim(),
        leaveId: leaveId.toString().trim(),
        status: e.target.value,
      };

      statusChanger(body);
    }
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
            onChange={fromFilterChangeHandler}
          />
          <div>-</div>
          <input
            type="datetime-local"
            name="to"
            id="to"
            onChange={toFilterChangeHandler}
          />
        </div>
        <div className={style["item"]}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
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
        leaves.map((leave) => {
          return (
            <div key={leave._id} className={style["item"]}>
              <div className={style["email"]}>{leave.email}</div>
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
                  statusChangeHandler(e, leave.user, leave._id);
                }}
              >
                <option value="---">---</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
              </select>
            </div>
          );
        })}
      {!leaves.length && (
        <div className={style["nothing"]}>no requests to show!</div>
      )}
    </div>
  );
};

export default UserLeaveRequests;
