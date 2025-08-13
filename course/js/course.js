

const course_show_loader = document.getElementById('course_loaders');
const courses_table = document.getElementById('courses_list');

window.addEventListener("DOMContentLoaded", function () {
   updateCourseTable()
});

// Show Teachers
function showTeachers(courses) {
    let tr = "";
    for (let i = 0; i < courses.length; i++) {
        tr += "<tr>";
        tr += "<td>" + parseInt(i + 1) + "</td>";
        tr += "<td>" + courses[i].name + "</td>";
        tr += "<td>" + courses[i].duration + "</td>";
        tr += "<td>";
        tr += `<button class="btn btn-dark" data-bs-toggle="offcanvas"  data-bs-target="#edit_course_convas" onclick="editCourseGetData(${courses[i].id},'${courses[i].name}','${courses[i].duration}')"  data-lang="lbl_edit">Edit</button>`;
        tr += `<button class="delete-btn btn btn-danger btn-sm mx-1" onClick="deleteCourse(${courses[i].id})"  data-lang="lbl_delete">Delete</button>`;
        tr += "</td>";
        tr += "</tr>";
    }
    courses_table.innerHTML = tr;
}

function saveCourse() {

    const name_input = document.getElementById('add_name');
    const duration_input = document.getElementById('add_duration');


    const add_button = document.getElementById('add_button');
    const add_spinner = document.getElementById('add_spinner');

    add_button.disabled = true;
    add_spinner.classList.remove("d-none");

    fetch('' + API_URL + '/course.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name_input.value,
            duration: duration_input.value,
        })
    })
        .then(response => response.json())
        .then(data => {

            add_button.disabled = false;
            add_spinner.classList.add("d-none");

            name_input.value = '';
            duration_input.value = '';
            

            getAlertMessage("lbl_course_added","lbl_good_job",'alert','success');
            updateCourseTable();
            
        })
        .catch((error) => {
            console.error('Error:', error);
            add_button.disabled = false;
            add_spinner.classList.add("d-none");
            getAlertMessage("lbl_course_not_added","lbl_sorry",'alert','waring');
        });

}
// add Validate inputs//
let add_btn = document.getElementById("add_button");
add_btn.addEventListener('click', function (event) {
    event.preventDefault();
    const name = document.getElementById("add_name").value.trim();
    const duration = document.getElementById("add_duration").value.trim();
  
    if (!name || !duration ) {


        if (!duration) {
            getAlertMessage("lbl_duration_required")
        }


        if (!name) {
            getAlertMessage("lbl_name_required")
        }


    } else {
        saveCourse()
       
    }
});

function updateCourseTable() {
   
    course_show_loader.classList.remove("d-none");

    fetch('' + API_URL + '/course.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            showTeachers(data);
            course_show_loader.classList.add("d-none");

            changeDynamicLabels();
        })
        .catch((error) => {
            console.error('Error:', error);
            course_show_loader.classList.add("d-none");
        });
        
}



// Delete

function deleteCourse(id) {
  
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
                getAlertMessage("lbl_course_deleted","lbl_good_job",'alert','success');
                updateCourseTable()
               })
              .catch((error) => {
                    getAlertMessage("lbl_course_not_deleted","lbl_sorry",'alert','warning');
                });
        }
   });

}

function editCourseGetData(id,name,duration){
        edit_name.value=name;
        edit_duration.value=duration;
        course_id.value=id;
}

//edit
    function editCourseData() {
        
        const edit_name = document.getElementById('edit_name');
        const edit_duration = document.getElementById('edit_duration');
        const course_id = document.getElementById('course_id');

        const edit_button = document.getElementById('edit_button');
        const edit_spinner = document.getElementById('edit_spinner');

        edit_button.disabled = true;
        edit_spinner.classList.remove("d-none");
        
    
        fetch('' + API_URL + '/course.php?id=' + course_id.value, {
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: edit_name.value,
            duration: edit_duration.value,
            id: course_id.value
        })
    })
        .then(response => response.json())
        .then(data => {

            edit_button.disabled = false;
            edit_spinner.classList.add("d-none");

            edit_name.value = edit_name.value;
            edit_duration.value = edit_duration.value;
            course_id.value = course_id.value;


            getAlertMessage("lbl_course_edited","lbl_good_job",'alert','success');
            updateCourseTable()
        })
        .catch((error) => {
            console.error('Error:', error);
            edit_button.disabled = false;
            edit_spinner.classList.add("d-none");
            getAlertMessage("lbl_course_not_edited","lbl_sorry",'alert','waring');
        });
    }
        
    //
//edits//

// Validate inputs//
let edit_btn = document.getElementById("edit_button");
edit_btn.addEventListener('click', function (event) {
    event.preventDefault();
    const name = document.getElementById("edit_name").value.trim();
    const duration = document.getElementById("edit_duration").value.trim();
    if (!name || !duration ) {

        if (!duration) {
            getAlertMessage("lbl_duration_required")
        }


        if (!name) {
            getAlertMessage("lbl_name_required")
        }


    } else {
        editCourseData()

    }
});