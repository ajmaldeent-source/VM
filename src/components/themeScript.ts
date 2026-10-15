// Applies the saved theme before paint to avoid a light/dark flash. Defaults to dark.
export const themeScript = `try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t!=='light')}catch(e){document.documentElement.classList.add('dark')}`;
