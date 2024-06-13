# Exam #1: "Study Plan"
## Student: s500000 ENRICO MASALA 

## React Client Application Routes

- Route `/`: list of courses, accessible by anybody
- Route `/login`: login form. After succest osful login, it redirects to ...
- Route `/studyplan`: list of courses, with study plan (on the right)
- Route `*`: not found page

## API Server

- GET `/api/courses`
- GET `/api/study-plan`   (authenticated)
  - Get full-time flag, + list of courses
- POST `/api/study-plan`  (authenticated)   this is for replacing as well ("editing")
  - Save full-time flag, + list of courses
- DELETE `/api/study-plan`  (authenticated)
- GET `/api/auth-token`    (authenticated)    what is inside the payload ? //TODO

### Authentication APIs

- POST `/api/session`
  - request parameters and request body content
  - response body content
  ...

## API Server2

- GET `/api/stats`



## Database Tables

- Table `users` - (id), name, email, hash, salt, fulltime
- Table `studyplan` - (course_id, user_id)
- Table `courses` - (course_id), name, cfu, maxstudents, mandatory
- Table `incompats` - (course_id, incompat_course_id)

## Main React Components

- `CourseList` (in `List.js`): component purpose and main functionality
- `StudyPlan` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.png)

## Users Credentials

- username, password (plus any other requested info which depends on the text)
- username, password (plus any other requested info which depends on the text)

