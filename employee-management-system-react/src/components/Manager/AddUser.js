import { Fragment, useEffect, useRef } from "react";
import { HTTP } from "../../packages/axios";
import style from "./AddUser.module.css";
import validator from "validator";

const AddUser = (props) => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const roleRef = useRef();
  const dobRef = useRef(new Date());
  const genderRef = useRef();
  const phoneNumberRef = useRef();
  const addressRef = useRef();

  const sendcredentialsRef = useRef();

  useEffect(() => {}, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    document.getElementById("add-submit").disabled = "true";

    let body = {
      manager: props.manager.email,
    };

    if (firstNameRef.current.value.trim())
      body = {
        firstName: firstNameRef.current.value,
        ...body,
      };

    if (lastNameRef.current.value.trim())
      body = {
        lastName: lastNameRef.current.value,
        ...body,
      };

    if (emailRef.current.value.trim())
      body = {
        email: emailRef.current.value,
        ...body,
      };

    if (
      passwordRef.current.value.trim() &&
      validator.isStrongPassword(passwordRef.current.value.trim())
    )
      body = {
        password: passwordRef.current.value,
        ...body,
      };

    if (roleRef.current.value.trim())
      body = {
        role: roleRef.current.value,
        ...body,
      };

    if (dobRef.current.value.trim())
      body = {
        dob: dobRef.current.value,
        ...body,
      };

    if (genderRef.current.value.trim())
      body = {
        gender: genderRef.current.value,
        ...body,
      };

    if (phoneNumberRef.current.value.trim())
      body = {
        phoneNumber: phoneNumberRef.current.value,
        ...body,
      };

    if (addressRef.current.value.trim())
      body = {
        address: addressRef.current.value,
        ...body,
      };

    //social

    const socialsParent = document.getElementById("social");
    let _social = [],
      socialUpdateCount = 0;

    for (let i = 0; i < socialsParent.childNodes.length; i++) {
      const title =
        socialsParent.childNodes[i].childNodes[0].childNodes[1].value.trim();
      const url =
        socialsParent.childNodes[i].childNodes[1].childNodes[1].value.trim();

      if (title && url) {
        _social.push({ title, url });
        socialUpdateCount++;
      }
    }

    if (socialUpdateCount > 0)
      body = {
        social: _social,
        ...body,
      };

    //

    //academic

    const academicParent = document.getElementById("academic");
    let _academicQualifications = [],
      academicUpdateCount = 0;

    for (let i = 0; i < academicParent.childNodes.length; i++) {
      const degreeCertificate =
        academicParent.childNodes[i].childNodes[0].childNodes[1].value.trim();
      const qualifications =
        academicParent.childNodes[i].childNodes[1].childNodes[1].value.trim();
      const institute =
        academicParent.childNodes[i].childNodes[2].childNodes[1].value.trim();
      const boardUniversity =
        academicParent.childNodes[i].childNodes[3].childNodes[1].value.trim();
      const year =
        academicParent.childNodes[i].childNodes[4].childNodes[1].value.trim();
      const percentageCgpa =
        academicParent.childNodes[i].childNodes[5].childNodes[1].value.trim();

      if (
        degreeCertificate &&
        qualifications &&
        institute &&
        boardUniversity &&
        year &&
        percentageCgpa
      ) {
        _academicQualifications.push({
          degreeCertificate,
          qualifications,
          institute,
          boardUniversity,
          year,
          percentageCgpa,
        });
        academicUpdateCount++;
      }
    }

    if (academicUpdateCount > 0)
      body = {
        academicQualifications: _academicQualifications,
        ...body,
      };

    //

    //experience

    const experienceParent = document.getElementById("experience");
    let _workExperience = [],
      experienceUpdateCount = 0;

    for (let i = 0; i < experienceParent.childNodes.length; i++) {
      const company =
        experienceParent.childNodes[i].childNodes[0].childNodes[1].value.trim();
      const role =
        experienceParent.childNodes[i].childNodes[1].childNodes[1].value.trim();
      const year =
        experienceParent.childNodes[i].childNodes[2].childNodes[1].value.trim();

      if (company && role && year) {
        _workExperience.push({ company, role, year });
        experienceUpdateCount++;
      }
    }

    if (experienceUpdateCount > 0)
      body = {
        workExperience: _workExperience,
        ...body,
      };

    //

    if (Object.keys(body).length)
      try {
        await HTTP.post(
          "/manager/user/add",
          {
            data: body,
            sendcredentials: sendcredentialsRef.current.checked,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        props.fetchUsers();

        alert("user added successfully");
        document.getElementById("add-submit").removeAttribute("disabled");

        props.closePopUp();
      } catch (e) {
        if (e.response) alert(e.response.data.message);
        else alert("an error occured");
        document.getElementById("add-submit").removeAttribute("disabled");
      }
  };

  //   const SocialTemplate = () => {
  //     return (
  //       <Fragment>
  //         <div className={style["content"]}>
  //           <div className={style["item"]}>
  //             <label htmlFor="title">{">> "}Title</label>
  //             <input name="title" required />
  //           </div>
  //           <div className={style["item"]}>
  //             <label htmlFor="url">Link</label>
  //             <input name="url" required />
  //           </div>
  //         </div>
  //         <div className={style["close"]}>remove</div>
  //       </Fragment>
  //     );
  //   };

  return (
    <Fragment>
      {
        <div className={style["container"]}>
          <div className={style["actions"]}>
            <label htmlFor="sendcredentials">Send credentils</label>
            <input
              ref={sendcredentialsRef}
              type="checkbox"
              id="sendcredentials"
              name="sendcredentials"
            />
          </div>
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
                <label htmlFor="email">Email</label>{" "}
                <input type="text" name="email" ref={emailRef} required />
              </div>
              <div className={style["item"]}>
                <label htmlFor="password">Password</label>{" "}
                <input
                  type="password"
                  name="password"
                  ref={passwordRef}
                  required
                />
              </div>
              <div className={style["item"]}>
                <label htmlFor="role">Role</label>{" "}
                <input type="text" name="role" ref={roleRef} required />
              </div>
              <div className={style["item"]}>
                <label htmlFor="dob">DOB</label>{" "}
                <input type="date" name="dob" ref={dobRef} required />
              </div>
              <div className={style["item"]}>
                <label htmlFor="gender">Gender</label>{" "}
                <select name="gender" ref={genderRef} required>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="transsexual">transsexual</option>
                </select>
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
              <div className={style["item"]}>
                <label htmlFor="address">Address</label>{" "}
                <input type="text" name="address" ref={addressRef} required />
              </div>
            </div>
            <div className={style["title"]}>
              <div>Social</div>
              <button title="add new social field">+</button>
            </div>
            <div className={style["block2"]} id="social">
              <div className={style["block"]}>
                <div className={style["item"]}>
                  <label htmlFor="title">{">> "}Title</label>
                  <input name="title" required />
                </div>
                <div className={style["item"]}>
                  <label htmlFor="url">Link</label>
                  <input name="url" required />
                </div>
              </div>
              {/* <div className={style["field"]}>
              </div> */}
            </div>
            <div className={style["title"]}>Academic Qualifications</div>
            <div className={style["block2"]} id="academic">
              <div className={style["block"]}>
                <div className={style["item"]}>
                  <label htmlFor="degree">{">> "}Degree/Certificate</label>
                  <input name="degree" required />
                </div>
                <div className={style["item"]}>
                  <label htmlFor="qualifications">Qualifications</label>
                  <input name="qualifications" required />
                </div>
                <div className={style["item"]}>
                  <label htmlFor="institute">Institute</label>
                  <input name="institute" required />
                </div>
                <div className={style["item"]}>
                  <label htmlFor="boardUniversity">Board/University</label>
                  <input name="boardUniversity" required />
                </div>
                <div className={style["item"]}>
                  <label htmlFor="year">Year</label>
                  <input name="year" required />
                </div>
                <div className={style["item"]}>
                  <label htmlFor="percentageCgpa">Percentage/Cgpa</label>
                  <input name="percentageCgpa" required />
                </div>
              </div>
            </div>
            <div className={style["title"]}>Work Experience</div>
            <div className={style["block2"]} id="experience">
              <div className={style["block"]}>
                <div className={style["item"]}>
                  <label htmlFor="company"> {">> "}Company</label>
                  <input name="company" required />
                </div>
                <div className={style["item"]}>
                  <label htmlFor="role">Role</label>
                  <input name="role" required />
                </div>
                <div className={style["item"]}>
                  <label htmlFor="year">Year</label>
                  <input name="year" required />
                </div>
              </div>
            </div>
            <button type="submit" id="add-submit">
              Submit
            </button>
          </form>
        </div>
      }
    </Fragment>
  );
};

export default AddUser;
