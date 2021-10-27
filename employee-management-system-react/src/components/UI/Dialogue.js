import style from "./Dialogue.module.css";

const Dialogue = (props) => {
  return (
    <div className={style["container"]}>
      <div className={style["content"]}>
        <div className={style["summary"]}>{props.message}</div>
        <div className={style["actions"]}>
          <button
            className={style["yes"]}
            onClick={() => {
              props.dialogueHandler(true);
            }}
          >
            YES
          </button>
          <button
            className={style["no"]}
            onClick={() => {
              props.dialogueHandler(false);
            }}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialogue;
