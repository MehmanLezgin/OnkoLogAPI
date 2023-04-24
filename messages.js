const settings = require('./settings');
const messages_lez = require('./messages_lez');

const messages = {
    'en': {
        error_occured: 'An error has occurred',
        server_error: 'Server error',
        err404: '404 Page not found',
        username_taken: 'This username has already been taken',
        email_taken: 'This email is already taken',

        name_format_err: 'Name can only contain letters',
        name_err: 'Invalid name',
        name_len_err: `Name must be between ${settings.NAME_MIN_LEN} and ${settings.NAME_MAX_LEN} characters`,

        username_err: 'Incorrect username',
        username_len_err: `Username must be between ${settings.USERNAME_MIN_LEN} and ${settings.USERNAME_MAX_LEN} characters`,
        username_format_err: 'Username can only contain characters A-Z, a-z, 0-9 and _.',

        email_err: 'Invalid Email',
        email_format_err: 'Invalid Email Format',

        password_len_err: `Password length must be between ${settings.PASSWORD_MIN_LEN} and ${settings.PASSWORD_MAX_LEN} characters`,
        password_err: 'Incorrect Password',

        signup_err: 'Signup failed',
        signup_success: 'Signup succeeded!',

        user_not_found: 'User not found',
        wrong_password: 'Wrong password',
        sign_in_empty_err: 'Please provide a username and password',

        auth_required: 'Authorization required',
        token_expired: 'Session ended. Authorization required',

        project_not_found: 'Project not found',
        project_access_denied: 'Project access denied',
        project_delete_succes: 'Project deleted successfully',
        project_delete_failed: 'Failed to delete project',
        project_share_success: 'Project access rules saved successfully!',

        project_name_taken: 'Project with this name already exists',
        project_name_len_err: `Project name must be between ${settings.PROJECT_NAME_MIN_LEN} and ${settings.PROJECT_NAME_MAX_LEN} characters`,
        project_name_format_err: 'Project name can only contain letters, numbers and _.',
        project_create_failed: 'Failed to create project',
        project_create_success: 'Project created successfully',
        project_rename_success: 'Project was successfully renamed',

        patient_not_found: 'Patient not found',
        patient_delete_success: 'Patient deleted successfully',
        patient_add_success: 'Patient added successfully',
        patient_edit_success: 'Patient edited successfully',
        patient_import_success: 'Patient imported successfully',
        patient_already_exist: 'A patient with this name already exists',

        err_check_entered_data: 'Error. Check the entered data',

        remainder_import_success: 'Remainder imported successfully',
        import_same_project_err: 'Cannot be imported into the same project',
        edits_saved: 'Changes saved'
    },
    'ru': {
        error_occured: 'Произошла ошибка',
        server_error: 'Ошибка сервера',
        err404: '404 Страница не найдена',
        username_taken: 'Данное имя пользователя уже занято',
        email_taken: 'Данный email уже занят',

        name_format_err: 'Имя может состоять только из букв',
        name_err: 'Некорректное имя',
        name_len_err: `Длина имени должна быть от ${settings.NAME_MIN_LEN} до ${settings.NAME_MAX_LEN} символов`,

        username_err: 'Некорректный Логин',
        username_len_err: `Длина логина должна быть от ${settings.USERNAME_MIN_LEN} до ${settings.USERNAME_MAX_LEN} символов`,
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
    },
    'lez': messages_lez
}
module.exports = messages;