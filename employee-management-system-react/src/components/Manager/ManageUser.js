import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HTTP } from "../../packages/axios";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import style from "./ManageUser.module.css";
import ViewUser from "./ViewUser";

const ManageUser = (props) => {
  const [users, setUsers] = useState([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [user, setUser] = useState(null);

  const [actionIndex, setActionIndex] = useState(0);

  let initialSearch = true;

  const fetchUsers = async () => {
    try {
      const response = await HTTP.get("/manager/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(response.data);
    } catch (e) {
      if (e.response) alert(e.response.data.message);
      else if (e.message) alert(e.message);
    }
  };

  const searchUsers = async (search) => {
    try {
      const response = await HTTP.get(`manager/user?search=${search}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(response.data);
    } catch (e) {
      if (e.response) alert(e.response.data.message);
      else if (e.message) alert(e.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const searchHandler = (e) => {
    if (!e.target.value.trim()) {
      if (initialSearch) return;
      else fetchUsers();
    }

    searchUsers(e.target.value.trim());
    initialSearch = false;
  };

  const openPopUp = (user) => {
    setIsPopUp(true);
  };

  const closePopUp = () => {
    setIsPopUp(false);
  };

  return (
    <div className={style["container"]}>
      {isPopUp &&
        createPortal(
          <div className={style["popup"]}>
            <div className={style["content"]}>
              <div
                className={style["actions"]}
                onClick={() => {
                  closePopUp();
                }}
              >
                close
              </div>
              {actionIndex === 0 && (
                <ViewUser
                  user={user}
                  fetchUsers={fetchUsers}
                  closePopUp={closePopUp}
                />
              )}
              {actionIndex === 1 && (
                <EditUser user={user} fetchUsers={fetchUsers} />
              )}
              {actionIndex === 3 && (
                <AddUser
                  fetchUsers={fetchUsers}
                  closePopUp={closePopUp}
                  manager={props.manager}
                />
              )}
            </div>
          </div>,
          document.getElementById("popup-root")
        )}

      <div className={style["topactions"]}>
        <div className={style["searchItem"]}>
          <label htmlFor="search">Search User</label>{" "}
          <input
            type="text"
            id="search"
            name="search"
            onChange={searchHandler}
          ></input>
        </div>
        <button
          onClick={() => {
            setActionIndex(3);
            openPopUp();
          }}
        >
          Add User
        </button>
      </div>
      <div className={`${style["item"]} ${style["heading"]}`}>
        <div>First Name</div>
        <div>Last Name</div>
        <div>Email</div>
        <div>Role</div>
        <div>Gender</div>
        <div>Actions</div>
      </div>

      {users.length > 0 &&
        users.map((user) => {
          return (
            <div key={user._id} className={style["item"]}>
              <div className={style["value"]}>{user.firstName}</div>
              <div className={style["value"]}>{user.lastName}</div>
              <div className={style["email"]}>{user.email}</div>
              <div className={style["value"]}>{user.role}</div>
              <div className={style["value"]}>{user.gender}</div>
              <div className={`${style["value"]}  ${style["actionItem"]}`}>
                <button
                  className={style["green"]}
                  onClick={() => {
                    setActionIndex(0);
                    setUser(user);
                    openPopUp();
                  }}
                >
                  View Profile
                </button>
                <button
                  className={style["blue"]}
                  onClick={() => {
                    setActionIndex(1);
                    setUser(user);
                    openPopUp();
                  }}
                >
                  Edit Profile
                </button>

                {/* <div className={style["configure"]}>
                  <div className={style["dot"]}></div>
                  <div className={style["dot"]}></div>
                  <div className={style["dot"]}></div>
                </div> */}
              </div>
            </div>
          );
        })}
      {!users.length && <div>no users to list!</div>}
    </div>
  );
};

export default ManageUser;
