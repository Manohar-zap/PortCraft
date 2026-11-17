import { PortfolioData, DEFAULT_THEME } from './types';
import { getTemplate } from './templates';

interface PersonaOverride {
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  projects: Array<{
    title: string;
    description: string;
    techStack: string[];
    liveUrl: string;
    githubUrl: string;
    featured?: boolean;
  }>;
  skills: Array<{ name: string; level: number; category: string }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location: string;
    description: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
    gpa?: string;
    description: string;
  }>;
  achievements: Array<{
    title: string;
    issuer: string;
    date: string;
    description: string;
    url?: string;
  }>;
}

const THEME_PERSONAS: Record<string, PersonaOverride> = {
  'spider-verse': {
    firstName: 'Miles',
    lastName: 'Morales',
    title: 'Brooklyn Web-Slinger & Creative Technologist',
    bio: 'Bitten by an experimental dimensional spider in Brooklyn. By day I craft generative interfaces and visual code; by night I leap between skyscrapers keeping the multiverse connected.',
    location: 'Brooklyn, NY',
    email: 'miles@multiverse.dev',
    website: 'https://milesmorales.art',
    github: 'https://github.com/miles-morales',
    linkedin: 'https://linkedin.com/in/milesmorales',
    projects: [
      {
        title: 'Dimensional Portal Mapper',
        description: 'Interactive WebGL spatial map visualizing parallel dimension rift anomalies across Earth-1610 and Earth-616.',
        techStack: ['Three.js', 'React', 'GLSL Shaders', 'WebSockets'],
        liveUrl: 'https://multiverse-map.example.com',
        githubUrl: 'https://github.com/miles-morales/dimension-rift',
        featured: true,
      },
      {
        title: 'Venom Blast Haptic Interface',
        description: 'Bio-electric charge detection system with micro-pulse feedback for tactile user interactions.',
        techStack: ['Web Bluetooth', 'TypeScript', 'Node.js'],
        liveUrl: 'https://venom-haptics.example.com',
        githubUrl: 'https://github.com/miles-morales/venom-charge',
        featured: false,
      },
      {
        title: 'Graffiti Spray AR Can',
        description: 'Augmented reality mobile application allowing street artists to project digital murals on urban brick walls.',
        techStack: ['WebXR', 'ARKit', 'Canvas API'],
        liveUrl: 'https://graffiti-ar.example.com',
        githubUrl: 'https://github.com/miles-morales/spray-ar',
        featured: false,
      },
    ],
    skills: [
      { name: 'Web-Swinging Physics', level: 5, category: 'Abilities' },
      { name: 'React / Next.js', level: 5, category: 'Frontend' },
      { name: 'Three.js & Canvas', level: 4, category: 'Design' },
      { name: 'Camouflage Invisibility', level: 4, category: 'Abilities' },
      { name: 'Venom Strike Protocol', level: 5, category: 'Abilities' },
    ],
    experience: [
      {
        company: 'Spider-Society Multiverse HQ',
        position: 'Junior Multiverse Ranger',
        startDate: '2023',
        endDate: 'Present',
        current: true,
        location: 'Nueva York (Earth-928)',
        description: 'Collaborating with alternate dimension operatives to stabilize dimensional canon events and debug temporal rifts.',
        highlights: ['Neutralized 14 dimensional anomalies', 'Authored the Web-Slinger tactical field guide'],
      },
    ],
    education: [
      {
        institution: 'Brooklyn Visions Academy',
        degree: 'High School Honors Diploma',
        field: 'Computer Science & Visual Arts',
        startYear: '2022',
        endYear: '2026',
        gpa: '3.92',
        description: 'Top student in physics, visual arts, and algorithmic computation.',
      },
    ],
    achievements: [
      {
        title: 'Brooklyn Hero of the Year',
        issuer: 'City of New York',
        date: 'October 2025',
        description: 'Awarded for heroic community defense during the dimensional collider collapse.',
      },
    ],
  },

  'gotham-noir': {
    firstName: 'Vincent',
    lastName: 'Cross',
    title: 'Lead Forensic Detective & Cyber Intelligence Analyst',
    bio: 'Operating in the dark corners of the city where corporate corruption meets encrypted extortion. Specialist in memory forensics, threat modeling, and intelligence dossier compilation.',
    location: 'Gotham City // Sector 4',
    email: 'v.cross@gcpd-intelligence.org',
    website: 'https://shadowdossier.org',
    github: 'https://github.com/v-cross',
    projects: [
      {
        title: 'Signal Bat-Radar Telemetry',
        description: 'Cryptographic radio frequency decoder scanning low-band emergency signals across Gotham rooftops.',
        techStack: ['Rust', 'SDR (Software Defined Radio)', 'ZeroMQ'],
        liveUrl: 'https://signal-radar.example.com',
        githubUrl: 'https://github.com/v-cross/rf-scanner',
        featured: true,
      },
      {
        title: 'Arkham Offender Risk Matrix',
        description: 'Bayesian probability graph calculating recurrence patterns for high-profile syndicate masterminds.',
        techStack: ['Python', 'NetworkX', 'SQLite', 'FastAPI'],
        liveUrl: 'https://arkham-matrix.example.com',
        githubUrl: 'https://github.com/v-cross/syndicate-graph',
        featured: false,
      },
    ],
    skills: [
      { name: 'Forensic Triage', level: 5, category: 'Intelligence' },
      { name: 'Reverse Engineering', level: 5, category: 'Cyber' },
      { name: 'Threat Actor Profiling', level: 4, category: 'Intelligence' },
      { name: 'Rust & C++', level: 4, category: 'Languages' },
    ],
    experience: [
      {
        company: 'Gotham Special Taskforce',
        position: 'Chief Cyber Investigator',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        location: 'Gotham City Hall',
        description: 'Leading forensic investigations against organized ransomware syndicates targeting municipal power grids.',
        highlights: ['Solved 38 major extortion cases', 'Built automated biometric incident registry'],
      },
    ],
    education: [
      {
        institution: 'Gotham State University',
        degree: 'Master of Science',
        field: 'Cybersecurity & Criminal Justice',
        startYear: '2016',
        endYear: '2019',
        gpa: '4.0',
        description: 'Thesis on encrypted peer-to-peer darknet extortion rings.',
      },
    ],
    achievements: [
      {
        title: 'Commissioner’s Distinguished Service Medal',
        issuer: 'Gotham Police Department',
        date: 'November 2024',
        description: 'Awarded for neutralizing the Black Mask data center breach.',
      },
    ],
  },

  'arc-reactor': {
    firstName: 'Marcus',
    lastName: 'Vance',
    title: 'Holographic Systems Architect & Robotics Engineer',
    bio: 'Designing clean high-density energy reactors and augmented holographic CAD interfaces. Passionate about automated fabrication, servo mechanics, and edge neural processors.',
    location: 'Malibu Innovation Lab, CA',
    email: 'm.vance@arc-innovations.io',
    website: 'https://marcusvance.tech',
    projects: [
      {
        title: 'Mark-X Clean Micro-Reactor',
        description: 'Compact 3.2-gigawatt palladium magnetic containment core with real-time temperature telemetry.',
        techStack: ['C++', 'Embedded RTOS', 'CAN Bus', 'OpenCL'],
        liveUrl: 'https://reactor-telemetry.example.com',
        githubUrl: 'https://github.com/mvance/arc-core',
        featured: true,
      },
      {
        title: 'JARVIS Voice Hologram HUD',
        description: 'Zero-latency spatial voice command engine displaying floating 3D wireframe schematics in augmented reality.',
        techStack: ['WebXR', 'Three.js', 'TensorFlow.js', 'Web Speech API'],
        liveUrl: 'https://hologram-hud.example.com',
        githubUrl: 'https://github.com/mvance/holographic-hud',
        featured: false,
      },
    ],
    skills: [
      { name: 'Embedded Systems', level: 5, category: 'Hardware' },
      { name: 'Holographic UI (WebXR)', level: 5, category: 'Frontend' },
      { name: 'Magnetic Plasma Physics', level: 4, category: 'Engineering' },
      { name: 'Robotics Control', level: 5, category: 'Hardware' },
    ],
    experience: [
      {
        company: 'Stark Advanced Research Lab',
        position: 'Senior Avionics Engineer',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        location: 'Malibu, CA',
        description: 'Developed flight telemetry stabilization algorithms for autonomous high-altitude aerial platforms.',
        highlights: ['Reduced thruster response latency by 65%', 'Filed 3 patents on plasma coil stabilization'],
      },
    ],
    education: [
      {
        institution: 'MIT',
        degree: 'B.S. in Electrical Engineering & Computer Science',
        field: 'Autonomous Robotics',
        startYear: '2017',
        endYear: '2021',
        description: 'Graduated Summa Cum Laude.',
      },
    ],
    achievements: [
      {
        title: 'National Defense Innovation Award',
        issuer: 'Defense Advanced Research Council',
        date: '2025',
        description: 'Recognized for breakthroughs in solid-state micro-power generators.',
      },
    ],
  },

  'brickverse': {
    firstName: 'Oliver',
    lastName: 'Stone',
    title: 'Master Brick Builder & Modular World Designer',
    bio: 'Piece by piece building scalable modular design systems. Believing that every great structure begins with a single stud and endless imagination.',
    location: 'Billund, Denmark',
    email: 'oliver@brickverse.studio',
    website: 'https://brickverse.studio',
    projects: [
      {
        title: 'Snap-Fit 3D Brick CAD',
        description: 'Interactive web-based 3D construction sandbox with dynamic collision detection, stud snapping, and parts list generation.',
        techStack: ['Three.js', 'React', 'Zustand', 'WebAssembly'],
        liveUrl: 'https://snap-cad.example.com',
        githubUrl: 'https://github.com/ostone/snap-cad',
        featured: true,
      },
      {
        title: 'Modular Castle Construction Kit',
        description: 'A 4,800-piece open-source digital building instruction set for medieval fortifications with functional drawbridges.',
        techStack: ['SVG', 'CSS 3D', 'WebGL'],
        liveUrl: 'https://brick-castle.example.com',
        githubUrl: 'https://github.com/ostone/castle-kit',
        featured: false,
      },
    ],
    skills: [
      { name: 'Modular Architecture', level: 5, category: 'Design' },
      { name: '3D Spatial Modeling', level: 5, category: 'Tools' },
      { name: 'Design Systems', level: 4, category: 'Frontend' },
      { name: 'Color Harmony', level: 5, category: 'Design' },
    ],
    experience: [
      {
        company: 'BrickForge Studios',
        position: 'Lead Master Builder',
        startDate: '2020',
        endDate: 'Present',
        current: true,
        location: 'Copenhagen, Denmark',
        description: 'Designing giant scale city dioramas and interactive building sets for worldwide exhibitions.',
        highlights: ['Built 1:50 scale historical museum diorama', 'Created digital parts taxonomy for 12,000 components'],
      },
    ],
    education: [
      {
        institution: 'Royal Danish Academy of Fine Arts',
        degree: 'Bachelor of Design',
        field: 'Industrial & Toy Architecture',
        startYear: '2016',
        endYear: '2020',
        description: 'Specialized in modular physical-digital hybrid play systems.',
      },
    ],
    achievements: [
      {
        title: 'Master Builder Golden Trophy',
        issuer: 'International Brick Creators Guild',
        date: '2024',
        description: 'Awarded first prize in modular architectural storytelling.',
      },
    ],
  },

  'code-reality': {
    firstName: 'Elliot',
    lastName: 'Ward',
    title: 'Systems Architect & Low-Level Kernel Engineer',
    bio: 'Tracing pointers through kernel space and compiling optimized distributed systems. Preferring clean monospace interfaces, raw sockets, and predictable memory allocations.',
    location: 'Zurich, Switzerland',
    email: 'elliot@kernel-space.org',
    website: 'https://elliotward.dev',
    github: 'https://github.com/elliotward',
    projects: [
      {
        title: 'Sub-Atomic Memory Allocator',
        description: 'Zero-lock cache-aligned slab memory allocator achieving 3.8x throughput improvement over standard malloc in multi-threaded workloads.',
        techStack: ['C', 'Assembly (x86_64)', 'Linux Perf', 'CMake'],
        liveUrl: 'https://allocator.example.com',
        githubUrl: 'https://github.com/elliotward/slab-alloc',
        featured: true,
      },
      {
        title: 'Fast-Packet BPF Firewall',
        description: 'Kernel eBPF filter inspecting and dropping malicious DDoS signatures at line-rate 100Gbps without context switches.',
        techStack: ['eBPF', 'Rust', 'Linux Kernel', 'BCC'],
        liveUrl: 'https://bpf-firewall.example.com',
        githubUrl: 'https://github.com/elliotward/ebpf-fw',
        featured: false,
      },
    ],
    skills: [
      { name: 'C & Systems Programming', level: 5, category: 'Languages' },
      { name: 'Linux Kernel & eBPF', level: 5, category: 'DevOps' },
      { name: 'Rust', level: 4, category: 'Languages' },
      { name: 'Network Protocols (TCP/IP)', level: 5, category: 'Backend' },
    ],
    experience: [
      {
        company: 'Alpine Systems Labs',
        position: 'Principal Kernel Engineer',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        location: 'Zurich, Switzerland',
        description: 'Architecting high-frequency telemetry pipelines and custom network protocol accelerators.',
        highlights: ['Reduced tail-latency by 42%', 'Maintained 99.999% uptime across 1,200 server nodes'],
      },
    ],
    education: [
      {
        institution: 'ETH Zurich',
        degree: 'Master of Science',
        field: 'Computer Engineering & Operating Systems',
        startYear: '2016',
        endYear: '2021',
        description: 'Focus on distributed systems and compiler optimizations.',
      },
    ],
    achievements: [
      {
        title: 'Linux Kernel Contributor Badge',
        issuer: 'Linux Foundation',
        date: '2024',
        description: 'Merged 14 patches into the networking and eBPF subsystem.',
      },
    ],
  },

  'desert-dynasty': {
    firstName: 'Paul',
    lastName: 'Atreides',
    title: 'Arrakis Cartographer & Spice Logistics Navigator',
    bio: 'Observing the winds of fate across endless dunes. Blending strategic foresight, desert survival wisdom, and long-range planetary navigation.',
    location: 'Arrakis // Sietch Tabr',
    email: 'paul@arrakis-spice.org',
    website: 'https://sandwalker.org',
    projects: [
      {
        title: 'Coriolis Storm Predictive Radar',
        description: 'Long-range thermodynamic radar detecting 800km/h Coriolis sandstorms up to six solar cycles in advance.',
        techStack: ['Python', 'Carto', 'Meteorology Telemetry', 'NumPy'],
        liveUrl: 'https://coriolis-radar.example.com',
        githubUrl: 'https://github.com/atreides/coriolis-radar',
        featured: true,
      },
      {
        title: 'Stillsuit Filtration Telemetry',
        description: 'Bio-metabolic water reclamation sensor conserving 98.4% of precious bodily moisture in deep desert conditions.',
        techStack: ['Embedded C', 'Micro-Sensors', 'Telemetry'],
        liveUrl: 'https://stillsuit-metrics.example.com',
        githubUrl: 'https://github.com/atreides/stillsuit-core',
        featured: false,
      },
    ],
    skills: [
      { name: 'Desert Navigation', level: 5, category: 'Specialties' },
      { name: 'Strategic Foresight', level: 5, category: 'Specialties' },
      { name: 'Cartography & GIS', level: 4, category: 'Tools' },
      { name: 'Ornithopter Piloting', level: 5, category: 'Skills' },
    ],
    experience: [
      {
        company: 'House Atreides Expedition Guild',
        position: 'Supreme Expedition Commander',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        location: 'Arrakeen City',
        description: 'Overseeing desert exploration convoys and negotiating alliances with Fremen tribal elders.',
        highlights: ['Mapped 120,000 sq km of uncharted Great Flat', 'Zero casualties over 24 dune treks'],
      },
    ],
    education: [
      {
        institution: 'Mentat Academy of Caladan',
        degree: 'High Mentat Discipline Order',
        field: 'Human Computation & Strategy',
        startYear: '2015',
        endYear: '2020',
        description: 'Trained in pure cognitive memory analysis and geopolitical strategy.',
      },
    ],
    achievements: [
      {
        title: 'Ruler of the Golden Sand Trophy',
        issuer: 'Guild of Navigators',
        date: '2025',
        description: 'Awarded for supreme desert mastery and planetary peace.',
      },
    ],
  },

  'vice-city': {
    firstName: 'Leo',
    lastName: 'Vance',
    title: '80s Synthwave Producer & Retro Arcade Engineer',
    bio: 'Cruising down Ocean Drive at 128 BPM. Crafting nostalgic vaporwave shaders, 8-bit sound synthesis engines, and palm-tree illuminated night skies.',
    location: 'Vice City, FL',
    email: 'leo@vice-arcade.fm',
    website: 'https://vice-arcade.fm',
    projects: [
      {
        title: 'Outrun 1986 Turbo Simulator',
        description: 'Pseudo-3D raster road engine recreating the feeling of blazing through coastal neon sunsets in a testarossa.',
        techStack: ['HTML5 Canvas', 'Web Audio API', 'JavaScript', 'GLSL'],
        liveUrl: 'https://outrun1986.example.com',
        githubUrl: 'https://github.com/lvance/outrun-engine',
        featured: true,
      },
      {
        title: 'FM Synth Cassette Deck',
        description: 'Virtual Yamaha DX7 frequency modulation synthesizer with tape hiss and magnetic flutter simulation.',
        techStack: ['Web Audio', 'Wasm (Rust)', 'Svelte'],
        liveUrl: 'https://cassette-synth.example.com',
        githubUrl: 'https://github.com/lvance/fm-synth',
        featured: false,
      },
    ],
    skills: [
      { name: 'Audio Synthesis (FM/AM)', level: 5, category: 'Audio' },
      { name: 'GLSL Pixel Shaders', level: 5, category: 'Graphics' },
      { name: 'Arcade Physics', level: 4, category: 'Gaming' },
      { name: '80s Aesthetic Mastery', level: 5, category: 'Design' },
    ],
    experience: [
      {
        company: 'Ocean View Sounds',
        position: 'Lead Game Audio Director',
        startDate: '2019',
        endDate: 'Present',
        current: true,
        location: 'Miami Beach, FL',
        description: 'Composing original synthwave sound tracks and designing sound stages for indie racing games.',
        highlights: ['Nominated for Best Retro Game Soundtrack 2024', '1.2M streams across synthwave radio'],
      },
    ],
    education: [
      {
        institution: 'South Beach Academy of Modern Music',
        degree: 'Bachelor of Sound Engineering',
        field: 'Electronic Music Production',
        startYear: '2015',
        endYear: '2019',
        description: 'Specialized in analog synthesizers and tape loop recording.',
      },
    ],
    achievements: [
      {
        title: 'Arcade Hall of Fame Grandmaster',
        issuer: 'Twin Galaxies Arcade Registry',
        date: '1986 / 2024',
        description: 'Highest documented score in coastal drift racing simulator.',
      },
    ],
  },

  'quantum-lab': {
    firstName: 'Dr. Elena',
    lastName: 'Rostova',
    title: 'Principal Quantum Physicist & Algorithmic Lead',
    bio: 'Investigating quantum coherence in superconducting transmon qubits. Building quantum error-correction algorithms and scalable quantum circuit simulators for next-generation computing.',
    location: 'Geneva, Switzerland',
    email: 'e.rostova@quantum-cern.ch',
    website: 'https://elenarostova.science',
    projects: [
      {
        title: 'Q-State 64-Qubit Simulator',
        description: 'GPU-accelerated state-vector quantum circuit simulator executing Shor and Grover algorithms in browser memory.',
        techStack: ['WebGPU', 'Rust', 'Wasm', 'TypeScript'],
        liveUrl: 'https://qstate.example.com',
        githubUrl: 'https://github.com/erostova/qstate-sim',
        featured: true,
      },
      {
        title: 'Cryo-Controller Qubit Interface',
        description: 'Low-noise microwave pulse generator interface operating at 15 millikelvin in helium dilution refrigerators.',
        techStack: ['Python', 'Qiskit', 'FPGA Verilog'],
        liveUrl: 'https://cryo-pulse.example.com',
        githubUrl: 'https://github.com/erostova/cryo-controller',
        featured: false,
      },
    ],
    skills: [
      { name: 'Quantum Circuit Design', level: 5, category: 'Physics' },
      { name: 'WebGPU & High Perf Computing', level: 5, category: 'Computing' },
      { name: 'Python & Qiskit', level: 5, category: 'Software' },
      { name: 'Cryogenic Engineering', level: 4, category: 'Hardware' },
    ],
    experience: [
      {
        company: 'European Quantum Research Consortium',
        position: 'Senior Research Scientist',
        startDate: '2020',
        endDate: 'Present',
        current: true,
        location: 'Geneva, Switzerland',
        description: 'Directing a team of 12 quantum software engineers developing topological error mitigation frameworks.',
        highlights: ['Published 8 papers in Nature Physics & Physical Review Letters', 'Achieved 99.8% two-qubit gate fidelity'],
      },
    ],
    education: [
      {
        institution: 'University of Cambridge',
        degree: 'Ph.D. in Theoretical Quantum Physics',
        field: 'Superconducting Quantum Devices',
        startYear: '2015',
        endYear: '2019',
        description: 'Doctoral dissertation on decoherence suppression in transmon lattices.',
      },
    ],
    achievements: [
      {
        title: 'Dirac Medal in Computational Physics',
        issuer: 'International Physics Association',
        date: '2025',
        description: 'Recognized for pioneering WebGPU-driven quantum simulation algorithms.',
      },
    ],
  },
};

