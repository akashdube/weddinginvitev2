with open('preview.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace divine-art-frame with divine-cutout-wrap
old_block = '''            <div class="divine-art-frame">
              <img src="./assets/shiva_parvati_hands.jpg" alt="Divine Union" class="divine-art-img" />
              <div class="divine-art-overlay"></div>
            </div>'''

new_block = '''            <div class="divine-cutout-wrap">
              <div class="divine-cutout-aura"></div>
              <img src="./assets/shiva_parvati_hands_cutout.png" alt="Shiva Parvati Vivah Divine Hands Union" class="divine-hands-cutout" />
            </div>'''

text = text.replace(old_block, new_block)

# For simulator card:
old_sim_block = '''              <div class="divine-art-frame">
                <img src="./assets/shiva_parvati_hands.jpg" alt="Divine Union" class="divine-art-img" />
                <div class="divine-art-overlay"></div>
              </div>'''

new_sim_block = '''              <div class="divine-cutout-wrap">
                <div class="divine-cutout-aura"></div>
                <img src="./assets/shiva_parvati_hands_cutout.png" alt="Shiva Parvati Vivah Divine Hands Union" class="divine-hands-cutout" id="sim-hands-cutout" style="transform: scale(1.42);" />
              </div>'''

text = text.replace(old_sim_block, new_sim_block)

# Update triggerSimUnseal in preview.html to add cutout zoom out
old_step5 = '''      // 5. Pop-up Card Elevates Forward from the envelope chamber
      setTimeout(() => {
        if (card) {
          card.style.transform = 'translateY(-36px) scale(1.06)';
          card.style.boxShadow = '0 30px 75px rgba(117, 82, 27, 0.35)';
        }
      }, 480);'''

new_step5 = '''      // 5. Pop-up Card Elevates Forward and Cutout Zooms Out!
      setTimeout(() => {
        if (card) {
          card.style.transform = 'translateY(-36px) scale(1.06)';
          card.style.boxShadow = '0 30px 75px rgba(117, 82, 27, 0.35)';
        }
        const simCutout = document.getElementById('sim-hands-cutout');
        if (simCutout) {
          simCutout.style.transition = 'transform 1.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease';
          simCutout.style.transform = 'scale(1.0)';
          simCutout.style.opacity = '1';
        }
      }, 380);'''

text = text.replace(old_step5, new_step5)

# Update resetSimEnvelope
old_reset = '''      if (card) {
        card.style.transform = '';
        card.style.boxShadow = '';
      }'''

new_reset = '''      if (card) {
        card.style.transform = '';
        card.style.boxShadow = '';
      }
      const simCutout = document.getElementById('sim-hands-cutout');
      if (simCutout) {
        simCutout.style.transition = 'none';
        simCutout.style.transform = 'scale(1.42)';
      }'''

text = text.replace(old_reset, new_reset)

with open('preview.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("preview.html updated with cutout and zoom-out logic successfully!")
