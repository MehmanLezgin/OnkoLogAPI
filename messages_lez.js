const settings = require('./settings');

const messages_lez = {
    error_occured: 'ГъалатI хьана',
    server_error: 'сервердин гъалатI',
    err404: '404 Ччин жагъанач',
    username_taken: 'Ин тIвар кьунава',
    email_taken: 'Ин email кьунава',

    name_format_err: 'ТIвар анжах гьарфарикай ибарат хьана кIанда',
    name_err: 'ТIвар дуьз туш',
    name_len_err: `ТIварцин яргъивал ${settings.NAME_MIN_LEN}-лай ${settings.NAME_MAX_LEN}-ал кьван символдикай ибарат хьана кIанда`,

    username_err: 'Логин дуьз туш',
    username_len_err: `Логиндин яргъивал ${settings.NAME_MIN_LEN}-лай ${settings.NAME_MAX_LEN}-ал кьван символдикай ибарат хьана кIанда`,

    username_len_err: `Логиндин яргъивал ${settings.USERNAME_MIN_LEN}-лай ${settings.USERNAME_MAX_LEN} символов`,
    username_format_err: 'Логин может содержать только символы A-Z, a-z, 0-9 и _.',

    email_err: 'Некорректный Email',
    email_format_err: 'Невалидный формат Email',

    password_len_err: `Длина пароля должна быть от ${settings.PASSWORD_MIN_LEN} до ${settings.PASSWORD_MAX_LEN} символов`,
    password_err: 'Некорректный Пароль',

    signup_err: 'Ошибка регистрации',
    signup_success: 'Регистрация прошла успешно!',

    user_not_found: 'Пользователь не найден',
    wrong_password: 'Неверный пароль',
    sign_in_empty_err: 'Пожалуйста, укажите имя пользователя и пароль',

    auth_required: 'Требуется авторизация',
    token_expired: 'Сессия завершена. Требуется авторизация',

    project_not_found: 'Проект не найден',
    project_access_denied: 'Отказано в доступе к проекту',
    project_delete_succes: 'Проект успешно удалён',
    project_delete_failed: 'Не удалось удалить проект',
    project_share_success: 'Правила доступа к проекту успешно сохранены!',

    project_name_taken: 'Проект с таким названием уже существует',
    project_name_len_err: `Длина названия проекта должна быть от ${settings.PROJECT_NAME_MIN_LEN} до ${settings.PROJECT_NAME_MAX_LEN} символов`,
    project_name_format_err: 'Название проекта может содержать только буквы, цифры и _.',
    project_create_failed: 'Не удалось создать проект',
    project_create_success: 'Проект успешно создан',
    project_rename_success: 'Проект успешно переименован',

    patient_not_found: 'Пациент не найден',
    patient_delete_success: 'Пациент успешно удалён',
    patient_add_success: 'Пациент успешно добавлен',
    patient_edit_success: 'Пациент успешно изменен',
    patient_import_success: 'Пациент успешно импортирован',
    patient_already_exist: 'Пациент с таким ФИО уже существует',

    err_check_entered_data: 'Ошибка. Проверьте введенные данные',

    remainder_import_success: 'Остаток успешно импортирован',
    import_same_project_err: 'Нельзя импортировать в тот же самый проект',
    edits_saved: 'Изменения сохранены'
}
module.exports = messages_lez;