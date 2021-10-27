import { Fragment, useEffect, useRef } from "react";
import { HTTP } from "../../packages/axios";
import style from "./UpdateManager.module.css";

const UpdateManager = (props) => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const roleRef = useRef();
  const phoneNumberRef = useRef();

  useEffect(() => {
    if (props.manager) {
      firstNameRef.current.value = props.manager.firstName;
      lastNameRef.current.value = props.manager.lastName;
      roleRef.current.value = props.manager.role;
      phoneNumberRef.current.value = props.manager.phoneNumber;
    }
  }, [props.manager]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    document.getElementById("update-submit").disabled = "true";

    let updates = {};

    if (
      firstNameRef.current.value.trim() &&
      firstNameRef.current.value !== props.manager.firstName
    )
      updates = {
        firstName: firstNameRef.current.value,
      };

    if (
      lastNameRef.current.value.trim() &&
      lastNameRef.current.value !== props.manager.lastName
    )
      updates = {
        lastName: lastNameRef.current.value,
        ...updates,
      };

    if (
      roleRef.current.value.trim() &&
      roleRef.current.value !== props.manager.role
    )
      updates = {
        role: roleRef.current.value,
        ...updates,
      };

    if (
      phoneNumberRef.current.value.trim() &&
      phoneNumberRef.current.value !== props.manager.phoneNumber
    )
      updates = {
        phoneNumber: phoneNumberRef.current.value,
        ...updates,
      };

    if (Object.keys(updates).length)
      try {
        await HTTP.patch(
          "/manager/edit",
          { updates },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        props.fetchManager();

        alert("updates successfully");
      } catch (e) {
        if (e.response.data.message) alert(e.response.data.message);
        else alert("an error occured");
      }

    document.getElementById("update-submit").removeAttribute("disabled");
  };

  return (
    <Fragment>
      {props.manager && (
        <div className={style["container"]}>
          <form onSubmit={onSubmitHandler}>
            <div className={style["title"]}>Basic</div>
            <div className={style["block"]}>
              <div className={style["item"]}>
                <label htmlFor="firstName">First Name</label>{" "}
                <input
                  type="text"
                  name="firstName"
                  ref={firstNameRef}
                  required
                />
              </div>
              <div className={style["item"]}>
                <label htmlFor="lastName">Last Name</label>{" "}
                <input type="text" name="lastName" ref={lastNameRef} required />
              </div>
              <div className={style["item"]}>
                <label htmlFor="role">Role</label>{" "}
                <input type="text" name="role" ref={roleRef} required />
              </div>
              <div className={style["item"]}>
                <label htmlFor="phoneNumber">Phone Number</label>{" "}
                <input
                  type="number"
                  name="phoneNumber"
                  ref={phoneNumberRef}
                  required
                />
              </div>
            </div>
            <button type="submit" id="update-submit">
              Update
            </button>
          </form>
        </div>
      )}
      {!props.manager && <div>Loading....</div>}
    </Fragment>
  );
};

export default UpdateManager;
