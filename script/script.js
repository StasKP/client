// Глобальные переменные
var api_url = 'http://diplom/api/'; // Адрес сервера

// Скрытие форм
function hide_form() {
    $('#hello').hide();
    $('#no_admin').hide();
    $('.error').html('');

    //---------!
    // Категории
    //---------!

    $('#form_store_category').hide();
    $('#form_store_category_ok').hide();
    $('#div_category').hide();
    $('#form_update_category').hide();
    // $('#form_update_category_ok').hide();

    //---------!
    // Статусы
    //---------!

    $('#form_store_status').hide();
    $('#form_store_status_ok').hide();
    $('#div_status').hide();
    $('#form_update_status').hide();
    // $('#form_update_status_ok').hide();

    //-----------------------!
    // Номера для проживания
    //-----------------------!

    $('#form_store_room').hide();
    $('#form_store_room_ok').hide();
    $('#div_room').hide();
    $('#form_update_room').hide();
    $('#form_update_room_ok').hide();

    //-----------------------!
    // Места в номере
    //-----------------------!

    $('#form_store_place').hide();
    $('#form_store_place_ok').hide();
    $('#div_place').hide();
    $('#form_update_place').hide();
    $('#form_update_place_ok').hide();

    //-----------------------!
    // Карточки бронирования
    //-----------------------!

    $('#form_store_booking').hide();
    $('#form_store_booking_ok').hide();
    $('#div_booking').hide();
    $('#form_update_booking').hide();
    $('#form_update_booking_ok').hide();
};

//Функция проверки пользователя при загрузке страницы
function check_user() {
    // Проверка пользователя при загрузке страницы
    if (localStorage.token != ' ') {
        //Если пользователь авторизирован
        $('.un_auth').hide();                   //Скрыть блоки неавторизированного пользователя
        $('.ok_auth').show();                   //Отобразить блоки доступные авторизированному пользователю
        $('.nic').append(localStorage.client);  //Вывод имени пользователя
    } else {
        // Если пользователь не авторизирован
        // Скрытие блоков
        $('.ok_auth').hide();           //Скрыть блоки доступные авторизированному пользователю
    }
}

// Очистка форм
function clear_input() {
    // Создание массива инпатов
    var inputs = document.querySelectorAll('input');

    // Очистка инпатов
    for (var i = 0;  i < inputs.length; i++) {
        inputs[i].value = '';
    };
}

//Функция регистрации
function signup() {
    // Получение данных из формы регистрации
    first_name = document.getElementById('first_name').value;           // Имя
    surname = document.getElementById('surname').value;                 // Фамилия
    email = document.getElementById('email').value;                     // E-mail
    phone = document.getElementById('phone').value;                     // Номер телефона
    is_corporate = document.getElementById('is_corporate').value;       //Вид лица. Юридическое или физическо
    corporate_name = document.getElementById('corporate_name').value;   // Название Юр. лица
    password = document.getElementById('password').value;               // Пароль
    password_repeat = document.getElementById('password_repeat').value; // Повтор пароля

    // Если лицо Юридическое, то название юр. лица должно быть заполнено
    if (is_corporate == 1) {
        if (corporate_name == ''){
            $('.e_corporate_name').html('The corporate name field is required.');
        }
    }

    // Проверка совпадение пароля и повтора пароля
    if (password != password_repeat){
        $('.e_password_repeat').html('Password mismatch.');
    }

    // Если лицо Физическое, то название юр. лица не должно быть заполнено
    if (is_corporate == 0) {
        if (corporate_name != ''){
            $('.e_corporate_name').html('The corporate name field is not required');
            return false;
        }
    }

    // Создание переменной с данными пользователя для отправки на сервер
    var data_r = {};
    data_r = {
        'first_name': first_name,           // Имя
        'surname': surname,                 // Фамилия
        'email': email,                     // E-mail
        'phone': phone,                     // Номер телефона
        'is_corporate': is_corporate,       // Вид лица (физическое или юридическое)
        'corporate_name': corporate_name,   // Название юр.лица
        'password': password,               // Пароль
        'password_repeat': password_repeat, // Повтор пароля
    };

    // Ajax запрос на сервер
    $.ajax({
        url: api_url+'signup',
        // headers: {'Authorization': 'Bearer '+document.cookie},
        method: 'POST',
        data: data_r,
        // Успешный запрос
        success: function (data){
            $('#form-reg').hide(100);
            $('.message_reg_ok').show(100);
        },
        // Ошибка
        error: function (data) {
            // alert(data.responseJSON.email);

            // Вывод ошибок валидации

            // Ошибка в имени
            if (data.responseJSON.first_name != ''){
                $('.e_first_name').html(data.responseJSON.first_name);
            }

            // Ошибка в фамилии
            if (data.responseJSON.surname != ''){
                $('.e_surname').html(data.responseJSON.surname);
            }

            // Ошибка в номере телефона
            if (data.responseJSON.phone != ''){
                $('.e_phone').html(data.responseJSON.phone);
            }

            // Ошибка в E-mail
            if (data.responseJSON.email != ''){
                $('.e_email').html(data.responseJSON.email);
            }

            // Ошибка в пароле
            if (data.responseJSON.password != ''){
                $('.e_password').html(data.responseJSON.password);
            }

            // Ошибка в повторе пароля
            if (data.responseJSON.password_repeat != ''){
                $('.e_password_repeat').html(data.responseJSON.password_repeat);
            }
        }
    });
}

// Функция авторизации
function login() {
    // Ajax запрос на сервер
    $.ajax({
        url: api_url+'login',
        // headers: {'Authorization': 'Bearer '+document.cookie},
        method: 'POST',
        data: $('#form-auth').serialize(),
        // Успешный запрос
        success: function (data){

            //Скрытие блоков
            $('#form-auth').hide(100);
            $('.vpr').hide(100);
            $('.un_auth').hide(100);

            //Оторажение блоков
            $('.ok_auth').show(100);
            $('#accordion').show();
            $('.message_auth_ok').show(100);

            //Вывод имени пользователя
            $('.nic').append(data.client);
            // document.cookie = data.token;

            //Соханение токена и имени в localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('client', data.client);
        },
        // Ошибка
        error: function (data) {
            // alert(data.responseJSON.email);

            //Вывод ошибок

            //Ошибка в E-mail
            if (data.responseJSON.email != ''){
                $('.e_email').html(data.responseJSON.email);
            }
            //Ошибка в пароле
            if (data.responseJSON.password != ''){
                $('.e_password').html(data.responseJSON.password);
            }

            //Неправильный логин или пароль
            if (data.login != '') {}
            $('.e_password').html(data.responseJSON.login);
        }
    });
}

