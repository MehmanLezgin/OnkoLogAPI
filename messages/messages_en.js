const settings = require('../settings');

module.exports = {
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
};