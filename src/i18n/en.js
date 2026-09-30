/**
 * English copy.
 *
 * Paragraph strings may contain inline links written as [label](url) —
 * see components/RichText.jsx for the (very small) renderer.
 */
export default {
  code: 'en',
  htmlLang: 'en',
  label: 'English',
  switchTo: 'Ganti ke Bahasa Indonesia',

  nav: {
    home: 'Home',
    about: 'About Me',
    projects: 'Projects',
    contact: 'Contact',
    menu: 'Menu',
    close: 'Close menu',
  },

  hero: {
    role: 'AI Engineer',
    name: 'Affan Ardana',
    description:
      'I am an AI Engineer with a deep understanding of AI, Machine Learning, and Deep Learning. I have experience researching and developing AI solutions for various applications.',
    focus: ['Computer Vision', 'Model Compression', 'Edge Deployment'],
    photoAlt: 'Portrait of Affan Ardana',
    scrollHint: 'Scroll to explore',
    ctaProjects: 'View projects',
    ctaContact: 'Get in touch',
  },

  about: {
    eyebrow: 'About Me',
    body: [
      'A Computer Science graduate with a focus on AI and Deep Learning. Experienced in developing BERT models for Indonesian text classification and contributing to scientific publications related to Computer Vision, model compression, and edge deployment. I have a strong interest in implementing efficient, ready-to-use models in real-world environments.',
    ],
    skillsEyebrow: 'More about me',
    skillsTitle: 'Technical Skills',
    skillsSubtitle: 'The tools and practices',
    skills: [
      { id: 'python', name: 'Python', kind: 'Language' },
      { id: 'pytorch', name: 'PyTorch', kind: 'Framework' },
      { id: 'scikitlearn', name: 'scikit-learn', kind: 'Library' },
      { id: 'onnx', name: 'ONNX Runtime', kind: 'Runtime' },
      { id: 'tensorrt', name: 'TensorRT', kind: 'Runtime' },
      { id: 'postgresql', name: 'PostgreSQL', kind: 'Database' },
      { id: 'quantization', name: 'Quantization', kind: 'INT8 · PTQ · QAT' },
      { id: 'data', name: 'Data Analysis and Processing', kind: 'Skill' },
      { id: 'model', name: 'Deep Learning Model Modification', kind: 'Skill' },
    ],
  },

  projects: {
    eyebrow: 'Projects',
    subtitle: 'Click for the full story.',
    openLabel: 'Open details',
    closeLabel: 'Close',
    visitLabel: 'Visit project',
    readLabel: 'Read the paper',
    detailLabel: 'Project detail',
    escHint: 'Press Esc to close',
    prev: 'Previous project',
    next: 'Next project',
    items: [
      {
        id: 'a',
        number: '01',
        title:
          'Introducing M-YOLO-CRD: A Lightweight YOLOv4 with Contrastive Representation Distillation for Edge Devices',
        subtitle:
          'A research project focused on developing a new YOLOv4-based model, utilizing distillation to make the model efficient on edge devices.',
        tags: ['Research Paper', 'New Model', 'Object Detection', 'PyTorch', 'YOLOv4'],
        link: 'https://ieeexplore.ieee.org/document/10852314/',
        hover: '/img/project-a-hover.png',
        detail: '/img/project-a-detail.png',
        detailAlt: 'M-YOLO-CRD teacher–student architecture diagram',
        previewCaption: 'M-YOLO-CRD architecture',
        stats: [
          { value: '6×', label: 'smaller model' },
          { value: '245.5 → 35.76 MB', label: 'model size' },
          { value: '< 4%', label: 'mAP loss' },
        ],
        body: [
          'In this project, we address the challenge of deploying object detection models (such as YOLOv4) on resource-constrained edge devices, which was previously hindered by heavy computational load and large model size. To solve this problem, we propose a modification that replaces YOLOv4’s default CSPDarknet53 backbone with a significantly lighter model, namely MobileNetV2 or RepViT.',
          'To minimize accuracy loss resulting from this architectural simplification, we applied Knowledge Distillation (KD), specifically through the Contrastive Representation Distillation (CRD) method, to transfer knowledge from a large model (teacher model) to a smaller model (student model).',
          'Through our experiments, our modified model, M-YOLO-CRD, was shown to successfully reduce the model size by a factor of six, from 245.5 MB to just 35.76 MB. This optimization significantly speeds up inference time on hardware such as the Jetson Nano, Orin Nano, and Raspberry Pi 4B, with a very minimal loss in precision (mAP) — less than 4% — while remaining reliable for use.',
        ],
      },
      {
        id: 'b',
        number: '02',
        title: 'Image-Based Food Nutritional Estimation',
        subtitle:
          'My first personal project implementing an AI model. It calculates the nutritional content of food based on images.',
        tags: ['Personal Project', 'Segmentation', 'PyTorch', 'SAM3', 'PostgreSQL'],
        link: 'https://ifne.vercel.app/',
        hover: '/img/project-b-hover.png',
        detail: '/img/project-b-detail.png',
        detailAlt: 'Food nutrition estimation app screenshot',
        note: {
          tone: 'warning',
          label: 'Warning',
          text: 'This project was built using vibe coding via Specification-Driven Development (SDD), but only for the web application. The AI and modelling work — training, evaluation, and data processing — was written directly, without it.',
        },
        stats: [
          { value: '1,358', label: 'food items in catalogue' },
          { value: 'human-in-the-loop', label: 'labelling workflow' },
        ],
        body: [
          'This project focuses on estimating the nutritional value of food based on a single photo — a task that typically requires manually searching for each ingredient, calculating portions, and summing up macronutrients. Instead of using AI as a fully autonomous system, this system is built as a “human-in-the-loop” workflow where the model makes suggestions and the user makes the final decision.',
          'The model used is SAM3, which is fed the names of 1,358 food items from a catalog. It then segments the plate into separate food items, and a YOLO-depth model is used to extract relative depth information that cannot be obtained from a flat image. Portion sizes are calculated using a formula obtained from [this paper](https://ieeexplore.ieee.org/document/11469902).',
          'This application was built with React 19, Vite, and Tailwind CSS on the front end, and Python 3.12, FastAPI, Pydantic, and SQLAlchemy on the back end, using PostgreSQL and object storage on Supabase, while the inference process utilizes Ultralytics SAM3, the YOLO depth model, PyTorch, OpenCV, and NumPy.',
          'Modeling — which includes model selection, segmentation workflows, and portion formulas — is performed directly in Google Colab, while the web application was built with AI assistance using Spec-Driven Development (SDD). The application segments food photos into multiple parts using a segmentation model. Additionally, the model provides label recommendations for each food item, though the final labeling decision rests with the user. Food data is also saved so it can be viewed and edited later.',
        ],
      },
      {
        id: 'c',
        number: '03',
        title: 'Predictive and Maintenance Dashboard',
        subtitle:
          'My second personal project. This project combines monitoring, prediction, RAG, and n8n.',
        tags: [
          'Personal Project',
          'Monitoring',
          'Prediction',
          'RAG',
          'n8n',
          'LSTM',
          'all-MiniLM-L6-v2',
          'Qwen2.5',
        ],
        link: 'https://pdm-sim.vercel.app/',
        hover: '/img/project-c-hover.png',
        detail: '/img/project-c-detail.png',
        detailAlt: 'Predictive maintenance dashboard telemetry view',
        note: {
          tone: 'warning',
          label: 'Warning',
          text: 'This project was built using vibe coding via Specification-Driven Development (SDD), but only for the web application. The AI and modelling work — training, evaluation, and data processing — was written directly, without it.',
        },
        stats: [
          { value: '60 min', label: 'failure horizon' },
          { value: '6', label: 'monitored signals' },
        ],
        body: [
          'This project combines a predictive monitoring system capable of detecting failure risks with a copilot system designed to identify failed components and the procedures that must be implemented.',
          'The platform is built using FastAPI, React, PostgreSQL (Supabase) with pgvector, PyTorch, sentence-transformers, llama.cpp, MQTT, n8n, and Docker.',
          'Data modeling and processing — training an LSTM to predict the probability of failure within the next 60 minutes, building an n8n workflow to transport MQTT data to the database, and vectorizing documents using all-MiniLM-L6-v2 into pgvector — were performed directly in Google Colab.',
          'The web application — comprising an API, domain rules, a dashboard, a test suite, and configurations — was written by an AI coding agent via Spec-Driven Development (SDD). Instead of directly prompting the coding agent, several specification documents were first drafted: a PRD, a Master Plan, programming standards, and an agent guide outlining the agent’s workflow. Then, each phase was planned based on these documents, and the results were reviewed before moving on to the next phase; each phase was required to conclude with proper formatting and comprehensive testing. Change logs were recorded in a changelog.',
        ],
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Get in Touch',
    emailLabel: 'Email',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Press Ctrl+C',
    socialsLabel: 'Find me elsewhere',
    emailSubject: 'Hello Affan',
  },

  footer: {
    builtWith: 'Built with React, Vite and Tailwind CSS',
    rights: 'Affan Ardana',
  },
};