// Функция выхода
function logout() {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+'logout',
        headers: {'Authorization': 'Bearer '+ localStorage.token},
        method: 'POST',
        // Успешный запрос
        success: function (data){
            // Очистка переменных в localStorage
            localStorage.token = ' ';   // Токен
            localStorage.client = ' ';  // Имя пользователя

            // Перезагрузка страницы
            location.reload();
        }
    });
}

//=================================================
// ---------------------------------------Категории
//=================================================

// Функция создания категорий
function store_category() {
    // Ajax запрос на сервер
    $.ajax({
        url: api_url+'category',
        headers: {'Authorization': 'Bearer '+ localStorage.token},
        method: 'POST',
        data: $('#form_store_category').serialize(),
        // Успешный запрос
        success: function (data){
            $('#form_store_category_ok').show();
            $('#form_store_category').hide();
        },
        // Ошибка
        error: function (data) {

            // Проверка на администратора
            if(data.status == 403){
                $('#no_admin').show();
                $('#form_store_category').hide();
            };

            // Вывод ошибок валидации

            // Ошибка в названии категории
            if (data.responseJSON.name_category != ''){
                $('.e_name_category').html(data.responseJSON.name_category);
            }

            // Ошибка в количестве основных мест категории
            if (data.responseJSON.number_of_main != ''){
                $('.e_number_of_main').html(data.responseJSON.number_of_main);
            }

            // Ошибка в количестве дополнительных мест категории
            if (data.responseJSON.number_of_additional != ''){
                $('.e_number_of_additional').html(data.responseJSON.number_of_additional);
            }
        }
    });

};

// Функция редактирования категорий
function update_category(id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+`category/${id}`,
        headers: {'Authorization': 'Bearer '+ localStorage.token},
        method: 'PATCH',
        data: $('#form_update_category').serialize(),
        // Успешный запрос
        success: function (data){
            // $('#modal_update_category').modal('hide');
            // $('#form_update_category').hide();
            // index_category();
            localStorage.rel = 1;
            location.reload();
        },
        // Ошибка
        error: function (data) {

            // Проверка на администратора
            if(data.status == 403){
                $('#no_admin').show();
                $('#form_update_category').hide();
            };

            // Вывод ошибок валидации

            // Ошибка в названии категории
            if (data.responseJSON.name_category != ''){
                $('.e_name_category').html(data.responseJSON.name_category);
            }

            // Ошибка в количестве основных мест категории
            if (data.responseJSON.number_of_main != ''){
                $('.e_number_of_main').html(data.responseJSON.number_of_main);
            }

            // Ошибка в количестве дополнительных мест категории
            if (data.responseJSON.number_of_additional != ''){
                $('.e_number_of_additional').html(data.responseJSON.number_of_additional);
            }
        }
    });
    return false;
}

// Функция открытия формы редактирования категорий
function form_update_category(id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+`category/${id}`,
        method: 'GET',
        // Успешный запрос
        success: function (data){
            hide_form();
            $('#div_category').show();
            $('#modal_update_category').modal('show');
            $('#form_update_category').show(1000);
            document.getElementById('new_name_category').value = data.name_category;                // Наименование категории
            document.getElementById('new_number_of_main').value = data.number_of_main;              // Количество основных мест
            document.getElementById('new_number_of_additional').value = data.number_of_additional;  // Количество дополнительных мест
            $('#butt_update_category').click(function(){
                $('.error').html('');
                update_category(data.id);
                return false;
            });
        }
    });
    return false;
};

// Функция удаления категорий
function delete_category(id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+`category/${id}`,
        headers: {'Authorization': 'Bearer '+ localStorage.token},
        method: 'DELETE',
        // Успешный запрос
        success: function (data){
            // list_delete_category();
            index_category();
        },
        // Ошибка
        error: function (data) {
            if(data.status == 403){
                $('#no_admin').show();
                $('#div_category').hide();
            };

            if(data.status == 500){
                $('#no_delete').modal('show');
            };
        }
    });
    return false;
}

// Вывод списка всех доступных категорий
function index_category(){
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+'category',
        method: 'GET',
        // Успешный запрос
        success: function (data){
            hide_form();
            $('#div_category').show(1000);
            $('#tbody_category').html(' ');
            $('#tbody_category').append(
                `
                    <tr>
                        <th class="table-hover">
                            <div>Наименование</div>
                        </th>
                        <th class="table-hover">
                            <div>Количество основных мест</div>
                        </th>      
                        <th class="table-hover">
                            <div>Количество дополнительных мест</div>
                        </th> 
                        <th class="table-hover">
                            
                        </th>                        
                    </tr>
                `
            );
            $.each(data, function (index, value) {
                $('#tbody_category').append(
                    `
						    <tr>
                                <td class="table-text">
                                    <div>${value.name_category}</div>
                                </td>
                                <td class="table-text">
                                    <div class="text-center">${value.number_of_main}</div>
                                </td>      
                                <td class="table-text">
                                    <div class="text-center">${value.number_of_additional}</div>
                                </td> 
                                <td>
                                    <form class="float-right">
                                        <button class="btn btn-outline-danger" id="delete_category_${value.id}"><i class="fa fa-trash-alt"></i></button>
                                    </form>
                                    <form class="float-right">
                                        <button class="btn btn-outline-success" id="update_category_${value.id}"><i class="fa fa-edit"></i></button>
                                    </form>
                                </td>                        
                            </tr>                  	
						`
                );
                $(`#delete_category_${value.id}`).click(function () {
                    delete_category(value.id);
                    return false;
                });
                $(`#update_category_${value.id}`).click(function () {
                    form_update_category(value.id);
                    return false;
                });
            });
        }
    });
};

//=================================================
// ---------------------------------------Статусы
// =================================================