/**
 * Returns a complete, populated PortfolioData instance with realistic data
 * customized specifically for the provided template ID.
 */
export function getSamplePortfolio(templateId: string): PortfolioData {
  const tpl = getTemplate(templateId);
  const persona = THEME_PERSONAS[tpl.id] || THEME_PERSONAS['spider-verse'];

  // Base fallback persona if theme doesn't have an exact persona
  const pName = persona.firstName ? persona : {
    firstName: tpl.family === 'inspired' ? 'Avery' : 'Kaelen',
    lastName: tpl.family === 'inspired' ? 'Vance' : 'Sterling',
    title: `${tpl.name.split('/')[0].trim()} Specialist`,
    bio: `Passionate creator exploring the universe of ${tpl.name}. Developing high-performance systems and bespoke interactive digital worlds.`,
    location: 'Metropolis Research Hub',
    email: 'contact@portcraft-demo.io',
    website: 'https://portcraft.dev',
    projects: [
      {
        title: `${tpl.name.split('/')[0].trim()} Initiative`,
        description: `Flagship project demonstrating the aesthetic and technical capabilities of the ${tpl.name} theme design.`,
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
        liveUrl: 'https://demo.portcraft.dev',
        githubUrl: 'https://github.com/portcraft',
        featured: true,
      },
      {
        title: `Core Protocol v2`,
        description: 'High-throughput architecture designed for modular deployment across multiple cloud infrastructures.',
        techStack: ['Node.js', 'PostgreSQL', 'Docker'],
        liveUrl: 'https://protocol.portcraft.dev',
        githubUrl: 'https://github.com/portcraft',
        featured: false,
      },
    ],
    skills: [
      { name: 'System Architecture', level: 5, category: 'Technical' },
      { name: 'UI & Spatial Design', level: 4, category: 'Design' },
      { name: 'Algorithmic Efficiency', level: 5, category: 'Core' },
      { name: 'Multiverse Deployment', level: 4, category: 'DevOps' },
    ],
    experience: [
      {
        company: `${tpl.name.split('/')[0].trim()} Studios`,
        position: 'Principal Lead Architect',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        location: 'Global Hub',
        description: 'Directing cross-disciplinary digital initiatives and architectural design.',
        highlights: ['Delivered 12 global productions', 'Engineered zero-latency real-time telemetry'],
      },
    ],
    education: [
      {
        institution: 'Institute of Advanced Digital Arts',
        degree: 'Master of Science',
        field: 'Software Engineering & Interactive Media',
        startYear: '2017',
        endYear: '2021',
        description: 'Graduated with highest departmental honors.',
      },
    ],
    achievements: [
      {
        title: 'Excellence in Digital Innovation',
        issuer: 'Global Design Association',
        date: '2025',
        description: `Recognized for excellence in interactive ${tpl.name} architecture.`,
      },
    ],
  };

  return {
    personal: {
      firstName: pName.firstName,
      lastName: pName.lastName,
      title: pName.title,
      email: pName.email,
      phone: pName.phone || '+1 (555) 321-7890',
      location: pName.location,
      website: pName.website || 'https://portcraft.dev',
      linkedin: pName.linkedin || 'https://linkedin.com',
      github: pName.github || 'https://github.com',
      twitter: 'https://x.com',
      bio: pName.bio,
      avatar: '',
    },
    education: pName.education.map((edu, idx) => ({
      id: `edu-${idx}`,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startYear: edu.startYear,
      endYear: edu.endYear,
      gpa: edu.gpa || '',
      description: edu.description,
    })),
    experience: pName.experience.map((exp, idx) => ({
      id: `exp-${idx}`,
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      location: exp.location,
      description: exp.description,
      highlights: exp.highlights,
    })),
    skills: pName.skills.map((s, idx) => ({
      id: `sk-${idx}`,
      name: s.name,
      level: s.level,
      category: s.category,
    })),
    projects: pName.projects.map((p, idx) => ({
      id: `proj-${idx}`,
      title: p.title,
      description: p.description,
      techStack: p.techStack,
      liveUrl: p.liveUrl,
      githubUrl: p.githubUrl,
      imageUrl: '',
      featured: !!p.featured,
    })),
    achievements: pName.achievements.map((a, idx) => ({
      id: `ach-${idx}`,
      title: a.title,
      issuer: a.issuer,
      date: a.date,
      description: a.description,
      url: a.url || '',
    })),
    templateId: tpl.id,
    theme: {
      ...DEFAULT_THEME,
      ...tpl.defaultTheme,
    },
    lastUpdated: '2026-11-17T18:00:00.000Z',
  };
}
