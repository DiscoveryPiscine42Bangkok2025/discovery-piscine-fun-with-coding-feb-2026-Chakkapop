$(document).ready(function() {
    const $list = $('#ft_list');
    const $btn = $('#newBtn');

    // 1. โหลด Cookie
    loadTodoList();

    // 2. คลิกปุ่ม New
    $btn.click(function() {
        let todoText = prompt("Please enter your new TO DO:");
        if (todoText && todoText.trim() !== "") {
            addTodo(todoText);
            saveCookie();
        }
    });

    // ฟังก์ชันเพิ่ม Todo
    function addTodo(text) {
        // สร้าง div ใหม่ด้วย jQuery
        let $div = $('<div>').text(text);

        // เพิ่ม Event คลิกเพื่อลบ
        $div.click(function() {
            if (confirm("Do you want to remove this TO DO?")) {
                $(this).remove(); // ลบตัวเอง
                saveCookie();     // อัปเดต Cookie
            }
        });

        // แทรกไว้บนสุด (Prepend)
        $list.prepend($div);
    }

    // ฟังก์ชันจัดการ Cookie (jQuery ไม่มี built-in cookie ต้องเขียนเองหรือใช้ Plugin)
    function saveCookie() {
        let todos = [];
        // วนลูปเก็บ Text จากทุกลูกใน list (ลูกบนสุดคือ index 0)
        $list.children().each(function() {
            todos.push($(this).text());
        });

        // Set Cookie
        let d = new Date();
        d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        // ต้อง encode JSON string
        document.cookie = "ft_list=" + encodeURIComponent(JSON.stringify(todos)) + ";" + expires + ";path=/";
    }

    function loadTodoList() {
        let name = "ft_list=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) == 0) {
                try {
                    let jsonStr = c.substring(name.length, c.length);
                    let todos = JSON.parse(jsonStr);
                    if (Array.isArray(todos)) {
                        // ต้องวนลูปย้อนกลับ (Reverse) เพราะ prepend จะดันของใหม่อยู่บน
                        // ถ้าใน cookie เก็บ [A, B] (A อยู่บน)
                        // add A -> [A]
                        // add B -> [B, A] (ผิด)
                        // ดังนั้นต้อง add B ก่อน -> [B] แล้ว add A -> [A, B] (ถูก)
                        for (let j = todos.length - 1; j >= 0; j--) {
                            addTodo(todos[j]);
                        }
                    }
                } catch (e) {
                    console.log("Cookie parse error");
                }
                return;
            }
        }
    }
});