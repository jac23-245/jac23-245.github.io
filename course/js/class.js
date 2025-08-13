

const class_show_loader = document.getElementById('class_loaders');
const class_table = document.getElementById('class_list');

window.addEventListener("DOMContentLoaded", function () {
    updateClassTable();
});


function setDefaultDateToCourseStartDate() {
    // Get the date input element
    const dateInput = document.getElementById('add_start_date');

    // Create a new date object for today
    const today = new Date();

    // Format the date as YYYY-MM-DD
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    // Set the value of the date input
    dateInput.value = formattedDate;
}




function showClass(classs) {
    let tr = ""
    for (let i = 0; i < classs.length; i++) {
        tr += "<tr>";
        tr += "<td>" + classs[i].class_id + "</td>";
        tr += "<td>" + classs[i].teacher_name + "</td>";
        tr += "<td>" + classs[i].course_name + "</td>";
        tr += "<td>" + classs[i].start_date + "</td>";
        tr += "<td>" + classs[i].end_date + "</td>";
        tr += "<td><button onClick='showStudents(" + classs[i].class_id + ")' class='btn btn-primary'>" + classs[i].total_students + "</button></td>";
        tr += "<td>" + returnStatus(classs[i].status) + "</td>";
        tr += "<td>" + `<button class='btn btn-primary mx-1' data-bs-toggle="offcanvas"   data-bs-target="#add_student_convas" onclick="addstudent(${classs[i].class_id})" data-lang="lbl_add_students">Add Student</button>` + `<button class='btn btn-success mx-1' data-bs-toggle="offcanvas"  data-bs-target="#edit_class_convas" onclick="getdateclass(${classs[i].class_id},'${classs[i].teacher_id}' ,'${classs[i].course_id}' ,'${classs[i].start_date}' ,'${classs[i].status}',)" data-lang="lbl_edit">Edit</button>` + `<button class='btn btn-danger mx-1' onClick="deleteClasses(${classs[i].class_id})" data-lang="lbl_delete">Delete</button>` + "</td>";
        tr += "</tr>";
    }
    class_table.innerHTML = tr;



}

function returnStatus(status) {
    if (status == "pending") {
        return '<span class="badge bg-warning" data-lang="lbl_class_pending">Pending</span>';
    } else if (status == "in_progress") {
        return '<span class="badge bg-primary" data-lang="lbl_class_in_progress">In-progress</span>';
    } else if (status == "completed") {
        return '<span class="badge bg-success" data-lang="lbl_class_completed">Completed</span>';
    }
}


// add class inputs//

function saveClasses() {

    const teacher = document.getElementById('add_select_teacher');
    const course = document.getElementById('add_select_course');
    const start_date = document.getElementById('add_start_date');
    const status = document.getElementById('add_status');

    const add_button = document.getElementById('add_button');
    const add_spinner = document.getElementById('add_spinner');

    add_button.disabled = true;
    add_spinner.classList.remove("d-none");

    fetch('' + API_URL + '/class.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            teacher: teacher.value,
            course: course.value,
            start_date: start_date.value,
            status: status.value,
        })
    })
        .then(response => response.json())
        .then(data => {

            add_button.disabled = false;
            add_spinner.classList.add("d-none");

            teacher.value = '';
            course.value = '';
            start_date.value = '';
            status.value = '';

            getAlertMessage("lbl_class_added","lbl_good_job",'alert','success');
            updateClassTable();

        })
        .catch((error) => {
            console.error('Error:', error);
            add_button.disabled = false;
            add_spinner.classList.add("d-none");
            getAlertMessage("lbl_class_not_added","lbl_sorry",'alert','waring');
        });

}

let add_btn = document.getElementById("add_button");
add_btn.addEventListener('click', function (event) {
    event.preventDefault();
    const teacher = document.getElementById("add_select_teacher").value.trim();
    const course = document.getElementById("add_select_course").value.trim();

    if (!teacher || !course) {


        if (!course) {
             getAlertMessage("lbl_course_required");
        }


        if (!teacher) {
             getAlertMessage("lbl_teacher_required");
        }


    } else {
        saveClasses()


    }
});