// Функция создания статуса номера
function store_status() {
    // Ajax запрос на сервер
    $.ajax({
        url: api_url+'status',
        headers: {'Authorization': 'Bearer '+ localStorage.token},
        method: 'POST',
        data: $('#form_store_status').serialize(),
        // Успешный запрос
        success: function (data){
            $('#form_store_status_ok').show();
            $('#form_store_status').hide();
        },
        // Ошибка
        error: function (data) {

            // Проверка на администратора
            if(data.status == 403){
                $('#no_admin').show();
                $('#form_store_status').hide();
            };

            // Вывод ошибок валидации

            // Ошибка в названии статуса
            if (data.responseJSON.name_status != ''){
                $('.e_name_status').html(data.responseJSON.name_status);
            }
        }
    });

};

// Функция редактирования статусов
function update_status(id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+`status/${id}`,
        headers: {'Authorization': 'Bearer '+ localStorage.token},
        method: 'PATCH',
        data: $('#form_update_status').serialize(),
        // Успешный запрос
        success: function (data){
            // $('#form_update_status_ok').show();
            // $('#form_update_status').hide();
            localStorage.rel = 2;
            location.reload();
        },
        // Ошибка
        error: function (data) {

            // Проверка на администратора
            if(data.status == 403){
                $('#no_admin').show();
                $('#form_update_status').hide();
            };

            // Вывод ошибок валидации

            // Ошибка в названии статуса номера
            if (data.responseJSON.name_status != ''){
                $('.e_name_status').html(data.responseJSON.name_status);
            }
        }
    });
    return false;
}

// Функция открытия формы редактирования статуса
function form_update_status(id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+`status/${id}`,
        method: 'GET',
        // Успешный запрос
        success: function (data){
            hide_form();
            $('#div_status').show();
            $('#modal_update_status').modal('show');
            $('#form_update_status').show(1000);
            document.getElementById('new_name_status').value = data.name_status;    // Наименование статуса
            $('#butt_update_status').click(function(){
                $('.error').html('');
                update_status(id);
                return false;
            });
        }
    });
    return false;
};

// Функция удаления статусов
function delete_status(id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+`status/${id}`,
        headers: {'Authorization': 'Bearer '+ localStorage.token},
        method: 'DELETE',
        // Успешный запрос
        success: function (data){
            // list_delete_status();
            index_status();
        },
        // Ошибка
        error: function (data) {
            if(data.status == 403){
                $('#no_admin').show();
                $('#div_status').hide();
            };

            if(data.status == 500){
                $('#no_delete').modal('show');
            };
        }
    });
    return false;
}

// Вывод списка всех доступных статусов
function index_status(){
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+'status',
        method: 'GET',
        // Успешный запрос
        success: function (data){
            hide_form();
            $('#div_status').show(1000);
            $('#tbody_status').html(' ');
            $('#tbody_status').append(
                `
                    <tr>
                        <th class="table-hover">
                            <div class="text-center">Наименование</div>
                        </th>   
                        <th class="table-hover">
                        
                        </th>                     
                    </tr>
                `
            );
            $.each(data, function (index, value) {
                $('#tbody_status').append(
                    `
						    <tr>                                
                                <td class="table-text">
                                    <div class="text-center">${value.name_status}</div>
                                </td> 
                                <td>
                                    <form class="float-right">
                                        <button class="btn btn-outline-danger" id="delete_status_${value.id}"><i class="fa fa-trash-alt"></i></button>
                                    </form>
                                    <form class="float-right">
                                        <button class="btn btn-outline-success" id="update_status_${value.id}"><i class="fa fa-edit"></i></button>
                                    </form>
                                </td>                                                     
                            </tr>                  	
						`
                );
                $(`#delete_status_${value.id}`).click(function () {
                    delete_status(value.id);
                    return false;
                });
                $(`#update_status_${value.id}`).click(function () {
                    form_update_status(value.id);
                    return false;
                });
            });
        }
    });
};

//=================================================
// ---------------------------Номера для проживания
// =================================================

// Открытие формы создания номера для проживания
function open_form_store_room(){
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+'category',
        method: 'GET',
        // Успешный запрос
        success: function (data){
            hide_form();
            $('#form_store_room').show(1000);
            $('#select_category_room').html(' ');
            $.each(data, function (index, value) {
                $('#select_category_room').append(
                    `
						    <option value="${value.id}">${value.name_category}</option>                	
						`
                );
            });
        }
    });
};

// Функция создания номера для проживания
function store_room() {
    // Ajax запрос на сервер
    $.ajax({
        url: api_url+'room',
        headers: {'Authorization': 'Bearer '+ localStorage.token},
        method: 'POST',
        data: $('#form_store_room').serialize(),
        // Успешный запрос
        success: function (data){
            $('#form_store_room_ok').show();
            $('#form_store_room').hide();
        },
        // Ошибка
        error: function (data) {

            // Проверка на администратора
            if(data.status == 403){
                $('#no_admin').show();
                $('#form_store_room').hide();
            };

            // Вывод ошибок валидации

            // Ошибка в номере номера для проживания
            if (data.responseJSON.name_room != ''){
                $('.e_name_room').html(data.responseJSON.name_room);
            }

            // Ошибка в этаже номер для проживания
            if (data.responseJSON.floor != ''){
                $('.e_floor').html(data.responseJSON.floor);
            }
        }
    });

};

// Функция открытия формы редактирования номера для проживания
function form_update_room(id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+`room/${id}`,
        method: 'GET',
        // Успешный запрос
        success: function (data){
            hide_form();
            $('#div_room').show();
            $('#modal_update_room').modal('show');
            $('#form_update_room').show(1000);
            // Ajax запрос к серверу
            $.ajax({
                url: api_url+'category',
                method: 'GET',
                // Успешный запрос
                success: function (data_1){
                    $('#select_category_room_update').html();
                    $.each(data_1, function (index, value) {
                        $('#select_category_room_update').append(
                            `
						    <option value="${value.id}">${value.name_category}</option>                	
						`
                        );
                    });
                    document.getElementById('new_name_room').value = data.name_room;                        // Номер номера для проживания
                    document.getElementById('select_category_room_update').value = data.category_room;      // Категория номера для проживания
                    document.getElementById('new_corpus').value = data.corpus;                              // Корпус номера для проживания
                    document.getElementById('new_floor').value = data.floor;                                // Этаж номера для проживания
                    $('#butt_update_room').click(function(){
                        $('.error').html('');
                        update_room(id);
                        return false;
                    });
                }
            });
        }
    });
    return false;
};

