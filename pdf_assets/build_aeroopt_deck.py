import base64
import os
import re

print("Starting build_aeroopt_deck.py...")

# Directories
work_dir = r'c:\Users\Saurabh Kumar\OneDrive\Desktop\AeroOpt AI'
pdf_assets_dir = os.path.join(work_dir, 'pdf_assets')
extracted_dir = os.path.join(pdf_assets_dir, 'extracted')

# Helper to read base64
def get_b64(path):
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')

def get_b64_src(path, mime='image/png'):
    return f"data:{mime};base64,{get_b64(path)}"

# Common images
sih_logo_src = get_b64_src(os.path.join(extracted_dir, 'img_2.png'))
bulb_src = get_b64_src(os.path.join(extracted_dir, 'img_3.png'))
man_src = get_b64_src(os.path.join(extracted_dir, 'img_4.png'))

# Page 4 Risk / Strategy Icons (using cleaned img_21)
p4_icons = {
    'risk_1': get_b64_src(os.path.join(extracted_dir, 'img_19.png')),
    'risk_2': get_b64_src(os.path.join(extracted_dir, 'img_20.png')),
    'risk_3': get_b64_src(os.path.join(extracted_dir, 'img_21_clean.png')),
    'risk_4': get_b64_src(os.path.join(extracted_dir, 'img_22.png')),
    'strat_1': get_b64_src(os.path.join(extracted_dir, 'img_23.png')),
    'strat_2': get_b64_src(os.path.join(extracted_dir, 'img_24.png')),
    'strat_3': get_b64_src(os.path.join(extracted_dir, 'img_25.png')),
    'strat_4': get_b64_src(os.path.join(extracted_dir, 'img_26.png')),
}

# Page 5 Impact & Benefit Icons
p5_icons = {
    'impact_1': get_b64_src(os.path.join(extracted_dir, 'img_29.png')),
    'impact_2': get_b64_src(os.path.join(extracted_dir, 'img_30.png')),
    'impact_3': get_b64_src(os.path.join(extracted_dir, 'img_31.png')),
    'impact_4': get_b64_src(os.path.join(extracted_dir, 'img_32.png')),
    'impact_5': get_b64_src(os.path.join(extracted_dir, 'img_33.png')),
    'benefit_1': get_b64_src(os.path.join(extracted_dir, 'img_34.png')),
    'benefit_2': get_b64_src(os.path.join(extracted_dir, 'img_35.png')),
    'benefit_3': get_b64_src(os.path.join(extracted_dir, 'img_36.png')),
    'benefit_4': get_b64_src(os.path.join(extracted_dir, 'img_37.png')),
    'benefit_5': get_b64_src(os.path.join(extracted_dir, 'img_38.png')),
}

# Page 6 Prototype Mobile Screens
proto_left_src = get_b64_src(os.path.join(pdf_assets_dir, 'mobile_fleet.png'))
proto_center_src = get_b64_src(os.path.join(pdf_assets_dir, 'mobile_dashboard.png'))
proto_right_src = get_b64_src(os.path.join(pdf_assets_dir, 'mobile_optimiser.png'))

# Page 3 Tech Stack SVGs
react_svg = '''<div style="display:flex; align-items:center; gap:5px;">
  <svg viewBox="-11.5 -10.23174 23 20.46348" style="height:25px; width:auto;">
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
    <g stroke="#61DAFB" stroke-width="1" fill="none">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
  <span style="font-family:Arial, sans-serif; font-size:13px; font-weight:800; color:#000000;">React 19</span>
</div>'''

node_svg = '''<div style="display:flex; align-items:center; gap:5px;">
  <svg viewBox="0 0 32 32" style="height:25px; width:auto;" fill="none">
    <path d="M16 2.5L28.1 9.5V23.5L16 30.5L3.9 23.5V9.5L16 2.5Z" fill="#539E43"/>
    <path d="M16 11C13.2 11 11 13.2 11 16C11 18.8 13.2 21 16 21C18.8 21 21 18.8 21 16C21 13.2 18.8 11 16 11Z" fill="#FFFFFF"/>
  </svg>
  <span style="font-family:Arial, sans-serif; font-size:13px; font-weight:800; color:#000000;">Node.js</span>
</div>'''

express_svg = '''<div style="display:flex; align-items:center; gap:4px;">
  <svg viewBox="0 0 32 32" style="height:24px; width:auto;" fill="none">
    <circle cx="16" cy="16" r="15" fill="#000000"/>
    <text x="16" y="21" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">ex</text>
  </svg>
  <span style="font-family:Arial, sans-serif; font-size:13px; font-weight:800; color:#1A1A1A;">Express</span>
</div>'''

mongodb_svg = '''<div style="display:flex; align-items:center; gap:4px;">
  <svg viewBox="0 0 24 24" style="height:25px; width:auto;" fill="none">
    <path d="M12 1.5C12 1.5 6.5 6.5 6.5 12.8C6.5 17.5 9.5 21.2 12 22.5C14.5 21.2 17.5 17.5 17.5 12.8C17.5 6.5 12 1.5 12 1.5Z" fill="#00ED64"/>
    <path d="M12 1.5V22.5C12 22.5 11.2 22 10.5 21C8.2 18 8 14.5 8.8 11.5C9.5 9 11 6 12 1.5Z" fill="#00684A"/>
    <path d="M12 22.5C12 22.5 12.2 21.5 12.5 20.8C13.2 18.8 13.5 16.5 13.2 14.5L12 12V22.5Z" fill="#13AA52"/>
  </svg>
  <span style="font-family:Arial, sans-serif; font-size:13px; font-weight:800; color:#001E2B;">MongoDB</span>
</div>'''

redis_svg = '''<div style="display:flex; align-items:center; gap:5px;">
  <svg viewBox="0 0 24 24" style="height:25px; width:auto;" fill="none">
    <path d="M2 7.5L12 2.5L22 7.5L12 12.5L2 7.5Z" fill="#DC382D"/>
    <path d="M2 12L12 17L22 12L20 11L12 15L4 11L2 12Z" fill="#A82820"/>
    <path d="M2 16.5L12 21.5L22 16.5L20 15.5L12 19.5L4 15.5L2 16.5Z" fill="#7A1C16"/>
  </svg>
  <span style="font-family:Arial, sans-serif; font-size:13px; font-weight:800; color:#DC382D;">Redis</span>
</div>'''

socketio_svg = '''<div style="display:flex; align-items:center; gap:4px;">
  <svg viewBox="0 0 24 24" style="height:24px; width:auto;" fill="none">
    <circle cx="12" cy="12" r="11" fill="#010101"/>
    <path d="M7 12C7 9.24 9.24 7 12 7C13.8 7 15.38 7.95 16.24 9.38L14.6 10.35C14.07 9.53 13.1 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.1 15 14.07 14.47 14.6 13.65L16.24 14.62C15.38 16.05 13.8 17 12 17C9.24 17 7 14.76 7 12Z" fill="#FFFFFF"/>
    <path d="M12 4L14 8H10L12 4Z" fill="#00D2FF"/>
    <path d="M12 20L10 16H14L12 20Z" fill="#00D2FF"/>
  </svg>
  <span style="font-family:Arial, sans-serif; font-size:13px; font-weight:800; color:#000000;">Socket.IO</span>
</div>'''

tailwind_svg = '''<div style="display:flex; align-items:center; gap:4px;">
  <svg viewBox="0 0 28 20" style="height:22px; width:auto;" fill="none">
    <path d="M14 4.5C11 4.5 9.2 6 8.6 9C9.8 7.5 11.3 6.9 13.1 7.2C14.1 7.4 14.9 8.2 15.7 9C17 10.3 18.5 11.8 21.8 11.8C24.8 11.8 26.6 10.3 27.2 7.3C26 8.8 24.5 9.4 22.7 9.1C21.7 8.9 20.9 8.1 20.1 7.3C18.8 6 17.3 4.5 14 4.5ZM7 10.5C4 10.5 2.2 12 1.6 15C2.8 13.5 4.3 12.9 6.1 13.2C7.1 13.4 7.9 14.2 8.7 15C10 16.3 11.5 17.8 14.8 17.8C17.8 17.8 19.6 16.3 20.2 13.3C19 14.8 17.5 15.4 15.7 15.1C14.7 14.9 13.9 14.1 13.1 13.3C11.8 12 10.3 10.5 7 10.5Z" fill="#38BDF8"/>
  </svg>
  <span style="font-family:Arial, sans-serif; font-size:13px; font-weight:800; color:#0F172A;">Tailwind</span>
</div>'''