function saveStudent() {

    const name = document.getElementById('add_name');
    const class_input = document.getElementById('add_student_class_id');

    const add_student = document.getElementById('add_student');
    const add_student_spinner = document.getElementById('add_student_spinner');

    add_student.disabled = true;
    add_student_spinner.classList.remove("d-none");


    fetch('' + API_URL + '/student-class.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            student: name.value,
            class: class_input.value,
        })
    })
        .then(response => response.json())
        .then(data => {

            add_student.disabled = false;
            add_student_spinner.classList.add("d-none");
            if (data.result == 1) {
                getAlertMessage("lbl_student_added","lbl_good_job",'alert','success')
                updateClassTable();
            } else if (data.result == 2) {
                getAlertMessage("lbl_student_exists","lbl_sorry",'alert','info')
            } else {
                showAlertMessage("Sorry!", "warning", "Error occured");
            }

            name.value = '';
        })
        .catch((error) => {
            console.error('Error:', error);
            add_student.disabled = false;
            add_student_spinner.classList.add("d-none");
            showAlertMessage('Sorry!', "warning", error);
        });

}


let add_student = document.getElementById("add_student");
add_student.addEventListener('click', function (event) {
    event.preventDefault()
    const name = document.getElementById("add_name").value.trim();
    if (!name) {
        getAlertMessage("lbl_student_required")
    } else {
        saveStudent()
    }
});


function getdateclass(id, teacher_id, course_id, start_date, status) {
    getEditTeachers(teacher_id);
    getEditCourses(course_id);
    document.getElementById('class_id').value = id;
    document.getElementById('edit_start_date').value = start_date;
    let status_select = document.getElementById("edit_status");

    for (let option of status_select.options) {
        if (option.value === status) {
            option.selected = true;
            break;
        }
    }
}


function editClassData() {

    const teacher_name = document.getElementById('edit_select_teacher');
    const course_name = document.getElementById('edit_select_course');
    const start_date = document.getElementById('edit_start_date');
    const status = document.getElementById('edit_status');
    const class_id = document.getElementById('class_id');

    const edit_button = document.getElementById('edit_button');
    const edit_spinner = document.getElementById('edit_spinner');

    edit_button.disabled = true;
    edit_spinner.classList.remove("d-none");

    fetch('' + API_URL + '/class.php?id=' + class_id.value, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            teacher: teacher_name.value,
            course: course_name.value,
            start_date: start_date.value,
            status: status.value,
            id: class_id.value
        })
    })
        .then(response => response.json())
        .then(data => {

            edit_button.disabled = false;
            edit_spinner.classList.add("d-none");

            teacher_name.value = teacher_name.value;
            course_name.value = course_name.value;
            start_date.value = start_date.value;
            status.value = status.value;
            class_id.value = class_id.value;


            getAlertMessage("lbl_class_edited","lbl_good_job",'alert','success');
            updateClassTable();

        })
        .catch((error) => {
            console.error('Error:', error);
            edit_button.disabled = false;
            edit_spinner.classList.add("d-none");
            getAlertMessage("lbl_class_not_edited","lbl_sorry",'alert','waring');
        });

}


let edit_btn = document.getElementById("edit_button");
edit_btn.addEventListener('click', function (event) {
    event.preventDefault();
    const teacher_name = document.getElementById("edit_select_teacher").value.trim();
    const course_name = document.getElementById("edit_select_course").value.trim();

    if (!teacher_name || !course_name ) {

        if (!course_name) {
            getAlertMessage("lbl_course_required");
        }


        if (!teacher_name) {
            getAlertMessage("lbl_teacher_required");
        }


    } else {
        editClassData()


    }
});


function deleteClasses(id) {

    Swal.fire({
        title: "Are you sure to do delete?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('' + API_URL + '/class.php?id=' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    getAlertMessage("lbl_class_deleted","lbl_good_job",'alert','success')
                    updateClassTable()
                })
                .catch((error) => {
                    getAlertMessage("lbl_class_not_deleted","lbl_sorry",'alert','waring');
                });
        }
    });

}


function updateClassTable() {

    class_show_loader.classList.remove("d-none");

    fetch('' + API_URL + '/class.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            showClass(data);
            class_show_loader.classList.add("d-none");

            updateStatusTexts();

            
            changeDynamicselect();


            changeDynamicLabels();

        })
        .catch((error) => {
            console.error('Error:', error);
            class_show_loader.classList.add("d-none");
        });

}

