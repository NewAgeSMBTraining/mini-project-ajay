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

    for (let i = 0; i < social.length; i++) {
      const title =
        socialsParent.childNodes[i].childNodes[0].childNodes[1].value.trim();
      const url =
        socialsParent.childNodes[i].childNodes[1].childNodes[1].value.trim();

      if (
        (title && social[i].title !== title) ||
        (url && social[i].url !== url)
      ) {
        _social.push({ title, url });
        socialUpdateCount++;
      } else _social.push({ title: social[i].title, url: social[i].url });
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

    for (let i = 0; i < academicQualifications.length; i++) {
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
        (degreeCertificate &&
          academicQualifications[i].degreeCertificate !== degreeCertificate) ||
        (qualifications &&
          academicQualifications[i].qualifications !== qualifications) ||
        (institute && academicQualifications[i].institute !== institute) ||
        (boardUniversity &&
          academicQualifications[i].boardUniversity !== boardUniversity) ||
        (year && academicQualifications[i].year !== year) ||
        (percentageCgpa &&
          academicQualifications[i].percentageCgpa !== percentageCgpa)
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
      } else
        _social.push({
          degreeCertificate: academicQualifications.degreeCertificate,
          qualifications: academicQualifications.qualifications,
          institute: academicQualifications.institute,
          boardUniversity: academicQualifications.boardUniversity,
          year: academicQualifications.year,
          percentageCgpa: academicQualifications.percentageCgpa,
        });
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

    for (let i = 0; i < workExperience.length; i++) {
      const company =
        experienceParent.childNodes[i].childNodes[0].childNodes[1].value.trim();
      const role =
        experienceParent.childNodes[i].childNodes[1].childNodes[1].value.trim();
      const year =
        experienceParent.childNodes[i].childNodes[2].childNodes[1].value.trim();

      if (
        (company && workExperience[i].company !== company) ||
        (role && workExperience[i].role !== role) ||
        (year && workExperience[i].year !== year)
      ) {
        _workExperience.push({ company, role, year });
        experienceUpdateCount++;
      } else
        _workExperience.push({
          company: workExperience[i].company,
          role: workExperience[i].role,
          year: workExperience[i].year,
        });
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
            <div className={style["title"]}>Social</div>
            <div className={style["block2"]} id="social">
              {social.map((s, i) => {
                return (
                  <div key={s._id} className={style["block"]}>
                    <div className={style["item"]}>
                      <label htmlFor="title">{">> "}Title</label>
                      <input name="title" defaultValue={s.title} required />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="url">Link</label>
                      <input name="url" defaultValue={s.url} required />
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
                        required
                      />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="qualifications">Qualifications</label>
                      <input
                        name="qualifications"
                        defaultValue={a.qualifications}
                        required
                      />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="institute">Institute</label>
                      <input
                        name="institute"
                        defaultValue={a.institute}
                        required
                      />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="boardUniversity">Board/University</label>
                      <input
                        name="boardUniversity"
                        defaultValue={a.boardUniversity}
                        required
                      />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="year">Year</label>
                      <input name="year" defaultValue={a.year} required />
                    </div>
                    <div className={style["item"]}>
                      <label htmlFor="percentageCgpa">Percentage/Cgpa</label>
                      <input
                        name="percentageCgpa"
                        defaultValue={a.percentageCgpa}
                        required
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
