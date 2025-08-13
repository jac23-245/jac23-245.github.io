

const teacher_show_loader = document.getElementById('teacher_loaders');
const teachers_table = document.getElementById('teacher_list');

window.addEventListener("DOMContentLoaded", function () {
    updateTeacherTable();
});

// Show Teachers
function showTeachers(teachers) {
    let tr = "";
    for (let i = 0; i < teachers.length; i++) {
        tr += "<tr>";
        tr += "<td>" + parseInt(i + 1) + "</td>";
        tr += "<td>" + teachers[i].name + "</td>";
        tr += "<td>" + teachers[i].phone + "</td>";
        tr += "<td>" + teachers[i].level + "</td>";
        tr += "<td>";
        tr += `<button class="btn btn-dark" data-bs-toggle="offcanvas" data-bs-target="#edit_teacher_convas" onclick="editTeacherGetData(${teachers[i].id},'${teachers[i].name}',${teachers[i].phone},'${teachers[i].level}')" data-lang="lbl_edit">Edit</button>`;
        tr += `<button class="delete-btn btn btn-danger btn-sm mx-1" onClick="deleteTeacher(${teachers[i].id})" data-lang="lbl_delete">Delete</button>`;
        tr += "</td>";
        tr += "</tr>";
    }
    teachers_table.innerHTML = tr;
}

function saveTeacher() {

    const name_input = document.getElementById('add_name');
    const phone_input = document.getElementById('add_phone');
    const level_select = document.getElementById('add_level');

    const add_button = document.getElementById('add_button');
    const add_spinner = document.getElementById('add_spinner');
    

    add_button.disabled = true;
    add_spinner.classList.remove("d-none");

    fetch('' + API_URL + '/teacher.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name_input.value,
            phone: phone_input.value,
            level: level_select.value
        })
    })
        .then(response => response.json())
        .then(data => {

            add_button.disabled = false;
            add_spinner.classList.add("d-none");

            name_input.value = '';
            phone_input.value = '';
            level_select.value = '';

            getAlertMessage("lbl_teacher_added", "lbl_good_job", 'alert', 'success');
            updateTeacherTable();

        })
        .catch((error) => {
            console.error('Error:', error);
            add_button.disabled = false;
            add_spinner.classList.add("d-none");
            getAlertMessage("lbl_teacher_not_added", "lbl_sorry", 'alert', 'warning')
        });

}
// add Validate inputs//
let add_btn = document.getElementById("add_button");
add_btn.addEventListener('click', function (event) {
    event.preventDefault();
    const name = document.getElementById("add_name").value.trim();
    const phone = document.getElementById("add_phone").value.trim();
    const level = document.getElementById("add_level").value.trim();
    if (!name || !phone || !level) {

        if (!level) {
            getAlertMessage("lbl_level_field_required");
        }


        if (!phone) {
            getAlertMessage("lbl_phone_required");
        }


        if (!name) {
            getAlertMessage("lbl_name_required");
        }


    } else {
        saveTeacher()

    }
});

function updateTeacherTable() {

    teacher_show_loader.classList.remove("d-none");

    fetch('' + API_URL + '/teacher.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {

            showTeachers(data);
            teacher_show_loader.classList.add("d-none");
            
            changeDynamicLabels();
           
        })
        .catch((error) => {
            console.error('Error:', error);
            teacher_show_loader.classList.add("d-none");
        });

}



// Delete

function deleteTeacher(id) {

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
            fetch('' + API_URL + '/teacher.php?id=' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    getAlertMessage("lbl_teacher_deleted", "lbl_good_job", 'alert','success');
                    updateTeacherTable()
                })
                .catch((error) => {
                    getAlertMessage("lbl_teacher_not_deleted", "lbl_sorry", 'alert','warning');
                });
        }
    });

}

function editTeacherGetData(id, name, phone, level) {
    edit_name.value = name;
    edit_phone.value = phone;
    edit_level.value = level;
    teacher_id.value = id;
}

//edit
function editTeacherData() {

    const edit_name = document.getElementById('edit_name');
    const edit_phone = document.getElementById('edit_phone');
    const edit_level = document.getElementById('edit_level');
    const teacher_id = document.getElementById('teacher_id');

    const edit_button = document.getElementById('edit_button');
    const edit_spinner = document.getElementById('edit_spinner');

    edit_button.disabled = true;
    edit_spinner.classList.remove("d-none");


    fetch('' + API_URL + '/teacher.php?id=' + teacher_id.value, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: edit_name.value,
            phone: edit_phone.value,
            level: edit_level.value,
            id: teacher_id.value
        })
    })
        .then(response => response.json())
        .then(data => {

            edit_button.disabled = false;
            edit_spinner.classList.add("d-none");

            edit_name.value = edit_name.value;
            edit_phone.value = edit_phone.value;
            edit_level.value = edit_level.value;
            teacher_id.value = teacher_id.value;


            getAlertMessage("lbl_teacher_edited", "lbl_good_job", 'alert', 'success');
            updateTeacherTable();
        })
        .catch((error) => {
            console.error('Error:', error);
            edit_button.disabled = false;
            edit_spinner.classList.add("d-none");

             getAlertMessage("lbl_teacher_not_edited", "lbl_sorry", 'alert', 'warning');
        });
}

//
//edits//

// Validate inputs//
let edit_btn = document.getElementById("edit_button");
edit_btn.addEventListener('click', function (event) {
    event.preventDefault();
    const name = document.getElementById("edit_name").value.trim();
    const phone = document.getElementById("edit_phone").value.trim();
    const level = document.getElementById("edit_level").value.trim();
    if (!name || !phone || !level) {

        if (!level) {
            getAlertMessage("lbl_level_field_required");
        }


        if (!phone) {
            getAlertMessage("lbl_phone_required");
        }


        if (!name) {
            getAlertMessage("lbl_name_required");
        }


    } else {
        editTeacherData()


    }
});