// Функция редактирования номера для проживания
function update_room(id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+`room/${id}`,
        headers: {'Authorization': 'Bearer '+ localStorage.token},
        method: 'PATCH',
        data: $('#form_update_room').serialize(),
        // Успешный запрос
        success: function (data){
            // $('#form_update_status_ok').show();
            // $('#form_update_status').hide();
            localStorage.rel = 3;
            location.reload();
        },
        // Ошибка
        error: function (data) {

            // Проверка на администратора
            if(data.status == 403){
                $('#no_admin').show();
                $('#form_update_room').hide();
            };

            // Вывод ошибок валидации

            // Ошибка в номере номера для проживания
            if (data.responseJSON.name_room != ''){
                $('.e_name_room').html(data.responseJSON.name_room);
            }

            // Ошибка в этаже номер для проживания
            if (data.responseJSON.floor != ''){
                $('.e_floor').html(data.responseJSON.floor);
            }
        }
    });
    return false;
}

// Функция удаления номера для проживания
function delete_room(id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+`room/${id}`,
        headers: {'Authorization': 'Bearer '+ localStorage.token},
        method: 'DELETE',
        // Успешный запрос
        success: function (data){
            // list_delete_room();
            index_room();
        },
        // Ошибка
        error: function (data) {
            if(data.status == 403){
                $('#no_admin').show();
                $('#div_room').hide();
            };

            if(data.status == 500){
                $('#no_delete').modal('show');
            };
        }
    });
    return false;
}

// Вывод списка всех доступных номеров для проживания
function index_room(){
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+'room',
        method: 'GET',
        // Успешный запрос
        success: function (data){
            hide_form();
            $('#div_room').show(1000);
            $('#tbody_room').html(' ');
            // Ajax запрос к серверу
            $.ajax({
                url: api_url+'category',
                method: 'GET',
                // Успешный запрос
                success: function (data_1){
                    var name_category = '';
                    $('#tbody_room').append(
                        `
                        <tr>
                            <th class="table-hover">
                                <div class="text-center">Номер номера</div>
                            </th> 
                            <th class="table-hover">
                                <div>Категория</div>
                            </th> 
                            <th class="table-hover">
                                <div class="text-center">Корпус</div>
                            </th>  
                            <th class="table-hover">
                                <div class="text-center">Этаж</div>
                            </th>  
                            <th class="table-hover">
                                
                            </th>                      
                        </tr>
                    `
                    );
                    $.each(data, function (index, value) {
                        $.each(data_1, function (index_1, value_1) {
                            if (value.category_room == value_1.id){
                                name_category = value_1.name_category;
                            }
                        });
                        $('#tbody_room').append(
                            `
						    <tr>
                                <td class="table-text">
                                    <div class="text-center">${value.name_room}</div>
                                </td>
                                <td class="table-text">
                                    <div>${name_category}</div>
                                </td>  
                                 <td class="table-text">
                                    <div class="text-center">${value.corpus}</div>
                                </td>
                                <td class="table-text">
                                    <div class="text-center">${value.floor}</div>
                                </td> 
                                <td class="table-text">
                                    <form class="float-right">
                                        <button class="btn btn-outline-danger" id="delete_room_${value.id}"><i class="fa fa-trash-alt"></i></button>
                                    </form>
                                    <form class="float-right">
                                        <button class="btn btn-outline-success" id="update_room_${value.id}"><i class="fa fa-edit"></i></button>
                                    </form>
                                </td>                             
                            </tr>                  	
						`
                        );
                        $(`#delete_room_${value.id}`).click(function () {
                            delete_room(value.id);
                            return false;
                        });
                        $(`#update_room_${value.id}`).click(function () {
                            form_update_room(value.id);
                            return false;
                        });
                    });
                }
            });

        }
    });
}

//=================================================
// ---------------------------Места в номере
// =================================================

// Открытие формы создания места в номере
function open_form_store_place(){
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+'room',
        method: 'GET',
        // Успешный запрос
        success: function (data){
            hide_form();
            $('#form_store_place').show(1000);
            $('#select_place_room').html(
                `
				    <option value="0">Номер в котором размещается место (Не выбрано)</option>                	
			    `
            );
            $.each(data, function (index, value) {
                $('#select_place_room').append(
                    `
					    <option value="${value.id}">${value.name_room}</option>                	
					`
                );
            });
        }
    });
};

// Функция создания места в номере
function store_place() {
    room_id = document.getElementById('select_place_room').value;

    if (room_id == 0) {
        // Ошибка в выборе номера
            $('.e_room_id').html('The room field is required.');
    } else {
        // Ajax запрос на сервер
        $.ajax({
            url: api_url + 'room/' + room_id + '/place',
            headers: {'Authorization': 'Bearer ' + localStorage.token},
            method: 'POST',
            data: $('#form_store_place').serialize(),
            // Успешный запрос
            success: function (data) {
                $('#form_store_place_ok').show();
                $('#form_store_place').hide();
            },
            // Ошибка
            error: function (data) {

                // Проверка на администратора
                if (data.status == 403) {
                    $('#no_admin').show();
                    $('#form_store_place').hide();
                }
                ;

                // Вывод ошибок валидации

                // Ошибка в названии места в номере
                if (data.responseJSON.name != '') {
                    $('.e_name').html(data.responseJSON.name);
                }
            }
        });
    }
};

// Функция открытия формы редактирования места в номере для проживания
function form_update_place(id, room_id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+`room/${room_id}/place/${id}`,
        method: 'GET',
        // Успешный запрос
        success: function (data){
            hide_form();
            $('#div_place').show();
            $('#modal_update_place').modal('show');
            $('#form_update_place').show(1000);
            // Ajax запрос к серверу
            $.ajax({
                url: api_url+'room',
                method: 'GET',
                // Успешный запрос
                success: function (data_1){
                    $('#select_place_room_update').html(
                        `
				            <option value="0">Номер в котором размещается место (Не выбрано)</option>                	
			            `
                    );
                    $.each(data_1, function (index, value) {
                        $('#select_place_room_update').append(
                            `
					            <option value="${value.id}">${value.name_room}</option>                	
					        `
                        );
                    });
                    document.getElementById('new_name').value = data.name;               // Место в номере для проживания
                    document.getElementById('select_place_room_update').value = data.room_id;       // Номер для проживания
                    document.getElementById('new_is_empty').value = data.is_empty;                  // Свободно/Занято
                    document.getElementById('new_is_primary').value = data.is_primary;              // Основное/Дополнительное
                    $('#butt_update_place').click(function(){
                        $('.error').html('');
                        update_place(id, room_id);
                        return false;
                    });
                }
            });
        }
    });
    return false;
};

