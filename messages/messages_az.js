const settings = require('../settings');

module.exports = {
    error_occured: "Səhv baş verdi",
    server_error: "Server səhvi",
    err404: "404 Səhifə tapılmadı",
    username_taken: "Bu istifadəçi adı artıq istifadə olunub",
    email_taken: "Bu e-poçt ünvanı artıq istifadə olunur",

    name_format_err: "Ad yalnız hərflərdən ibarət ola bilər",
    name_err: "Yanlış ad",
    name_len_err: `Ad ${settings.NAME_MIN_LEN} ilə ${settings.NAME_MAX_LEN} simvol arasında olmalıdır`,

    username_err: "Yanlış istifadəçi adı",
    username_len_err: `İstifadəçi adı ${settings.USERNAME_MIN_LEN} ilə ${settings.USERNAME_MAX_LEN} simvol arasında olmalıdır`,
    username_format_err: "İstifadəçi adı yalnız A-Z, a-z, 0-9 və _ simvollarını içərməlidir.",

    email_err: "Yanlış E-poçt ünvanı",
    email_format_err: "Yanlış E-poçt formatı",

    password_len_err: `Parol uzunluğu ${settings.PASSWORD_MIN_LEN} ilə ${settings.PASSWORD_MAX_LEN} simvol arasında olmalıdır`,
    password_err: "Yanlış parol",

    signup_err: "Qeydiyyatda səhv baş verdi",
    signup_success: "Qeydiyyat uğurla tamamlandı!",

    user_not_found: "İstifadəçi tapılmadı",
    wrong_password: "Yanlış parol",
    sign_in_empty_err: "Xahiş edirəm istifadəçi adı və parol daxil edin",

    auth_required: "Kimlik doğrulaması tələb olunur",
    token_expired: "Sessiya sona çatdı. Kimlik doğrulaması tələb olunur",

    project_not_found: "Proyekt tapılmadı",
    project_access_denied: "Proyekta giriş qadağandır",
    project_delete_succes: "Proyekt uğurla silindi",
    project_delete_failed: "Proyekti silmək mümkün olmadı",
    project_share_success: "Proyektin giriş qaydaları uğurla saxlanıldı!",

    project_name_taken: "Bu adla proyekt artıq mövcuddur",
    project_name_len_err: `Proyekt adı ${settings.PROJECT_NAME_MIN_LEN} ilə ${settings.PROJECT_NAME_MAX_LEN} simvol arasında olmalıdır`,
    project_name_format_err: "Proyekt adı yalnız hərflər, rəqəmlər və _ simvollarını içərməlidir.",
    project_create_failed: "Proyekt yaratmaq mümkün olmadı",
    project_create_success: "Proyekt uğurla yaradıldı",
    project_rename_success: "Proyekt uğurla yenidən adlandırıldı",

    patient_not_found: "Həkim tapılmadı",
    patient_delete_success: "Həkim uğurla silindi",
    patient_add_success: "Həkim uğurla əlavə edildi",
    patient_edit_success: "Həkim uğurla düzəldildi",
    patient_import_success: "Həkim uğurla idxal edildi",
    patient_already_exist: "Bu adla həkim artıq mövcuddur",

    err_check_entered_data: "Səhv. Daxil edilən məlumatları yoxlayın",

    remainder_import_success: "Qalıq uğurla idxal edildi",
    import_same_project_err: "Eyni proyektə idxal etmək mümkün deyil",
    edits_saved: "Dəyişikliklər qeydə alındı"
};