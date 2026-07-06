// script.js — Pixel Nav with Typing Animation

(function() {
  'use strict';

  // ---------- TYPING ANIMATION ----------
  const greetingElement = document.getElementById('greetingText');
  const name = '👋 Hello, I\'m Geervani';
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function typeEffect() {
    const currentText = name.substring(0, charIndex);
    greetingElement.innerHTML = currentText + '<span class="typing-cursor"></span>';

    if (!isDeleting && charIndex < name.length) {
      charIndex++;
      typingTimeout = setTimeout(typeEffect, 100 + Math.random() * 50);
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      typingTimeout = setTimeout(typeEffect, 50 + Math.random() * 30);
    } else if (!isDeleting && charIndex === name.length) {
      typingTimeout = setTimeout(() => {
        isDeleting = true;
        typeEffect();
      }, 3000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      typingTimeout = setTimeout(typeEffect, 500);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (greetingElement) {
      greetingElement.innerHTML = '<span class="typing-cursor"></span>';
      setTimeout(typeEffect, 500);
    }
  });

  // ---------- ACTIVE LINK TRACKING (scroll spy) ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-list a');
  let isScrolling = false;
  let scrollTimeout;
  let currentActiveId = 'hero';

  function updateActiveLink(forceUpdate = false) {
    if (isScrolling && !forceUpdate) return;
    
    let currentId = '';
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.id;
      }
    });

    if (!currentId) {
      currentId = currentActiveId;
    }

    if (currentId !== currentActiveId) {
      currentActiveId = currentId;
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + currentId) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateActiveLink, { passive: true });

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateActiveLink, 100);
  });

  // ---------- SMOOTH SCROLL FOR NAV LINKS ----------
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          isScrolling = true;
          
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }
          
          navLinks.forEach(link => {
            link.removeAttribute('aria-current');
          });
          this.setAttribute('aria-current', 'page');
          currentActiveId = targetId.replace('#', '');
          
          const targetPosition = targetElement.offsetTop;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          scrollTimeout = setTimeout(() => {
            isScrolling = false;
            updateActiveLink(true);
          }, 800);
        }
      }
    });
  });

  // ---------- CONTACT FORM HANDLING WITH EMAILJS ----------
  // Initialize EmailJS (REPLACE WITH YOUR PUBLIC KEY)
  (function() {
    emailjs.init("YOUR_PUBLIC_KEY_HERE");
  })();

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('user_name').value.trim();
      const email = document.getElementById('user_email').value.trim();
      const message = document.getElementById('message').value.trim();
      const submitBtn = document.getElementById('submitBtn');
      const btnText = document.getElementById('btnText');
      const formStatus = document.getElementById('formStatus');

      // Validation
      if (!name || !email || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Show loading state
      btnText.textContent = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      formStatus.style.display = 'none';

      // Send email using EmailJS
      // REPLACE WITH YOUR SERVICE ID, TEMPLATE ID, AND PUBLIC KEY
      emailjs.send(
        'YOUR_SERVICE_ID',           // Replace with your Service ID
        'YOUR_TEMPLATE_ID',          // Replace with your Template ID
        {
          from_name: name,
          from_email: email,
          message: message,
          to_email: 'geervaninandinangalam26@gmail.com'
        }
      ).then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        showStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        btnText.textContent = 'Send Message';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        
        // Auto-hide status after 5 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      }, function(error) {
        console.log('FAILED...', error);
        showStatus('❌ Failed to send message. Please try again.', 'error');
        btnText.textContent = 'Send Message';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      });
    });
  }

  function showStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    formStatus.style.background = type === 'success' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)';
    formStatus.style.color = type === 'success' ? '#4ade80' : '#f87171';
    formStatus.style.border = type === 'success' ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(248, 113, 113, 0.3)';
  }

  // ---------- CHAT INPUT HANDLING ----------
  const chatInput = document.querySelector('.chat-input input');
  const chatSendBtn = document.querySelector('.chat-input button');
  const chatMessages = document.querySelector('.chat-messages');

  if (chatInput && chatSendBtn && chatMessages) {
    function sendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;

      const sentMessage = document.createElement('div');
      sentMessage.className = 'message sent';
      sentMessage.innerHTML = `
        <div class="message-content">
          <p>${text}</p>
          <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="message-avatar">👤</div>
      `;
      chatMessages.appendChild(sentMessage);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      setTimeout(() => {
        const botReplies = [
          "That's interesting! Tell me more.",
          "I love that perspective! 😊",
          "Great question! What do you think?",
          "Thanks for sharing that with me.",
          "That's really cool! How did you get into that?"
        ];
        const reply = botReplies[Math.floor(Math.random() * botReplies.length)];

        const botMessage = document.createElement('div');
        botMessage.className = 'message received';
        botMessage.innerHTML = `
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <p>${reply}</p>
            <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        `;
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000 + Math.random() * 1500);
    }

    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // ---------- KEYBOARD ACCESSIBILITY ----------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close any open mobile nav if needed
    }
  });

  console.log('🚀 Geervani\'s Portfolio (Dark Theme with Typing Animation) loaded successfully!');
})();