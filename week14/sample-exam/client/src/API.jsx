const SERVER_HOST = "http://localhost";
const SERVER2_HOST = "http://localhost";
const SERVER_PORT = 3001;
const SERVER2_PORT = 3002;

const SERVER_BASE = `${SERVER_HOST}:${SERVER_PORT}/api/`;
const SERVER2_BASE = `${SERVER2_HOST}:${SERVER2_PORT}/api/`;

/**
 * Generic API call
 *
 * @param endpoint API endpoint string to fetch
 * @param method HTTP method
 * @param body HTTP request body string
 * @param headers additional HTTP headers to be passed to 'fetch'
 * @param expectResponse wheter to expect a non-empty response body
 * 
 * @returns whatever the specified API endpoint returns
 */
const APICall = async (endpoint, method = "GET", body = undefined, headers = undefined, expectResponse = true, server_base_url = SERVER_BASE) => {
  let errors = [];

  try {
    const response = await fetch(new URL(endpoint, server_base_url), {
        method,
        body,
        headers,
        credentials: "include"
    });

    if (response.ok) {
      if (expectResponse) return await response.json();
    }
    else errors = (await response.json()).errors;
  } catch {
    const err = ["Failed to contact the server"];
    throw err;
  }

  if (errors.length !== 0)
    throw errors;
};

/**
 * Fetches all the courses from the server
 *
 * @returns list of courses
 */
const fetchCourses = async () => await APICall("courses");

/**
 * Fetches the number of enrolled student for each course from the server
 *
 * @returns an object like: {course_code1: num_students1, course_code2: num_students2, ...}.
 *          Courses that do not appear in this object have no enrolled students
 */
const fetchNumStudents = async () => await APICall("courses?filter=enrolled");

const deleteStudyPlan = async () => await APICall(
  "study-plan",
  "DELETE",
  undefined,
  undefined,
  false
);

const createStudyPlan = async (fullTime, courses) => await APICall(
  "study-plan",
  "POST",
  JSON.stringify({fullTime, courses}),
  { "Content-Type": "application/json" },
  false
);

const editStudyPlan = async (add, rem) => await APICall(
  "study-plan-modifications",
  "POST",
  JSON.stringify({add, rem}),
  { "Content-Type": "application/json" },
  false
);

/**
 * Attempts to login the student
 * 
 * @param email email of the student
 * @param password password of the student
 */
const login = async (email, password) => await APICall(
  "session",
  "POST",
  JSON.stringify({username: email, password}),
  { "Content-Type": "application/json" }
);

/**
 * Logout.
 * This function can return a "Not authenticated" error if the student wasn't authenticated beforehand
 */
const logout = async () => await APICall(
  "session",
  "DELETE",
  undefined,
  undefined,
  false
);

/**
 * Fetches the currently logged in student's info
 */
const fetchCurrentStudent = async () => await APICall("session/current");


/**
 * Fetches the token to access the second server
 */
const getAuthToken = async () => await APICall(
  "auth-token",
  "GET",
  undefined,
  undefined,
  true
);


/**
 * Fetches the info from the second server, using an authorization token
 */
const getStats = async (authToken, courses) => await APICall(
  "stats",
  "POST",
  JSON.stringify({courses: courses}),
  { "Content-Type": "application/json",
    "Authorization": `Bearer ${authToken}`,
   },
  true,
  SERVER2_BASE
);


const API = {
  fetchCourses,
  fetchNumStudents,
  deleteStudyPlan,
  createStudyPlan,
  editStudyPlan,
  login,
  logout,
  fetchCurrentStudent,
  getAuthToken,
  getStats,
};

export { API };