// Функция редактирования места в номере для проживания
function update_place(id, room_id) {
    update_room_id = document.getElementById('select_place_room_update').value;

    if (update_room_id == 0) {
        // Ошибка в выборе номера
        $('.e_room_id').html('The room field is required.');
    } else {
        // Ajax запрос к серверу
        $.ajax({
            url: api_url + 'room/' + room_id + '/place/'+id,
            headers: {'Authorization': 'Bearer ' + localStorage.token},
            method: 'PATCH',
            data: $('#form_update_place').serialize(),
            // Успешный запрос
            success: function (data) {
                // $('#form_update_status_ok').show();
                // $('#form_update_status').hide();
                localStorage.rel = 4;
                location.reload();
            },
            // Ошибка
            error: function (data) {

                // Проверка на администратора
                if (data.status == 403) {
                    $('#no_admin').show();
                    $('#form_update_room').hide();
                }
                ;

                // Вывод ошибок валидации

                // Ошибка в названии места в номере
                if (data.responseJSON.name != '') {
                    $('.e_name').html(data.responseJSON.name);
                }
            }
        });
    }
    return false;
}

// Вывод списка всех доступных мест в номерах для проживания
function index_place(){
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+'room',
        method: 'GET',
        // Успешный запрос
        success: function (data){
            hide_form();
            $('#div_place').show(1000);
            $('#tbody_place').html(' ');
            $.each(data, function (index, value) {
                room_id_index = value.id;
                // Ajax запрос к серверу
                $.ajax({
                    url: api_url + 'room/' + room_id_index + '/place',
                    method: 'GET',
                    // Успешный запрос
                    success: function (data_1) {
                        var name_category = '';
                        $.each(data_1, function (index_1, value_1) {
                            $('#tbody_place').append(
                                `
                                    <tr>
                                        <td class="table-text">
                                            <div>Место - ${value_1.name} в номере - ${value.name_room}</div>
                                        </td>
                                        <td>
                                            <div id="empty_${value_1.id}"></div>
                                        </td> 
                                        <td>
                                            <div id="primary_${value_1.id}"></div>
                                        </td>                                        
                                        <td>
                                            <form class="float-right">
                                                <button class="btn btn-outline-danger" id="delete_place_${value_1.id}"><i class="fa fa-trash-alt"></i></button>
                                            </form>
                                            <form class="float-right">
                                                <button class="btn btn-outline-success" id="update_place_${value_1.id}"><i class="fa fa-edit"></i></button>
                                            </form>
                                        </td>                          
                                    </tr>                  	
						        `
                            );
                            $(`#update_place_${value_1.id}`).click(function () {
                                form_update_place(value_1.id, value.id);
                                return false;
                            });
                            $(`#delete_place_${value_1.id}`).click(function () {
                                delete_place(value_1.id, value.id);
                                return false;
                            });
                            if (value_1.is_empty == 1){
                                $(`#empty_${value_1.id}`).append(`Занято`);
                            }
                            else {
                                $(`#empty_${value_1.id}`).append(`Свободно`);
                            };
                            if (value_1.is_primary == 1){
                                $(`#primary_${value_1.id}`).append(`Дополнительное`);
                            }
                            else {
                                $(`#primary_${value_1.id}`).append(`Основное`);
                            };
                        });
                    }
                });
            })
        }
    });
}

// Функция удаления мест в номерах для проживания
function delete_place(id, room_id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url + 'room/' + room_id + '/place/'+id,
        headers: {'Authorization': 'Bearer '+ localStorage.token},
        method: 'DELETE',
        // Успешный запрос
        success: function (data){
            //list_delete_place();
            index_place();
        },
        // Ошибка
        error: function (data) {
            if(data.status == 403){
                $('#no_admin').show();
                $('#div_place').hide();
            };

            if(data.status == 500){
                $('#no_delete').modal('show');
            };
        }
    });
    return false;
}

//=================================================
// ---------------------------Карточки бронирования
// =================================================

// Открытие формы создания карточки бронирования
function open_form_store_booking(){
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+'category',
        method: 'GET',
        // Успешный запрос
        success: function (data) {
            hide_form();
            $('#form_store_booking').show();
            $('#select_booking_category_room').html(
                `
				    <option value="0">Категория номера (не выбрано)</option>                	
			    `
            );
            $.each(data, function (index, value) {
                $('#select_booking_category_room').append(
                    `
					    <option value="${value.id}">
					        ${value.name_category}
					    </option>                	
					`
                );
                $(`#select_booking_category_room`).click(function () {
                    add_room();
                    return false;
                });
            });
        }
    });
};

// Функция запонения списка номеров
function add_room(){
    id_category = document.getElementById('select_booking_category_room').value;

    // Ajax запрос к серверу
    $.ajax({
        url: api_url+`category/${id_category}`,
        method: 'GET',
        // Успешный запрос
        success: function (data){
            $('.note').html(`Максимум ${data.number_of_additional + data.number_of_main} места`);
            places = data.number_of_additional + data.number_of_main;
        }
    });
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+'room',
        method: 'GET',
        // Успешный запрос
        success: function (data){
            $('#select_room_id').html(
                `
				    <option value="0">Идентификатор номера</option>
			    `
            );
            $.each(data, function (index, value) {
                if (id_category == value.category_room) {
                    $('#select_room_id').append(
                        `
					        <option value="${value.id}">${value.name_room}</option>
					    `
                    );
                }
            });
        }
    });
};

