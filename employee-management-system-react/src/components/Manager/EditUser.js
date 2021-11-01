import { Fragment, useEffect, useRef, useState } from "react";
import { HTTP } from "../../packages/axios";
import style from "./EditUser.module.css";

const EditUser = (props) => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const roleRef = useRef();
  const dobRef = useRef(new Date());
  const genderRef = useRef();
  const phoneNumberRef = useRef();
  const addressRef = useRef();

  const [socialFields, setSocialsFields] = useState([]);

  const [academicFields, setAcademicFields] = useState([]);

  const [experienceFields, setExperienceFields] = useState([]);

  useEffect(() => {
    if (props.user) {
      firstNameRef.current.value = props.user.firstName;
      lastNameRef.current.value = props.user.lastName;
      emailRef.current.value = props.user.email;
      roleRef.current.value = props.user.role;
      genderRef.current.value = props.user.gender;
      dobRef.current.value = props.user.dob.slice(0, 10);
      phoneNumberRef.current.value = props.user.phoneNumber;
      addressRef.current.value = props.user.address;

      let _social = [];
      props.user.social.forEach((e, i) => {
        _social.push(
          <Fragment>
            <div className={style["content"]}>
              <div className={style["item"]}>
                <label htmlFor="title">{">> "}Title</label>
                <input name="title" defaultValue={e.title} required />
              </div>
              <div className={style["item"]}>
                <label htmlFor="url">Link</label>
                <input name="url" defaultValue={e.url} required />
              </div>
            </div>
            {i !== 0 && (
              <div
                className={style["close"]}
                onClick={socialFieldRemoveHandler}
              >
                remove
              </div>
            )}
          </Fragment>
        );
      });
      setSocialsFields(_social);

      let _academic = [];
      props.user.academicQualifications.forEach((e, i) => {
        _academic.push(
          <Fragment>
            <div key={e._id} className={style["content"]}>
              <div className={style["item"]}>
                <label htmlFor="degree">{">> "}Degree/Certificate</label>
                <input
                  name="degree"
                  defaultValue={e.degreeCertificate}
                  required
                />
              </div>
              <div className={style["item"]}>
                <label htmlFor="qualifications">Qualifications</label>
                <input
                  name="qualifications"
                  defaultValue={e.qualifications}
                  required
                />
              </div>
              <div className={style["item"]}>
                <label htmlFor="institute">Institute</label>
                <input name="institute" defaultValue={e.institute} required />
              </div>
              <div className={style["item"]}>
                <label htmlFor="boardUniversity">Board/University</label>
                <input
                  name="boardUniversity"
                  defaultValue={e.boardUniversity}
                  required
                />
              </div>
              <div className={style["item"]}>
                <label htmlFor="year">Year</label>
                <input name="year" defaultValue={e.year} required />
              </div>
              <div className={style["item"]}>
                <label htmlFor="percentageCgpa">Percentage/Cgpa</label>
                <input
                  name="percentageCgpa"
                  defaultValue={e.percentageCgpa}
                  required
                />
              </div>
            </div>
            {i !== 0 && (
              <div
                className={style["close"]}
                onClick={academicFieldRemoveHandler}
              >
                remove
              </div>
            )}
          </Fragment>
        );
      });
      setAcademicFields(_academic);

      let _experience = [];
      props.user.workExperience.forEach((e, i) => {
        _experience.push(
          <Fragment>
            <div key={e._id} className={style["content"]}>
              <div className={style["item"]}>
                <label htmlFor="company"> {">> "}Company</label>
                <input name="company" defaultValue={e.company} required />
              </div>
              <div className={style["item"]}>
                <label htmlFor="role">Role</label>
                <input name="role" defaultValue={e.role} required />
              </div>
              <div className={style["item"]}>
                <label htmlFor="year">Year</label>
                <input name="year" defaultValue={e.year} required />
              </div>
            </div>
            {i !== 0 && (
              <div
                className={style["close"]}
                onClick={experienceFieldRemoveHandler}
              >
                remove
              </div>
            )}
          </Fragment>
        );
      });
      setExperienceFields(_experience);
    }
  }, [props.user]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    document.getElementById("update-submit").disabled = "true";

    let updates = {};

    if (
      firstNameRef.current.value.trim() &&
      firstNameRef.current.value !== props.user.firstName
    )
      updates = {
        firstName: firstNameRef.current.value,
      };

    if (
      lastNameRef.current.value.trim() &&
      lastNameRef.current.value !== props.user.lastName
    )
      updates = {
        lastName: lastNameRef.current.value,
        ...updates,
      };

    if (
      emailRef.current.value.trim() &&
      emailRef.current.value !== props.user.email
    )
      updates = {
        email: emailRef.current.value,
        ...updates,
      };

    if (
      roleRef.current.value.trim() &&
      roleRef.current.value !== props.user.role
    )
      updates = {
        role: roleRef.current.value,
        ...updates,
      };

    if (
      dobRef.current.value.trim() &&
      dobRef.current.value !== props.user.dob.slice(0, 10)
    )
      updates = {
        dob: dobRef.current.value,
        ...updates,
      };

    if (
      genderRef.current.value.trim() &&
      genderRef.current.value !== props.user.gender
    )
      updates = {
        gender: genderRef.current.value,
        ...updates,
      };

    if (
      phoneNumberRef.current.value.trim() &&
      phoneNumberRef.current.value !== props.user.phoneNumber
    )
      updates = {
        phoneNumber: phoneNumberRef.current.value,
        ...updates,
      };

    if (
      addressRef.current.value.trim() &&
      addressRef.current.value !== props.user.address
    )
      updates = {
        address: addressRef.current.value,
        ...updates,
      };

    //social

    const socialsParent = document.getElementById("social");
    let _social = [],
      socialUpdateCount = 0;

    for (let i = 0; i < socialsParent.childNodes.length; i++) {
      const title =
        socialsParent.childNodes[
          i
        ].childNodes[0].childNodes[0].childNodes[1].value.trim();
      const url =
        socialsParent.childNodes[
          i
        ].childNodes[0].childNodes[1].childNodes[1].value.trim();

      if (props.user.social.length !== socialsParent.childNodes.length) {
        _social.push({ title, url });
        socialUpdateCount++;
      } else if (props.user.social[i]) {
        if (
          props.user.social[i].title !== title ||
          props.user.social[i].url !== url
        ) {
          _social.push({ title, url });
          socialUpdateCount++;
        } else {
          _social.push({
            title,
            url,
          });
        }
      }
    }

    if (socialUpdateCount > 0)
      updates = {
        social: _social,
        ...updates,
      };

    //

    //academic

    const academicParent = document.getElementById("academic");
    let _academicQualifications = [],
      academicUpdateCount = 0;

    for (let i = 0; i < academicParent.childNodes.length; i++) {
      const degreeCertificate =
        academicParent.childNodes[
          i
        ].childNodes[0].childNodes[0].childNodes[1].value.trim();
      const qualifications =
        academicParent.childNodes[
          i
        ].childNodes[0].childNodes[1].childNodes[1].value.trim();
      const institute =
        academicParent.childNodes[
          i
        ].childNodes[0].childNodes[2].childNodes[1].value.trim();
      const boardUniversity =
        academicParent.childNodes[
          i
        ].childNodes[0].childNodes[3].childNodes[1].value.trim();
      const year =
        academicParent.childNodes[
          i
        ].childNodes[0].childNodes[4].childNodes[1].value.trim();
      const percentageCgpa =
        academicParent.childNodes[
          i
        ].childNodes[0].childNodes[5].childNodes[1].value.trim();

      if (
        props.user.academicQualifications.length !==
        academicParent.childNodes.length
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
      } else if (props.user.academicQualifications[i]) {
        if (
          props.user.academicQualifications[i].degreeCertificate !==
            degreeCertificate ||
          props.user.academicQualifications[i].qualifications !==
            qualifications ||
          props.user.academicQualifications[i].institute !== institute ||
          props.user.academicQualifications[i].boardUniversity !==
            boardUniversity ||
          props.user.academicQualifications[i].year !== year ||
          props.user.academicQualifications[i].percentageCgpa !== percentageCgpa
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
        } else {
          _academicQualifications.push({
            degreeCertificate,
            qualifications,
            institute,
            boardUniversity,
            year,
            percentageCgpa,
          });
        }
      }
    }

    if (academicUpdateCount > 0)
      updates = {
        academicQualifications: _academicQualifications,
        ...updates,
      };

    //

    //experience

    const experienceParent = document.getElementById("experience");
    let _workExperience = [],
      experienceUpdateCount = 0;

    for (let i = 0; i < experienceParent.childNodes.length; i++) {
      const company =
        experienceParent.childNodes[
          i
        ].childNodes[0].childNodes[0].childNodes[1].value.trim();
      const role =
        experienceParent.childNodes[
          i
        ].childNodes[0].childNodes[1].childNodes[1].value.trim();
      const year =
        experienceParent.childNodes[
          i
        ].childNodes[0].childNodes[2].childNodes[1].value.trim();

      if (
        props.user.workExperience.length !== experienceParent.childNodes.length
      ) {
        _workExperience.push({
          company,
          role,
          year,
        });
        experienceUpdateCount++;
      } else if (props.user.workExperience[i]) {
        if (
          props.user.workExperience[i].company !== company ||
          props.user.workExperience[i].role !== role ||
          props.user.workExperience[i].year !== year
        ) {
          _workExperience.push({
            company,
            role,
            year,
          });
          experienceUpdateCount++;
        } else {
          _workExperience.push({
            company,
            role,
            year,
          });
        }
      }
    }

    if (experienceUpdateCount > 0)
      updates = {
        workExperience: _workExperience,
        ...updates,
      };

    //

    if (Object.keys(updates).length)
      try {
        await HTTP.patch(
          "/manager/user/manage",
          { updates, uId: props.user._id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        props.fetchUsers();

        alert("updates successfully");
      } catch (e) {
        if (e.response) alert(e.response.data.message);
        else alert("an error occured");
      }

    document.getElementById("update-submit").removeAttribute("disabled");
  };

  const socialFieldRemoveHandler = (e) => {
    const parent = document.getElementById("social");

    const el = document.getElementById(e.target.parentNode.id);
    parent.removeChild(el);
  };

  const academicFieldRemoveHandler = (e) => {
    const parent = document.getElementById("academic");

    const el = document.getElementById(e.target.parentNode.id);
    parent.removeChild(el);
  };

  const experienceFieldRemoveHandler = (e) => {
    const parent = document.getElementById("experience");

    const el = document.getElementById(e.target.parentNode.id);
    parent.removeChild(el);
  };

  const socialFieldAddHandler = () => {
    setSocialsFields((prevs) => {
      return [
        ...prevs,
        <Fragment>
          <div className={style["content"]}>
            <div className={style["item"]}>
              <label htmlFor="title">{">> "}Title</label>
              <input name="title" required />
            </div>
            <div className={style["item"]}>
              <label htmlFor="url">Link</label>
              <input name="url" required />
            </div>
          </div>
          <div className={style["close"]} onClick={socialFieldRemoveHandler}>
            remove
          </div>
        </Fragment>,
      ];
    });
  };

  const academicFieldAddHandler = () => {
    setAcademicFields((prevs) => {
      return [
        ...prevs,
        <Fragment>
          <div className={style["content"]}>
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
          <div className={style["close"]} onClick={academicFieldRemoveHandler}>
            remove
          </div>
        </Fragment>,
      ];
    });
  };

  const experienceFieldAddHandler = () => {
    setExperienceFields((prevs) => {
      return [
        ...prevs,
        <Fragment>
          <div className={style["content"]}>
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
          <div
            className={style["close"]}
            onClick={experienceFieldRemoveHandler}
          >
            remove
          </div>
        </Fragment>,
      ];
    });
  };

  return (
    <Fragment>
      {props.user && (
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
                <label htmlFor="email">Email</label>{" "}
                <input type="text" name="email" ref={emailRef} required />
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
              <button
                title="add new social field"
                onClick={() => {
                  socialFieldAddHandler();
                }}
                type="button"
              >
                +
              </button>
            </div>
            <div className={style["block2"]} id="social">
              {socialFields.map((el, i) => {
                return (
                  <div key={i} className={style["field"]} id={`social${i}`}>
                    {el}
                  </div>
                );
              })}
            </div>
            <div className={style["title"]}>
              <div>Academic Qualifications </div>
              <button
                title="add new academic field"
                onClick={() => {
                  academicFieldAddHandler();
                }}
                type="button"
              >
                +
              </button>
            </div>
            <div className={style["block2"]} id="academic">
              {academicFields.map((el, i) => {
                return (
                  <div key={i} className={style["field"]} id={`academic${i}`}>
                    {el}
                  </div>
                );
              })}
            </div>
            <div className={style["title"]}>
              <div>Work Experience </div>
              <button
                title="add new experience field"
                onClick={() => {
                  experienceFieldAddHandler();
                }}
                type="button"
              >
                +
              </button>
            </div>
            <div className={style["block2"]} id="experience">
              {experienceFields.map((el, i) => {
                return (
                  <div key={i} className={style["field"]} id={`experience${i}`}>
                    {el}
                  </div>
                );
              })}
            </div>
            <button type="submit" id="update-submit">
              Update
            </button>
          </form>
        </div>
      )}
      {!props.user && <div>Loading....</div>}
    </Fragment>
  );
};

export default EditUser;
