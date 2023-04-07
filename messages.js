const settings = require('./settings');

const messages = {
    'en': {
        err404: '404 Page not found',
        username_taken: 'This username already taken',
        email_taken: 'This email is already in use',
        name_err: 'Invalid name',
        name_format_err: 'Name can only contain letters',
        name_len_err: `Name length must be between ${settings.NAME_MIN_LEN} and ${settings.NAME_MAX_LEN} characters`,

        username_err: 'Invalid Login',
        username_len_err: `Username length must be between ${settings.USERNAME_MIN_LEN} and ${settings.USERNAME_MAX_LEN} characters`,
        username_format_err: 'Username can only contain letters (A-Z, a-z), numbers (0-9) and underscores (_)',

        email_err: 'Invalid Email',
        email_format_err: 'Invalid Email format',
        
        password_len_err: `Password length must be between ${settings.PASSWORD_MIN_LEN} and ${settings.PASSWORD_MAX_LEN} characters`,
        password_err: 'Invalid Password',

        signup_err: 'Sign up error',

        user_not_found: 'User not found',
        wrong_password: 'Wrong password',
        sign_in_empty_err: 'Please provide a username and password',

        auth_required: 'Authorization required',

        project_not_found: 'Project not found'
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

        user_not_found: 'Пользователь не найден',
        wrong_password: 'Неверный пароль',
        sign_in_empty_err: 'Пожалуйста, укажите имя пользователя и пароль',

        auth_required: 'Требуется авторизация',

        project_not_found: 'Проект не найден',
        project_access_denied: 'Отказано в доступе к проекту',
        project_delete_succes: 'Проект успешно удалён',
        project_delete_failed: 'Не удалось удалить проект',

        project_name_taken: 'Проект с таким названием уже существует',
        project_name_len_err: `Длина названия проекта должна быть от ${settings.PROJECT_NAME_MIN_LEN} до ${settings.PROJECT_NAME_MAX_LEN} символов`,
        project_create_failed: 'Не удалось создать проект',
        project_create_success: 'Проект успешно создан',
        project_rename_success: 'Проект успешно переименован',

        project_share_success: 'Правила доступа к проекту успешно сохранены!'
    }
}
module.exports = messages;