// Функция создания карточки бронирования
function store_booking() {
    booking_category_room = document.getElementById('select_booking_category_room').value;
    start_date = document.getElementById('start_date').value;
    end_date = document.getElementById('end_date').value;
    end_date = document.getElementById('end_date').value;
    c_places = document.getElementById('places').value;

    if (booking_category_room == 0) {
        // Ошибка в выборе категории номера
        $('.e_category_room').html('The category room field is required.');
    } else {
        if (start_date > end_date) {
            // Ошибка в дате заселения/выселения
            $('.e_end_date').html(
                'Date of eviction cannot be earlier than date of settlement.'
            );
        } else {
            if (c_places > places){
                // Ошибка в количестве мест
                $('.e_places').html(
                    'The number of reserved seats may not exceed the number of additional seats.'
                );
            } else {
                // Ajax запрос на сервер
                $.ajax({
                    url: api_url + 'booking',
                    headers: {'Authorization': 'Bearer ' + localStorage.token},
                    method: 'POST',
                    data: $('#form_store_booking').serialize(),
                    // Успешный запрос
                    success: function (data) {
                        $('#form_store_booking_ok').show();
                        $('#form_store_booking').hide();
                    },
                    // Ошибка
                    error: function (data) {

                        // Проверка на администратора
                        if (data.status == 403) {
                            $('#no_admin').show();
                            $('#form_store_place').hide();
                        }
                        ;

                        // Вывод ошибок валидации

                        // Ошибка в названии места в номере
                        // if (data.responseJSON.name != '') {
                        //     $('.e_name').html(data.responseJSON.name);
                        // }
                    }
                });
            }
        }

    }
};

// Вывод списка всех карточек бронирования
function index_booking(){
    // Ajax запрос к серверу
    $.ajax({
        url: api_url +'booking',
        headers: {'Authorization': 'Bearer ' + localStorage.token},
        method: 'GET',
        success: function (data) {
            hide_form();
            $('#div_booking').show(1000);
            $('#tbody_booking').html(' ');
            $('#tbody_booking').append(
                `
                    <tr>
                        <th class="table-hover">
                            <div class="text-center">№</div>
                        </th> 
                        <th class="table-hover">
                            <div>Клиент</div>
                        </th> 
                        <th class="table-hover">
                             <div>Категория</div>
                        </th>  
                        <th class="table-hover">
                             <div class="text-center">Дата заселения</div>
                        </th>
                        <th class="table-hover">
                              <div class="text-center">Дата выселения</div>
                        </th>  
                        <th class="table-hover">
                            <div class="text-center">Кол-во мест</div>
                        </th> 
                        <th class="table-hover">
                            <div class="text-center">Номер комнаты</div>
                        </th>
                        <th class="table-hover">
                            <div class="text-center">Подтверждён/Неподтверждён</div>
                        </th> 
                        <th class="table-hover">
                            
                        </th>                      
                    </tr>
                `
            );
            $.each(data, function (index, value) {
                var options = {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    timezone: 'UTC'
                };
                d = new Date(value.start_date);
                d1 = d.getDate()+'.'+(d.getMonth()+1)+'.'+d.getFullYear();
                de = new Date(value.end_date);
                de1 = de.getDate()+'.'+(de.getMonth()+1)+'.'+de.getFullYear();
                $('#tbody_booking').append(
                    `
                        <tr>
                            <td>
                                <div class="text-center">
                                    ${value.id}
                                </div>
                            </td>
                        
                            <td>
                                <div class="text-center" id="booking_client_${value.id}">
                                    
                                </div>
                            </td>
                        
                            <td>
                                <div class="text-center" id="booking_category_${value.id}">
                                    
                                </div>
                            </td>
                        
                            <td>
                                <div class="text-center">
                                    ${d1}
                                </div>
                            </td>
                        
                            <td>
                                <div class="text-center">
                                    ${de1}
                                </div>
                            </td>
                       
                            <td>
                                <div class="text-center">
                                    ${value.places}
                                </div>
                            </td>
                        
                            <td>
                                <div class="text-center" id="booking_room_id_${value.id}">
                                    <small class="error e_room_id_${value.id} form-text text-danger"></small>
                                </div>
                            </td>
                        
                            <td>
                                <div class="text-center" id="booking_status_${value.id}">
                                    
                                </div>
                            </td>
                            <td>
                                <form class="float-right" id="booking_check_${value.id}">
                                    <button class="btn btn-outline-primary" id="ok_booking_${value.id}"><i class="fa fa-check"></i>  Подтвердить</button>
                                </form>
                                <form class="float-right">
                                    <button class="btn btn-outline-danger" id="delete_booking_${value.id}"><i class="fa fa-trash-alt"></i></button>
                                </form>
                                <form class="float-right">
                                    <button class="btn btn-outline-success" id="update_booking_${value.id}"><i class="fa fa-edit"></i></button>
                                </form>
                            </td>
                        </tr>
                    `
                );
                $(`#ok_booking_${value.id}`).click(function () {
                    ok_booking(value.id);
                    return false;
                });
                $(`#delete_booking_${value.id}`).click(function () {
                    delete_booking(value.id);
                    return false;
                });
                $(`#update_booking_${value.id}`).click(function () {
                    form_update_booking(value.id);
                    return false;
                });
                $.ajax({
                    url: api_url+'room',
                    method: 'GET',
                    success: function (data_1) {
                        $.each(data_1, function (index_1, value_1) {
                            if (value.room_id == value_1.id) {
                                $(`#booking_room_id_${value.id}`).append(`${value_1.name_room}`);
                            }
                        })
                    }
                });
                $.ajax({
                    url: api_url+'category',
                    method: 'GET',
                    success: function (data_1) {
                        $.each(data_1, function (index_1, value_1) {
                            if (value.category_room == value_1.id) {
                                $(`#booking_category_${value.id}`).append(`${value_1.name_category}`);
                            }
                        })
                    }
                });
                $.ajax({
                    url: api_url+'user/'+value.client,
                    headers: {'Authorization': 'Bearer ' + localStorage.token},
                    method: 'GET',
                    success: function (data_1) {
                        $(`#booking_client_${value.id}`).append(`${data_1.client}`);
                    }
                })
                if (value.booking_status == 0) {
                    $(`#booking_status_${value.id}`).append(`Не подтвержден`);
                    $(`#booking_check_${value.id}`).show();
                } else {
                    $(`#booking_status_${value.id}`).append(`Подтвержден`);
                    $(`#booking_check_${value.id}`).hide();
                }
            })
        },
        // Ошибка
        error: function (data) {
            if(data.status == 403){
                $('#no_admin').show();
                $('#div_place').hide();
            };
        }
    });
}

// Функция подтверждения карточек бронирования
function ok_booking(id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url + 'bookings/'+id,
        headers: {'Authorization': 'Bearer '+ localStorage.token},
        method: 'PATCH',
        // Успешный запрос
        success: function (data){
            // list_ok_booking();
            index_booking();
        },
        // Ошибка
        error: function (data) {

            // Проверка на администратора
            if (data.status == 403) {
                $('#no_admin').show();
                $('#form_store_place').hide();
            }


            // Вывод ошибок валидации

            // Ошибка в названии места в номере
            if (data.responseJSON.room_id != '') {
                $('.e_room_id_'+id).html(data.responseJSON.room_id);
            }
        }
    });
    return false;
}

