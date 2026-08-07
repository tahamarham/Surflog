import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Your dictionary of translations
const translations = {
  en: {
    accountDetails: 'Account Details',
    editProfile: 'Edit Profile',
    save: 'Save Changes',
    changePhoto: 'Change Photo',
    name: 'Full Name',
    bio: 'Bio',
    language: 'Language',
  },
  fr: {
    accountDetails: 'Détails du compte',
    editProfile: 'Modifier le profil',
    save: 'Enregistrer',
    changePhoto: 'Changer la photo',
    name: 'Nom complet',
    bio: 'Bio',
    language: 'Langue',
  },
  ar: {
    accountDetails: 'تفاصيل الحساب',
    editProfile: 'تعديل الملف الشخصي',
    save: 'حفظ التغييرات',
    changePhoto: 'تغيير الصورة',
    name: 'الاسم الكامل',
    bio: 'السيرة الذاتية',
    language: 'اللغة',
  },
  it: {
    accountDetails: 'Dettagli Account',
    editProfile: 'Modifica Profilo',
    save: 'Salva le modifiche',
    changePhoto: 'Cambia Foto',
    name: 'Nome Completo',
    bio: 'Biografia',
    language: 'Lingua',
  }
};

const i18n = new I18n(translations);

// Fallback to the device's language, or default to English
i18n.locale = Localization.getLocales()[0].languageCode ?? 'en';
i18n.enableFallback = true;

export default i18n;