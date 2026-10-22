import re

# Read preview.html
with open('preview.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Section HTML to insert before <!-- ======================================================================\n       INTERACTIVE DESIGN LAB: Wax Seal Size & Cursive Typography Options
studio_html = '''  <!-- ======================================================================
       INTERACTIVE DESIGN LAB: Pop-up Card Divine Union Artwork & AP Logo
       7 Handcrafted Designs with Whole Page Zoom-Out Animation
       ====================================================================== -->
  <section class="popup-studio-section" id="popup-studio">
    <div class="popup-studio-header">
      <span class="popup-studio-badge">✦ Handcrafted Design Lab</span>
      <h2 class="popup-studio-title">Pop-up Card: Sacred Shiva-Parvati Union &amp; AP Logo</h2>
      <p class="popup-studio-desc">
        When the royal wax seal breaks, the envelope doors swing open and this sacred card elevates into view with a 
        <strong>cinematic whole-page camera zoom-out animation</strong>. Review the <strong>7 handcrafted design variations</strong> 
        below, seamlessly blending the divine Shiva-Parvati hands artwork and the AP monogram into your wedding palette.
        Click any card to load it directly into the <strong>Live 3D Envelope Simulator</strong> below!
      </p>
    </div>

    <!-- Global Design Studio Controls Bar -->
    <div class="popup-controls-bar">
      <div class="popup-ctrl-group">
        <span class="popup-ctrl-label">Active Design:</span>
        <div class="btn-toggle-group" id="design-select-group">
          <button class="popup-toggle-btn active" data-design="1">1. Jharokha</button>
          <button class="popup-toggle-btn" data-design="2">2. Pichwai</button>
          <button class="popup-toggle-btn" data-design="3">3. Botanical</button>
          <button class="popup-toggle-btn" data-design="4">4. Sanctum</button>
          <button class="popup-toggle-btn" data-design="5">5. Lotus</button>
          <button class="popup-toggle-btn" data-design="6">6. Mehendi</button>
          <button class="popup-toggle-btn" data-design="7">7. Couture</button>
        </div>
      </div>

      <div class="popup-ctrl-group">
        <span class="popup-ctrl-label">AP Logo Finish:</span>
        <div class="btn-toggle-group" id="logo-select-group">
          <button class="popup-toggle-btn active" data-logo="gold">✨ Embossed Gold Foil</button>
          <button class="popup-toggle-btn" data-logo="maroon">🍷 Royal Burgundy Maroon</button>
        </div>
      </div>

      <div class="popup-ctrl-group">
        <span class="popup-ctrl-label">Zoom-Out Camera Style:</span>
        <div class="btn-toggle-group" id="camera-select-group">
          <button class="popup-toggle-btn active" data-zoom="stage-zoom-majestic">Majestic Pullback (0.90x)</button>
          <button class="popup-toggle-btn" data-zoom="stage-zoom-regal">Panoramic Overview (0.86x)</button>
          <button class="popup-toggle-btn" data-zoom="stage-zoom-float">Cinematic Float (0.96x)</button>
        </div>
      </div>
    </div>

    <!-- 7 Handcrafted Designs Comparison Grid -->
    <div class="popup-designs-grid" id="popup-designs-grid">

      <!-- Design 1: Royal Jharokha Arch -->
      <div class="popup-design-card selected" data-design="1" id="design-card-1">
        <span class="card-num-tag">Design 01 • Recommended</span>
        <div class="card-preview-stage">
          <div class="divine-popup-card theme-jharokha" style="width: 270px; height: 360px;">
            <div class="divine-header">
              <span class="divine-shloka">॥ श्री गणेशाय नमः ॥</span>
              <div class="divine-ap-logo-wrap">
                <img src="./assets/ap_logo_gold.png" alt="AP Logo" class="divine-ap-logo-img logo-target" />
              </div>
            </div>
            <div class="divine-art-frame">
              <img src="./assets/shiva_parvati_hands.jpg" alt="Divine Union" class="divine-art-img" />
              <div class="divine-art-overlay"></div>
            </div>
            <div class="divine-footer">
              <div class="divine-names-wrap">
                <span class="divine-name">Pranshi</span>
                <span class="divine-amp">&amp;</span>
                <span class="divine-name">Akash</span>
              </div>
              <div class="divine-sub-badge">
                <span>✦</span>
                <span>#APforever</span>
                <span>•</span>
                <span>18 &amp; 20 Nov 2026</span>
              </div>
            </div>
          </div>
        </div>
        <div class="popup-card-meta">
          <h3 class="popup-card-title">1. Royal Jharokha Arch</h3>
          <span class="popup-card-tagline">Mughal Palace Pavilion &amp; Gold Embossed Trim</span>
          <p class="popup-card-desc">
            The sacred Shiva-Parvati painting is housed in a classic scalloped Mughal jharokha arch with golden filigree trim. Above it, the gold foil AP monogram shines under the divine Ganesha shloka.
          </p>
          <div class="popup-card-swatches">
            <span class="swatch-dot" style="background:#c29d59;" title="Gold Foil"></span>
            <span class="swatch-dot" style="background:#fdfcf9;" title="Warm Ivory"></span>
            <span class="swatch-dot" style="background:#2b221a;" title="Royal Sepia"></span>
            <span class="swatch-dot" style="background:#e5adb1;" title="Lotus Pink"></span>
          </div>
          <button class="btn-select-design" onclick="selectDesign(1)">✦ Preview in Live Envelope</button>
        </div>
      </div>

      <!-- Design 2: Sacred Pichwai & Silk Scroll -->
      <div class="popup-design-card" data-design="2" id="design-card-2">
        <span class="card-num-tag">Design 02</span>
        <div class="card-preview-stage">
          <div class="divine-popup-card theme-pichwai" style="width: 270px; height: 360px;">
            <div class="divine-header">
              <span class="divine-shloka">॥ अखंड सौभाग्यवती भव ॥</span>
              <div class="divine-ap-logo-wrap">
                <img src="./assets/ap_logo_maroon.png" alt="AP Logo" class="divine-ap-logo-img logo-target" />
              </div>
            </div>
            <div class="divine-art-frame">
              <img src="./assets/shiva_parvati_hands.jpg" alt="Divine Union" class="divine-art-img" />
              <div class="divine-art-overlay"></div>
            </div>
            <div class="divine-footer">
              <div class="divine-names-wrap">
                <span class="divine-name">Pranshi</span>
                <span class="divine-amp">&amp;</span>
                <span class="divine-name">Akash</span>
              </div>
              <div class="divine-sub-badge">
                <span>✦</span>
                <span>#APforever</span>
                <span>•</span>
                <span>Sacred Bond</span>
              </div>
            </div>
          </div>
        </div>
        <div class="popup-card-meta">
          <h3 class="popup-card-title">2. Sacred Pichwai &amp; Silk Scroll</h3>
          <span class="popup-card-tagline">Burgundy Velvet Border &amp; Warm Parchment</span>
          <p class="popup-card-desc">
            Rich royal burgundy velvet border matching Goddess Parvati\'s bridal dupatta. Centered with the maroon AP monogram, gold dashed pinstripes, and the timeless marital blessing.
          </p>
          <div class="popup-card-swatches">
            <span class="swatch-dot" style="background:#6b1419;" title="Royal Burgundy"></span>
            <span class="swatch-dot" style="background:#fbf5eb;" title="Silk Parchment"></span>
            <span class="swatch-dot" style="background:#c29d59;" title="Gold Foil"></span>
          </div>
          <button class="btn-select-design" onclick="selectDesign(2)">✦ Preview in Live Envelope</button>
        </div>
      </div>

      <!-- Design 3: Modern Botanical Editorial -->
      <div class="popup-design-card" data-design="3" id="design-card-3">
        <span class="card-num-tag">Design 03</span>
        <div class="card-preview-stage">
          <div class="divine-popup-card theme-botanical" style="width: 270px; height: 360px;">
            <div class="divine-header">
              <span class="divine-shloka">॥ शुभ मुहूर्त • कल्याणम् ॥</span>
              <div class="divine-ap-logo-wrap">
                <img src="./assets/ap_logo_gold.png" alt="AP Logo" class="divine-ap-logo-img logo-target" />
              </div>
            </div>
            <div class="divine-art-frame">
              <img src="./assets/shiva_parvati_hands.jpg" alt="Divine Union" class="divine-art-img" />
              <div class="divine-art-overlay"></div>
            </div>
            <div class="divine-footer">
              <div class="divine-names-wrap">
                <span class="divine-name">PRANSHI &amp; AKASH</span>
              </div>
              <div class="divine-sub-badge">
                <span>✦</span>
                <span>#APforever</span>
                <span>•</span>
                <span>Editorial Edition</span>
              </div>
            </div>
          </div>
        </div>
        <div class="popup-card-meta">
          <h3 class="popup-card-title">3. Modern Botanical Editorial</h3>
          <span class="popup-card-tagline">Minimalist Alabaster &amp; Sage Leaf Harmony</span>
          <p class="popup-card-desc">
            A high-fashion modern editorial layout: the AP logo is nested in a delicate sage-ring crest, framed by crisp olive borders, clean spaced typography, and pure white negative space.
          </p>
          <div class="popup-card-swatches">
            <span class="swatch-dot" style="background:#78967c;" title="Sage Green"></span>
            <span class="swatch-dot" style="background:#ffffff;" title="Pure Alabaster"></span>
            <span class="swatch-dot" style="background:#c29d59;" title="Gold Accent"></span>
          </div>
          <button class="btn-select-design" onclick="selectDesign(3)">✦ Preview in Live Envelope</button>
        </div>
      </div>

      <!-- Design 4: Swarna Mandir (Golden Temple Sanctum) -->
      <div class="popup-design-card" data-design="4" id="design-card-4">
        <span class="card-num-tag">Design 04</span>
        <div class="card-preview-stage">
          <div class="divine-popup-card theme-sanctum" style="width: 270px; height: 360px;">
            <div class="divine-header">
              <span class="divine-shloka">॥ ॐ नमः शिवाय ॥</span>
              <div class="divine-ap-logo-wrap">
                <img src="./assets/ap_logo_gold.png" alt="AP Logo" class="divine-ap-logo-img logo-target" />
              </div>
            </div>
            <div class="divine-art-frame">
              <img src="./assets/shiva_parvati_hands.jpg" alt="Divine Union" class="divine-art-img" />
              <div class="divine-art-overlay"></div>
            </div>
            <div class="divine-footer">
              <div class="divine-names-wrap">
                <span class="divine-name">Pranshi</span>
                <span class="divine-amp">&amp;</span>
                <span class="divine-name">Akash</span>
              </div>
              <div class="divine-sub-badge">
                <span>✦</span>
                <span>#APforever</span>
                <span>•</span>
                <span>Golden Aura</span>
              </div>
            </div>
          </div>
        </div>
        <div class="popup-card-meta">
          <h3 class="popup-card-title">4. Swarna Mandir Sanctum</h3>
          <span class="popup-card-tagline">Sacred Shiva Mantra &amp; Shimmering Golden Aura</span>
          <p class="popup-card-desc">
            Surrounded by golden temple repousse borders with an animated sunburst halo glowing behind the AP logo. Dedicated with the auspicious mantra <em>॥ ॐ नमः शिवाय ॥</em>.
          </p>
          <div class="popup-card-swatches">
            <span class="swatch-dot" style="background:#c29d59;" title="Deep Gold"></span>
            <span class="swatch-dot" style="background:#f7e4a8;" title="Sunburst Glow"></span>
            <span class="swatch-dot" style="background:#8c6a23;" title="Antique Ochre"></span>
          </div>
          <button class="btn-select-design" onclick="selectDesign(4)">✦ Preview in Live Envelope</button>
        </div>
      </div>

      <!-- Design 5: Botanical Pavilion & Lotus -->
      <div class="popup-design-card" data-design="5" id="design-card-5">
        <span class="card-num-tag">Design 05</span>
        <div class="card-preview-stage">
          <div class="divine-popup-card theme-lotus" style="width: 270px; height: 360px;">
            <div class="divine-header">
              <span class="divine-shloka">॥ प्रेम परिणय सूत्र ॥</span>
              <div class="divine-ap-logo-wrap">
                <img src="./assets/ap_logo_gold.png" alt="AP Logo" class="divine-ap-logo-img logo-target" />
              </div>
            </div>
            <div class="divine-art-frame">
              <img src="./assets/shiva_parvati_hands.jpg" alt="Divine Union" class="divine-art-img" />
              <div class="divine-art-overlay"></div>
            </div>
            <div class="divine-footer">
              <div class="divine-names-wrap">
                <span class="divine-name">Pranshi</span>
                <span class="divine-amp">&amp;</span>
                <span class="divine-name">Akash</span>
              </div>
              <div class="divine-sub-badge">
                <span>✦</span>
                <span>#APforever</span>
                <span>•</span>
                <span>Lotus Blossom</span>
              </div>
            </div>
          </div>
        </div>
        <div class="popup-card-meta">
          <h3 class="popup-card-title">5. Botanical Pavilion &amp; Lotus</h3>
          <span class="popup-card-tagline">Lotus Petal Pink &amp; Champagne Gold Accents</span>
          <p class="popup-card-desc">
            Extracted from the soft pink lotus blossoms in the lower corners of the artwork. Soft dusty-rose borders, French Parisienne calligraphy, and champagne gold floral highlights.
          </p>
          <div class="popup-card-swatches">
            <span class="swatch-dot" style="background:#e5adb1;" title="Lotus Petal"></span>
            <span class="swatch-dot" style="background:#dfbe7d;" title="Champagne Gold"></span>
            <span class="swatch-dot" style="background:#fdfaf7;" title="Blush Ivory"></span>
          </div>
          <button class="btn-select-design" onclick="selectDesign(5)">✦ Preview in Live Envelope</button>
        </div>
      </div>

      <!-- Design 6: Royal Mehendi & Alta Bridal -->
      <div class="popup-design-card" data-design="6" id="design-card-6">
        <span class="card-num-tag">Design 06</span>
        <div class="card-preview-stage">
          <div class="divine-popup-card theme-mehendi" style="width: 270px; height: 360px;">
            <div class="divine-header">
              <span class="divine-shloka">॥ शुभ विवाह • मंगलम् ॥</span>
              <div class="divine-ap-logo-wrap">
                <img src="./assets/ap_logo_maroon.png" alt="AP Logo" class="divine-ap-logo-img logo-target" />
              </div>
            </div>
            <div class="divine-art-frame">
              <img src="./assets/shiva_parvati_hands.jpg" alt="Divine Union" class="divine-art-img" />
              <div class="divine-art-overlay"></div>
            </div>
            <div class="divine-footer">
              <div class="divine-names-wrap">
                <span class="divine-name">Pranshi</span>
                <span class="divine-amp">&amp;</span>
                <span class="divine-name">Akash</span>
              </div>
              <div class="divine-sub-badge">
                <span>✦</span>
                <span>#APforever</span>
                <span>•</span>
                <span>Bridal Alta &amp; Henna</span>
              </div>
            </div>
          </div>
        </div>
        <div class="popup-card-meta">
          <h3 class="popup-card-title">6. Royal Mehendi &amp; Alta</h3>
          <span class="popup-card-tagline">Traditional Vermilion, Henna &amp; Gold Inlay</span>
          <p class="popup-card-desc">
            Celebrates the exquisite bridal mehendi on Parvati\'s hand. Features a vermilion red inner bezel, deep burgundy typography, and dual-tone gold wire inlay.
          </p>
          <div class="popup-card-swatches">
            <span class="swatch-dot" style="background:#a33b47;" title="Vermilion Alta"></span>
            <span class="swatch-dot" style="background:#c29d59;" title="Gold Wire"></span>
            <span class="swatch-dot" style="background:#fcf9f2;" title="Warm Linen"></span>
          </div>
          <button class="btn-select-design" onclick="selectDesign(6)">✦ Preview in Live Envelope</button>
        </div>
      </div>

      <!-- Design 7: Contemporary Frosted Glass & Gold Foil -->
      <div class="popup-design-card" data-design="7" id="design-card-7">
        <span class="card-num-tag">Design 07</span>
        <div class="card-preview-stage">
          <div class="divine-popup-card theme-couture" style="width: 270px; height: 360px;">
            <div class="divine-header">
              <span class="divine-shloka">॥ SACRED UNION • 2026 ॥</span>
              <div class="divine-ap-logo-wrap">
                <img src="./assets/ap_logo_gold.png" alt="AP Logo" class="divine-ap-logo-img logo-target" />
              </div>
            </div>
            <div class="divine-art-frame">
              <img src="./assets/shiva_parvati_hands.jpg" alt="Divine Union" class="divine-art-img" />
              <div class="divine-art-overlay"></div>
            </div>
            <div class="divine-footer">
              <div class="divine-names-wrap">
                <span class="divine-name" style="font-family:'Cormorant Garamond',serif; font-size:1.35rem; font-weight:700;">Pranshi &amp; Akash</span>
              </div>
              <div class="divine-sub-badge">
                <span>✦</span>
                <span>#APforever</span>
                <span>•</span>
                <span>Couture Glass</span>
              </div>
            </div>
          </div>
        </div>
        <div class="popup-card-meta">
          <h3 class="popup-card-title">7. Couture Frosted Glass</h3>
          <span class="popup-card-tagline">Glassmorphic Layering &amp; High-Gloss Monogram</span>
          <p class="popup-card-desc">
            Ultra-modern luxury wedding stationery: translucent frosted glass layering with beveled specular highlights, floating glass plaque for the AP logo, and architectural poise.
          </p>
          <div class="popup-card-swatches">
            <span class="swatch-dot" style="background:rgba(255,255,255,0.85); border:1px solid #c29d59;" title="Frosted Glass"></span>
            <span class="swatch-dot" style="background:#c29d59;" title="Gold Foil"></span>
            <span class="swatch-dot" style="background:#1e1e1e;" title="Modern Noir"></span>
          </div>
          <button class="btn-select-design" onclick="selectDesign(7)">✦ Preview in Live Envelope</button>
        </div>
      </div>

    </div>

    <!-- Live 3D Envelope & Camera Zoom Simulator -->
    <div class="simulator-anchor-wrap" id="envelope-simulator-stage">
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="popup-studio-badge" style="background:#f0ebe2; color:#5c471c;">Live 3D Envelope Simulation</span>
        <h3 style="font-family: var(--font-serif); font-size: 1.85rem; color: #242c26; margin-top: 4px;">
          Active Pop-up Card: <span id="active-design-label" style="color: #8c6a23;">Design 1 (Royal Jharokha Arch)</span>
        </h3>
        <p style="font-size: 0.9rem; color: #666; max-width: 600px; margin: 0 auto;">
          Click the gold wax seal or use the action button below to watch the <strong>whole-page camera zoom-out pullback</strong>, 
          doors swinging open, and the pop-up card rising from the envelope!
        </p>
      </div>

      <!-- The Live Interactive 3D Envelope Container -->
      <div style="display: flex; justify-content: center; align-items: center; min-height: 520px; perspective: 1200px;">
        <div class="envelope-stage stage-camera-focused stage-zoom-majestic" id="live-sim-stage" style="width: 350px; height: 470px; position: relative;">
          
          <!-- Back Chamber Shadow -->
          <div style="position: absolute; inset: 0; background: #e8ded0; border-radius: 16px; box-shadow: 0 15px 45px rgba(0,0,0,0.12);"></div>

          <!-- Inside Pop-up Invitation Card (Elevates on Unseal) -->
          <div class="envelope-invitation-card" id="live-sim-card" style="position: absolute; inset: 16px; border-radius: 14px; z-index: 10; padding: 0; overflow: hidden; background: transparent; border: none; transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 1.2s ease;">
            
            <div class="divine-popup-card theme-jharokha" id="sim-active-card-content" style="width: 100%; height: 100%;">
              <div class="divine-header">
                <span class="divine-shloka" id="sim-card-shloka">॥ श्री गणेशाय नमः ॥</span>
                <div class="divine-ap-logo-wrap">
                  <img src="./assets/ap_logo_gold.png" alt="AP Logo" class="divine-ap-logo-img" id="sim-card-logo" />
                </div>
              </div>
              <div class="divine-art-frame">
                <img src="./assets/shiva_parvati_hands.jpg" alt="Divine Union" class="divine-art-img" />
                <div class="divine-art-overlay"></div>
              </div>
              <div class="divine-footer">
                <div class="divine-names-wrap">
                  <span class="divine-name" id="sim-card-bride">Pranshi</span>
                  <span class="divine-amp">&amp;</span>
                  <span class="divine-name" id="sim-card-groom">Akash</span>
                </div>
                <div class="divine-sub-badge" id="sim-card-badge">
                  <span>✦</span>
                  <span>#APforever</span>
                  <span>•</span>
                  <span>18 &amp; 20 Nov 2026</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Gatefold Palace Doors: Left & Right -->
          <div id="sim-gate-left" style="position: absolute; top: 0; left: 0; width: 175px; height: 470px; background: linear-gradient(135deg, #fdfbf8 0%, #f5ede2 100%); border-radius: 16px 0 0 16px; border: 1px solid #e0d5c3; border-right: none; z-index: 20; transform-origin: left center; transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1); box-shadow: 2px 0 10px rgba(0,0,0,0.06);">
            <div style="position: absolute; inset: 12px; border: 1px dashed rgba(194, 157, 89, 0.5); border-radius: 10px 0 0 10px;"></div>
          </div>

          <div id="sim-gate-right" style="position: absolute; top: 0; right: 0; width: 175px; height: 470px; background: linear-gradient(225deg, #fdfbf8 0%, #f5ede2 100%); border-radius: 0 16px 16px 0; border: 1px solid #e0d5c3; border-left: none; z-index: 20; transform-origin: right center; transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1); box-shadow: -2px 0 10px rgba(0,0,0,0.06);">
            <div style="position: absolute; inset: 12px; border: 1px dashed rgba(194, 157, 89, 0.5); border-radius: 0 10px 10px 0;"></div>
          </div>

          <!-- Silk Ribbon Band across the Center Seam -->
          <div class="envelope-ribbon-band" id="sim-ribbon" style="position: absolute; top: 50%; left: 0; right: 0; height: 56px; transform: translateY(-50%); background: linear-gradient(90deg, #ecd3be 0%, #f7ede3 50%, #ecd3be 100%); border-top: 1px solid rgba(194, 157, 89, 0.45); border-bottom: 1px solid rgba(194, 157, 89, 0.45); box-shadow: 0 4px 14px rgba(0,0,0,0.08); z-index: 25; pointer-events: none; transition: opacity 0.4s ease, transform 0.4s ease;"></div>

          <!-- 3D Gold Wax Seal Monogram Locking Palace Doors -->
          <div class="wax-seal-wrapper" id="sim-seal-wrapper" onclick="triggerSimUnseal()" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 35; cursor: pointer; transition: transform 0.3s ease;">
            <div class="wax-seal-stamp" id="sim-seal-stamp" style="width: 112px; height: 112px; border-radius: 50%; background-image: url('./assets/wax_seal_pa.png?v=2'); background-position: center; background-repeat: no-repeat; background-size: contain; filter: drop-shadow(0 14px 28px rgba(117, 82, 27, 0.45)); transition: transform 0.4s ease, opacity 0.4s ease;">
            </div>
            <div class="seal-prompt" id="sim-seal-prompt" style="position: absolute; top: calc(100% + 14px); left: 50%; transform: translateX(-50%); white-space: nowrap; margin-top: 0; font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 600; color: #8c6a23; background: rgba(255,255,255,0.96); padding: 6px 20px; border-radius: 999px; box-shadow: 0 6px 20px rgba(0,0,0,0.08); border: 1px solid rgba(194, 157, 89, 0.35);">
              Tap to Break Seal
            </div>
          </div>

        </div>
      </div>

      <!-- Action Buttons -->
      <div class="sim-actions-bar">
        <button class="sim-action-btn btn-trigger-unseal" id="btn-unseal-action" onclick="triggerSimUnseal()">
          <span>✦ Break Seal &amp; Trigger Zoom-Out Animation</span>
        </button>
        <button class="sim-action-btn btn-reset-envelope" onclick="resetSimEnvelope()">
          <span>↺ Reseal &amp; Try Another Design</span>
        </button>
      </div>
    </div>

  </section>

'''

# Target line to insert before
target = '<!-- ======================================================================\n       INTERACTIVE DESIGN LAB: Wax Seal Size & Cursive Typography Options'

if target in content:
    content = content.replace(target, studio_html + '\n  ' + target, 1)
    print("Inserted studio_html successfully!")
else:
    print("Target not found with exact match, attempting regex...")
    pattern = r'<!--\s*={10,}\s*\n\s*INTERACTIVE DESIGN LAB:\s*Wax Seal Size'
    m = re.search(pattern, content)
    if m:
        content = content[:m.start()] + studio_html + '\n  ' + content[m.start():]
        print("Inserted via regex match!")
    else:
        print("Failed to find insertion location!")

# Also append the script for popup studio before </body>
script_code = '''
    // ======================================================================
    // POP-UP CARD DESIGN STUDIO & LIVE ENVELOPE SIMULATOR LOGIC
    // ======================================================================
    let currentSelectedDesign = 1;
    let currentLogoFinish = 'gold';
    let currentZoomStyle = 'stage-zoom-majestic';
    let isSimUnsealed = false;

    const designThemeMap = {
      1: {
        themeClass: 'theme-jharokha',
        name: 'Design 1 (Royal Jharokha Arch)',
        shloka: '॥ श्री गणेशाय नमः ॥',
        bride: 'Pranshi',
        groom: 'Akash',
        badge: '✦ #APforever • 18 & 20 Nov 2026'
      },
      2: {
        themeClass: 'theme-pichwai',
        name: 'Design 2 (Sacred Pichwai & Silk Scroll)',
        shloka: '॥ अखंड सौभाग्यवती भव ॥',
        bride: 'Pranshi',
        groom: 'Akash',
        badge: '✦ #APforever • Sacred Bond'
      },
      3: {
        themeClass: 'theme-botanical',
        name: 'Design 3 (Modern Botanical Editorial)',
        shloka: '॥ शुभ मुहूर्त • कल्याणम् ॥',
        bride: 'PRANSHI & AKASH',
        groom: '',
        badge: '✦ #APforever • Editorial Edition'
      },
      4: {
        themeClass: 'theme-sanctum',
        name: 'Design 4 (Swarna Mandir Golden Sanctum)',
        shloka: '॥ ॐ नमः शिवाय ॥',
        bride: 'Pranshi',
        groom: 'Akash',
        badge: '✦ #APforever • Golden Aura'
      },
      5: {
        themeClass: 'theme-lotus',
        name: 'Design 5 (Botanical Pavilion & Lotus)',
        shloka: '॥ प्रेम परिणय सूत्र ॥',
        bride: 'Pranshi',
        groom: 'Akash',
        badge: '✦ #APforever • Lotus Blossom'
      },
      6: {
        themeClass: 'theme-mehendi',
        name: 'Design 6 (Royal Mehendi & Alta)',
        shloka: '॥ शुभ विवाह • मंगलम् ॥',
        bride: 'Pranshi',
        groom: 'Akash',
        badge: '✦ #APforever • Bridal Alta & Henna'
      },
      7: {
        themeClass: 'theme-couture',
        name: 'Design 7 (Couture Frosted Glass)',
        shloka: '॥ SACRED UNION • 2026 ॥',
        bride: 'Pranshi & Akash',
        groom: '',
        badge: '✦ #APforever • Couture Glass'
      }
    };

    window.selectDesign = function(num) {
      currentSelectedDesign = num;

      // Update Card highlights
      document.querySelectorAll('.popup-design-card').forEach(c => c.classList.remove('selected'));
      const activeCard = document.getElementById('design-card-' + num);
      if (activeCard) activeCard.classList.add('selected');

      // Update Top Toggle buttons
      document.querySelectorAll('#design-select-group .popup-toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-design') == num);
      });

      // Update Simulator Card Content
      const data = designThemeMap[num];
      const cardContent = document.getElementById('sim-active-card-content');
      if (cardContent && data) {
        cardContent.className = 'divine-popup-card ' + data.themeClass;
        document.getElementById('sim-card-shloka').textContent = data.shloka;
        document.getElementById('sim-card-bride').textContent = data.bride;
        const groomEl = document.getElementById('sim-card-groom');
        if (groomEl) groomEl.textContent = data.groom;
        document.getElementById('sim-card-badge').innerHTML = '<span>✦</span><span>#APforever</span><span>•</span><span>' + data.badge.split('•')[1] + '</span>';
      }

      const labelEl = document.getElementById('active-design-label');
      if (labelEl && data) labelEl.textContent = data.name;

      // Smooth scroll to simulator if user clicked a card
      const simStage = document.getElementById('envelope-simulator-stage');
      if (simStage && window.scrollY < simStage.offsetTop - 300) {
        simStage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };

    // Design button listeners
    document.querySelectorAll('#design-select-group .popup-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = parseInt(btn.getAttribute('data-design'), 10);
        selectDesign(d);
      });
    });

    // Logo finish switcher
    document.querySelectorAll('#logo-select-group .popup-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#logo-select-group .popup-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const finish = btn.getAttribute('data-logo');
        currentLogoFinish = finish;

        const logoSrc = finish === 'gold' ? './assets/ap_logo_gold.png' : './assets/ap_logo_maroon.png';
        const simLogo = document.getElementById('sim-card-logo');
        if (simLogo) simLogo.src = logoSrc;

        document.querySelectorAll('.logo-target').forEach(img => {
          img.src = logoSrc;
        });
      });
    });

    // Camera zoom switcher
    document.querySelectorAll('#camera-select-group .popup-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#camera-select-group .popup-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const zoomClass = btn.getAttribute('data-zoom');
        currentZoomStyle = zoomClass;

        const stage = document.getElementById('live-sim-stage');
        if (stage && isSimUnsealed) {
          stage.classList.remove('stage-zoom-majestic', 'stage-zoom-regal', 'stage-zoom-float');
          stage.classList.add(zoomClass);
        }
      });
    });

    // Trigger Simulator Unseal with Whole-Page Zoom-Out
    window.triggerSimUnseal = function() {
      if (isSimUnsealed) return;
      isSimUnsealed = true;

      const stage = document.getElementById('live-sim-stage');
      const sealWrapper = document.getElementById('sim-seal-wrapper');
      const sealStamp = document.getElementById('sim-seal-stamp');
      const sealPrompt = document.getElementById('sim-seal-prompt');
      const ribbon = document.getElementById('sim-ribbon');
      const gateLeft = document.getElementById('sim-gate-left');
      const gateRight = document.getElementById('sim-gate-right');
      const card = document.getElementById('live-sim-card');

      // 1. Seal cracks & breaks
      if (sealStamp) {
        sealStamp.style.transform = 'scale(1.18) rotate(8deg)';
        setTimeout(() => {
          sealStamp.style.transform = 'scale(0) rotate(-16deg)';
          sealStamp.style.opacity = '0';
        }, 120);
      }
      if (sealPrompt) sealPrompt.style.display = 'none';

      // 2. Whole Stage / Camera Zoom Out Pullback Animation!
      setTimeout(() => {
        if (stage) {
          stage.classList.remove('stage-camera-focused');
          stage.classList.add(currentZoomStyle, 'stage-unsealed');
        }
      }, 150);

      // 3. Ribbon fades
      setTimeout(() => {
        if (ribbon) {
          ribbon.style.opacity = '0';
          ribbon.style.transform = 'translateY(-50%) scaleY(0.8)';
        }
        if (sealWrapper) sealWrapper.style.display = 'none';
      }, 250);

      // 4. Gate doors swing open in 3D
      setTimeout(() => {
        if (gateLeft) gateLeft.style.transform = 'rotateY(-125deg)';
        if (gateRight) gateRight.style.transform = 'rotateY(125deg)';
      }, 350);

      // 5. Pop-up Card Elevates Forward from the envelope chamber
      setTimeout(() => {
        if (card) {
          card.style.transform = 'translateY(-36px) scale(1.06)';
          card.style.boxShadow = '0 30px 75px rgba(117, 82, 27, 0.35)';
        }
      }, 480);
    };

    // Reset Simulator
    window.resetSimEnvelope = function() {
      isSimUnsealed = false;

      const stage = document.getElementById('live-sim-stage');
      const sealWrapper = document.getElementById('sim-seal-wrapper');
      const sealStamp = document.getElementById('sim-seal-stamp');
      const sealPrompt = document.getElementById('sim-seal-prompt');
      const ribbon = document.getElementById('sim-ribbon');
      const gateLeft = document.getElementById('sim-gate-left');
      const gateRight = document.getElementById('sim-gate-right');
      const card = document.getElementById('live-sim-card');

      if (stage) {
        stage.classList.remove('stage-zoom-majestic', 'stage-zoom-regal', 'stage-zoom-float', 'stage-unsealed');
        stage.classList.add('stage-camera-focused');
      }
      if (card) {
        card.style.transform = '';
        card.style.boxShadow = '';
      }
      if (gateLeft) gateLeft.style.transform = 'rotateY(0deg)';
      if (gateRight) gateRight.style.transform = 'rotateY(0deg)';
      if (ribbon) {
        ribbon.style.display = 'block';
        ribbon.style.opacity = '1';
        ribbon.style.transform = 'translateY(-50%) scaleY(1)';
      }
      if (sealWrapper) sealWrapper.style.display = 'flex';
      if (sealStamp) {
        sealStamp.style.transform = 'scale(1)';
        sealStamp.style.opacity = '1';
      }
      if (sealPrompt) sealPrompt.style.display = 'block';
    };
'''

if '</body>' in content:
    content = content.replace('</body>', '<script>' + script_code + '</script>\n</body>', 1)
    print("Appended popup studio script!")

with open('preview.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated preview.html successfully!")