function addClass() {
    setDefaultDateToCourseStartDate();
    getTeachers();
    getCourses();
}

function getTeachers() {

    const loader = document.getElementById('add_teacher_dropdown_loader');

    const selectElement = document.getElementById('add_select_teacher');
    selectElement.innerHTML = '<option value="">Select Teacher</option>';


    loader.classList.remove("d-none");

    fetch('' + API_URL + '/teacher.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(teacher => {
                const option = document.createElement('option');
                option.value = teacher.id; // or teacher.name if you prefer
                option.textContent = teacher.name;
                selectElement.appendChild(option);
            });
            loader.classList.add("d-none");
        })
        .catch((error) => {
            console.error('Error:', error);
            loader.classList.add("d-none");
        });
}

function getEditTeachers(teacher_id) {

    const loader = document.getElementById('edit_teacher_dropdown_loader');

    const selectElement = document.getElementById('edit_select_teacher');
    selectElement.innerHTML = '<option value="">Select Teacher</option>';


    loader.classList.remove("d-none");

    fetch('' + API_URL + '/teacher.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(teacher => {
                const option = document.createElement('option');
                option.value = teacher.id;
                option.textContent = teacher.name;

                if (teacher.id == teacher_id) {
                    option.selected = true;
                }

                selectElement.appendChild(option);
            });
            loader.classList.add("d-none");
        })
        .catch((error) => {
            console.error('Error:', error);
            loader.classList.add("d-none");
        });
}

function getCourses() {
    const loader = document.getElementById('add_course_dropdown_loader');

    const selectElement = document.getElementById('add_select_course');
    selectElement.innerHTML = '<option value="">Select Course</option>';


    loader.classList.remove("d-none");

    fetch('' + API_URL + '/course.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = course.name;
                selectElement.appendChild(option);
            });
            loader.classList.add("d-none");
        })
        .catch((error) => {
            console.error('Error:', error);
            loader.classList.add("d-none");
        });
}

function getEditCourses(course_id) {
    const loader = document.getElementById('edit_course_dropdown_loader');

    const selectElement = document.getElementById('edit_select_course');
    selectElement.innerHTML = '<option value="">Select Course</option>';


    loader.classList.remove("d-none");

    fetch('' + API_URL + '/course.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = course.name;
                if (course.id == course_id) {
                    option.selected = true;
                }
                selectElement.appendChild(option);
            });
            loader.classList.add("d-none");
        })
        .catch((error) => {
            console.error('Error:', error);
            loader.classList.add("d-none");
        });
}

function addstudent(class_id) {
    getStudents(class_id);
}

function getStudents(class_id) {
    document.getElementById('add_student_class_id').value = class_id;;

    const loader = document.getElementById('add_name_dropdown_loader');
    const selectElement = document.getElementById('add_name');
    selectElement.innerHTML = '<option value="">Loading...</option>';

    loader.classList.remove("d-none");

    fetch('' + API_URL + '/student.php', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            selectElement.innerHTML = '<option value="">Select Name</option>';
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.name + ' ' + item.fname + ' (' + item.phone + ')';
                selectElement.appendChild(option);
            });
            loader.classList.add("d-none");
        })
        .catch(error => {
            console.error(error);
            loader.classList.add("d-none");
        });
}


function showStudents(class_id) {
    var myModal = new bootstrap.Modal(document.getElementById('students_modal'));
    myModal.show();

    const tbody = document.getElementById('student_list');
    const loader = document.getElementById('student_loaders');

    tbody.innerHTML = '';
    loader.classList.remove('d-none');

    fetch(`${API_URL}/student-class.php?class_id=${class_id}`)
        .then(response => response.json())
        .then(data => {
            loader.classList.add('d-none');
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(student => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.fname}</td>
                        <td>${student.phone}</td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                showAlertMessage('Sorry!', "warning", 'You Did Not Add Student')
            }
        })
        .catch(error => {
            console.error('خطا در دریافت داده‌ها:', error);
            loader.classList.add('d-none');
            showAlertMessage('Sorry!', "warning", error);
        });
}
