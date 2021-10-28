import { useRef } from "react";
import { HTTP } from "../../packages/axios";
import style from "./ApplyForLeave.module.css";

const ApplyForLeave = (props) => {
  const summaryRef = useRef();
  const dateFromRef = useRef();
  const dateToRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    document.getElementById("leave-submit").disabled = "true";

    let leave = {};

    if (summaryRef.current.value.trim())
      leave = {
        summary: summaryRef.current.value,
      };

    if (dateFromRef.current.value.toString().trim())
      leave = {
        dateFrom: dateFromRef.current.value,
        ...leave,
      };

    if (dateToRef.current.value.toString().trim())
      leave = {
        dateTo: dateToRef.current.value,
        ...leave,
      };

    const leaveKeys = ["summary", "dateFrom", "dateTo"];

    const isValid = leaveKeys.every((key) => Object.keys(leave).includes(key));

    if (isValid)
      try {
        await HTTP.post("/user/leave", leave, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        props.fetchUser();

        alert("leave request submited successfully");
      } catch (e) {
        if (e.message) alert(e.message);
        else if (e.response.data.message) alert(e.response.data.message);
      }

    document.getElementById("leave-submit").removeAttribute("disabled");
  };

  return (
    <div className={style["container"]}>
      {props.user && (
        <form onSubmit={onSubmitHandler}>
          <div className={style["item"]}>
            <label htmlFor="summary">Summary</label>{" "}
            <input type="text" name="summary" ref={summaryRef} required />
          </div>
          <div className={style["item"]}>
            <label htmlFor="dateFrom">Date From</label>{" "}
            <input
              type="datetime-local"
              name="dateFrom"
              ref={dateFromRef}
              required
            />
          </div>
          <div className={style["item"]}>
            <label htmlFor="dateTo">Date To</label>{" "}
            <input
              type="datetime-local"
              name="dateFrom"
              ref={dateToRef}
              required
            />
          </div>
          <button type="submit" id="leave-submit">
            Apply
          </button>
        </form>
      )}
      {!props.user && <div>Loading....</div>}
    </div>
  );
};

export default ApplyForLeave;
