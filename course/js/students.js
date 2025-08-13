

const student_show_loader = document.getElementById('student_loaders');
const students_table = document.getElementById('student_list');

window.addEventListener("DOMContentLoaded", function () {
    updateStudentTable();
});

// Show Students
function showStudents(students) {
    let tr = "";
    for (let i = 0; i < students.length; i++) {
        tr += "<tr>";
        tr += "<td>" + parseInt(i + 1) + "</td>";
        tr += "<td>" + students[i].name + "</td>";
        tr += "<td>" + students[i].fname + "</td>";
        tr += "<td>" + students[i].phone + "</td>";
        tr += "<td>";
        tr += `<button class="btn btn-dark" data-bs-toggle="offcanvas"  data-bs-target="#edit_student_convas" onclick="editStudentGetData(${students[i].id},'${students[i].name}', '${students[i].phone}','${students[i].fname}',)"  data-lang="lbl_edit">Edit</button>`;
        tr += `<button class="delete-btn btn btn-danger btn-sm mx-1" onClick="deleteStudent(${students[i].id})"  data-lang="lbl_delete">Delete</button>`;
        tr += "</td>";
        tr += "</tr>";
    }
    students_table.innerHTML = tr;
}

function saveStudent() {

    const name = document.getElementById('add_name');
    const father_name = document.getElementById('add_father_name');
    const phone = document.getElementById('add_phone');
   

    const add_button = document.getElementById('add_button');
    const add_spinner = document.getElementById('add_spinner');

    add_button.disabled = true;
    add_spinner.classList.remove("d-none");

    fetch('' + API_URL + '/student.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name.value,
            father_name: father_name.value,
            phone: phone.value
            
        })
    })
        .then(response => response.json())
        .then(data => {

            add_button.disabled = false;
            add_spinner.classList.add("d-none");

            name.value = '';
            father_name.value = '';
            phone.value = '';
            
           

            getAlertMessage("lbl_student_added", "lbl_good_job",'alert','success');
            updateStudentTable();
            
        })
        .catch((error) => {
            console.error('Error:', error);
            add_button.disabled = false;
            add_spinner.classList.add("d-none");
             getAlertMessage("lbl_student_not_added","lbl_sorry",'alert', 'warning');
        });

}
// add Validate inputs//
let add_btn = document.getElementById("add_button");
add_btn.addEventListener('click', function (event) {
    event.preventDefault();
    const name = document.getElementById("add_name").value.trim();
     const father_name = document.getElementById("add_father_name").value.trim();
    const phone = document.getElementById("add_phone").value.trim();
    if (!name || !phone || !father_name) {

        if (!father_name) {
            getAlertMessage("lbl_fathername_required")
        }


        if (!phone) {
            getAlertMessage("lbl_phone_required")
        }


        if (!name) {
            getAlertMessage("lbl_name_required")
        }


    } else {
        saveStudent()
       
    }
});

function updateStudentTable() {
   
    student_show_loader.classList.remove("d-none");

    fetch('' + API_URL + '/student.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            showStudents(data);
            student_show_loader.classList.add("d-none");

             changeDynamicLabels();
        })
        .catch((error) => {
            console.error('Error:', error);
            student_show_loader.classList.add("d-none");
        });
        
}



// Delete

function deleteStudent(id) {

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
            fetch('' + API_URL + '/student.php?id=' + id, {
                method: 'DELETE',
                headers: {
                   'Content-Type': 'application/json'
                }
           })
              .then(response => response.json())
             .then(data => {
               getAlertMessage("lbl_student_deleted", "lbl_good_job", 'alert','success');
                updateStudentTable()
               })
              .catch((error) => {
                    getAlertMessage("lbl_student_not_deleted", "lbl_sorry", 'alert','warning');

                });
        }
   });

}

function editStudentGetData(id,name,phone,fname){
        edit_name.value=name;
        edit_fname.value=fname;
        edit_phone.value=phone;
        student_id.value=id;
}

//edit
    function editStudentData() {
        
        const edit_name = document.getElementById('edit_name');
        const father_name = document.getElementById('edit_fname');
        const edit_phone = document.getElementById('edit_phone');
        const student_id = document.getElementById('student_id');

        const edit_button = document.getElementById('edit_button');
        const edit_spinner = document.getElementById('edit_spinner');

        edit_button.disabled = true;
        edit_spinner.classList.remove("d-none");
        
    
        fetch('' + API_URL + '/student.php?id=' + student_id.value, {
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: edit_name.value,
            father_name: father_name.value,
            phone: edit_phone.value,
            id: student_id.value
        })
    })
        .then(response => response.json())
        .then(data => {

            edit_button.disabled = false;
            edit_spinner.classList.add("d-none");

            edit_name.value = edit_name.value;
            father_name.value = father_name.value;
            
            edit_phone.value = edit_phone.value;
            student_id.value = student_id.value;


            getAlertMessage("lbl_student_edited", "lbl_good_job",'alert','success');
            updateStudentTable();
           
        })
        .catch((error) => {
            console.error('Error:', error);
            edit_button.disabled = false;
            edit_spinner.classList.add("d-none");
            

            getAlertMessage("lbl_student_not_edited","lbl_sorry",'alert', 'warning');
        });
    }
        
    //
//edits//

// Validate inputs//
let edit_btn = document.getElementById("edit_button");
edit_btn.addEventListener('click', function (event) {
    event.preventDefault();
    const name = document.getElementById("edit_name").value.trim();
      const father_name = document.getElementById("edit_fname").value.trim();
    const phone = document.getElementById("edit_phone").value.trim();
    if (!name || !phone || !father_name) {

        if (!father_name) {
            getAlertMessage("lbl_fathername_required")
        }


        if (!phone) {
            getAlertMessage("lbl_phone_required")
        }


        if (!name) {
            getAlertMessage("lbl_name_required")
        }


    } else {
        editStudentData()

       
    }
});