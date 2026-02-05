window.onload = function() {
    loadTodoList();

    var btn = document.getElementById("newBtn");
    btn.addEventListener("click", openPrompt);
};

function openPrompt() {
    var todoText = prompt("Please enter your new TO DO:");
    if (todoText && todoText.trim() !== "") {
        addTodo(todoText);
        saveCookie(); // บันทึก Cookie ทุกครั้งที่มีการเปลี่ยนแปลง
    }
}

function addTodo(text) {
    var list = document.getElementById("ft_list");
    var newDiv = document.createElement("div");
    
    newDiv.textContent = text;

    newDiv.addEventListener("click", function() {
        var confirmDelete = confirm("Do you want to remove this TO DO?");
        if (confirmDelete) {
            this.remove(); 
            saveCookie();  
        }
    });

    list.insertBefore(newDiv, list.firstChild);
}

function saveCookie() {
    var todos = [];
    var list = document.getElementById("ft_list").children;
    
    for (var i = 0; i < list.length; i++) {
        todos.push(list[i].textContent);
    }

    var d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    
    document.cookie = "ft_list=" + encodeURIComponent(JSON.stringify(todos)) + ";" + expires + ";path=/";
}

function loadTodoList() {
    var name = "ft_list=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            try {
                var jsonStr = c.substring(name.length, c.length);
                var todos = JSON.parse(jsonStr);
                
                if (Array.isArray(todos)) {
                    for (var j = todos.length - 1; j >= 0; j--) {
                        addTodo(todos[j]);
                    }
                }
            } catch (e) {
                console.log("Error parsing cookie");
            }
            return;
        }
    }
}