// Функция удаления карточек бронирования
function delete_booking(id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url + 'booking/'+id,
        headers: {'Authorization': 'Bearer '+ localStorage.token},
        method: 'DELETE',
        // Успешный запрос
        success: function (data){
            // list_delete_booking();
            index_booking();
        },
        // Ошибка
        error: function (data) {

            // Проверка на администратора
            if (data.status == 403) {
                $('#no_admin').show();
                $('#form_store_place').hide();
            }
        }
    });
    return false;
}

// Функция открытия формы редактирования карточки бронирования
function form_update_booking(id) {
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+`booking/${id}`,
        headers: {'Authorization': 'Bearer ' + localStorage.token},
        method: 'GET',
        // Успешный запрос
        success: function (data){
            hide_form();
            $('#div_booking').show();
            $('#modal_update_booking').modal('show');
            $('#form_update_booking').show(1000);
            // Ajax запрос к серверу
            $.ajax({
                url: api_url+'category',
                method: 'GET',
                // Успешный запрос
                success: function (data_1) {
                    hide_form();
                    $('#div_booking').show();
                    $('#modal_update_booking').modal('show');
                    $('#form_update_booking').show();
                    $('#select_booking_category_room_new').html(
                        `
				            <option value="0">Категория номера (не выбрано)</option>                	
			            `
                    );
                    $.each(data_1, function (index, value) {
                        $('#select_booking_category_room_new').append(
                            `
					            <option value="${value.id}">
					            ${value.name_category}
					            </option>                	
					        `
                        );
                        $(`#select_booking_category_room_new`).click(function () {
                            add_update_room();
                            return false;
                        });
                    });
                    document.getElementById('select_booking_category_room_new').value = data.category_room;
                    // Ajax запрос к серверу
                    $.ajax({
                        url: api_url+`category/${data.category_room}`,
                        method: 'GET',
                        // Успешный запрос
                        success: function (data_2){
                            $('.note').html(`Максимум ${data_2.number_of_additional + data_2.number_of_main} места`);
                            places = data_2.number_of_additional + data_2.number_of_main;
                        }
                    });
                    // Ajax запрос к серверу
                    $.ajax({
                        url: api_url+'room',
                        method: 'GET',
                        // Успешный запрос
                        success: function (data_3){
                            $('#select_room_id_new').html(
                                `
                                    <option value="0">Идентификатор номера</option>
                                `
                            );
                            $.each(data_3, function (index_3, value_3) {
                                if (data.category_room == value_3.category_room) {
                                    $('#select_room_id_new').append(
                                        `
					                        <option value="${value_3.id}">${value_3.name_room}</option>
					                     `
                                    );
                                }
                            });
                            document.getElementById('select_room_id_new').value = data.room_id;
                        }
                    });

                }
            });



            document.getElementById('places_new').value = data.places;
            document.getElementById('start_date_new').value = data.start_date;
            document.getElementById('end_date_new').value = data.end_date;

            $('#update_booking').click(function(){
                    $('.error').html('');
                    update_booking(id);
                    return false;
            });
        },
        // Ошибка
        error: function (data) {
            if(data.status == 403){
                $('#no_admin').show();
                $('#div_place').hide();
            };
        }


    });
    return false;
};

// Функция запонения списка номеров в форме редактирования карточки бронирования
function add_update_room(){
    id_category_new = document.getElementById('select_booking_category_room_new').value;

    // Ajax запрос к серверу
    $.ajax({
        url: api_url+`category/${id_category_new}`,
        method: 'GET',
        // Успешный запрос
        success: function (data){
            $('.note').html(`Максимум ${data.number_of_additional + data.number_of_main} места`);
            places = data.number_of_additional + data.number_of_main;
        }
    });
    // Ajax запрос к серверу
    $.ajax({
        url: api_url+'room',
        method: 'GET',
        // Успешный запрос
        success: function (data){
            $('#select_room_id_new').html(
                `
				    <option value="0">Идентификатор номера</option>
			    `
            );
            $.each(data, function (index, value) {
                if (id_category_new == value.category_room) {
                    $('#select_room_id_new').append(
                        `
					        <option value="${value.id}">${value.name_room}</option>
					    `
                    );
                }
            });
        }
    });
};

// Функция редактирования карточки бронирования
function update_booking(id, room_id) {
    booking_category_room_new = document.getElementById('select_booking_category_room_new').value;
    start_date_new = document.getElementById('start_date_new').value;
    end_date_new = document.getElementById('end_date_new').value;
    end_date_new = document.getElementById('end_date_new').value;
    c_places_new = document.getElementById('places_new').value;

    if (booking_category_room_new == 0) {
        // Ошибка в выборе категории номера
        $('.e_category_room').html('The category room field is required.');
    } else {
        if (start_date_new > end_date) {
            // Ошибка в дате заселения/выселения
            $('.e_end_date').html(
                'Date of eviction cannot be earlier than date of settlement.'
            );
        } else {
            if (c_places_new > places){
                // Ошибка в количестве мест
                $('.e_places').html(
                    'The number of reserved seats may not exceed the number of additional seats.'
                );
            } else {
                // Ajax запрос на сервер
                $.ajax({
                    url: api_url + 'booking/'+id,
                    headers: {'Authorization': 'Bearer ' + localStorage.token},
                    method: 'PATCH',
                    data: $('#form_update_booking').serialize(),
                    // Успешный запрос
                    success: function (data) {
                        localStorage.rel = 5;
                        location.reload();
                    },
                    // Ошибка
                    error: function (data) {

                        // Проверка на администратора
                        if (data.status == 403) {
                            $('#no_admin').show();
                            $('#form_update_place').hide();
                        }
                        ;

                        // Вывод ошибок валидации

                        // Ошибка в названии места в номере
                        // if (data.responseJSON.name != '') {
                        //     $('.e_name').html(data.responseJSON.name);
                        // }
                    }
                });
            }
        }

    }
}










