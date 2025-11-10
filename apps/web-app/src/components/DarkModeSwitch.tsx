import React, { useEffect, useState } from 'react';
import styles from 'Styles/DarkModeSwitch.module.css';

const DarkModeSwitch = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Verificar tema actual al montar
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      console.log('Dark mode check:', isDarkMode);
      setIsDark(isDarkMode);
    };

    checkDarkMode();

    // Escuchar cambios en la clase del HTML
    const observer = new MutationObserver((mutations) => {
      console.log('HTML class changed');
      checkDarkMode();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    console.log('Toggle dark mode:', checked);
    
    setIsDark(checked);
    
    if (checked) {
      console.log('Adding dark class');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      console.log('Removing dark class');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    console.log('Current classes:', document.documentElement.className);
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.switch}>
        <input 
          type="checkbox" 
          className={styles.input}
          checked={isDark}
          onChange={handleToggle}
          aria-label="Toggle dark mode"
        />
        <span className={styles.slider} />
      </label>
    </div>
  );
};

export default DarkModeSwitch;
