(() => {
  const data = window.examData || { students: [], sessions: [], classrooms: [] };

  const getSession = (id) => data.sessions.find((session) => session.id === id);

  const formatDate = (isoDate) => {
    if (!isoDate) return "TBD";
    const date = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(date.getTime())) return isoDate;
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const formatTimeRange = (session) =>
    session?.start && session?.end ? `${session.start} – ${session.end}` : "To be announced";

  const renderEmpty = (target, message) => {
    if (!target) return;
    target.innerHTML = `<div class="muted-card">${message}</div>`;
  };

  const renderStudentResult = (student) => {
    const target = document.querySelector("[data-student-output]");
    if (!target) return;
    if (!student) {
      renderEmpty(target, "We could not find that enrollment number. Please try again.");
      return;
    }

    const sessionMarkup = student.sessions
      .map((sessionId) => getSession(sessionId))
      .filter(Boolean)
      .map(
        (session) => `
        <li class="session-row">
          <div>
            <p class="session-title">${session.subject}</p>
            <p class="session-meta">${formatDate(session.date)} · ${formatTimeRange(session)}</p>
          </div>
          <div class="session-room">
            <span class="badge">${session.classroom}</span>
            <p class="session-meta">${session.invigilator}</p>
          </div>
        </li>`
      )
      .join("") || "<li class=\"session-row\">No scheduled exams yet.</li>";

    target.innerHTML = `
      <div class="result-card">
        <header>
          <h3>${student.name}</h3>
          <p>${student.branch} · ${student.year}</p>
          <p>Roll no. ${student.roll}</p>
          <p>Seat Row ${student.row}, Seat ${student.seat}</p>
        </header>
        <h4>Upcoming exams</h4>
        <ul class="session-list">
          ${sessionMarkup}
        </ul>
      </div>`;
  };

  const uniqueValues = (list) => Array.from(new Set(list));

  const populateBranchOptions = () => {
    const select = document.querySelector("[data-branch-select]");
    if (!select) return;
    const options = uniqueValues(data.sessions.map((session) => session.branchCode));
    select.innerHTML =
      '<option value="">Select branch</option>' +
      options
        .map((code) => {
          const session = data.sessions.find((item) => item.branchCode === code);
          return `<option value="${code}">${session?.branch ?? code}</option>`;
        })
        .join("");
  };

  const populateYearOptions = () => {
    const branchSelect = document.querySelector("[data-branch-select]");
    const yearSelect = document.querySelector("[data-year-select]");
    if (!branchSelect || !yearSelect) return;

    const selectedBranch = branchSelect.value;
    const filtered = selectedBranch
      ? data.sessions.filter((session) => session.branchCode === selectedBranch)
      : data.sessions;
    const years = uniqueValues(filtered.map((session) => session.year));

    yearSelect.innerHTML =
      '<option value="">Select year</option>' +
      years.map((year) => `<option value="${year}">${year}</option>`).join("");
  };

  const renderBranchResult = (payload) => {
    const target = document.querySelector("[data-branch-output]");
    if (!target) return;

    if (!payload.sessions.length) {
      renderEmpty(
        target,
        "No schedule found for the selected branch/year combination. Try another filter."
      );
      return;
    }

    const studentList = payload.students
      .map(
        (student) => `
        <li>
          <strong>${student.name}</strong>
          <span>Roll ${student.roll}</span>
          <span>Row ${student.row}, Seat ${student.seat}</span>
        </li>`
      )
      .join("");

    const sessionList = payload.sessions
      .map(
        (session) => `
        <li class="session-row">
          <div>
            <p class="session-title">${session.subject}</p>
            <p class="session-meta">${formatDate(session.date)} · ${formatTimeRange(session)}</p>
          </div>
          <div class="session-room">
            <span class="badge">${session.classroom}</span>
            <p class="session-meta">${session.invigilator}</p>
          </div>
        </li>`
      )
      .join("");

    target.innerHTML = `
      <div class="result-card">
        <header>
          <h3>${payload.branchName}</h3>
          <p>${payload.year}</p>
        </header>
        <h4>Exam slots</h4>
        <ul class="session-list">${sessionList}</ul>
        <h4 class="mt">Students mapped to this slot</h4>
        <ul class="student-list">${studentList}</ul>
      </div>`;
  };

  const populateClassrooms = () => {
    const select = document.querySelector("[data-classroom-select]");
    if (!select) return;
    select.innerHTML =
      '<option value="">Select classroom</option>' +
      data.classrooms.map((cls) => `<option value="${cls.id}">${cls.id}</option>`).join("");
  };

  const renderClassroomResult = (payload) => {
    const target = document.querySelector("[data-classroom-output]");
    if (!target) return;
    if (!payload.classroom) {
      renderEmpty(target, "Choose a classroom to see its schedule.");
      return;
    }

    if (!payload.sessions.length) {
      renderEmpty(target, `No exams scheduled in ${payload.classroom.id}.`);
      return;
    }

    const sessionList = payload.sessions
      .map(
        (session) => `
        <li class="session-row">
          <div>
            <p class="session-title">${session.subject}</p>
            <p class="session-meta">${session.branch} · ${session.year}</p>
            <p class="session-meta">${formatDate(session.date)} · ${formatTimeRange(session)}</p>
          </div>
          <div class="session-room">
            <p class="session-meta">${session.invigilator}</p>
          </div>
        </li>`
      )
      .join("");

    const studentList = payload.students
      .map(
        (student) => `
        <li>
          ${student.name}
          <span>(${student.branch}, ${student.year})</span>
          <span>Row ${student.row} · Seat ${student.seat}</span>
        </li>`
      )
      .join("");

    target.innerHTML = `
      <div class="result-card">
        <header>
          <h3>Classroom ${payload.classroom.id}</h3>
          <p>${payload.classroom.location}</p>
          <p>Capacity ${payload.classroom.capacity}</p>
        </header>
        <h4>Schedule</h4>
        <ul class="session-list">${sessionList}</ul>
        <h4 class="mt">Students currently assigned</h4>
        <ul class="student-list">${studentList}</ul>
      </div>`;
  };

  const handleStudentForm = () => {
    const form = document.querySelector("[data-student-form]");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const roll = formData.get("rollno")?.trim();
      if (!roll) {
        renderEmpty(document.querySelector("[data-student-output]"), "Enter an enrollment number.");
        return;
      }
      const student = data.students.find(
        (entry) => entry.roll.toLowerCase() === roll.toLowerCase()
      );
      renderStudentResult(student);
    });
  };

  const handleBranchForm = () => {
    const form = document.querySelector("[data-branch-form]");
    const branchSelect = document.querySelector("[data-branch-select]");
    const yearSelect = document.querySelector("[data-year-select]");
    if (!form || !branchSelect || !yearSelect) return;

    branchSelect.addEventListener("change", populateYearOptions);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const branchCode = branchSelect.value;
      const year = yearSelect.value;
      if (!branchCode || !year) {
        renderEmpty(
          document.querySelector("[data-branch-output]"),
          "Pick both branch and year to see the timetable."
        );
        return;
      }
      const sessions = data.sessions.filter(
        (session) => session.branchCode === branchCode && session.year === year
      );
      const students = data.students.filter(
        (student) => student.branchCode === branchCode && student.year === year
      );
      renderBranchResult({
        sessions,
        students,
        branchName: sessions[0]?.branch ?? branchCode,
        year
      });
    });
  };

  const handleClassroomForm = () => {
    const form = document.querySelector("[data-classroom-form]");
    const select = document.querySelector("[data-classroom-select]");
    if (!form || !select) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const roomId = select.value;
      if (!roomId) {
        renderEmpty(document.querySelector("[data-classroom-output]"), "Select a classroom first.");
        return;
      }
      const classroom = data.classrooms.find((cls) => cls.id === roomId);
      const sessions = data.sessions.filter((session) => session.classroom === roomId);
      const sessionIds = sessions.map((session) => session.id);
      const students = data.students.filter((student) =>
        student.sessions.some((sessionId) => sessionIds.includes(sessionId))
      );
      renderClassroomResult({ classroom, sessions, students });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    populateBranchOptions();
    populateYearOptions();
    populateClassrooms();
    handleStudentForm();
    handleBranchForm();
    handleClassroomForm();
  });
})();

