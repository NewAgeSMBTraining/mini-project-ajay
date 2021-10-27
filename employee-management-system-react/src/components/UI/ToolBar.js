import style from "./Toolbar.module.css";

const ToolBar = (props) => {
  return (
    <div className={style["toolbar"]}>
      <div className={style["title"]}>EMP-MANAGER SYSTEM</div>
      <div className={style["actions"]}>
        <button onClick={props.logoutHandler}>Logout</button>
      </div>
    </div>
  );
};

export default ToolBar;
