
# Exam-Seating-Arrangement-System
**I had created this project as my Web Engineering Project in 5th Semester.**
<br/>
<br/>
During exam period it is very hectic task to find out where is your examination hall and which seat would allocate 
to a perticular student.This is a web application developed to help students to find out their respective examination hall during semester exam.
This would also shows the respective seat of a student in a perticular row and also the schedule of their examination.

It is an application in which you can search your roll number to find out your examination classroom.If you want to know about your complete class then this facility is also available you just have to search your class , year and branch.
You can also enter examination hall number to see which class is allocated to which class.

This one is develop using HTML , bootstrap and LAMP(Linux, Apache, MySQL, PHP).

Some changes could be done here to make it more reliable and more automatic like sending a message to students about their examination hall and timetable etc.

## Getting Started

1. Install a local web server stack (XAMPP/WAMP/LAMP).
2. Move/clone this repository into your web root (e.g. `C:\xampp\htdocs\ExamSeatingArrange-website`).
3. Configure database credentials via environment variables (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`) or edit `config.php` defaults.
4. Create a MySQL database named `trial` and import the SQL schemas from `sqlfile/`.
5. Browse to `http://localhost/ExamSeatingArrange-website/firstpageresponse.php` for the student UI or `adminloginde.php` for the admin portal (default credentials `user/user` – change immediately).

### PDF Export

- Classroom seating pages now include a **Download PDF** button that uses `generate_classroom_pdf.php` to export seats, timings and optional invigilator notes per hall. Enter the hall via `Classroom` search, review the layout, then click the button to get a printable file.
- For a lightweight showcase without PHP/MySQL, open `static-html/index.html`. Sample data for the static mode lives in `static-html/assets/sample-data.js`.

