import style from "./LeaveRequests.module.css";

const LeaveRequests = (props) => {
  return (
    <div className={style["container"]}>
      <div className={`${style["item"]} ${style["heading"]}`}>
        <div>Summary</div>
        <div>Date From</div>
        <div>Date To</div>
        <div>Status</div>
      </div>
      {!props.user.leaveRequests.length && (
        <div className={style["nothing"]}>no leave requests to show.</div>
      )}
      {props.user &&
        props.user.leaveRequests.map((item) => {
          return (
            <div key={item._id} className={style["item"]}>
              <div className={style["value"]}>{item.summary}</div>
              <div className={style["value"]}>{item.dateFrom}</div>
              <div className={style["value"]}>{item.dateTo}</div>
              <div
                className={`
                    ${style["value"]} ${
                  item.status === "approved"
                    ? style["approved"]
                    : item.status === "rejected"
                    ? style["rejected"]
                    : style["pending"]
                }
                    `}
              >
                {item.status}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default LeaveRequests;
