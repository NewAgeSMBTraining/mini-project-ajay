import { Fragment, useEffect, useRef } from "react";
import style from "./UpdateManager.module.css";

const ManagerProfile = (props) => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const roleRef = useRef();
  const emailRef = useRef();
  const phoneNumberRef = useRef();

  useEffect(() => {
    if (props.manager) {
      firstNameRef.current.value = props.manager.firstName;
      lastNameRef.current.value = props.manager.lastName;
      roleRef.current.value = props.manager.role;
      emailRef.current.value = props.manager.email;
      phoneNumberRef.current.value = props.manager.phoneNumber;
    }
  }, [props.manager]);

  return (
    <Fragment>
      {props.manager && (
        <div className={style["container"]}>
          <form>
            <div className={style["title"]}>Basic</div>
            <div className={style["block"]}>
              <div className={style["item"]}>
                <label htmlFor="firstName">First Name</label>{" "}
                <input
                  type="text"
                  name="firstName"
                  ref={firstNameRef}
                  readOnly
                />
              </div>
              <div className={style["item"]}>
                <label htmlFor="lastName">Last Name</label>{" "}
                <input type="text" name="lastName" ref={lastNameRef} readOnly />
              </div>
              <div className={style["item"]}>
                <label htmlFor="role">Role</label>{" "}
                <input type="text" name="role" ref={roleRef} readOnly />
              </div>
              <div className={style["item"]}>
                <label htmlFor="email">Email</label>{" "}
                <input type="text" name="email" ref={emailRef} readOnly />
              </div>
              <div className={style["item"]}>
                <label htmlFor="phoneNumber">Phone Number</label>{" "}
                <input
                  type="number"
                  name="phoneNumber"
                  ref={phoneNumberRef}
                  readOnly
                />
              </div>
            </div>
          </form>
        </div>
      )}
      {!props.manager && <div>Loading....</div>}
    </Fragment>
  );
};

export default ManagerProfile;
