import { useTheme } from '../context/ThemeContext';

// Define translation types
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Define translations
const translations: Translations = {
  'common.welcome': {
    en: 'Welcome',
    es: 'Bienvenido',
    fr: 'Bienvenue',
    de: 'Willkommen',
    ja: 'ようこそ'
  },
  'common.home': {
    en: 'Home',
    es: 'Inicio',
    fr: 'Accueil',
    de: 'Startseite',
    ja: 'ホーム'
  },
  'common.blogs': {
    en: 'Blogs',
    es: 'Blogs',
    fr: 'Blogs',
    de: 'Blogs',
    ja: 'ブログ'
  },
  'common.create': {
    en: 'Create',
    es: 'Crear',
    fr: 'Créer',
    de: 'Erstellen',
    ja: '作成'
  },
  'common.save': {
    en: 'Save',
    es: 'Guardar',
    fr: 'Enregistrer',
    de: 'Speichern',
    ja: '保存'
  },
  'common.cancel': {
    en: 'Cancel',
    es: 'Cancelar',
    fr: 'Annuler',
    de: 'Abbrechen',
    ja: 'キャンセル'
  },
  'common.settings': {
    en: 'Settings',
    es: 'Configuración',
    fr: 'Paramètres',
    de: 'Einstellungen',
    ja: '設定'
  },
  'common.profile': {
    en: 'Profile',
    es: 'Perfil',
    fr: 'Profil',
    de: 'Profil',
    ja: 'プロフィール'
  },
  'common.logout': {
    en: 'Logout',
    es: 'Cerrar sesión',
    fr: 'Déconnexion',
    de: 'Abmelden',
    ja: 'ログアウト'
  },
  'settings.appearance': {
    en: 'Appearance',
    es: 'Apariencia',
    fr: 'Apparence',
    de: 'Aussehen',
    ja: '外観'
  },
  'settings.darkMode': {
    en: 'Dark Mode',
    es: 'Modo oscuro',
    fr: 'Mode sombre',
    de: 'Dunkelmodus',
    ja: 'ダークモード'
  },
  'settings.darkMode.description': {
    en: 'Switch between light and dark themes',
    es: 'Cambiar entre temas claros y oscuros',
    fr: 'Basculer entre les thèmes clair et sombre',
    de: 'Zwischen hellem und dunklem Design wechseln',
    ja: 'ライトテーマとダークテーマを切り替える'
  },
  'settings.notifications': {
    en: 'Notifications',
    es: 'Notificaciones',
    fr: 'Notifications',
    de: 'Benachrichtigungen',
    ja: '通知'
  },
  'settings.emailNotifications': {
    en: 'Email Notifications',
    es: 'Notificaciones por correo electrónico',
    fr: 'Notifications par e-mail',
    de: 'E-Mail-Benachrichtigungen',
    ja: 'メール通知'
  },
  'settings.emailNotifications.description': {
    en: 'Receive emails about blog updates',
    es: 'Recibir correos electrónicos sobre actualizaciones del blog',
    fr: 'Recevoir des e-mails sur les mises à jour du blog',
    de: 'E-Mails über Blog-Updates erhalten',
    ja: 'ブログの更新に関するメールを受け取る'
  },
  'settings.language': {
    en: 'Language',
    es: 'Idioma',
    fr: 'Langue',
    de: 'Sprache',
    ja: '言語'
  },
  'settings.selectLanguage': {
    en: 'Select Language',
    es: 'Seleccionar idioma',
    fr: 'Sélectionner la langue',
    de: 'Sprache auswählen',
    ja: '言語を選択'
  },
  'settings.security': {
    en: 'Security',
    es: 'Seguridad',
    fr: 'Sécurité',
    de: 'Sicherheit',
    ja: 'セキュリティ'
  },
  'settings.changePassword': {
    en: 'Change Password',
    es: 'Cambiar contraseña',
    fr: 'Changer le mot de passe',
    de: 'Passwort ändern',
    ja: 'パスワードを変更'
  },
  'settings.hide': {
    en: 'Hide',
    es: 'Ocultar',
    fr: 'Masquer',
    de: 'Verbergen',
    ja: '隠す'
  },
  'settings.currentPassword': {
    en: 'Current Password',
    es: 'Contraseña actual',
    fr: 'Mot de passe actuel',
    de: 'Aktuelles Passwort',
    ja: '現在のパスワード'
  },
  'settings.newPassword': {
    en: 'New Password',
    es: 'Nueva contraseña',
    fr: 'Nouveau mot de passe',
    de: 'Neues Passwort',
    ja: '新しいパスワード'
  },
  'settings.confirmPassword': {
    en: 'Confirm New Password',
    es: 'Confirmar nueva contraseña',
    fr: 'Confirmer le nouveau mot de passe',
    de: 'Neues Passwort bestätigen',
    ja: '新しいパスワードを確認'
  },
  'settings.updatePassword': {
    en: 'Update Password',
    es: 'Actualizar contraseña',
    fr: 'Mettre à jour le mot de passe',
    de: 'Passwort aktualisieren',
    ja: 'パスワードを更新'
  },
  'settings.saveSettings': {
    en: 'Save Settings',
    es: 'Guardar configuración',
    fr: 'Enregistrer les paramètres',
    de: 'Einstellungen speichern',
    ja: '設定を保存'
  },
  'home.welcome': {
    en: 'Welcome to',
    es: 'Bienvenido a',
    fr: 'Bienvenue sur',
    de: 'Willkommen bei',
    ja: 'ようこそ'
  },
  'home.tagline': {
    en: 'Discover stories, ideas, and insights from writers on any topic. Share your thoughts with the world.',
    es: 'Descubre historias, ideas y conocimientos de escritores sobre cualquier tema. Comparte tus pensamientos con el mundo.',
    fr: 'Découvrez des histoires, des idées et des analyses de rédacteurs sur n\'importe quel sujet. Partagez vos pensées avec le monde.',
    de: 'Entdecke Geschichten, Ideen und Erkenntnisse von Autoren zu jedem Thema. Teile deine Gedanken mit der Welt.',
    ja: 'あらゆるトピックについて、ライターの物語、アイデア、洞察を発見しましょう。あなたの考えを世界と共有しましょう。'
  },
  'home.getStarted': {
    en: 'Get Started',
    es: 'Comenzar',
    fr: 'Commencer',
    de: 'Loslegen',
    ja: '始める'
  },
  'home.exploreBlogs': {
    en: 'Explore Blogs',
    es: 'Explorar blogs',
    fr: 'Explorer les blogs',
    de: 'Blogs erkunden',
    ja: 'ブログを探索'
  },
  'home.searchPlaceholder': {
    en: 'Search articles, topics, or authors...',
    es: 'Buscar artículos, temas o autores...',
    fr: 'Rechercher des articles, des sujets ou des auteurs...',
    de: 'Artikel, Themen oder Autoren suchen...',
    ja: '記事、トピック、著者を検索...'
  },
  'home.allPosts': {
    en: 'All Posts',
    es: 'Todas las publicaciones',
    fr: 'Tous les articles',
    de: 'Alle Beiträge',
    ja: 'すべての投稿'
  },
  'home.featured': {
    en: 'Featured Post',
    es: 'Publicación destacada',
    fr: 'Article en vedette',
    de: 'Hervorgehobener Beitrag',
    ja: '注目の投稿'
  },
  'home.latestPosts': {
    en: 'Latest Posts',
    es: 'Últimas publicaciones',
    fr: 'Derniers articles',
    de: 'Neueste Beiträge',
    ja: '最新の投稿'
  },
  'home.postsTagged': {
    en: 'Posts tagged',
    es: 'Publicaciones etiquetadas',
    fr: 'Articles étiquetés',
    de: 'Beiträge mit dem Tag',
    ja: 'タグ付けされた投稿'
  },
  'home.searchResults': {
    en: 'Search results for',
    es: 'Resultados de búsqueda para',
    fr: 'Résultats de recherche pour',
    de: 'Suchergebnisse für',
    ja: 'の検索結果'
  },
  'home.noPostsFound': {
    en: 'No posts found. Try adjusting your search or filters.',
    es: 'No se encontraron publicaciones. Intenta ajustar tu búsqueda o filtros.',
    fr: 'Aucun article trouvé. Essayez d\'ajuster votre recherche ou vos filtres.',
    de: 'Keine Beiträge gefunden. Versuchen Sie, Ihre Suche oder Filter anzupassen.',
    ja: '投稿が見つかりませんでした。検索条件やフィルターを調整してみてください。'
  },
  'home.errorTitle': {
    en: 'Error Loading Blogs',
    es: 'Error al cargar blogs',
    fr: 'Erreur lors du chargement des blogs',
    de: 'Fehler beim Laden der Blogs',
    ja: 'ブログの読み込みエラー'
  },
  'home.retry': {
    en: 'Retry',
    es: 'Reintentar',
    fr: 'Réessayer',
    de: 'Erneut versuchen',
    ja: '再試行'
  },
  'home.loading': {
    en: 'Loading...',
    es: 'Cargando...',
    fr: 'Chargement...',
    de: 'Wird geladen...',
    ja: '読み込み中...'
  }
};

// Translation hook
export const useTranslation = () => {
  const { language } = useTheme();
  
  const t = (key: string, fallback?: string): string => {
    if (!translations[key]) {
      return fallback || key;
    }
    
    return translations[key][language] || translations[key]['en'] || fallback || key;
  };
  
  return { t };
};

export default useTranslation; 