aws_svg = '''<div style="display:flex; align-items:center; gap:4px;">
  <svg viewBox="0 0 24 24" style="height:24px; width:auto;" fill="none">
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#FF9900"/>
    <path d="M12 4.2L4 8.2V15.8L12 19.8L20 15.8V8.2L12 4.2Z" fill="#232F3E"/>
    <circle cx="12" cy="12" r="3.2" fill="#FF9900"/>
  </svg>
  <span style="font-family:Arial, sans-serif; font-size:13px; font-weight:800; color:#232F3E;">AWS Bedrock</span>
</div>'''

# HTML Document Assembly
html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>AeroOpt AI - Smart India Hackathon 2026</title>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  @page {{ size: 1440px 810px; margin: 0; }}
  body {{
    background: #E7F9FF;
    color: #000000;
    font-family: Arial, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}
  .page {{
    width: 1440px;
    height: 810px;
    position: relative;
    overflow: hidden;
    page-break-after: always;
    background: #E7F9FF;
    padding: 18px 44px 18px 44px;
    display: flex;
    flex-direction: column;
  }}
  .orange-pill {{
    background: #FA8F3E;
    color: #000000;
    font-family: 'Century Gothic', Futura, Arial, sans-serif;
    font-weight: 900;
    font-size: 16px;
    padding: 7px 20px;
    border-radius: 8px;
    display: inline-block;
    text-align: center;
    border: none;
  }}
  .section-title {{
    font-family: Garamond, 'Times New Roman', serif;
    font-size: 28px;
    font-weight: 700;
    color: #AF4C0F;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
  }}
  .blist {{
    list-style: none;
    padding-left: 0;
  }}
  .blist li {{
    position: relative;
    padding-left: 24px;
    font-size: 15.5px;
    line-height: 1.36;
    color: #000000;
    margin-bottom: 7px;
  }}
  .blist li::before {{
    content: "•";
    position: absolute;
    left: 4px;
    top: -3px;
    font-size: 26px;
    color: #000000;
  }}
</style>
</head>
<body>

<!-- ==========================================
     PAGE 1: TITLE SLIDE
     ========================================== -->
<div class="page">
  
  <div style="display:flex; justify-content:space-between; align-items:flex-start; height:103px; margin-bottom:12px; position:relative;">
    <div style="width:160px; height:1px;"></div>
    <div style="flex:1; text-align:center; padding-top:14px;">
      <div style="font-family:Garamond, 'Times New Roman', serif; font-size:62px; font-weight:700; color:#034697; border-bottom:3.5px double #034697; display:inline-block; line-height:1; padding-bottom:3px; letter-spacing:0.5px;">
        SMART INDIA HACKATHON 2026
      </div>
    </div>
    <img src="{sih_logo_src}" style="width:160px; height:auto; object-fit:contain; padding-top:4px;" alt="SIH 2026" />
  </div>

  <div style="display:flex; flex:1; align-items:center; position:relative; margin-top:16px;">
    <!-- Meta Column Left -->
    <div style="flex:1.2; display:flex; flex-direction:column; gap:24px; padding-left:10px; z-index:2;">
      <div style="font-size:32px; line-height:1.2;">
        <span style="font-weight:700;">Problem Statement ID – </span>
        <span style="color:#034697; font-weight:400;">SIH26125</span>
      </div>
      <div style="font-size:32px; line-height:1.25;">
        <span style="font-weight:700;">Problem Statement Title - </span>
        <span style="color:#034697; font-weight:400;">Air Power: Dynamic Air Operations &amp; Resource Optimisation System</span>
      </div>
      <div style="font-size:32px; line-height:1.2; display:flex; align-items:center;">
        <span style="font-weight:700; width:280px; display:inline-flex; justify-content:space-between;">Theme <span>-</span></span>
        <span style="color:#034697; font-weight:400; margin-left:14px;">Defence &amp; Aerospace / AI</span>
      </div>
      <div style="font-size:32px; line-height:1.2; display:flex; align-items:center;">
        <span style="font-weight:700; width:280px; display:inline-flex; justify-content:space-between;">PS Category <span>-</span></span>
        <span style="color:#034697; font-weight:400; margin-left:14px;">Software</span>
      </div>
      <div style="font-size:32px; line-height:1.2; display:flex; align-items:center;">
        <span style="font-weight:700; width:280px; display:inline-flex; justify-content:space-between;">Organization <span>-</span></span>
        <span style="color:#000000; font-weight:700; margin-left:14px;">Indian Air Force (IAF)</span>
      </div>
      <div style="font-size:32px; line-height:1.2; display:flex; align-items:center;">
        <span style="font-weight:700; width:280px; display:inline-flex; justify-content:space-between;">Team ID <span>-</span></span>
        <span style="color:#034697; font-weight:400; margin-left:14px;">158358</span>
      </div>
      <div style="font-size:32px; line-height:1.2; display:flex; align-items:center;">
        <span style="font-weight:700; width:280px; display:inline-flex; justify-content:space-between;">Team Name <span>-</span></span>
        <span style="color:#034697; font-weight:400; margin-left:14px;">TrustForge-l</span>
      </div>
    </div>

    <!-- Graphics Right: Brain bulb + 3D person -->
    <div style="flex:0.8; height:100%; position:relative; display:flex; align-items:center; justify-content:flex-end;">
      <img src="{bulb_src}" style="position:absolute; right:170px; bottom:20px; width:340px; height:auto; object-fit:contain; z-index:1;" />
      <img src="{man_src}" style="position:absolute; right:0px; bottom:-18px; width:260px; height:auto; object-fit:contain; z-index:2;" />
    </div>
  </div>
</div>

<!-- ==========================================
     PAGE 2: PROBLEM, SOLUTION & HIERARCHY
     ========================================== -->
<div class="page">
  
  <div style="display:flex; justify-content:space-between; align-items:flex-start; height:103px; margin-bottom:12px; position:relative;">
    <div style="width:160px; height:1px;"></div>
    <div style="flex:1; text-align:center; padding-top:14px;">
      <div style="font-family:Garamond, 'Times New Roman', serif; font-size:58px; font-weight:700; color:#034697; border-bottom:3.5px double #034697; display:inline-block; line-height:1; padding-bottom:3px; letter-spacing:0.5px;">
        AEROOPT AI
      </div>
      <div style="font-family:Arial, sans-serif; font-size:17.5px; font-weight:700; color:#000000; letter-spacing:1px; margin-top:8px;">
        DYNAMIC AIR OPERATIONS &amp; RESOURCE OPTIMISATION PLATFORM (IAF DSS)
      </div>
    </div>
    <img src="{sih_logo_src}" style="width:160px; height:auto; object-fit:contain; padding-top:4px;" alt="SIH 2026" />
  </div>

  <div style="display:flex; flex:1; margin-top:4px; position:relative;">
    <!-- Left Pane: Problem Overview & Solution -->
    <div style="flex:1.05; padding-right:36px; border-right:2px solid #000000; display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <div class="section-title">PROBLEM OVERVIEW</div>
        <ul class="blist">
          <li><strong>Fragmented Operational Awareness –</strong> Fleet readiness, aircrew fatigue, weather corridors, and task queues are siloed across disparate legacy dispatch logs.</li>
          <li><strong>Suboptimal Sortie Scheduling –</strong> Manual dispatch processes cause severe scheduling bottlenecks and fail to recompute allocations during tactical surges.</li>
          <li><strong>Pilot Fatigue &amp; Regulation Violations –</strong> Lack of automated tracking for cumulative 7-day flight hours risks pilot exhaustion and breaches aviation safety rules.</li>
          <li><strong>Convective Weather Vulnerabilities –</strong> Static planning cannot dynamically gate weather-sensitive sorties from restricted operational sectors.</li>
          <li><strong>Vulnerability to Data Tampering –</strong> Flight logs and operational dispatch decisions lack immutable audit trails required for command oversight.</li>
        </ul>
      </div>

      <div style="margin-top:6px;">
        <div class="section-title">PROBLEM SOLUTION</div>
        <ul class="blist">
          <li><strong>Constraint-Based Optimiser –</strong> High-performance solver computes multi-resource feasibility across fleet and aircrew in <strong>&lt; 20 milliseconds</strong>.</li>
          <li><strong>Redis Dual-Engine Architecture –</strong> Sub-millisecond schedule caching (<strong>0.8ms</strong>) with atomic 24h lockout keys and zero-crash embedded fallback.</li>
          <li><strong>Dynamic What-If Replanning –</strong> Instant simulation comparing before-vs-after diffs upon airframe grounding, pilot illness, or storm incursions.</li>
          <li><strong>Automated Weather Corridors –</strong> Live convective weather gating automatically blocks weather-sensitive missions from restricted airspace sectors.</li>
          <li><strong>Pilot Fatigue Governance –</strong> Strict enforcement of 60-hour weekly duty caps, rest windows, and predictive 72-hour fatigue indices.</li>
          <li><strong>Human-in-the-Loop Audit Ledger –</strong> Commanders retain absolute operational authority with an immutable audit ledger recording every decision diff.</li>
        </ul>
      </div>
    </div>

    <!-- Right Pane: Hierarchical Diagram -->
    <div style="flex:0.95; padding-left:36px; display:flex; flex-direction:column; align-items:center; position:relative;">
      <div class="section-title" style="font-size:32px; line-height:1.15; margin-bottom:18px;">
        HIERARCHICAL<br>DIAGRAM
      </div>

      <div style="position:relative; width:100%; flex:1; display:flex; justify-content:center;">
        <!-- Connecting SVG lines -->
        <svg style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1;" overflow="visible">
          <defs>
            <marker id="arr2" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000"/>
            </marker>
          </defs>
          <!-- Governance to Administration -->
          <path d="M 62 205 L 62 44 L 180 44" fill="none" stroke="#000000" stroke-width="3" marker-end="url(#arr2)"/>
          <!-- Card 1 to Card 2 -->
          <path d="M 295 190 L 295 218" fill="none" stroke="#000000" stroke-width="3" marker-end="url(#arr2)"/>
          <!-- Card 2 to Card 3 -->
          <path d="M 295 365 L 295 393" fill="none" stroke="#000000" stroke-width="3" marker-end="url(#arr2)"/>
        </svg>

        <!-- Governance Avatar on Left -->
        <div style="position:absolute; left:15px; top:185px; display:flex; flex-direction:column; align-items:center; gap:8px; z-index:3;">
          <div style="width:78px; height:78px; background:#034697; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(3,70,151,0.35);">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div class="orange-pill" style="font-size:14px; padding:4px 14px;">COMMAND</div>
        </div>

        <!-- 3 Tier Cards Stacked on Right -->
        <div style="margin-left:70px; display:flex; flex-direction:column; gap:16px; width:390px; z-index:2;">
          <!-- Tier 1 -->
          <div style="position:relative;">
            <div style="position:absolute; top:-14px; left:50%; transform:translateX(-50%); z-index:3;" class="orange-pill">AIR HQ OVERSIGHT</div>
            <div style="background:#FFFFFF; border:2px solid #000000; border-radius:12px; padding:18px 16px 12px 16px; text-align:center;">
              <div class="orange-pill" style="font-size:13px; padding:3px 14px; margin-bottom:8px;">TACTICAL OPERATIONS DASHBOARD</div>
              <ul style="list-style:none; text-align:left; font-size:14px; line-height:1.42; color:#000000; padding-left:14px;">
                <li>• Fleet Readiness &amp; Airframe Serviceability</li>
                <li>• Flight Crew Duty Hours &amp; Type-Ratings</li>
                <li>• Airspace Sector &amp; Weather Hazard Maps</li>
              </ul>
            </div>
          </div>

          <!-- Tier 2 -->
          <div style="position:relative; margin-top:10px;">
            <div style="position:absolute; top:-14px; left:50%; transform:translateX(-50%); z-index:3; font-size:13px; padding:4px 16px;" class="orange-pill">CORE ENGINE &amp; CACHE</div>
            <div style="background:#FFFFFF; border:2px solid #000000; border-radius:12px; padding:30px 16px 14px 16px;">
              <ul style="list-style:none; text-align:left; font-size:14px; line-height:1.42; color:#000000; padding-left:14px;">
                <li>• Constraint Solver Engine (&lt;20ms Run Time)</li>
                <li>• Dual-Engine Redis Cache (0.8ms Latency)</li>
                <li>• Dynamic Replanning &amp; What-If Disruption Diff</li>
                <li>• MongoDB Operational Store &amp; Predictive Risk Index</li>
              </ul>
            </div>
          </div>

          <!-- Tier 3 -->
          <div style="position:relative; margin-top:10px;">
            <div style="position:absolute; top:-14px; left:50%; transform:translateX(-50%); z-index:3; font-size:13px; padding:4px 16px;" class="orange-pill">TACTICAL APPLICATIONS</div>
            <div style="background:#FFFFFF; border:2px solid #000000; border-radius:12px; padding:30px 16px 14px 16px; text-align:center;">
              <div class="orange-pill" style="font-size:13px; padding:3px 14px; margin-bottom:8px;">AEROOPT MISSION HUD</div>
              <ul style="list-style:none; text-align:left; font-size:14px; line-height:1.42; color:#000000; padding-left:14px;">
                <li>• Wing Commanders &amp; Operations Planners</li>
                <li>• Flight Dispatch Officers &amp; Squadron Terminals</li>
                <li>• Maintenance Engineers &amp; Audit Inspectors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ==========================================
     PAGE 3: TECHNICAL APPROACH & WORKFLOW
     ========================================== -->
<div class="page">
  
  <div style="display:flex; justify-content:space-between; align-items:flex-start; height:103px; margin-bottom:12px; position:relative;">
    <div style="width:160px; height:1px;"></div>
    <div style="flex:1; text-align:center; padding-top:14px;">
      <div style="font-family:Garamond, 'Times New Roman', serif; font-size:62px; font-weight:700; color:#034697; border-bottom:3.5px double #034697; display:inline-block; line-height:1; padding-bottom:3px; letter-spacing:0.5px;">
        TECHNICAL APPROACH
      </div>
    </div>
    <img src="{sih_logo_src}" style="width:160px; height:auto; object-fit:contain; padding-top:4px;" alt="SIH 2026" />
  </div>

  <div style="display:flex; flex:1; margin-top:4px; position:relative;">
    <!-- Methodology Left -->
    <div style="flex:1; padding-right:24px; border-right:2px solid #000000; display:flex; flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">METHODOLOGY</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px 22px; flex:1;">
        <!-- 10 Steps U-flow -->
        <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
          <div style="font-size:12px; line-height:1.25; min-height:30px; display:flex; align-items:center; justify-content:center;">Consolidate IAF operational parameters, mission queues &amp; aircrew constraints.</div>
          <div class="orange-pill" style="width:100%; font-size:12.5px; padding:7px 4px; border-radius:6px;">Requirement Analysis</div>
          <div style="font-size:18px; font-weight:700; color:#000; margin-top:2px;">↓</div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
          <div style="font-size:12px; line-height:1.25; min-height:30px; display:flex; align-items:center; justify-content:center;">Nationwide deployment with continuous telemetry, Redis sync &amp; live audit.</div>
          <div class="orange-pill" style="width:100%; font-size:12.5px; padding:7px 4px; border-radius:6px;">Full Rollout &amp; Monitoring</div>
          <div style="height:18px;"></div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
          <div style="font-size:12px; line-height:1.25; min-height:30px; display:flex; align-items:center; justify-content:center;">Design modular architecture with sub-20ms solver, dual-engine cache &amp; Socket.IO.</div>
          <div class="orange-pill" style="width:100%; font-size:12.5px; padding:7px 4px; border-radius:6px;">System Architecture Design</div>
          <div style="font-size:18px; font-weight:700; color:#000; margin-top:2px;">↓</div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
          <div style="font-size:12px; line-height:1.25; min-height:30px; display:flex; align-items:center; justify-content:center;">Validate with tactical planners across 10 airframe classes &amp; surge scenarios.</div>
          <div class="orange-pill" style="width:100%; font-size:12.5px; padding:7px 4px; border-radius:6px;">Operational Pilot Testing</div>
          <div style="font-size:18px; font-weight:700; color:#000; margin-bottom:2px;">↑</div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
          <div style="font-size:12px; line-height:1.25; min-height:30px; display:flex; align-items:center; justify-content:center;">Setup Node.js Express API, Redis cache engine &amp; MongoDB operational store.</div>
          <div class="orange-pill" style="width:100%; font-size:12.5px; padding:7px 4px; border-radius:6px;">Backend &amp; Cache Setup</div>
          <div style="font-size:18px; font-weight:700; color:#000; margin-top:2px;">↓</div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
          <div style="font-size:12px; line-height:1.25; min-height:30px; display:flex; align-items:center; justify-content:center;">Implement IAF captcha, 10-attempt / 24h lockout &amp; role-based JWT guards.</div>
          <div class="orange-pill" style="width:100%; font-size:12.5px; padding:7px 4px; border-radius:6px;">Security Hardening</div>
          <div style="font-size:18px; font-weight:700; color:#000; margin-bottom:2px;">↑</div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
          <div style="font-size:12px; line-height:1.25; min-height:30px; display:flex; align-items:center; justify-content:center;">Build multi-resource constraint solver with duty limits &amp; convective weather gating.</div>
          <div class="orange-pill" style="width:100%; font-size:12.5px; padding:7px 4px; border-radius:6px;">Constraint Solver Engine</div>
          <div style="font-size:18px; font-weight:700; color:#000; margin-top:2px;">↓</div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
          <div style="font-size:12px; line-height:1.25; min-height:30px; display:flex; align-items:center; justify-content:center;">Implement what-if simulator &amp; before-vs-after diff computation for disruptions.</div>
          <div class="orange-pill" style="width:100%; font-size:12.5px; padding:7px 4px; border-radius:6px;">Dynamic Replanning Core</div>
          <div style="font-size:18px; font-weight:700; color:#000; margin-bottom:2px;">↑</div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
          <div style="font-size:12px; line-height:1.25; min-height:30px; display:flex; align-items:center; justify-content:center;">Create React 19 Tactical Mission HUD with Recharts &amp; real-time event stream.</div>
          <div class="orange-pill" style="width:100%; font-size:12.5px; padding:7px 4px; border-radius:6px;">Frontend Mission HUD</div>
          <div style="font-size:18px; font-weight:700; color:#000; margin-top:2px;">→</div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
          <div style="font-size:12px; line-height:1.25; min-height:30px; display:flex; align-items:center; justify-content:center;">Deploy Redis schedule caching (0.8ms) with automatic event-driven invalidation.</div>
          <div class="orange-pill" style="width:100%; font-size:12.5px; padding:7px 4px; border-radius:6px;">Redis Cache &amp; Event Sync</div>
          <div style="height:18px;"></div>
        </div>
      </div>
    </div>

    <!-- Flow Chart Right -->
    <div style="flex:1.15; padding-left:24px; display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <div class="section-title" style="margin-bottom:14px; text-align:left; padding-left:140px;">FLOW CHART:</div>

        <!-- Flowchart diagram with boxes and arrows -->
        <div style="position:relative; width:100%; height:440px;">
          <!-- SVG connections -->
          <svg style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1;" overflow="visible">
            <defs>
              <marker id="arr3" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#AF4C0F"/>
              </marker>
            </defs>
            <!-- Start down to Box 1 -->
            <path d="M 46 42 L 46 68" stroke="#AF4C0F" stroke-width="3" fill="none" marker-end="url(#arr3)"/>
            <!-- Box 1 to Box 2 -->
            <path d="M 92 108 C 102 135, 110 135, 118 112" stroke="#AF4C0F" stroke-width="3" fill="none" marker-end="url(#arr3)"/>
            <!-- Box 2 to Box 3 -->
            <path d="M 212 108 C 222 135, 230 135, 238 112" stroke="#AF4C0F" stroke-width="3" fill="none" marker-end="url(#arr3)"/>
            <!-- Box 3 to Box 4 -->
            <path d="M 332 108 C 342 135, 350 135, 358 112" stroke="#AF4C0F" stroke-width="3" fill="none" marker-end="url(#arr3)"/>
            <!-- Box 4 to Box 5 -->
            <path d="M 452 108 C 462 135, 470 135, 478 112" stroke="#AF4C0F" stroke-width="3" fill="none" marker-end="url(#arr3)"/>
            <!-- Box 5 down to Decision -->
            <path d="M 525 152 L 525 220" stroke="#AF4C0F" stroke-width="3" fill="none" marker-end="url(#arr3)"/>
            <!-- Decision NO to Rejected -->
            <path d="M 545 315 L 545 352" stroke="#AF4C0F" stroke-width="3" fill="none" marker-end="url(#arr3)"/>
            <!-- Decision YES down-left to Box 4 -->
            <path d="M 490 288 L 436 348" stroke="#AF4C0F" stroke-width="3" fill="none" marker-end="url(#arr3)"/>
            <!-- Bottom row flow: Box 4 -> Box 3 -> Box 2 -> Box 1 -> END -->
            <path d="M 348 375 L 328 375" stroke="#AF4C0F" stroke-width="3" fill="none" marker-end="url(#arr3)"/>
            <path d="M 232 375 L 212 375" stroke="#AF4C0F" stroke-width="3" fill="none" marker-end="url(#arr3)"/>
            <path d="M 116 375 L 96 375" stroke="#AF4C0F" stroke-width="3" fill="none" marker-end="url(#arr3)"/>
            <!-- Box 1 up to END -->
            <path d="M 46 348 L 46 238" stroke="#AF4C0F" stroke-width="3" fill="none" marker-end="url(#arr3)"/>
            <!-- Middle card push -->
            <path d="M 285 140 C 300 165, 300 175, 285 190" stroke="#AF4C0F" stroke-width="2.5" fill="none" marker-end="url(#arr3)"/>
          </svg>

          <!-- Top Row Nodes -->
          <div style="position:absolute; left:12px; top:4px; background:#FA8F3E; color:#000; font-weight:700; font-size:15px; padding:6px 18px; border-radius:30px; border:2px solid #AF4C0F;">Start</div>
          
          <div style="position:absolute; left:2px; top:70px; width:88px; background:#FA8F3E; color:#000; font-size:11px; font-weight:700; padding:8px 4px; border-radius:12px; text-align:center; line-height:1.2; border:1.5px solid #AF4C0F;">Planner opens AeroOpt AI HUD</div>
          
          <div style="position:absolute; left:112px; top:70px; width:94px; background:#FA8F3E; color:#000; font-size:11px; font-weight:700; padding:8px 4px; border-radius:12px; text-align:center; line-height:1.2; border:1.5px solid #AF4C0F;">Enters Ops ID, Key &amp; Captcha</div>
          
          <div style="position:absolute; left:232px; top:70px; width:94px; background:#FA8F3E; color:#000; font-size:11px; font-weight:700; padding:8px 4px; border-radius:12px; text-align:center; line-height:1.2; border:1.5px solid #AF4C0F;">Backend checks 24h Lockout Key</div>
          
          <div style="position:absolute; left:352px; top:70px; width:94px; background:#FA8F3E; color:#000; font-size:11px; font-weight:700; padding:8px 4px; border-radius:12px; text-align:center; line-height:1.2; border:1.5px solid #AF4C0F;">Validates hash &amp; issues Ops JWT</div>
          
          <div style="position:absolute; left:472px; top:70px; width:98px; background:#FA8F3E; color:#000; font-size:11px; font-weight:700; padding:8px 4px; border-radius:12px; text-align:center; line-height:1.2; border:1.5px solid #AF4C0F;">Submits Priority Mission Tasks</div>

          <!-- Middle Card -->
          <div style="position:absolute; left:215px; top:185px; width:125px; background:#FA8F3E; color:#000; font-size:11px; font-weight:700; padding:10px 6px; border-radius:12px; text-align:center; line-height:1.25; border:1.5px solid #AF4C0F; z-index:2;">
            Pushes task queue to Optimiser Engine
          </div>

          <!-- Decision Node -->
          <div style="position:absolute; left:488px; top:225px; width:114px; height:85px; background:#FA8F3E; color:#000; font-size:13px; font-weight:800; border-radius:50%; display:flex; align-items:center; justify-content:center; text-align:center; line-height:1.15; border:2px solid #AF4C0F; z-index:2;">
            Feasibility<br>Satisfied?
          </div>
          <div style="position:absolute; left:430px; top:280px; font-size:16px; font-weight:900; color:#AF4C0F; transform:rotate(-45deg);">YES</div>
          <div style="position:absolute; left:555px; top:322px; font-size:16px; font-weight:900; color:#000000;">NO</div>

          <!-- Account Rejected Node -->
          <div style="position:absolute; left:492px; top:356px; width:108px; background:#FA8F3E; color:#000; font-size:12px; font-weight:800; padding:10px 4px; border-radius:12px; text-align:center; line-height:1.2; border:1.5px solid #AF4C0F;">
            Flag Missing<br>Airframe / Pilot
          </div>

          <!-- Bottom Row Leftward Flow -->
          <div style="position:absolute; left:18px; top:195px; background:#FA8F3E; color:#000; font-weight:700; font-size:16px; padding:6px 18px; border-radius:30px; border:2px solid #AF4C0F;">END</div>

          <div style="position:absolute; left:4px; top:350px; width:88px; background:#FA8F3E; color:#000; font-size:11px; font-weight:700; padding:8px 4px; border-radius:12px; text-align:center; line-height:1.2; border:1.5px solid #AF4C0F;">Broadcast order via Socket.IO</div>

          <div style="position:absolute; left:120px; top:350px; width:88px; background:#FA8F3E; color:#000; font-size:11px; font-weight:700; padding:8px 4px; border-radius:12px; text-align:center; line-height:1.2; border:1.5px solid #AF4C0F;">Immutable log saved to Audit Trail</div>

          <div style="position:absolute; left:235px; top:350px; width:88px; background:#FA8F3E; color:#000; font-size:11px; font-weight:700; padding:8px 4px; border-radius:12px; text-align:center; line-height:1.2; border:1.5px solid #AF4C0F;">Commander reviews &amp; signs off</div>

          <div style="position:absolute; left:350px; top:350px; width:88px; background:#FA8F3E; color:#000; font-size:11px; font-weight:700; padding:8px 4px; border-radius:12px; text-align:center; line-height:1.2; border:1.5px solid #AF4C0F;">Computes schedule in &lt;20ms</div>
        </div>
      </div>

      <!-- Tech Stack Footer: ONLY AeroOpt AI Project Technologies -->
      <div style="border-top:2px solid #000000; padding-top:8px; display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; gap:8px;">
        <div style="font-family:Garamond, serif; font-size:24px; font-weight:700; color:#AF4C0F; letter-spacing:0.5px; line-height:1.05; white-space:nowrap; margin-right:4px;">TECH<br>STACK</div>
        {react_svg}
        {node_svg}
        {express_svg}
        {mongodb_svg}
        {redis_svg}
        {socketio_svg}
        {tailwind_svg}
        {aws_svg}
      </div>
    </div>
  </div>
</div>

<!-- ==========================================
     PAGE 4: FEASIBILITY AND VIABILITY
     ========================================== -->
<div class="page">
  
  <div style="display:flex; justify-content:space-between; align-items:flex-start; height:103px; margin-bottom:12px; position:relative;">
    <div style="width:160px; height:1px;"></div>
    <div style="flex:1; text-align:center; padding-top:14px;">
      <div style="font-family:Garamond, 'Times New Roman', serif; font-size:62px; font-weight:700; color:#034697; border-bottom:3.5px double #034697; display:inline-block; line-height:1; padding-bottom:3px; letter-spacing:0.5px;">
        FEASIBILITY AND VIABILITY
      </div>
    </div>
    <img src="{sih_logo_src}" style="width:160px; height:auto; object-fit:contain; padding-top:4px;" alt="SIH 2026" />
  </div>

  <div style="font-size:22px; font-weight:700; color:#000000; margin-bottom:8px; letter-spacing:0.5px;">
    ANALYSIS OF THE FEASIBILITY OF THE IDEA
  </div>

  <!-- Top 6-Column Feasibility Strip -->
  <div style="display:grid; grid-template-columns:repeat(6, 1fr); border-top:2px solid #000000; border-bottom:2px solid #000000; padding:10px 0; margin-bottom:12px;">
    <div style="padding:0 10px; border-right:2px dashed #000000; display:flex; flex-direction:column;">
      <div style="font-size:15px; font-weight:700; color:#AF4C0F; text-align:center; line-height:1.2; margin-bottom:8px; min-height:36px;">1. TECHNICAL<br>FEASIBILITY</div>
      <div style="font-size:12.5px; line-height:1.35; color:#000000;">Sub-20ms constraint engine, Redis dual-engine caching, and modern React 19 SPA built on proven, production-grade open-source components with zero esoteric dependencies.</div>
    </div>
    <div style="padding:0 10px; border-right:2px dashed #000000; display:flex; flex-direction:column;">
      <div style="font-size:15px; font-weight:700; color:#AF4C0F; text-align:center; line-height:1.2; margin-bottom:8px; min-height:36px;">2. ECONOMICAL<br>FEASIBILITY</div>
      <div style="font-size:12.5px; line-height:1.35; color:#000000;">Self-hosted architecture eliminates recurring commercial SaaS licensing fees. Dual-engine fallback allows deployment on standard hardware without expensive infrastructure.</div>
    </div>
    <div style="padding:0 10px; border-right:2px dashed #000000; display:flex; flex-direction:column;">
      <div style="font-size:15px; font-weight:700; color:#AF4C0F; text-align:center; line-height:1.2; margin-bottom:8px; min-height:36px;">3. SOCIAL<br>FEASIBILITY</div>
      <div style="font-size:12.5px; line-height:1.35; color:#000000;">Fosters deep trust among flight crews and operations planners by mathematically enforcing pilot rest regulations, eliminating fatigue-induced safety hazards.</div>
    </div>
    <div style="padding:0 10px; border-right:2px dashed #000000; display:flex; flex-direction:column;">
      <div style="font-size:15px; font-weight:700; color:#AF4C0F; text-align:center; line-height:1.2; margin-bottom:8px; min-height:36px;">4. LEGAL &amp; COMPLIANCE<br>FEASIBILITY</div>
      <div style="font-size:12.5px; line-height:1.35; color:#000000;">Strictly complies with Indian Military Aviation regulations, DGCA flight duty time limitations (FDTL), and CERT-In sovereign cybersecurity directives.</div>
    </div>
    <div style="padding:0 10px; border-right:2px dashed #000000; display:flex; flex-direction:column;">
      <div style="font-size:15px; font-weight:700; color:#AF4C0F; text-align:center; line-height:1.2; margin-bottom:8px; min-height:36px;">5. OPERATIONAL<br>FEASIBILITY</div>
      <div style="font-size:12.5px; line-height:1.35; color:#000000;">High-contrast IAF tactical HUD designed for high-stress dispatch rooms with zero learning curve, automated what-if simulations, and one-click schedule approvals.</div>
    </div>
    <div style="padding:0 10px; display:flex; flex-direction:column;">
      <div style="font-size:15px; font-weight:700; color:#AF4C0F; text-align:center; line-height:1.2; margin-bottom:8px; min-height:36px;">6. SECURITY<br>FEASIBILITY</div>
      <div style="font-size:12.5px; line-height:1.35; color:#000000;">Role-based access control, cryptographic JWT session tokens, 10-attempt/24h terminal lockout via atomic Redis keys, and an immutable audit trail.</div>
    </div>
  </div>

  <!-- Bottom 2-Column: Challenges & Strategies -->
  <div style="display:flex; flex:1; position:relative;">
    <!-- Left: Potential Challenges -->
    <div style="flex:1; padding-right:24px; border-right:2px solid #000000; display:flex; flex-direction:column;">
      <div style="font-size:18px; font-weight:800; color:#000000; text-align:center; margin-bottom:14px;">
        POTENTIAL CHALLENGES AND RISKS
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px 20px; flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="flex:1; padding-right:8px;">
            <div style="font-size:13.5px; font-weight:800; color:#AF4C0F; margin-bottom:4px;">HIGH-TEMPO SORTIE BURSTS</div>
            <div style="font-size:12.5px; line-height:1.35;">Simultaneous surge taskings during conflict escalations risking schedule latency or server bottlenecks.</div>
          </div>
          <img src="{p4_icons['risk_1']}" style="width:64px; height:64px; object-fit:contain; flex-shrink:0;" />
        </div>

        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="flex:1; padding-right:8px;">
            <div style="font-size:13.5px; font-weight:800; color:#AF4C0F; margin-bottom:4px;">USER ADOPTION &amp; RESISTANCE</div>
            <div style="font-size:12.5px; line-height:1.35;">Legacy dispatch operators and flight clerks resisting automated algorithmic recommendations.</div>
          </div>
          <img src="{p4_icons['risk_2']}" style="width:64px; height:64px; object-fit:contain; flex-shrink:0;" />
        </div>

        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="flex:1; padding-right:8px;">
            <div style="font-size:13.5px; font-weight:800; color:#AF4C0F; margin-bottom:4px;">SUDDEN CONVECTIVE WEATHER</div>
            <div style="font-size:12.5px; line-height:1.35;">Dynamic storm fronts rapidly closing operational flight corridors and invalidating schedules.</div>
          </div>
          <img src="{p4_icons['risk_3']}" style="width:64px; height:64px; object-fit:contain; flex-shrink:0;" />
        </div>

        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="flex:1; padding-right:8px;">
            <div style="font-size:13.5px; font-weight:800; color:#AF4C0F; margin-bottom:4px;">UNAUTHORIZED DISPATCH ESCALATION</div>
            <div style="font-size:12.5px; line-height:1.35;">Malicious administrative tampering or credential compromise attempting unauthorized flight orders.</div>
          </div>
          <img src="{p4_icons['risk_4']}" style="width:64px; height:64px; object-fit:contain; flex-shrink:0;" />
        </div>
      </div>
    </div>

    <!-- Right: Strategies -->
    <div style="flex:1; padding-left:24px; display:flex; flex-direction:column;">
      <div style="font-size:18px; font-weight:800; color:#000000; text-align:center; margin-bottom:14px;">
        STRATEGIES FOR OVERCOMING THESE CHALLENGES
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px 20px; flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="flex:1; padding-right:8px;">
            <div style="font-size:13.5px; font-weight:800; color:#AF4C0F; margin-bottom:4px;">SUB-20MS CONSTRAINTS &amp; CACHE</div>
            <div style="font-size:12.5px; line-height:1.35;">High-speed constraint matcher cached in Redis (0.8ms retrieval) handling surge scheduling instantly.</div>
          </div>
          <img src="{p4_icons['strat_1']}" style="width:64px; height:64px; object-fit:contain; flex-shrink:0;" />
        </div>

        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="flex:1; padding-right:8px;">
            <div style="font-size:13.5px; font-weight:800; color:#AF4C0F; margin-bottom:4px;">AWARENESS &amp; INTERACTIVE HUD</div>
            <div style="font-size:12.5px; line-height:1.35;">Zero-learning-curve IAF tactical interface with transparent constraint explanations and guided onboarding.</div>
          </div>
          <img src="{p4_icons['strat_2']}" style="width:64px; height:64px; object-fit:contain; flex-shrink:0;" />
        </div>

        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="flex:1; padding-right:8px;">
            <div style="font-size:13.5px; font-weight:800; color:#AF4C0F; margin-bottom:4px;">DYNAMIC REPLANNING SIMULATOR</div>
            <div style="font-size:12.5px; line-height:1.35;">What-if disruption engine replanning sorties and rerouting flights around severe weather in seconds.</div>
          </div>
          <img src="{p4_icons['strat_3']}" style="width:64px; height:64px; object-fit:contain; flex-shrink:0;" />
        </div>

        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="flex:1; padding-right:8px;">
            <div style="font-size:13.5px; font-weight:800; color:#AF4C0F; margin-bottom:4px;">ACCESS CONTROL &amp; AUDIT TRAIL</div>
            <div style="font-size:12.5px; line-height:1.35;">Strict least-privilege RBAC, 24h lockout policy, and tamper-proof immutable audit logging for all actions.</div>
          </div>
          <img src="{p4_icons['strat_4']}" style="width:64px; height:64px; object-fit:contain; flex-shrink:0;" />
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ==========================================
     PAGE 5: IMPACT AND BENEFITS
     ========================================== -->
<div class="page">
  
  <div style="display:flex; justify-content:space-between; align-items:flex-start; height:103px; margin-bottom:12px; position:relative;">
    <div style="width:160px; height:1px;"></div>
    <div style="flex:1; text-align:center; padding-top:14px;">
      <div style="font-family:Garamond, 'Times New Roman', serif; font-size:62px; font-weight:700; color:#034697; border-bottom:3.5px double #034697; display:inline-block; line-height:1; padding-bottom:3px; letter-spacing:0.5px;">
        IMPACT AND BENEFITS
      </div>
    </div>
    <img src="{sih_logo_src}" style="width:160px; height:auto; object-fit:contain; padding-top:4px;" alt="SIH 2026" />
  </div>

  <div style="display:flex; flex:1; margin-top:6px; position:relative;">
    <!-- Left Unique Features Column -->
    <div style="width:280px; padding-right:20px; border-right:2px solid #000000; display:flex; flex-direction:column; justify-content:space-between;">
      <div style="font-family:Garamond, serif; font-size:26px; font-weight:700; color:#AF4C0F; text-align:left;">UNIQUE FEATURES:</div>

      <div style="display:flex; flex-direction:column; align-items:center;">
        <div class="orange-pill" style="width:100%; font-size:13.5px; padding:6px 4px;">Sub-20ms Constraint Engine</div>
        <div style="font-size:12.5px; line-height:1.3; text-align:center; margin-top:4px;">Solves complex multi-resource flight schedules across 10 airframe classes and crew rosters in milliseconds.</div>
      </div>

      <div style="display:flex; flex-direction:column; align-items:center;">
        <div class="orange-pill" style="width:100%; font-size:13.5px; padding:6px 4px;">Dynamic What-If Simulator</div>
        <div style="font-size:12.5px; line-height:1.3; text-align:center; margin-top:4px;">Immediate before-vs-after diff comparisons for sudden airframe groundings, crew illnesses, or storms.</div>
      </div>

      <div style="display:flex; flex-direction:column; align-items:center;">
        <div class="orange-pill" style="width:100%; font-size:13.5px; padding:6px 4px;">Redis Dual-Engine Resilience</div>
        <div style="font-size:12.5px; line-height:1.3; text-align:center; margin-top:4px;">Sub-millisecond schedule cache with embedded zero-config fallback guaranteeing 100% demo availability.</div>
      </div>

      <div style="display:flex; flex-direction:column; align-items:center;">
        <div class="orange-pill" style="width:100%; font-size:13.5px; padding:6px 4px;">Automated Weather Gating</div>
        <div style="font-size:12.5px; line-height:1.3; text-align:center; margin-top:4px;">Real-time convective storm restriction checks blocking weather-sensitive sorties from high-risk sectors.</div>
      </div>

      <div style="display:flex; flex-direction:column; align-items:center;">
        <div class="orange-pill" style="width:100%; font-size:13.5px; padding:6px 4px;">Human-in-the-Loop Sign-off</div>
        <div style="font-size:12.5px; line-height:1.3; text-align:center; margin-top:4px;">Autonomy with accountability: AI recommends optimal sortie orders while commanders retain approval authority.</div>
      </div>
    </div>

    <!-- Right Column: Impacts & Benefits -->
    <div style="flex:1; padding-left:24px; display:flex; flex-direction:column; height:100%;">
      <!-- Impacts Section -->
      <div style="flex:1; border-bottom:2px solid #000000; padding-bottom:10px; display:flex; flex-direction:column; justify-content:center;">
        <div class="section-title" style="margin-bottom:8px;">IMPACTS</div>
        <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:14px; text-align:center;">
          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="background:#BFE397; font-weight:800; font-size:12.5px; padding:8px 4px; border-radius:8px; width:100%; min-height:48px; display:flex; align-items:center; justify-content:center; line-height:1.2;">Operational Tempo<br>Acceleration</div>
            <img src="{p5_icons['impact_1']}" style="width:68px; height:68px; object-fit:contain; margin:10px 0;" />
            <div style="font-size:12px; line-height:1.3;">Cuts flight dispatch scheduling cycle from hours to milliseconds.</div>
          </div>

          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="background:#BFE397; font-weight:800; font-size:12.5px; padding:8px 4px; border-radius:8px; width:100%; min-height:48px; display:flex; align-items:center; justify-content:center; line-height:1.2;">Enhanced Mission<br>Readiness</div>
            <img src="{p5_icons['impact_2']}" style="width:68px; height:68px; object-fit:contain; margin:10px 0;" />
            <div style="font-size:12px; line-height:1.3;">Optimizes fleet serviceability rates through intelligent airframe hour distribution.</div>
          </div>

          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="background:#BFE397; font-weight:800; font-size:12.5px; padding:8px 4px; border-radius:8px; width:100%; min-height:48px; display:flex; align-items:center; justify-content:center; line-height:1.2;">Zero-Fatigue<br>Flight Safety</div>
            <img src="{p5_icons['impact_3']}" style="width:68px; height:68px; object-fit:contain; margin:10px 0;" />
            <div style="font-size:12px; line-height:1.3;">Prevents pilot exhaustion by enforcing strict 60h weekly regulatory duty limits.</div>
          </div>

          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="background:#BFE397; font-weight:800; font-size:12.5px; padding:8px 4px; border-radius:8px; width:100%; min-height:48px; display:flex; align-items:center; justify-content:center; line-height:1.2;">Rapid Disruption<br>Recovery</div>
            <img src="{p5_icons['impact_4']}" style="width:68px; height:68px; object-fit:contain; margin:10px 0;" />
            <div style="font-size:12px; line-height:1.3;">Minimizes mission cancellations during sudden adverse weather or airframe AOG events.</div>
          </div>

          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="background:#BFE397; font-weight:800; font-size:12.5px; padding:8px 4px; border-radius:8px; width:100%; min-height:48px; display:flex; align-items:center; justify-content:center; line-height:1.2;">Sovereign Defence<br>Self-Reliance</div>
            <img src="{p5_icons['impact_5']}" style="width:68px; height:68px; object-fit:contain; margin:10px 0;" />
            <div style="font-size:12px; line-height:1.3;">Completely homegrown decision-support software deployed within Indian borders.</div>
          </div>
        </div>
      </div>

      <!-- Benefits Section -->
      <div style="flex:1; padding-top:10px; display:flex; flex-direction:column; justify-content:center;">
        <div class="section-title" style="margin-bottom:8px;">BENEFITS</div>
        <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:14px; text-align:center;">
          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="background:#BFE397; font-weight:800; font-size:12.5px; padding:8px 4px; border-radius:8px; width:100%; min-height:48px; display:flex; align-items:center; justify-content:center; line-height:1.2;">Tactical Situational<br>Picture</div>
            <img src="{p5_icons['benefit_1']}" style="width:68px; height:68px; object-fit:contain; margin:10px 0;" />
            <div style="font-size:12px; line-height:1.3;">Consolidated single-pane-of-glass HUD displaying fleet, crew, weather, and sorties.</div>
          </div>

          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="background:#BFE397; font-weight:800; font-size:12.5px; padding:8px 4px; border-radius:8px; width:100%; min-height:48px; display:flex; align-items:center; justify-content:center; line-height:1.2;">Maximized Fuel &amp;<br>Asset Life</div>
            <img src="{p5_icons['benefit_2']}" style="width:68px; height:68px; object-fit:contain; margin:10px 0;" />
            <div style="font-size:12px; line-height:1.3;">Balances airframe flight hours and fuel reserves to extend depot maintenance intervals.</div>
          </div>

          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="background:#BFE397; font-weight:800; font-size:12.5px; padding:8px 4px; border-radius:8px; width:100%; min-height:48px; display:flex; align-items:center; justify-content:center; line-height:1.2;">Audit &amp; Command<br>Accountability</div>
            <img src="{p5_icons['benefit_3']}" style="width:68px; height:68px; object-fit:contain; margin:10px 0;" />
            <div style="font-size:12px; line-height:1.3;">100% transparent decision ledger recording every allocation, approval, and rejection.</div>
          </div>

          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="background:#BFE397; font-weight:800; font-size:12.5px; padding:8px 4px; border-radius:8px; width:100%; min-height:48px; display:flex; align-items:center; justify-content:center; line-height:1.2;">Scalable to<br>Tri-Service Ops</div>
            <img src="{p5_icons['benefit_4']}" style="width:68px; height:68px; object-fit:contain; margin:10px 0;" />
            <div style="font-size:12px; line-height:1.3;">Architecture effortlessly scales to army aviation, naval air arms, and joint commands.</div>
          </div>

          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="background:#BFE397; font-weight:800; font-size:12.5px; padding:8px 4px; border-radius:8px; width:100%; min-height:48px; display:flex; align-items:center; justify-content:center; line-height:1.2;">Zero Recurring<br>Licensing Costs</div>
            <img src="{p5_icons['benefit_5']}" style="width:68px; height:68px; object-fit:contain; margin:10px 0;" />
            <div style="font-size:12px; line-height:1.3;">Eliminates reliance on expensive foreign military logistics software.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ==========================================
     PAGE 6: OUR PROTOTYPE & REFERENCES
     ========================================== -->
<div class="page" style="padding-top:14px;">
  <!-- Custom Split Top Header matching reference -->
  <div style="display:flex; height:90px; margin-bottom:12px; margin-left:-44px; margin-right:-44px;">
    <!-- Left Header -->
    <div style="flex:1.05; display:flex; align-items:center; padding-left:0px; border-right:2px solid #000000;">
      <div style="flex:1; text-align:center;">
        <span style="font-family:Garamond, serif; font-size:46px; font-weight:700; color:#034697; border-bottom:3.5px double #034697; display:inline-block; line-height:1; padding-bottom:3px; letter-spacing:0.5px;">
          OUR PROTOTYPE
        </span>
      </div>
    </div>
    <!-- Right Header -->
    <div style="flex:0.95; display:flex; align-items:center; justify-content:space-between; padding-left:30px; padding-right:44px;">
      <span style="font-family:Garamond, serif; font-size:40px; font-weight:700; color:#034697; border-bottom:3.5px double #034697; display:inline-block; line-height:1; padding-bottom:3px; letter-spacing:0.5px;">
        RESEARCH AND REFERENCES
      </span>
      <img src="{sih_logo_src}" style="width:145px; height:auto; object-fit:contain;" alt="SIH 2026" />
    </div>
  </div>

  <div style="display:flex; flex:1; position:relative;">
    <!-- Left Half: Prototype Mobile Screens with exact reference overlapping phones -->
    <div style="flex:1.05; padding-right:24px; border-right:2px solid #000000; display:flex; flex-direction:column; align-items:center; position:relative;">
      <!-- App Interface pill with curved arrows -->
      <div style="position:relative; display:flex; align-items:center; justify-content:center; margin-bottom:10px; width:100%;">
        <svg style="position:absolute; width:100%; height:80px; top:-10px; pointer-events:none;" overflow="visible">
          <defs>
            <marker id="arrAppL" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000"/>
            </marker>
            <marker id="arrAppR" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000"/>
            </marker>
          </defs>
          <path d="M 280 40 C 240 50, 200 110, 180 150" stroke="#000000" stroke-width="4" fill="none" marker-end="url(#arrAppL)"/>
          <path d="M 400 40 C 440 50, 480 110, 500 150" stroke="#000000" stroke-width="4" fill="none" marker-end="url(#arrAppR)"/>
        </svg>
        <div class="orange-pill" style="font-size:26px; padding:6px 28px; border-radius:24px; z-index:2;">WebApp Interface</div>
      </div>

      <!-- 3 Overlapping Phones -->
      <div style="position:relative; width:100%; flex:1; display:flex; justify-content:center; align-items:flex-start;">
        <!-- Left Phone: Fleet Registry -->
        <div style="width:205px; height:430px; background:#0F172A; border:3.5px solid #1E293B; border-radius:26px; overflow:hidden; box-shadow:0 12px 28px rgba(0,0,0,0.35); position:absolute; left:50px; top:10px; z-index:1;">
          <div style="height:14px; background:#0F172A; display:flex; justify-content:center; align-items:center;">
            <div style="width:40px; height:4px; background:#334155; border-radius:2px;"></div>
          </div>
          <img src="{proto_left_src}" style="width:100%; height:416px; object-fit:cover; object-position:top;" alt="AeroOpt Fleet Registry" />
        </div>

        <!-- Center Phone: Mission HUD Dashboard (in front & lower) -->
        <div style="width:205px; height:430px; background:#0F172A; border:3.5px solid #1E293B; border-radius:26px; overflow:hidden; box-shadow:0 16px 36px rgba(0,0,0,0.45); position:absolute; left:235px; top:50px; z-index:3;">
          <div style="height:14px; background:#0F172A; display:flex; justify-content:center; align-items:center;">
            <div style="width:40px; height:4px; background:#334155; border-radius:2px;"></div>
          </div>
          <img src="{proto_center_src}" style="width:100%; height:416px; object-fit:cover; object-position:top;" alt="AeroOpt Mission HUD" />
        </div>

        <!-- Right Phone: Constraint Optimiser -->
        <div style="width:205px; height:430px; background:#0F172A; border:3.5px solid #1E293B; border-radius:26px; overflow:hidden; box-shadow:0 12px 28px rgba(0,0,0,0.35); position:absolute; left:420px; top:8px; z-index:2;">
          <div style="height:14px; background:#0F172A; display:flex; justify-content:center; align-items:center;">
            <div style="width:40px; height:4px; background:#334155; border-radius:2px;"></div>
          </div>
          <img src="{proto_right_src}" style="width:100%; height:416px; object-fit:cover; object-position:top;" alt="AeroOpt Constraint Optimiser" />
        </div>
      </div>

      <!-- Web Interface pill at bottom -->
      <div style="margin-top:10px; margin-bottom:4px; z-index:4;">
        <div class="orange-pill" style="font-size:22px; padding:6px 26px; border-radius:20px;">Web Interface</div>
      </div>
    </div>

    <!-- Right Half: Research & References -->
    <div style="flex:0.95; padding-left:36px; display:flex; flex-direction:column; justify-content:space-around; gap:16px;">
      <div>
        <div style="display:flex; align-items:baseline; gap:8px;">
          <span style="font-size:26px; color:#034697; line-height:1;">•</span>
          <span style="font-size:21px; font-weight:700; color:#034697;">Operations Research &amp; MILP in Air Operations Scheduling (NATO STO / IEEE)</span>
        </div>
        <div style="font-size:16.5px; line-height:1.42; color:#000000; margin-top:4px;">
          <strong>Summary:</strong> Formulates mixed-integer linear programming (MILP) and constraint satisfaction algorithms for optimal sortie scheduling, airframe turnaround minimization, and crew fatigue mitigation.
        </div>
        <div style="font-size:16px; margin-top:4px;">
          Link: <a href="https://www.sto.nato.int/publications/" style="color:#AF4C0F; font-weight:700; text-decoration:none;">https://www.sto.nato.int/publications/</a>
        </div>
      </div>

      <div>
        <div style="display:flex; align-items:baseline; gap:8px;">
          <span style="font-size:26px; color:#034697; line-height:1;">•</span>
          <span style="font-size:21px; font-weight:700; color:#034697;">ICAO Annex 6 &amp; DGCA Flight and Duty Time Limitations (FDTL)</span>
        </div>
        <div style="font-size:16.5px; line-height:1.42; color:#000000; margin-top:4px;">
          <strong>Summary:</strong> International and Indian statutory guidelines governing pilot duty cycles, mandatory rest intervals, and cumulative 7-day fatigue thresholds for flight safety.
        </div>
        <div style="font-size:16px; margin-top:4px;">
          Link: <a href="https://www.dgca.gov.in/digigov-portal/" style="color:#AF4C0F; font-weight:700; text-decoration:none;">https://www.dgca.gov.in/digigov-portal/</a>
        </div>
      </div>

      <div>
        <div style="display:flex; align-items:baseline; gap:8px;">
          <span style="font-size:26px; color:#034697; line-height:1;">•</span>
          <span style="font-size:21px; font-weight:700; color:#034697;">Real-Time In-Memory Caching Strategies for High-Throughput Tactical Systems (ACM)</span>
        </div>
        <div style="font-size:16.5px; line-height:1.42; color:#000000; margin-top:4px;">
          <strong>Summary:</strong> Architectural framework evaluating sub-millisecond in-memory caching, atomic key lockouts, and event-driven invalidation in defense command-and-control grids.
        </div>
        <div style="font-size:16px; margin-top:4px;">
          Link: <a href="https://dl.acm.org/doi/10.1145/3318464.3389700" style="color:#AF4C0F; font-weight:700; text-decoration:none;">https://dl.acm.org/doi/10.1145/3318464.3389700</a>
        </div>
      </div>

      <div>
        <div style="display:flex; align-items:baseline; gap:8px;">
          <span style="font-size:26px; color:#034697; line-height:1;">•</span>
          <span style="font-size:21px; font-weight:700; color:#034697;">Human-in-the-Loop AI Decision Support for Mission-Critical Command Systems (DARPA)</span>
        </div>
        <div style="font-size:16.5px; line-height:1.42; color:#000000; margin-top:4px;">
          <strong>Summary:</strong> Principles for designing explainable, human-governed AI advisory systems ensuring tactical autonomy operates under strict commander oversight and tamper-proof auditing.
        </div>
        <div style="font-size:16px; margin-top:4px;">
          Link: <a href="https://www.darpa.mil/program/explainable-artificial-intelligence" style="color:#AF4C0F; font-weight:700; text-decoration:none;">https://www.darpa.mil/program/explainable-artificial-intelligence</a>
        </div>
      </div>
    </div>
  </div>
</div>

</body>
</html>
'''

output_html_path = os.path.join(work_dir, 'AeroOpt_AI_SIH_2026_Deck.html')
with open(output_html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Generated {output_html_path} successfully! Total length: {len(html)} chars.")
