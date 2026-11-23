import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette: Dark Navy & Cyan / Purple accents
    BG_DARK = RGBColor(11, 17, 32)        # #0B1120 Deep Dark Navy
    CARD_BG = RGBColor(19, 29, 49)        # #131D31 Card Navy
    CARD_BORDER = RGBColor(38, 54, 82)    # #263652 Card Border
    ACCENT_CYAN = RGBColor(6, 182, 212)   # #06B6D4 Cyan
    BRIGHT_CYAN = RGBColor(34, 211, 238)  # #22D3EE Bright Cyan
    ACCENT_PURPLE = RGBColor(168, 85, 247)# #A855F7 Purple
    BRIGHT_PURPLE = RGBColor(192, 132, 252)# #C084FC Bright Purple
    TEXT_WHITE = RGBColor(248, 250, 252)  # #F8FAFC White
    TEXT_MUTED = RGBColor(148, 163, 184)  # #94A3B8 Slate 400
    ACCENT_GREEN = RGBColor(34, 197, 94)  # #22C55E Green
    ACCENT_AMBER = RGBColor(245, 158, 11) # #F59E0B Amber

    # Screenshots directory
    img_dir = os.path.abspath('screenshots')
    screenshots = {
        'landing': os.path.join(img_dir, 'proto_a_landing.png'),
        'dashboard': os.path.join(img_dir, 'app_1_dashboard.png'),
        'review': os.path.join(img_dir, 'proto_c_review.png'),
        'theme': os.path.join(img_dir, 'app_3_theme_preview.png'),
        'builder': os.path.join(img_dir, 'app_4_builder.png'),
        'intelligence': os.path.join(img_dir, 'app_5_intelligence.png'),
    }

    def add_base_slide(category, title, subtitle):
        slide = prs.slides.add_slide(blank_layout)
        
        # 1. Full-bleed Dark Navy Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()

        # 2. Top Accent Glow Bar (Cyan to Purple)
        accent_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.04))
        accent_bar.fill.solid()
        accent_bar.fill.fore_color.rgb = ACCENT_CYAN
        accent_bar.line.fill.background()

        # 3. Category Tag Badge
        badge = slide.shapes.add_textbox(Inches(0.8), Inches(0.55), Inches(6.0), Inches(0.3))
        tf_b = badge.text_frame
        tf_b.word_wrap = True
        tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0
        p_b = tf_b.paragraphs[0]
        p_b.text = f"// {category.upper()}"
        p_b.font.size = Pt(10)
        p_b.font.bold = True
        p_b.font.color.rgb = BRIGHT_CYAN
        p_b.font.name = 'Consolas'

        # 4. Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.733), Inches(0.55))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE
        p_t.font.name = 'Calibri'

        # 5. Slide Subtitle
        if subtitle:
            sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(11.733), Inches(0.35))
            tf_s = sub_box.text_frame
            tf_s.word_wrap = True
            tf_s.margin_left = tf_s.margin_top = tf_s.margin_right = tf_s.margin_bottom = 0
            p_s = tf_s.paragraphs[0]
            p_s.text = subtitle
            p_s.font.size = Pt(12)
            p_s.font.color.rgb = TEXT_MUTED
            p_s.font.name = 'Calibri'

        # 6. Bottom Footer
        footer = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.733), Inches(0.3))
        tf_f = footer.text_frame
        tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0
        p_f = tf_f.paragraphs[0]
        p_f.text = "PortCraft • Student Digital Profile Aggregator & Portfolio Builder"
        p_f.font.size = Pt(9)
        p_f.font.color.rgb = RGBColor(71, 85, 105)
        p_f.font.name = 'Calibri'

        return slide

    def add_card(slide, left, top, width, height, bg=CARD_BG, border=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg
        card.line.color.rgb = border
        card.line.width = Pt(1)
        return card

    # =========================================================================
    # SLIDE 1: PortCraft — Project Overview
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = BG_DARK
    bg1.line.fill.background()

    # Gradient top bar
    bar1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(0.06))
    bar1.fill.solid()
    bar1.fill.fore_color.rgb = ACCENT_CYAN
    bar1.line.fill.background()

    # Title box
    t1 = slide1.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.733), Inches(1.8))
    tf1 = t1.text_frame
    tf1.word_wrap = True
    p1_badge = tf1.paragraphs[0]
    p1_badge.text = "CAPSTONE ENGINEERING PROJECT // NEXT.JS 16 & AI"
    p1_badge.font.size = Pt(12)
    p1_badge.font.bold = True
    p1_badge.font.color.rgb = BRIGHT_CYAN
    p1_badge.font.name = 'Consolas'

    p1_main = tf1.add_paragraph()
    p1_main.text = "PORTCRAFT"
    p1_main.font.size = Pt(44)
    p1_main.font.bold = True
    p1_main.font.color.rgb = TEXT_WHITE
    p1_main.font.name = 'Calibri'

    p1_sub = tf1.add_paragraph()
    p1_sub.text = "Student Digital Profile Aggregator & Multiverse Portfolio Builder"
    p1_sub.font.size = Pt(20)
    p1_sub.font.color.rgb = BRIGHT_PURPLE
    p1_sub.font.name = 'Calibri'

    # Overview Description Card
    desc_card = add_card(slide1, Inches(0.8), Inches(3.2), Inches(11.733), Inches(1.1))
    tb_desc = slide1.shapes.add_textbox(Inches(1.0), Inches(3.3), Inches(11.333), Inches(0.9))
    tf_desc = tb_desc.text_frame
    tf_desc.word_wrap = True
    p_d = tf_desc.paragraphs[0]
    p_d.text = "PortCraft solves student profile fragmentation by aggregating GitHub, LeetCode, Codeforces, Kaggle, and LinkedIn into unified portfolios powered by 30 immersive fictional-universe themes. Features zero-fabrication resume parsing, real-time completeness tracking, Nielsen-rated usability evaluations, and one-click standalone ZIP exports."
    p_d.font.size = Pt(13)
    p_d.font.color.rgb = RGBColor(226, 232, 240)
    p_d.font.name = 'Calibri'

    # 4 Pillar Feature Cards
    pillars = [
        ("Multi-Platform Aggregation", "Automated sync for GitHub repos, LeetCode ratings, Codeforces stats & Kaggle achievements.", BRIGHT_CYAN),
        ("Zero-Fabrication Parser", "High-accuracy PDF/DOCX/OCR parser. Unknown dates and skill levels remain strictly unassessed.", BRIGHT_PURPLE),
        ("30 Multiverse Themes", "Spider-Verse, Cyberpunk, Gotham, Arc Reactor & more consuming a single unified data contract.", ACCENT_GREEN),
        ("Local-First Privacy", "GDPR-compliant consent gate, granular scoped deletion, and zero external tracking dependencies.", ACCENT_AMBER)
    ]
    card_w = Inches(2.78)
    card_gap = Inches(0.2)
    for idx, (p_title, p_desc, p_color) in enumerate(pillars):
        c_left = Inches(0.8) + idx * (card_w + card_gap)
        add_card(slide1, c_left, Inches(4.6), card_w, Inches(2.1))
        
        # Color bar on top of card
        top_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, c_left, Inches(4.6), card_w, Inches(0.05))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = p_color
        top_bar.line.fill.background()

        tb = slide1.shapes.add_textbox(c_left + Inches(0.15), Inches(4.75), card_w - Inches(0.3), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p_t = tf.paragraphs[0]
        p_t.text = p_title
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = p_color
        
        p_body = tf.add_paragraph()
        p_body.text = p_desc
        p_body.font.size = Pt(11)
        p_body.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 2: Problem Statement
    # =========================================================================
    slide2 = add_base_slide(
        "PROBLEM STATEMENT",
        "The Problem: Fragmented Profiles & High Portfolio Friction",
        "Why standard developer portfolio builders and scattered platform links fail technical students"
    )

    problems = [
        (
            "01",
            "Fragmented Technical Footprint",
            "Students maintain active accounts across 5+ platforms:\n• Code repositories on GitHub\n• Algorithmic badges on LeetCode & Codeforces\n• Machine learning projects on Kaggle\n• Certifications & education on LinkedIn\n\nResult: Recruiters receive a messy list of disjointed URLs and miss key accomplishments.",
            BRIGHT_CYAN
        ),
        (
            "02",
            "High Maintenance & Design Friction",
            "Building a personalized, high-quality portfolio requires:\n• Advanced frontend design & responsive styling\n• Repetitive manual data entry across multiple sites\n• Ongoing hosting, domain configuration, and updates\n\nResult: 70%+ of students either have no portfolio or rely on outdated, broken personal websites.",
            BRIGHT_PURPLE
        ),
        (
            "03",
            "Fabricated Data & Generic Templates",
            "Existing portfolio builders suffer from critical design flaws:\n• Resume parsers fabricate random skill ratings (e.g. 3/5)\n• Missing experience dates are hallucinated with current year\n• Drab corporate templates fail to stand out in competitive tech recruitment.",
            ACCENT_AMBER
        )
    ]
    p_w = Inches(3.77)
    for idx, (num, p_title, p_desc, p_color) in enumerate(problems):
        c_left = Inches(0.8) + idx * (p_w + Inches(0.2))
        add_card(slide2, c_left, Inches(2.0), p_w, Inches(4.8))

        # Number pill
        pill = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left + Inches(0.2), Inches(2.2), Inches(0.7), Inches(0.35))
        pill.fill.solid()
        pill.fill.fore_color.rgb = p_color
        pill.line.fill.background()
        tf_pill = pill.text_frame
        p_pill = tf_pill.paragraphs[0]
        p_pill.text = num
        p_pill.font.bold = True
        p_pill.font.size = Pt(11)
        p_pill.font.color.rgb = BG_DARK
        p_pill.alignment = PP_ALIGN.CENTER

        tb = slide2.shapes.add_textbox(c_left + Inches(0.2), Inches(2.7), p_w - Inches(0.4), Inches(3.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p_h = tf.paragraphs[0]
        p_h.text = p_title
        p_h.font.size = Pt(15)
        p_h.font.bold = True
        p_h.font.color.rgb = TEXT_WHITE

        p_b = tf.add_paragraph()
        p_b.text = p_desc
        p_b.font.size = Pt(11)
        p_b.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 3: End-to-End Workflow
    # =========================================================================
    slide3 = add_base_slide(
        "SYSTEM PIPELINE",
        "End-to-End Workflow: From Raw Data to Deployed Portfolio",
        "A seamless 5-stage automated pipeline that consolidates, refines, and presents student achievements"
    )

    steps = [
        ("1. Ingest", "Multi-Source Intake", "PDF/DOCX/OCR Resume Parser + GitHub, LeetCode, Codeforces & Kaggle API connectors.", BRIGHT_CYAN),
        ("2. Review", "Human-in-the-Loop", "Inspect extracted fields, toggle section visibility, adjust unassessed skills with zero hallucination.", BRIGHT_PURPLE),
        ("3. Theme", "Multiverse Selection", "Choose from 30 immersive themes (Spider-Verse, Cyberpunk, Gotham) sharing a single JSON contract.", ACCENT_GREEN),
        ("4. Customize", "Real-Time Builder", "WYSIWYG layout customizer, reorder sections, adjust color parameters and banner accents.", BRIGHT_CYAN),
        ("5. Export", "Instant Deployment", "Export self-contained static HTML/CSS/JS ZIP ready for GitHub Pages, Vercel, or Netlify.", BRIGHT_PURPLE),
    ]
    step_w = Inches(2.2)
    step_gap = Inches(0.18)
    for idx, (s_num, s_title, s_desc, s_color) in enumerate(steps):
        s_left = Inches(0.8) + idx * (step_w + step_gap)
        add_card(slide3, s_left, Inches(2.1), step_w, Inches(3.4))

        # Top indicator bar
        ib = slide3.shapes.add_shape(MSO_SHAPE.RECTANGLE, s_left, Inches(2.1), step_w, Inches(0.06))
        ib.fill.solid()
        ib.fill.fore_color.rgb = s_color
        ib.line.fill.background()

        tb = slide3.shapes.add_textbox(s_left + Inches(0.15), Inches(2.3), step_w - Inches(0.3), Inches(3.0))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p1 = tf.paragraphs[0]
        p1.text = s_num
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = s_color
        p1.font.name = 'Consolas'

        p2 = tf.add_paragraph()
        p2.text = s_title
        p2.font.size = Pt(14)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE

        p3 = tf.add_paragraph()
        p3.text = s_desc
        p3.font.size = Pt(11)
        p3.font.color.rgb = TEXT_MUTED

    # Bottom Architecture Summary Card
    summary_card = add_card(slide3, Inches(0.8), Inches(5.75), Inches(11.733), Inches(1.05))
    tb_sc = slide3.shapes.add_textbox(Inches(1.0), Inches(5.85), Inches(11.333), Inches(0.85))
    tf_sc = tb_sc.text_frame
    tf_sc.word_wrap = True
    p_sc1 = tf_sc.paragraphs[0]
    p_sc1.text = "INTELLIGENCE ENGINE & LOCAL STORAGE BACKBONE"
    p_sc1.font.size = Pt(11)
    p_sc1.font.bold = True
    p_sc1.font.color.rgb = BRIGHT_CYAN
    p_sc1.font.name = 'Consolas'
    p_sc2 = tf_sc.add_paragraph()
    p_sc2.text = "All stages operate locally in browser storage (LocalStorage / SessionStorage) with zero mandatory cloud databases. The recommendation engine evaluates portfolio data in real-time to suggest relevant skill improvements and theme pairings."
    p_sc2.font.size = Pt(11)
    p_sc2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 4: Resume Import & Profile Integration
    # =========================================================================
    slide4 = add_base_slide(
        "DATA INGESTION",
        "Resume Ingestion & Multi-Platform Aggregation",
        "High-accuracy extraction across documents, scanned images, and live coding platform APIs"
    )

    # Left: Feature highlights (Width: 5.6 inches)
    f4_items = [
        ("Multi-Modal Document Parser", "Native text extraction for PDF and DOCX documents with automated section boundary detection and clean tokenization.", BRIGHT_CYAN),
        ("Vision OCR Fallback", "Scanned or image resumes (PNG/JPG/WEBP) are parsed using local Tesseract.js OCR with Google Gemini 2.0 Flash vision fallback.", BRIGHT_PURPLE),
        ("Zero-Fabrication Policy", "Missing dates strictly remain empty strings (\"\"). Unrated skills default to level: 0 (unassessed). Zero artificial numbers invented.", ACCENT_GREEN),
        ("Direct Platform Connectors", "Instant sync with GitHub (repos, stars, top languages), LeetCode (solved count & contest rating), Codeforces, and Kaggle.", BRIGHT_CYAN)
    ]
    for idx, (f_title, f_desc, f_col) in enumerate(f4_items):
        top_pos = Inches(2.0) + idx * Inches(1.15)
        add_card(slide4, Inches(0.8), top_pos, Inches(5.6), Inches(1.05))
        tb = slide4.shapes.add_textbox(Inches(1.0), top_pos + Inches(0.1), Inches(5.2), Inches(0.85))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = f_title
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = f_col
        p2 = tf.add_paragraph()
        p2.text = f_desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED

    # Right: Screenshot Card (Width: 5.8 inches)
    add_card(slide4, Inches(6.7), Inches(2.0), Inches(5.833), Inches(4.7))
    if os.path.exists(screenshots['landing']):
        slide4.shapes.add_picture(screenshots['landing'], Inches(6.8), Inches(2.1), width=Inches(5.633))

    # =========================================================================
    # SLIDE 5: Student Profile Dashboard
    # =========================================================================
    slide5 = add_base_slide(
        "STUDENT DASHBOARD",
        "Student Profile Dashboard: Unified Health & Analytics",
        "Centralized overview of profile completeness, competitive coding metrics, and portfolio quick actions"
    )

    # Left: Screenshot (Width: 6.2 inches)
    add_card(slide5, Inches(0.8), Inches(2.0), Inches(6.0), Inches(4.7))
    if os.path.exists(screenshots['dashboard']):
        slide5.shapes.add_picture(screenshots['dashboard'], Inches(0.9), Inches(2.1), width=Inches(5.8))

    # Right: Dashboard Features (Width: 5.4 inches)
    f5_items = [
        ("Real-Time Profile Completeness", "Dynamic health percentage (0-100%) tracking profile integrity across personal info, skills, projects, experience, and education.", BRIGHT_CYAN),
        ("Unified Coding Analytics", "Consolidates LeetCode problems solved (Easy/Medium/Hard), Codeforces contest ratings, and GitHub repository activity in one interface.", BRIGHT_PURPLE),
        ("Section Health & Quick Actions", "Direct navigation chips to edit unassessed skills, add project live demos, review parsed resumes, or jump directly into the theme builder.", ACCENT_GREEN),
        ("One-Click Preview & Export", "Immediate preview generation and standalone ZIP packaging accessible right from the main dashboard navigation.", BRIGHT_CYAN)
    ]
    for idx, (f_title, f_desc, f_col) in enumerate(f5_items):
        top_pos = Inches(2.0) + idx * Inches(1.15)
        add_card(slide5, Inches(7.1), top_pos, Inches(5.433), Inches(1.05))
        tb = slide5.shapes.add_textbox(Inches(7.3), top_pos + Inches(0.1), Inches(5.0), Inches(0.85))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = f_title
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = f_col
        p2 = tf.add_paragraph()
        p2.text = f_desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 6: 30 Theme System
    # =========================================================================
    slide6 = add_base_slide(
        "DESIGN SYSTEM",
        "30 Theme System: Immersive Fictional Universes",
        "A single normalized portfolio data contract powering 30 radically distinct aesthetic experiences"
    )

    # Left: Screenshot (Width: 6.0 inches)
    add_card(slide6, Inches(0.8), Inches(2.0), Inches(6.0), Inches(4.7))
    if os.path.exists(screenshots['theme']):
        slide6.shapes.add_picture(screenshots['theme'], Inches(0.9), Inches(2.1), width=Inches(5.8))

    # Right: Theme Features & Sample Worlds
    f6_items = [
        ("Single Universal Data Contract", "All 30 themes consume the exact same PortfolioData JSON schema. Students switch themes instantly with zero data re-entry or layout breakage.", BRIGHT_CYAN),
        ("Rich Multiverse Aesthetics", "Includes Spider-Verse (glitch & comic halftone), Cyberpunk 2077 (neon terminal), Gotham Dark Knight (tactical radar), Arc Reactor, Kingdom of Ink, Solar Forge, etc.", BRIGHT_PURPLE),
        ("Zero Theme Bleed", "Scoped CSS variables, Framer Motion choreography, responsive touch interactions, and custom audio soundscapes tailored to each fictional universe.", ACCENT_GREEN),
        ("Full Responsive Viewport Fidelity", "Optimized typography hierarchies and overflow constraints guaranteeing zero clipping on mobile, tablet, and ultra-wide desktop monitors.", ACCENT_AMBER)
    ]
    for idx, (f_title, f_desc, f_col) in enumerate(f6_items):
        top_pos = Inches(2.0) + idx * Inches(1.15)
        add_card(slide6, Inches(7.1), top_pos, Inches(5.433), Inches(1.05))
        tb = slide6.shapes.add_textbox(Inches(7.3), top_pos + Inches(0.1), Inches(5.0), Inches(0.85))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = f_title
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = f_col
        p2 = tf.add_paragraph()
        p2.text = f_desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 7: Portfolio Builder & Customization
    # =========================================================================
    slide7 = add_base_slide(
        "PORTFOLIO BUILDER",
        "Portfolio Builder: Real-Time Customization & WYSIWYG",
        "Intuitive drag-and-drop section management with instant visual feedback and theme customization"
    )

    # Left: Builder Screenshot (Width: 6.0 inches)
    add_card(slide7, Inches(0.8), Inches(2.0), Inches(6.0), Inches(4.7))
    if os.path.exists(screenshots['builder']):
        slide7.shapes.add_picture(screenshots['builder'], Inches(0.9), Inches(2.1), width=Inches(5.8))

    # Right: Builder Capabilities (Width: 5.4 inches)
    f7_items = [
        ("Dynamic Section Reordering", "Reorder, show, or hide About, Skills, Projects, Experience, Education, and Achievements to suit specific job application requirements.", BRIGHT_CYAN),
        ("Live Split-Screen Preview", "Changes to bio, tech stacks, or project links update the rendered canvas in real time without triggering page reloads.", BRIGHT_PURPLE),
        ("Theme Parameter Controls", "Customize theme-specific accent colors, typography sizing, particle densities, and background scanlines directly from the builder controls.", ACCENT_GREEN),
        ("Dual-Position Export Trigger", "Export buttons placed in both the persistent top navigation and floating toolbar for fast one-click static site packaging.", ACCENT_AMBER)
    ]
    for idx, (f_title, f_desc, f_col) in enumerate(f7_items):
        top_pos = Inches(2.0) + idx * Inches(1.15)
        add_card(slide7, Inches(7.1), top_pos, Inches(5.433), Inches(1.05))
        tb = slide7.shapes.add_textbox(Inches(7.3), top_pos + Inches(0.1), Inches(5.0), Inches(0.85))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = f_title
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = f_col
        p2 = tf.add_paragraph()
        p2.text = f_desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 8: Portfolio Sections & Content Model
    # =========================================================================
    slide8 = add_base_slide(
        "DATA MODEL",
        "Portfolio Sections & Comprehensive Content Model",
        "Extensible JSON data model capturing all dimensions of a student's engineering profile"
    )

    sections_data = [
        ("Personal & Bio", "Full name, professional title, biography, contact info, GitHub/LinkedIn links, and custom avatar URL.", BRIGHT_CYAN),
        ("Technical Skills", "Categorized across Frontend, Backend, Database, DevOps, Languages & AI with truthful unassessed level flags.", BRIGHT_PURPLE),
        ("Featured Projects", "Project titles, tech stack badges, GitHub repository URLs, live demo links, descriptions, and feature stars.", ACCENT_GREEN),
        ("Work Experience", "Position title, company name, location (Remote/Onsite), start/end dates, current role flags, and bullet highlights.", BRIGHT_CYAN),
        ("Education & Degrees", "University name, degree, major / field of study, start and graduation years, GPA/CGPA, and coursework notes.", BRIGHT_PURPLE),
        ("Achievements & Certs", "Hackathons, research publications, competitive programming awards, and verified credentials (CKA, AWS, Scrum).", ACCENT_AMBER),
    ]
    grid_w = Inches(3.77)
    grid_h = Inches(2.2)
    for idx, (s_title, s_desc, s_color) in enumerate(sections_data):
        col = idx % 3
        row = idx // 3
        c_left = Inches(0.8) + col * (grid_w + Inches(0.2))
        c_top = Inches(2.1) + row * (grid_h + Inches(0.25))

        add_card(slide8, c_left, c_top, grid_w, grid_h)
        
        # Color bar on card
        top_bar = slide8.shapes.add_shape(MSO_SHAPE.RECTANGLE, c_left, c_top, grid_w, Inches(0.05))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = s_color
        top_bar.line.fill.background()

        tb = slide8.shapes.add_textbox(c_left + Inches(0.2), c_top + Inches(0.15), grid_w - Inches(0.4), grid_h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = s_title
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = s_color

        p2 = tf.add_paragraph()
        p2.text = s_desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 9: Intelligence & Recommendations
    # =========================================================================
    slide9 = add_base_slide(
        "INTELLIGENCE ENGINE",
        "Intelligence Engine: Personalized Recommendations",
        "Goal-oriented skill gap analysis, responsive feedback loops, and objective portfolio recommendations"
    )

    # Left: Screenshot (Width: 6.0 inches)
    add_card(slide9, Inches(0.8), Inches(2.0), Inches(6.0), Inches(4.7))
    if os.path.exists(screenshots['intelligence']):
        slide9.shapes.add_picture(screenshots['intelligence'], Inches(0.9), Inches(2.1), width=Inches(5.8))

    # Right: Recommendation Capabilities (Width: 5.4 inches)
    f9_items = [
        ("Goal-Oriented Skill Matching", "Analyzes the user's career focus (Full Stack, Backend, Data Science) against their profile and highlights missing high-demand skills.", BRIGHT_CYAN),
        ("Active Feedback Responsiveness", "Learns from user feedback (Helpful, Not Helpful, Already Done). Positive ratings boost related categories; dismissals permanently purge items.", BRIGHT_PURPLE),
        ("Smart Project Deduplication", "Cross-checks recommendations against existing portfolio items to ensure projects already completed are never redundantly suggested.", ACCENT_GREEN),
        ("Dynamic Data Fingerprinting", "Recommendations automatically recalculate whenever profile data, active templates, or skills change with zero manual refreshing.", ACCENT_AMBER)
    ]
    for idx, (f_title, f_desc, f_col) in enumerate(f9_items):
        top_pos = Inches(2.0) + idx * Inches(1.15)
        add_card(slide9, Inches(7.1), top_pos, Inches(5.433), Inches(1.05))
        tb = slide9.shapes.add_textbox(Inches(7.3), top_pos + Inches(0.1), Inches(5.0), Inches(0.85))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = f_title
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = f_col
        p2 = tf.add_paragraph()
        p2.text = f_desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 10: Behavior Tracking & Privacy
    # =========================================================================
    slide10 = add_base_slide(
        "PRIVACY & ETHICS",
        "Local-First Architecture & Consent-Gated Tracking",
        "Zero tracking without explicit user consent, strict local browser storage, and full GDPR compliance"
    )

    privacy_cards = [
        (
            "Strict Consent Enforcement",
            "• Analytics and personalization tracking are strictly disabled until the user explicitly grants permission.\n• Revoking consent immediately disconnects DOM event listeners, halts heartbeat intervals, and clears pending updates.\n• Real-time window event dispatch ensures state updates instantly.",
            BRIGHT_CYAN
        ),
        (
            "Persistent Real Session Tracking",
            "• Eliminated hardcoded session IDs ('builder-session') and static durations.\n• Sessions dynamically track activity across a 30-minute rolling window.\n• Genuine interaction duration, page views, and engagement metrics computed without arbitrary mock values.",
            BRIGHT_PURPLE
        ),
        (
            "Granular 5-Scope Data Deletion",
            "Users possess absolute control over their stored data with scoped deletion options:\n1. 'all': Complete purge of profile, events, and feedback\n2. 'analytics': Purge interaction telemetry and metrics\n3. 'recommendations': Clear cached suggestion history\n4. 'profile': Reset portfolio data\n5. 'events': Clear event logs",
            ACCENT_AMBER
        ),
        (
            "Comprehensive Data Export",
            "• Single-click complete data export (`exportAllData()`)\n• Delivers a clean JSON archive containing user profile, analytics events, recommendations, user feedback, and A/B test assignments.\n• Enables 100% data portability with zero vendor lock-in.",
            ACCENT_GREEN
        )
    ]
    p_w10 = Inches(5.76)
    p_h10 = Inches(2.25)
    for idx, (p_title, p_desc, p_color) in enumerate(privacy_cards):
        col = idx % 2
        row = idx // 2
        c_left = Inches(0.8) + col * (p_w10 + Inches(0.2))
        c_top = Inches(2.1) + row * (p_h10 + Inches(0.25))

        add_card(slide10, c_left, c_top, p_w10, p_h10)
        
        # Color bar on card
        top_bar = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, c_left, c_top, p_w10, Inches(0.05))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = p_color
        top_bar.line.fill.background()

        tb = slide10.shapes.add_textbox(c_left + Inches(0.2), c_top + Inches(0.12), p_w10 - Inches(0.4), p_h10 - Inches(0.25))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = p_title
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = p_color

        p2 = tf.add_paragraph()
        p2.text = p_desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 11: AI Assistant, Preview & Export
    # =========================================================================
    slide11 = add_base_slide(
        "ASSISTANT & DEPLOYMENT",
        "AI Assistant, Multi-Device Preview & Standalone Export",
        "Intelligent content refinement, responsive device emulation, and client-side ZIP bundle packaging"
    )

    t11_items = [
        (
            "Context-Aware AI Assistant",
            "Integrated portfolio assistant powered by Google Gemini API:\n• Enhances student project bullet points using action verbs and measurable metrics\n• Generates tailored professional summaries based on target engineering roles\n• Corrects grammar and refines technical terminology while preserving student voice.",
            BRIGHT_CYAN
        ),
        (
            "Multi-Device Viewport Emulator",
            "Interactive preview toolbar allowing students to inspect portfolio rendering across screen formats:\n• Desktop View (1440px): Full visual fidelity with particle canvases and multi-column layouts\n• Tablet View (768px): Dual-column grid layouts with touch-friendly navigation\n• Mobile View (375px): Single-column swipeable cards with zero horizontal overflow.",
            BRIGHT_PURPLE
        ),
        (
            "Single-Click Standalone ZIP Export",
            "Client-side bundling powered by JSZip and FileSaver:\n• Generates self-contained static HTML, CSS, JavaScript, and asset files\n• Zero external server or runtime dependencies required to host\n• Deployable immediately to GitHub Pages, Vercel, Netlify, or any static web host.",
            ACCENT_GREEN
        )
    ]
    w11 = Inches(3.77)
    for idx, (t_title, t_desc, t_col) in enumerate(t11_items):
        c_left = Inches(0.8) + idx * (w11 + Inches(0.2))
        add_card(slide11, c_left, Inches(2.1), w11, Inches(4.7))

        top_bar = slide11.shapes.add_shape(MSO_SHAPE.RECTANGLE, c_left, Inches(2.1), w11, Inches(0.06))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = t_col
        top_bar.line.fill.background()

        tb = slide11.shapes.add_textbox(c_left + Inches(0.2), Inches(2.3), w11 - Inches(0.4), Inches(4.3))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = t_title
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = t_col

        p2 = tf.add_paragraph()
        p2.text = t_desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 12: Technology & Architecture
    # =========================================================================
    slide12 = add_base_slide(
        "SYSTEM ARCHITECTURE",
        "Technology Stack & Implementation Architecture",
        "Modern full-stack architecture built with Next.js 16, TypeScript, and local-first browser storage"
    )

    stack_cards = [
        (
            "Frontend & Core Framework",
            "• Next.js 16.4 (App Router & Turbopack)\n• React 19 (Server & Client Components)\n• TypeScript (Strict type safety across data schemas)\n• Partial Prefetching & Fast Static Page Generation",
            BRIGHT_CYAN
        ),
        (
            "Styling & Animation",
            "• Tailwind CSS 4 (Utility-first scoped theming)\n• Framer Motion (Orchestrated entrance & exit choreography)\n• Lucide Icons (Streamlined iconography)\n• Responsive CSS Grid & Flexbox layouts",
            BRIGHT_PURPLE
        ),
        (
            "Parsing & AI Technologies",
            "• PDFParse (Native PDF binary parsing)\n• Mammoth (DOCX XML extraction)\n• Tesseract.js (Client/server optical character recognition)\n• Google GenAI SDK (Gemini 2.0 Flash multimodal vision)",
            ACCENT_GREEN
        ),
        (
            "Storage, Packaging & UX Evaluation",
            "• LocalStorage & SessionStorage (Local-first architecture)\n• JSZip & FileSaver (Browser-side static site bundling)\n• Nielsen 10 Heuristics Usability Evaluator\n• Two-Proportion Z-Test A/B Testing Engine",
            ACCENT_AMBER
        )
    ]
    w12 = Inches(5.76)
    h12 = Inches(2.25)
    for idx, (s_title, s_desc, s_color) in enumerate(stack_cards):
        col = idx % 2
        row = idx // 2
        c_left = Inches(0.8) + col * (w12 + Inches(0.2))
        c_top = Inches(2.1) + row * (h12 + Inches(0.25))

        add_card(slide12, c_left, c_top, w12, h12)

        top_bar = slide12.shapes.add_shape(MSO_SHAPE.RECTANGLE, c_left, c_top, w12, Inches(0.05))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = s_color
        top_bar.line.fill.background()

        tb = slide12.shapes.add_textbox(c_left + Inches(0.2), c_top + Inches(0.12), w12 - Inches(0.4), h12 - Inches(0.25))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = s_title
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = s_color

        p2 = tf.add_paragraph()
        p2.text = s_desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 13: Benefits & Future Improvements
    # =========================================================================
    slide13 = add_base_slide(
        "IMPACT & ROADMAP",
        "Project Benefits, Usability Validation & Future Roadmap",
        "Empirically validated student outcomes alongside key engineering milestones for future development"
    )

    # Top: 3 Metric Badges
    stat_metrics = [
        ("96.0%", "Task Completion Rate", "24 / 25 tasks completed across 5 student test participants", BRIGHT_CYAN),
        ("4.8 / 5.0", "User Satisfaction Score", "Empirically validated high user satisfaction across core flows", BRIGHT_PURPLE),
        ("1.6 / 5.0", "Cognitive Effort Rating", "Low friction score (1 = Very Easy, 5 = Very Difficult)", ACCENT_GREEN),
    ]
    stat_w = Inches(3.77)
    for idx, (val, label, sublabel, col) in enumerate(stat_metrics):
        s_left = Inches(0.8) + idx * (stat_w + Inches(0.2))
        add_card(slide13, s_left, Inches(2.05), stat_w, Inches(1.6))
        
        tb = slide13.shapes.add_textbox(s_left + Inches(0.15), Inches(2.15), stat_w - Inches(0.3), Inches(1.4))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p1 = tf.paragraphs[0]
        p1.text = val
        p1.font.size = Pt(28)
        p1.font.bold = True
        p1.font.color.rgb = col
        p1.font.name = 'Consolas'

        p2 = tf.add_paragraph()
        p2.text = label
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE

        p3 = tf.add_paragraph()
        p3.text = sublabel
        p3.font.size = Pt(9)
        p3.font.color.rgb = TEXT_MUTED

    # Bottom: Future Improvements Roadmap Cards (4 items)
    roadmap_items = [
        ("Custom Domain Publishing", "One-click deployment to custom student domains using Vercel & GitHub Pages APIs.", BRIGHT_CYAN),
        ("Automated Platform Webhooks", "Background sync webhooks for real-time updates when new LeetCode problems or commits occur.", BRIGHT_PURPLE),
        ("ATS Resume PDF Exporter", "Generate traditional ATS-compliant PDF resumes directly from the synchronized portfolio data.", ACCENT_AMBER),
        ("Community Theme Marketplace", "Open creator marketplace allowing students to design, share, and fork custom fictional multiverse themes.", ACCENT_GREEN),
    ]
    rm_w = Inches(2.78)
    rm_gap = Inches(0.2)
    for idx, (rm_title, rm_desc, rm_col) in enumerate(roadmap_items):
        r_left = Inches(0.8) + idx * (rm_w + rm_gap)
        add_card(slide13, r_left, Inches(3.9), rm_w, Inches(2.8))

        top_bar = slide13.shapes.add_shape(MSO_SHAPE.RECTANGLE, r_left, Inches(3.9), rm_w, Inches(0.05))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = rm_col
        top_bar.line.fill.background()

        tb = slide13.shapes.add_textbox(r_left + Inches(0.15), Inches(4.05), rm_w - Inches(0.3), Inches(2.5))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p1 = tf.paragraphs[0]
        p1.text = f"Roadmap 0{idx+1}"
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = rm_col
        p1.font.name = 'Consolas'

        p2 = tf.add_paragraph()
        p2.text = rm_title
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE

        p3 = tf.add_paragraph()
        p3.text = rm_desc
        p3.font.size = Pt(10)
        p3.font.color.rgb = TEXT_MUTED

    # Save Presentation
    output_path = 'PortCraft_Project_Presentation.pptx'
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == '__main__':
    create_presentation()
