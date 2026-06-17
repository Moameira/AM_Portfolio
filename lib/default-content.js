export const defaultContent = {
  profile: {
    name: "Mohamed Ameira",
    title: "CS STUDENT @ FH MÜNSTER",
    location: "Dortmund, NRW · Germany",
    origin: "Mauritanian",
    email: "imameira999@gmail.com",
    github: "https://github.com/Moameira",
    linkedin: "https://linkedin.com/in/mohamed-ameira-8122b31a7",
    phone: "+49 152 18655343",
    status: "Open to internships & projects",
    about: [
      "I'm a passionate Computer Science student at FH Münster — curious by nature, builder by instinct. I love understanding how things work at every level, from socket-level networking in C to crafting smooth React UIs.",
      "My journey started in Mauritania, took me through Germany's Studienkolleg system, and now I'm deep in my Bachelor's — building real projects that challenge me every semester.",
      "I speak four languages, write code in several more, and believe the best way to learn is to build something that scares you a little. Whether it's a Rubik's solver or a web server from raw sockets — I'm in."
    ],
    typewriter: [
      "Systems Programmer",
      "Web Developer",
      "Algorithm Enthusiast",
      "CI/CD Automator",
      "4-Language Speaker",
      "Open Source Builder",
      "Problem Solver"
    ]
  },
  skills: [
    { category: "Languages", items: ["C", "C++", "Python", "Java", "JavaScript", "HTML / CSS"] },
    { category: "Frameworks & Libraries", items: ["React", "React Native", "Expo", "Node.js"] },
    { category: "Systems & Low-Level", items: ["Socket Programming", "HTTP Protocol", "Virtual Hosting", "Memory Management", "Multithreading", "Linux"] },
    { category: "Algorithms & CS", items: ["Data Structures", "Algorithm Design", "State-Space Search", "OOP", "Database Design", "AI Basics"] },
    { category: "DevOps & Deployment", items: ["Git / GitHub", "Jenkins CI/CD", "Vercel", "Railway", "Linux CLI", "PowerShell"] },
    { category: "Dev Tools", items: ["VS Code", "Valgrind", "AddressSanitizer", "Doxygen", "Burp Suite", "Eclipse", "IntelliJ"] },
    { category: "Testing & Quality", items: ["Unit Testing", "CI Automation", "XML Report Parsing", "Debug Tooling"] }
  ],
  projects: [
    {
      title: "C-WEBSERVER.exe",
      icon: "🌐",
      date: "April 2025",
      description: "A fully custom HTTP/1.1 web server built in C from raw sockets. Supports virtual hosting, static file serving, secure path traversal prevention, and proper error pages (403/404/501). Includes Doxygen docs and memory-safe testing.",
      tech: ["C", "HTTP/1.1", "Sockets", "Valgrind", "Doxygen", "Burp Suite"],
      skillsGained: "Socket programming · Virtual hosting · HTTP internals · Memory leak detection · Security testing · API documentation",
      link: "https://github.com/Moameira"
    },
    {
      title: "RUBIKS-SOLVER.exe",
      icon: "🧩",
      date: "November 2024",
      description: "An algorithmic Rubik's Cube solver with state-space search and an optimal solving strategy. Features a visual React interface that animates the solution step by step, with the heavy computation handled in Python/C++.",
      tech: ["Python", "C++", "React", "State-Space Search"],
      skillsGained: "Algorithm design · State-space search · Python–C++ interop · React UI · Visualization logic · Complexity analysis",
      link: "https://github.com/Moameira"
    },
    {
      title: "KALENDER-APP.exe",
      icon: "📅",
      date: "January 2024",
      description: "A fully functional calendar app with event creation, recurring appointments, notifications, and a polished user interface. Developed with a strong focus on UX/UI and real-world usability patterns.",
      tech: ["C", "React", "JavaScript"],
      skillsGained: "Frontend development · State management · Date/time handling · Event-driven architecture · UX/UI design · Component design",
      link: "https://github.com/Moameira"
    }
  ],
  education: [
    {
      school: "Fachhochschule Münster",
      degree: "Bachelor of Science — Informatik",
      meta: "Oct 2023 – Present · Münster, NRW",
      status: "Active",
      courses: ["Data Structures", "Algorithms Analysis", "Webserver Dev", "Database Management", "Artificial Intelligence", "Internet Technology", "Systems Programming", "Computer Architecture"]
    },
    {
      school: "Hochschule Wismar",
      degree: "Studienkolleg — Ingenieurwissenschaften",
      meta: "Sep 2022 – Sep 2023 · Wismar, MV",
      status: "Done",
      courses: []
    },
    {
      school: "Lycée Technique de Nouakchott",
      degree: "Fachgebundene Hochschulreife — Ingenieurwissenschaften",
      meta: "Sep 2019 – Sep 2020 · Nouakchott, Mauritania",
      status: "Done",
      courses: []
    }
  ],
  experience: [
    {
      role: "Software Development Intern",
      company: "Software Development Company · Nouakchott, Mauritania",
      date: "May – Jun 2021",
      bullets: [
        "Designed and built an automated daily unit-testing service that significantly reduced time spent finding and fixing bugs during active product development.",
        "Wrote Python and PowerShell integration scripts to parse XML test reports into organized summaries and deploy the latest build to hardware — enabling fully automated daily test runs.",
        "Configured Jenkins CI/CD pipeline to orchestrate the full load-test-report cycle, running autonomously once per day without manual intervention."
      ]
    }
  ]
};
