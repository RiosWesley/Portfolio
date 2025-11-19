export function initLoadingScreen(): void {
  const loadingText = document.getElementById('loading-text');
  const loadingScreen = document.getElementById('loading-screen');
  
  if (!loadingText || !loadingScreen) return;
  
  document.body.classList.add('loading');
  
  const finalText = 'CARREGANDO';
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  const chars = finalText.split('').map((char) => {
    const span = document.createElement('span');
    span.className = 'char glitching';
    const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
    span.textContent = char === ' ' ? '\u00A0' : randomChar;
    span.setAttribute('data-char', char === ' ' ? '\u00A0' : randomChar);
    span.setAttribute('data-final', char === ' ' ? '\u00A0' : char);
    return span;
  });
  
  loadingText.append(...chars);
  
  let glitchInterval: number | undefined;
  let glitchCount = 0;
  const maxGlitches = 4;
  const glitchSpeed = 25;
  
  function startGlitch(): void {
    glitchInterval = window.setInterval(() => {
      chars.forEach((charEl) => {
        const finalChar = charEl.getAttribute('data-final');
        if (finalChar && finalChar !== '\u00A0' && charEl.textContent !== finalChar) {
          const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
          charEl.textContent = randomChar;
          charEl.setAttribute('data-char', randomChar);
          charEl.classList.add('glitching');
        }
      });
      
      glitchCount++;
      
      if (glitchCount >= maxGlitches) {
        if (glitchInterval !== undefined) {
          clearInterval(glitchInterval);
        }
        
        chars.forEach((charEl, index) => {
          setTimeout(() => {
            const finalChar = charEl.getAttribute('data-final');
            if (finalChar && finalChar !== '\u00A0') {
              charEl.textContent = finalChar;
              charEl.setAttribute('data-char', finalChar);
              charEl.classList.remove('glitching');
              
              if (index === chars.length - 1 && loadingText) {
                setTimeout(() => {
                  loadingText.classList.add('final');
                  setTimeout(() => {
                    loadingText.classList.remove('final');
                  }, 300);
                }, 50);
              }
            }
          }, index * 20);
        });
      }
    }, glitchSpeed);
  }
  
  startGlitch();
  
  function hideLoadingScreen(): void {
    const minDisplayTime = 1500;
    const startTime = Date.now();
    
    function checkAndHide(): void {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);
      
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.classList.add('hidden');
          document.body.classList.remove('loading');
          setTimeout(() => {
            if (loadingScreen.parentNode) {
              loadingScreen.remove();
            }
          }, 600);
        }
      }, remaining);
    }
    
    if (document.readyState === 'complete') {
      checkAndHide();
    } else {
      window.addEventListener('load', checkAndHide);
    }
  }
  
  hideLoadingScreen();
}