// Функция выполняемая при загрузке документа
$(document).ready(function () {

    // alert(localStorage.token);

    check_user();
    hide_form();
    $('#hello').show();


    // Если перезагрузка страницы выполнена после редактирования категории
    if (localStorage.rel == 1){
        hide_form();
        index_category();
        // $('#form_update_category_ok').show();
        localStorage.rel = 0;
    }

    // Если перезагрузка страницы выполнена после редактирования статуса
    if (localStorage.rel == 2){
        hide_form();
        index_status();
        localStorage.rel = 0;
    }

    // Если перезагрузка страницы выполнена после редактирования номера для проживания
    if (localStorage.rel == 3){
        hide_form();
        index_room();
        localStorage.rel = 0;
    }

    // Если перезагрузка страницы выполнена после редактирования места в номере для проживания
    if (localStorage.rel == 4){
        hide_form();
        index_place();
        localStorage.rel = 0;
    }

    // Если перезагрузка страницы выполнена после редактирования карточки бронирования
    if (localStorage.rel == 5){
        hide_form();
        index_booking();
        localStorage.rel = 0;
    }

    // Модальное окно регистрации
    var dialog = document.getElementById('reg');
    $('.registration_b').click(function () {
        dialog1.close();
        dialog.showModal(1000);
    });
    $('#close').click(function () {
        dialog.close(1000);
    });

    // Модальное окно авторизации
    var dialog1 = document.getElementById('auth');
    $('.login_b').click(function () {
        dialog.close();
        dialog1.showModal(1000);
    });
    $('.closes').click(function () {
        dialog1.close(1000);
    });

    // Отправка формы регистрации
    $('#butt-reg').click(function(){
        $('.error').html(' ');
        signup();
        return false;
    });

    // Отправка формы авторизации
    $('#butt_auth').click(function(){
        $('.error').html('');
        login();
        return false;
    });

    // Выход
    $('#logout').click(function(){
        logout();
        // return false;
    });

//=================================================
// ---------------------------------------Категории
//=================================================

    // При нажатии на ссылку Создать категорию
    $('#a_store_category').click(function(){
        clear_input();
        $('.card-header').html('Создание категорий номеров');
        hide_form();
        $('#form_store_category').show(1000);
    });

    // Создание категорий номеров
    $('#store_category').click(function(){
        $('.error').html('');
        store_category();
        return false;
    });

    // Возвращение к созданию категорий номеров
    $('#back_store_category').click(function () {

        clear_input();

        $('#form_store_category_ok').hide();
        $('#form_store_category').show();
        return false;
    });

    // При нажатии на ссылку получения категорий
    $('#a_index_category').click(function(){
        $('.card-header').html('Все доступные категории номеров');
        hide_form();
        index_category();
        return false;
    });

    $('.close_modal_category').click(function () {
        localStorage.rel = 1;
        location.reload();
    })

//=================================================
// ---------------------------------------Статусы
// =================================================

    // При нажатии на ссылку Создать статус номера
    $('#a_store_status').click(function(){
        clear_input();
        $('.card-header').html('Создание статуса номеров');
        hide_form();
        $('#form_store_status').show(1000);
    });

    // Создание статуса номеров
    $('#store_status').click(function(){
        $('.error').html('');
        store_status();
        return false;
    });

    // Возвращение к созданию статуса номеров
    $('#back_store_status').click(function () {

        clear_input();

        $('#form_store_status_ok').hide();
        $('#form_store_status').show();
        return false;
    });

    // При нажатии на ссылку получения статусов
    $('#a_index_status').click(function(){
        $('.card-header').html('Все доступные статусы номеров');
        hide_form();
        index_status();
        return false;
    })

    $('.close_modal_status').click(function () {
        localStorage.rel = 2;
        location.reload();
    })

//=================================================
// ------------------------Номера для проживания
// =================================================

    // При нажатии на ссылку Создать статус номера
    $('#a_store_room').click(function(){
        clear_input();
        $('.card-header').html('Создание номера для проживания');
        hide_form();
        open_form_store_room();
    });

    // Создание номеров для проживания
    $('#store_room').click(function(){
        $('.error').html('');
        store_room();
        return false;
    });

    // Возвращение к созданию номера для проживания
    $('#back_store_room').click(function () {

        clear_input();

        $('#form_store_room_ok').hide();
        $('#form_store_room').show();
        return false;
    });

    // При нажатии на ссылку получения статусов
    $('#a_index_room').click(function(){
        $('.card-header').html('Все доступные номера для проживании');
        hide_form();
        index_room();
        return false;
    })

    $('.close_modal_room').click(function () {
        localStorage.rel = 3;
        location.reload();
    })

//=================================================
// ---------------------------------Места в номере
//=================================================

    // При нажатии на ссылку Создать место в номере
    $('#a_store_place').click(function(){
        clear_input();
        $('.card-header').html('Создание места в номере');
        hide_form();
        open_form_store_place();
    });

    // Создание места в номере
    $('#store_place').click(function(){
        $('.error').html('');
        store_place();
        return false;
    });

    // Возвращение к созданию места в номере
    $('#back_store_place').click(function () {

        clear_input();

        $('#form_store_place_ok').hide();
        $('#form_store_place').show();
        return false;
    });

    // При нажатии на ссылку получения статусов
    $('#a_index_place').click(function(){
        $('.card-header').html('Все доступные места в номерах для проживании');
        hide_form();
        index_place();
        return false;
    })

    $('.close_modal_place').click(function () {
        localStorage.rel = 4;
        location.reload();
    })

//=================================================
// --------------------------Карточки бронирования
//=================================================

    // При нажатии на ссылку Создать карточку бронирования
    $('#a_store_booking').click(function(){
        clear_input();
        $('.card-header').html('Создание карточки бронирования');
        hide_form();
        open_form_store_booking();
    });

    // Создание карточки бронирования
    $('#store_booking').click(function(){
        $('.error').html('');
        store_booking();
        return false;
    });

    // Возвращение к созданию карточки бронирования
    $('#back_store_booking').click(function () {

        clear_input();

        hide_form();

        $('#select_room_id').html(
            `
				    <option value="0">Идентификатор номера</option>
			    `
        );

        open_form_store_booking();
        return false;
    });

    // При нажатии на ссылку получения карточек бронирования
    $('#a_index_booking').click(function(){
        $('.card-header').html('Все имеющиеся карточки бронирования');
        hide_form();
        index_booking();
        return false;
    })

    $('.close_modal_booking').click(function () {
        localStorage.rel = 5;
        location.reload();
    })
});