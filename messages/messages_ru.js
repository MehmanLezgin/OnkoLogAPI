const settings = require('../settings');

module.exports = {
    error_occured: "Произошла ошибка",
    server_error: "Ошибка сервера",
    err404: "404 Страница не найдена",
    username_taken: "Это имя пользователя уже занято",
    email_taken: "Этот адрес электронной почты уже используется",

    name_format_err: "Имя может содержать только буквы",
    name_err: "Некорректное имя",
    name_len_err: `Имя должно содержать от ${settings.NAME_MIN_LEN} до ${settings.NAME_MAX_LEN} символов`,

    username_err: "Некорректное имя пользователя",
    username_len_err: `Имя пользователя должно содержать от ${settings.USERNAME_MIN_LEN} до ${settings.USERNAME_MAX_LEN} символов`,
    username_format_err: "Имя пользователя может содержать только символы A-Z, a-z, 0-9 и _.",

    email_err: "Некорректный адрес электронной почты",
    email_format_err: "Некорректный формат адреса электронной почты",

    password_len_err: `Длина пароля должна быть от ${settings.PASSWORD_MIN_LEN} до ${settings.PASSWORD_MAX_LEN} символов`,
    password_err: "Неверный пароль",

    signup_err: "Ошибка при регистрации",
    signup_success: "Регистрация прошла успешно!",

    user_not_found: "Пользователь не найден",
    wrong_password: "Неверный пароль",
    sign_in_empty_err: "Пожалуйста, введите имя пользователя и пароль",

    auth_required: "Требуется авторизация",
    token_expired: "Сессия завершена. Требуется авторизация",

    project_not_found: "Проект не найден",
    project_access_denied: "Отказано в доступе к проекту",
    project_delete_succes: "Проект успешно удален",
    project_delete_failed: "Не удалось удалить проект",
    project_share_success: "Правила доступа к проекту успешно сохранены!",

    project_name_taken: "Проект с таким именем уже существует",
    project_name_len_err: `Имя проекта должно содержать от ${settings.PROJECT_NAME_MIN_LEN} до ${settings.PROJECT_NAME_MAX_LEN} символов`,
    project_name_format_err: "Имя проекта может содержать только буквы, цифры и _.",
    project_create_failed: "Не удалось создать проект",
    project_create_success: "Проект успешно создан",
    project_rename_success: "Проект успешно переименован",

    patient_not_found: "Пациент не найден",
    patient_delete_success: "Пациент успешно удален",
    patient_add_success: "Пациент успешно добавлен",
    patient_edit_success: "Пациент успешно отредактирован",
    patient_import_success: "Пациент успешно импортирован",
    patient_already_exist: "Пациент с таким именем уже существует",

    err_check_entered_data: "Ошибка. Проверьте введенные данные",

    remainder_import_success: "Остаток успешно импортирован",
    import_same_project_err: "Невозможно импортировать в тот же проект",
    edits_saved: "Изменения сохранены"
};