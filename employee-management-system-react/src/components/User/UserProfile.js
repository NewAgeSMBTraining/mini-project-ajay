import { Fragment, useEffect } from "react";
import { useRef, useState } from "react/cjs/react.development";
import style from "./UpdateUser.module.css";

const UserProfile = (props) => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const roleRef = useRef();
  const dobRef = useRef(new Date());
  const genderRef = useRef();
  const phoneNumberRef = useRef();
  const addressRef = useRef();
  const [social, setSocial] = useState([]);
  const [academicQualifications, setAcademicQualifications] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);

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
      setSocial(props.user.social);
      setAcademicQualifications(props.user.academicQualifications);
      setWorkExperience(props.user.workExperience);
    }
  }, [props.user]);

  return (
    <Fragment>
      {props.user && (
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
                <label htmlFor="email">Email</label>{" "}
                <input type="text" name="email" ref={emailRef} readOnly />
              </div>
              <div className={style["item"]}>
                <label htmlFor="role">Role</label>{" "}
                <input type="text" name="role" ref={roleRef} readOnly />
              </div>
              <div className={style["item"]}>
                <label htmlFor="dob">DOB</label>{" "}
                <input type="date" name="dob" ref={dobRef} readOnly />
              </div>
              <div className={style["item"]}>
                <label htmlFor="gender">Gender</label>{" "}
                <input type="text" name="gender" ref={genderRef} readOnly />
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
              <div className={style["item"]}>
                <label htmlFor="address">Address</label>{" "}
                <input type="text" name="address" ref={addressRef} readOnly />
              </div>
            </div>
            <div className={style["title"]}>Social</div>
            <div className={style["block2"]} id="social">
              {social.map((s, i) => {
                return (
                  <div key={s._id} className={style["block"]}>
                    <div className={style["item"]}>
                      <label htmlFor="title">{">> "}Title</label>
                      <input name="title" defaultValue={s.title} readOnly />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="url">Link</label>
                      <input name="url" defaultValue={s.url} readOnly />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={style["title"]}>Academic Qualifications</div>
            <div className={style["block2"]} id="academic">
              {academicQualifications.map((a, i) => {
                return (
                  <div key={a._id} className={style["block"]}>
                    <div className={style["item"]}>
                      <label htmlFor="degree">{">> "}Degree/Certificate</label>
                      <input
                        name="degree"
                        defaultValue={a.degreeCertificate}
                        readOnly
                      />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="qualifications">Qualifications</label>
                      <input
                        name="qualifications"
                        defaultValue={a.qualifications}
                        readOnly
                      />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="institute">Institute</label>
                      <input
                        name="institute"
                        defaultValue={a.institute}
                        readOnly
                      />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="boardUniversity">Board/University</label>
                      <input
                        name="boardUniversity"
                        defaultValue={a.boardUniversity}
                        readOnly
                      />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="year">Year</label>
                      <input name="year" defaultValue={a.year} readOnly />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="percentageCgpa">Percentage/Cgpa</label>
                      <input
                        name="percentageCgpa"
                        defaultValue={a.percentageCgpa}
                        readOnly
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={style["title"]}>Work Experience</div>
            <div className={style["block2"]} id="experience">
              {workExperience.map((e, i) => {
                return (
                  <div key={e._id} className={style["block"]}>
                    <div className={style["item"]}>
                      <label htmlFor="company"> {">> "}Company</label>
                      <input name="company" defaultValue={e.company} readOnly />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="role">Role</label>
                      <input name="role" defaultValue={e.role} readOnly />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="year">Year</label>
                      <input name="year" defaultValue={e.year} readOnly />
                    </div>
                  </div>
                );
              })}
            </div>
          </form>
        </div>
      )}
      {!props.user && <div>Loading....</div>}
    </Fragment>
  );
};

export default UserProfile;
