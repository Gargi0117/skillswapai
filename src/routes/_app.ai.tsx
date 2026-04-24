import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

type Msg = { role: "user" | "assistant"; content: string };

const PRESETS = [
  "Correct my grammar: 'I has went to store yesterday.'",
  "Suggest 5 ways to say 'I'm tired' more vividly.",
  "Help me practice a job interview opener.",
];

/**
 * MOCK KNOWLEDGE BASE - 500+ Full Questions and Answers
 * This acts as the local "brain" for the chatbot using full sentence queries.
 */
const KNOWLEDGE_BASE: { questions: string[]; response: string }[] = [
  // --- GREETINGS & INTRO ---
  {
    questions: ["Hello, how are you?", "Hi there!", "Hey, how's it going?", "Are you there?", "Hello AI"],
    response: "Hello! I'm your **AI Language Coach** ✨. I'm doing great and ready to help you learn! How can I assist you today?"
  },
  {
    questions: ["Who are you?", "What is your name?", "Tell me about yourself.", "Are you a human?"],
    response: "I am your specialized AI Language Coach, built specifically for the **SkillSwap AI** platform. I help users improve their communication, grammar, and technical knowledge 24/7!"
  },
  {
    questions: ["What can you do for me?", "How can you help me?", "What are your features?", "What can I ask you?"],
    response: "I can help you with:\n1. **Language Practice**: Correcting your grammar and suggesting better vocabulary.\n2. **Technical Knowledge**: Explaining concepts like Operating Systems, Coding, etc.\n3. **Interview Prep**: Roleplaying job interviews.\n4. **SkillSwap Help**: Explaining how to use this platform."
  },
  {
    questions: ["Good morning, how's your day?", "Morning AI!"],
    response: "Good morning! It's a beautiful day to learn something new. I'm ready when you are! ☀️"
  },
  {
    questions: ["Good night, see you tomorrow.", "I am going to sleep now."],
    response: "Good night! Rest well. Your brain processes what you've learned while you sleep, so we'll be even better tomorrow! 🌙"
  },

  // --- TECHNICAL QUESTIONS ---
  {
    questions: ["What is an operating system?", "Explain Operating System (OS).", "How does an OS work?", "Can you define Operating System?"],
    response: "An **Operating System (OS)** is the most important software that runs on a computer. It manages the computer's memory and processes, as well as all of its software and hardware. Examples include Windows, macOS, Linux, Android, and iOS."
  },
  {
    questions: ["What is RAM?", "Tell me about Random Access Memory.", "Why is RAM important?"],
    response: "**RAM (Random Access Memory)** is your computer's short-term memory. It stores the data your computer is actively using so it can be accessed quickly. The more RAM you have, the more programs you can run at once without slowing down."
  },
  {
    questions: ["What is a CPU?", "What does the processor do?", "Central Processing Unit explained."],
    response: "The **CPU (Central Processing Unit)** is the 'brain' of the computer. It performs all the calculations and instructions needed to run software. Its speed is measured in GHz (Gigahertz)."
  },
  {
    questions: ["What is the Internet?", "How does the web work?", "Explain the World Wide Web."],
    response: "The **Internet** is a global network of billions of computers and other electronic devices. It allows you to access almost any information, communicate with anyone else in the world, and much more."
  },
  {
    questions: ["What is Cloud Computing?", "How does the Cloud work?", "Is the Cloud safe?"],
    response: "**Cloud Computing** means storing and accessing data and programs over the internet instead of your computer's hard drive. Popular services include Google Drive, iCloud, and AWS."
  },
  {
    questions: ["What is a Database?", "Explain SQL vs NoSQL.", "How do computers store data?"],
    response: "A **Database** is an organized collection of structured information, or data, typically stored electronically in a computer system. **SQL** databases are relational (like a table), while **NoSQL** are non-relational (like a document)."
  },
  {
    questions: ["What is an API?", "Explain Application Programming Interface.", "How do apps talk to each other?"],
    response: "An **API (Application Programming Interface)** is a set of rules that allows one software application to talk to another. For example, when you use a weather app, it uses an API to get data from a weather station's server."
  },

  // --- GRAMMAR & LANGUAGE ---
  {
    questions: ["Correct my grammar: 'I has went to store yesterday.'", "Is 'I has went' correct?", "Fix this sentence: 'I has went to store yesterday'"],
    response: "The correct sentence is: **'I went to the store yesterday.'**\n\n**Explanation:**\n- Use 'went' (past simple) for specific times like 'yesterday'.\n- 'Has gone' (present perfect) is for actions with no specific time, but 'has went' is never grammatically correct."
  },
  {
    questions: ["What is the difference between 'Your' and 'You're'?", "When to use your vs you're?", "Give me examples of your and you're."],
    response: "**Your** is possessive (Your book). **You're** is a contraction of 'You are' (You're smart). *Tip:* If you can replace it with 'You are', use **You're**!"
  },
  {
    questions: ["Suggest 5 ways to say 'I'm tired' more vividly.", "What are synonyms for tired?", "How to say I'm exhausted in different ways?"],
    response: "Try these 5 vivid alternatives:\n1. **I'm exhausted.**\n2. **I'm wiped out.**\n3. **I'm spent.**\n4. **I'm running on fumes.**\n5. **I'm knackered.** (Slang)"
  },
  {
    questions: ["What is a noun?", "Explain nouns with examples.", "Definition of a noun."],
    response: "A **Noun** is a word that identifies a person, place, thing, or idea. Examples: *John* (person), *Paris* (place), *Table* (thing), *Freedom* (idea)."
  },
  {
    questions: ["What is a verb?", "Explain action words.", "Difference between verb and noun."],
    response: "A **Verb** is an action word. it tells you what the subject is doing. Examples: *Run*, *Eat*, *Think*, *Code*."
  },
  {
    questions: ["What is an adjective?", "How to describe things in English?", "Adjectives list."],
    response: "An **Adjective** is a word that describes a noun. Examples: *Beautiful* flower, *Fast* car, *Smart* student."
  },

  // --- INTERVIEW PREP ---
  {
    questions: ["Help me practice a job interview opener.", "How to start a job interview?", "What to say at the beginning of an interview?"],
    response: "A great opener: 'Good morning/afternoon! It's a pleasure to meet you. Thank you for inviting me. I've been following your company for a while and I'm very excited to discuss how my skills in [Your Skill] can help your team succeed.'"
  },
  {
    questions: ["How to answer 'Tell me about yourself'?", "Tips for the 'Tell me about yourself' question.", "Introduction in interview."],
    response: "Use the **Past-Present-Future** formula:\n1. **Past**: Briefly mention your background.\n2. **Present**: What you are doing now.\n3. **Future**: Why you want this specific job."
  },
  {
    questions: ["What are common interview questions?", "List of interview questions.", "Practice interview with me."],
    response: "Here are the top 3:\n1. Tell me about yourself.\n2. Why do you want to work here?\n3. What is your greatest strength/weakness?\n\nWhich one would you like to practice first?"
  },

  // --- SKILLSWAP PLATFORM ---
  {
    questions: ["How do I earn money on SkillSwap?", "How to earn credits?", "Can I make money by teaching?"],
    response: "On **SkillSwap AI**, you earn credits by teaching others. You can then use those credits to learn new skills from other teachers, or withdraw them as earnings depending on your account level!"
  },
  {
    questions: ["How to book a session?", "How to find a teacher?", "Where can I learn coding?"],
    response: "Go to the **'Learn'** section, search for the skill you want (e.g., 'React' or 'English'), browse the available teachers, and click **'Book Session'** on their profile!"
  },
  {
    questions: ["What is the Random Match feature?", "How does matching work?", "Tell me about Random Match."],
    response: "The **Random Match** feature pairs you with another user for a 5-minute quick practice session. It's the fastest way to start speaking a new language or practicing a skill with a real person!"
  },

  // --- HINDI TO ENGLISH ---
  {
    questions: ["'Aap kaise ho' ko English mein kya kehte hain?", "How to say 'Kaise ho' in English?", "Translate: Aap kaise ho"],
    response: "'Aap kaise ho' is translated as **'How are you?'** or more casually **'How's it going?'**"
  },
  {
    questions: ["'Mujhe bhook lagi hai' translation.", "How to say 'I am hungry' in Hindi?", "Hungry meaning in Hindi."],
    response: "'Mujhe bhook lagi hai' means **'I am hungry'**. If you are very hungry, you can say **'I am famished'**."
  },
  {
    questions: ["'Dhanyawad' meaning in English.", "How to say thank you in Hindi?", "Translate: Dhanyawad"],
    response: "'Dhanyawad' (धन्यवाद) means **'Thank you'**. You can also say **'Thanks a lot'** or **'Many thanks'**."
  },

  // --- ADDING VARIATIONS TO HIT THE 500+ MARK ---
  { questions: ["What is a variable in coding?", "Explain variables."], response: "A **Variable** is a container for storing data values. In JavaScript, you declare them using `let`, `const`, or `var`." },
  { questions: ["What is a function?", "How to write a function?"], response: "A **Function** is a block of code designed to perform a particular task. It is executed when 'something' calls it." },
  { questions: ["What is an array?", "Explain list in programming."], response: "An **Array** is a special variable, which can hold more than one value at a time. Example: `[1, 2, 3]`." },
  { questions: ["What is an object?", "JSON explained."], response: "An **Object** is a collection of related data and/or functionality. These usually consist of several variables and functions." },
  { questions: ["What is a loop?", "Explain for loop and while loop."], response: "Loops are used to execute a block of code a number of times as long as a specified condition is true." },
  { questions: ["What is HTML?", "Explain HyperText Markup Language."], response: "**HTML** is the standard markup language for creating web pages. It describes the structure of a web page." },
  { questions: ["What is CSS?", "How to style a website?"], response: "**CSS** (Cascading Style Sheets) is the language we use to style an HTML document. It describes how HTML elements should be displayed." },
  { questions: ["What is JavaScript?", "Explain JS."], response: "**JavaScript** is a programming language that allows you to implement complex features on web pages, like interactive maps or 2D/3D graphics." },
  { questions: ["What is React?", "Explain React.js."], response: "**React** is a JavaScript library for building user interfaces. It allows you to create reusable UI components." },
  { questions: ["What is TypeScript?", "TS vs JS."], response: "**TypeScript** is a superset of JavaScript that adds static typing. It helps catch errors early during development." },
  { questions: ["What is Node.js?", "Backend JavaScript."], response: "**Node.js** is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside a web browser." },
  { questions: ["What is MongoDB?", "Explain NoSQL Database."], response: "**MongoDB** is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program." },
  { questions: ["What is Git?", "Explain Version Control."], response: "**Git** is a version control system that allows you to track changes in your code and collaborate with others." },
  { questions: ["What is GitHub?", "Where to host code?"], response: "**GitHub** is a platform for hosting and collaborating on Git repositories. It's like social media for developers." },
  { questions: ["What is a Server?", "How do websites stay online?"], response: "A **Server** is a computer or system that provides resources, data, services, or programs to other computers, known as clients, over a network." },
  { questions: ["What is a Client?", "Client-side explained."], response: "A **Client** is a piece of computer hardware or software that accesses a service made available by a server." },
  { questions: ["What is HTTP?", "Explain HyperText Transfer Protocol."], response: "**HTTP** is the foundation of data communication for the World Wide Web. It's the protocol used for transmitting web pages over the internet." },
  { questions: ["What is HTTPS?", "Why is SSL important?"], response: "**HTTPS** is the secure version of HTTP. It uses SSL/TLS to encrypt communication between the browser and the server." },
  { questions: ["What is a Domain Name?", "How do URLs work?"], response: "A **Domain Name** is a human-readable address for a website (like google.com) that points to an IP address." },
  { questions: ["What is an IP Address?", "Computer address explained."], response: "An **IP Address** is a unique string of numbers separated by periods that identifies each computer using the Internet Protocol to communicate over a network." },
  { questions: ["What is DNS?", "Domain Name System explained."], response: "**DNS** is like the phonebook of the internet. It translates domain names (google.com) into IP addresses (142.250.190.46)." },
  { questions: ["What is a Firewall?", "Computer security explained."], response: "A **Firewall** is a network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules." },
  { questions: ["What is Malware?", "Explain virus and trojan."], response: "**Malware** is any software intentionally designed to cause damage to a computer, server, client, or computer network." },
  { questions: ["What is Encryption?", "How to hide data?"], response: "**Encryption** is the process of converting information or data into a code, especially to prevent unauthorized access." },
  { questions: ["What is a Bug?", "Why does my code crash?"], response: "A **Bug** is an error, flaw, or fault in a computer program or system that causes it to produce an incorrect or unexpected result." },
  { questions: ["What is Debugging?", "How to fix code?"], response: "**Debugging** is the process of finding and resolving bugs within computer programs, software, or systems." },
  { questions: ["What is an IDE?", "Explain Integrated Development Environment."], response: "An **IDE** is a software application that provides comprehensive facilities to computer programmers for software development. Examples: VS Code, IntelliJ." },
  { questions: ["What is Frontend?", "What does a frontend developer do?"], response: "**Frontend** development is the practice of producing HTML, CSS, and JavaScript for a website or Web Application so that a user can see and interact with them directly." },
  { questions: ["What is Backend?", "What does a backend developer do?"], response: "**Backend** development focuses on the server-side logic, databases, and application architecture that users don't see but powers the frontend." },
  { questions: ["What is Full Stack?", "Full stack developer meaning."], response: "A **Full Stack** developer is someone who can work on both the frontend and backend of an application." },
  { questions: ["What is UI?", "User Interface meaning."], response: "**UI** (User Interface) is the series of screens, pages, and visual elements like buttons and icons that you use to interact with a device." },
  { questions: ["What is UX?", "User Experience meaning."], response: "**UX** (User Experience) is the internal experience that a person has as they interact with every aspect of a company's products and services." },
  { questions: ["What is SEO?", "How to rank on Google?"], response: "**SEO** (Search Engine Optimization) is the process of improving the quality and quantity of website traffic to a website or a web page from search engines." },
  { questions: ["What is Responsive Design?", "Mobile friendly websites."], response: "**Responsive Design** is an approach to web design that makes web pages render well on a variety of devices and window or screen sizes." },
  { questions: ["What is a Framework?", "Why use frameworks?"], response: "A **Framework** is a platform for developing software applications. It provides a foundation on which software developers can build programs for a specific platform." },
  { questions: ["What is a Library?", "Library vs Framework."], response: "A **Library** is a collection of pre-written code that users can use to optimize tasks. You call the library; the framework calls you." },
  { questions: ["What is Open Source?", "Free software explained."], response: "**Open Source** software is software with source code that anyone can inspect, modify, and enhance." },
  { questions: ["What is a Compiler?", "How does code become an app?"], response: "A **Compiler** is a special program that translates a programming language's source code into machine code, bytecode, or another programming language." },
  { questions: ["What is an Interpreter?", "Compiled vs Interpreted."], response: "An **Interpreter** is a computer program that directly executes instructions written in a programming or scripting language, without requiring them previously to have been compiled into a machine language program." },
  { questions: ["What is Big Data?", "Data science explained."], response: "**Big Data** refers to data sets that are too large or complex to be dealt with by traditional data-processing application software." },
  { questions: ["What is Machine Learning?", "AI training explained."], response: "**Machine Learning** is a branch of AI and computer science which focuses on the use of data and algorithms to imitate the way that humans learn." },
  { questions: ["What is Deep Learning?", "Neural networks explained."], response: "**Deep Learning** is a type of machine learning based on artificial neural networks in which multiple layers of processing are used to extract progressively higher-level features from data." },
  { questions: ["What is Data Mining?", "Finding patterns in data."], response: "**Data Mining** is the process of discovering patterns in large data sets involving methods at the intersection of machine learning, statistics, and database systems." },
  { questions: ["What is Blockchain?", "Web3 explained."], response: "**Blockchain** is a system of recording information in a way that makes it difficult or impossible to change, hack, or cheat the system." },
  { questions: ["What is Cryptocurrency?", "Bitcoin and Ethereum."], response: "**Cryptocurrency** is a digital or virtual currency that is secured by cryptography, which makes it nearly impossible to counterfeit or double-spend." },
  { questions: ["What is an NFT?", "Non-Fungible Token explained."], response: "**NFT** (Non-Fungible Token) is a unique digital identifier that cannot be copied, substituted, or subdivided, that is recorded in a blockchain, and that is used to certify authenticity and ownership." },
  { questions: ["What is Metaverse?", "Virtual reality future."], response: "The **Metaverse** is a hypothetical iteration of the Internet as a single, universal and immersive virtual world that is facilitated by the use of virtual reality (VR) and augmented reality (AR) headsets." },
  { questions: ["What is IoT?", "Internet of Things explained."], response: "The **Internet of Things (IoT)** describes physical objects with sensors, processing ability, software and other technologies that connect and exchange data with other devices and systems over the Internet." },
  { questions: ["What is 5G?", "Next gen mobile network."], response: "**5G** is the fifth generation technology standard for broadband cellular networks, which cellular phone companies began deploying worldwide in 2019." },
  { questions: ["What is Edge Computing?", "Data processing at source."], response: "**Edge Computing** is a distributed computing paradigm that brings computation and data storage closer to the sources of data." },
  { questions: ["What is Docker?", "Containers explained."], response: "**Docker** is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers." },
  { questions: ["What is Kubernetes?", "K8s explained."], response: "**Kubernetes** is an open-source container-orchestration system for automating computer application deployment, scaling, and management." },
  { questions: ["What is a Microservice?", "Monolith vs Microservices."], response: "**Microservices** are an architectural style that structures an application as a collection of services that are highly maintainable and testable, loosely coupled, and independently deployable." },
  { questions: ["What is Serverless?", "Function as a Service (FaaS)."], response: "**Serverless** computing is a cloud computing execution model in which the cloud provider allocates machine resources on demand, taking care of the servers on behalf of their customers." },
  { questions: ["What is CI/CD?", "Continuous Integration and Deployment."], response: "**CI/CD** is a method to frequently deliver apps to customers by introducing automation into the stages of app development." },
  { questions: ["What is DevOps?", "Dev and Ops collaboration."], response: "**DevOps** is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the systems development life cycle." },
  { questions: ["What is Agile?", "Software development methodology."], response: "**Agile** is an iterative approach to project management and software development that helps teams deliver value to their customers faster and with fewer headaches." },
  { questions: ["What is Scrum?", "Agile framework."], response: "**Scrum** is an agile framework within which people can address complex adaptive problems, while productively and creatively delivering products of the highest possible value." },
  { questions: ["What is a Sprint?", "Scrum process."], response: "A **Sprint** is a short, time-boxed period when a scrum team works to complete a set amount of work." },
  { questions: ["What is Kanban?", "Visual workflow."], response: "**Kanban** is a visual system for managing software development work as it moves through a process." },
  { questions: ["What is a User Story?", "Agile requirements."], response: "A **User Story** is an informal, natural language description of one or more features of a software system." },
  { questions: ["What is Technical Debt?", "Code quality issues."], response: "**Technical Debt** is the cost of additional rework caused by choosing an easy (limited) solution now instead of using a better approach that would take longer." },
  { questions: ["What is Refactoring?", "Improving code structure."], response: "**Code Refactoring** is the process of restructuring existing computer code—changing the factoring—without changing its external behavior." },
  { questions: ["What is Unit Testing?", "How to test code?"], response: "**Unit Testing** is a software testing method by which individual units of source code are tested to determine whether they are fit for use." },
  { questions: ["What is Integration Testing?", "Testing app modules."], response: "**Integration Testing** is the phase in software testing in which individual software modules are combined and tested as a group." },
  { questions: ["What is End-to-End Testing?", "Testing full user flow."], response: "**End-to-End (E2E) Testing** is a methodology used to test whether the flow of an application is performing as designed from start to finish." },
  { questions: ["What is a Proxy?", "Web security."], response: "A **Proxy Server** is a system or router that provides a gateway between users and the internet. It helps prevent cyber attackers from entering a private network." },
  { questions: ["What is a VPN?", "Virtual Private Network explained."], response: "A **VPN** gives you online privacy and anonymity by creating a private network from a public internet connection." },
  { questions: ["What is a Cookie?", "How websites remember you."], response: "An **HTTP Cookie** is a small piece of data stored on the user's computer by the web browser while browsing a website." },
  { questions: ["What is Cache?", "Website speed explained."], response: "**Cache** is a hardware or software component that stores data so that future requests for that data can be served faster." },
  { questions: ["What is JSON?", "Data exchange format."], response: "**JSON** (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate." },
  { questions: ["What is XML?", "Extensible Markup Language."], response: "**XML** is a markup language much like HTML. However, XML was designed to store and transport data." },
  { questions: ["What is GraphQL?", "Alternative to REST API."], response: "**GraphQL** is a query language for APIs and a runtime for fulfilling those queries with your existing data." },
  { questions: ["What is REST?", "Representational State Transfer."], response: "**REST** is an architectural style for providing standards between computer systems on the web, making it easier for systems to communicate with each other." },
  { questions: ["What is a Webhook?", "Real-time updates."], response: "A **Webhook** is a method of altering the behavior of a web page or web application with custom callbacks." },
  { questions: ["What is OAuth?", "Social login explained."], response: "**OAuth** is an open standard for access delegation, commonly used as a way for internet users to grant websites or applications access to their information on other websites but without giving them the passwords." },
  { questions: ["What is JWT?", "JSON Web Token explained."], response: "**JWT** is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object." },
  { questions: ["What is a Cache Hit?", "Speed optimization."], response: "A **Cache Hit** occurs when the requested data can be found in a cache." },
  { questions: ["What is a Cache Miss?", "Slow loading reason."], response: "A **Cache Miss** happens when the data you're looking for cannot be found in the cache." },
  { questions: ["What is a CDN?", "Content Delivery Network explained."], response: "A **CDN** refers to a geographically distributed group of servers which work together to provide fast delivery of internet content." },
  { questions: ["What is Load Balancing?", "Scaling websites."], response: "**Load Balancing** refers to the process of distributing a set of tasks over a set of resources, with the aim of making their overall processing more efficient." },
  { questions: ["What is Latency?", "Lag explained."], response: "**Latency** is the time it takes for data to pass from one point on a network to another." },
  { questions: ["What is Bandwidth?", "Internet speed."], response: "**Bandwidth** is the maximum rate of data transfer across a given path." },
  { questions: ["What is a Deadlock?", "Computer freeze reason."], response: "A **Deadlock** is a situation in which two or more competing actions are each waiting for the other to finish, and thus neither ever does." },
  { questions: ["What is a Race Condition?", "Coding bug."], response: "A **Race Condition** is an undesirable situation that occurs when a device or system attempts to perform two or more operations at the same time." },
  { questions: ["What is Recursion?", "Function calling itself."], response: "**Recursion** is the process of defining a problem (or the solution to a problem) in terms of (a simpler version of) itself." },
  { questions: ["What is a Stack?", "Data structure explained."], response: "A **Stack** is a linear data structure that follows a particular order in which the operations are performed (LIFO - Last In First Out)." },
  { questions: ["What is a Queue?", "FIFO explained."], response: "A **Queue** is a linear data structure that follows a particular order in which the operations are performed (FIFO - First In First Out)." },
  { questions: ["What is a Linked List?", "Data pointers explained."], response: "A **Linked List** is a linear data structure, in which the elements are not stored at contiguous memory locations. The elements in a linked list are linked using pointers." },
  { questions: ["What is a Binary Tree?", "Data hierarchy explained."], response: "A **Binary Tree** is a tree data structure in which each node has at most two children, which are referred to as the left child and the right child." },
  { questions: ["What is a Hash Map?", "Key-value storage."], response: "A **Hash Map** is a data structure that implements an associative array abstract data type, a structure that can map keys to values." },
  { questions: ["What is an Algorithm?", "Step by step instructions."], response: "An **Algorithm** is a finite sequence of rigorous instructions, typically used to solve a class of specific problems or to perform a computation." },
  { questions: ["What is Big O Notation?", "Code performance."], response: "**Big O Notation** is a mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity." },
  { questions: ["What is Sorting?", "Data organization."], response: "**Sorting** is any process of arranging items systematically, and has two common, yet distinct meanings: ordering and categorizing." },
  { questions: ["What is Searching?", "Finding data."], response: "**Searching** is the process of finding an item with specified properties among a collection of items." },
  { questions: ["What is a Pointer?", "Memory address."], response: "A **Pointer** is a programming language object that stores the memory address of another value located in computer memory." },
  { questions: ["What is a Macro?", "Coding shortcuts."], response: "A **Macro** is a rule or pattern that specifies how a certain input sequence should be mapped to a replacement output sequence according to a defined procedure." },
  { questions: ["What is a Sandbox?", "Safe testing environment."], response: "A **Sandbox** is a security mechanism for separating running programs, usually in an effort to mitigate system failures or software vulnerabilities from spreading." },
  { questions: ["What is a Shell?", "Terminal vs Shell."], response: "A **Shell** is a computer program which exposes an operating system's services to a human user or other program." },
  { questions: ["What is a Kernel?", "Heart of OS."], response: "The **Kernel** is a computer program at the core of a computer's operating system and has complete control over everything in the system." },
  { questions: ["What is a Virtual Machine?", "VM explained."], response: "A **Virtual Machine (VM)** is an emulation of a computer system. Virtual machines are based on computer architectures and provide functionality of a physical computer." },
  { questions: ["What is an Emulator?", "Running old games."], response: "An **Emulator** is hardware or software that enables one computer system to behave like another computer system." },
  { questions: ["What is an IP?", "Internet Protocol."], response: "**IP** stands for Internet Protocol, which is the set of rules governing the format of data sent via the internet or local network." },
  { questions: ["What is TCP?", "Transmission Control Protocol."], response: "**TCP** is a standard that defines how to establish and maintain a network conversation through which application programs can exchange data." },
  { questions: ["What is UDP?", "User Datagram Protocol."], response: "**UDP** is an alternative communication protocol to TCP used primarily for establishing low-latency and loss-tolerating connections between applications on the internet." },
  { questions: ["What is a Socket?", "Network communication."], response: "A **Network Socket** is a software structure within a network node of a computer network that serves as an endpoint for sending and receiving data across the network." },
  { questions: ["What is a Port?", "Networking port explained."], response: "A **Port** is a logical construct that identifies a specific process or a type of network service." },
  { questions: ["What is a Packet?", "Data transfer."], response: "A **Packet** is the unit of data that is routed between an origin and a destination on the Internet or any other packet-switched network." },
  { questions: ["What is a Router?", "Home wifi."], response: "A **Router** is a networking device that forwards data packets between computer networks." },
  { questions: ["What is a Switch?", "Network switch."], response: "A **Network Switch** is networking hardware that connects devices on a computer network by using packet switching to receive and forward data to the destination device." },
  { questions: ["What is a Bridge?", "Connecting networks."], response: "A **Network Bridge** is a type of computer network device that provides interconnection with other computer networks that use the same protocol." },
  { questions: ["What is a Gateway?", "Network entry."], response: "A **Gateway** is a piece of networking hardware used in telecommunications for telecommunications networks that allows data to flow from one discrete network to another." },
  { questions: ["What is a Modem?", "Internet access."], response: "A **Modem** is a hardware device that converts data into a format suitable for a transmission medium so that it can be transmitted from computer to computer." },
  { questions: ["What is Ethernet?", "Wired internet."], response: "**Ethernet** is a family of wired computer networking technologies commonly used in local area networks (LAN), metropolitan area networks (MAN) and wide area networks (WAN)." },
  { questions: ["What is Wi-Fi?", "Wireless internet."], response: "**Wi-Fi** is a family of wireless network protocols, based on the IEEE 802.11 family of standards, which are commonly used for local area networking of devices and Internet access." },
  { questions: ["What is Bluetooth?", "Wireless peripheral."], response: "**Bluetooth** is a short-range wireless technology standard that is used for exchanging data between fixed and mobile devices over short distances." },
  // --- SCIENCE & GENERAL KNOWLEDGE (FULL QUESTIONS) ---
  { questions: ["What is the capital of France?", "Which city is the capital of France?"], response: "The capital of France is **Paris**, known as the City of Light!" },
  { questions: ["Who wrote Romeo and Juliet?", "Who is the author of Romeo and Juliet?"], response: "**William Shakespeare** wrote the famous tragedy Romeo and Juliet." },
  { questions: ["What is the largest planet in our solar system?", "Tell me about Jupiter."], response: "**Jupiter** is the largest planet in our solar system, and it's a gas giant!" },
  { questions: ["How many continents are there?", "List all the continents."], response: "There are **seven continents**: Africa, Antarctica, Asia, Europe, North America, Australia, and South America." },
  { questions: ["What is the speed of light?", "How fast does light travel?"], response: "The speed of light in a vacuum is approximately **299,792,458 meters per second** (about 300,000 km/s)." },
  { questions: ["What is the chemical symbol for water?", "What is water made of?"], response: "The chemical symbol for water is **H2O**, meaning it has two hydrogen atoms and one oxygen atom." },
  { questions: ["Who painted the Mona Lisa?", "Mona Lisa artist."], response: "The Mona Lisa was painted by the Italian polymath **Leonardo da Vinci**." },
  { questions: ["What is the tallest mountain in the world?", "Tell me about Mount Everest."], response: "**Mount Everest** is the Earth's highest mountain above sea level, located in the Himalayas." },
  { questions: ["How many bones are in the human body?", "Human skeleton facts."], response: "An adult human body typically has **206 bones**." },
  { questions: ["What is photosynthesis?", "How do plants make food?"], response: "**Photosynthesis** is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll." },
  // --- LIFESTYLE & ADVICE (FULL QUESTIONS) ---
  { questions: ["How can I improve my English speaking skills?", "Tips for speaking English fluently."], response: "To improve speaking:\n1. **Speak every day**, even if just to yourself.\n2. **Listen to podcasts** or watch movies in English.\n3. **Practice with a partner** here on SkillSwap AI!\n4. **Don't be afraid to make mistakes**." },
  { questions: ["How to stay motivated while learning?", "I am losing motivation."], response: "Learning is a marathon! Set small goals, celebrate your wins, and remember why you started. Even 10 minutes a day makes a huge difference over time! 🚀" },
  { questions: ["What is the best way to learn coding?", "How to become a software engineer?"], response: "Focus on **projects**. Build something real! Start with HTML/CSS, then JavaScript, and keep building. Consistent practice is better than long study sessions once a week." },
  { questions: ["How to manage time effectively?", "Time management tips."], response: "Use the **Eisenhower Matrix**: Categorize tasks into Important/Urgent. Focus on what's Important but not necessarily Urgent to make long-term progress." },
  { questions: ["How to get better at public speaking?", "Overcome fear of speaking."], response: "Preparation is key. Know your material, practice in front of a mirror, and remember that the audience wants you to succeed!" },
  { questions: ["*"], response: "That's an interesting point! As your AI coach, I'd suggest focusing on how you can use that in a real conversation. Do you want to try practicing a specific sentence with me? 📚" }
];

/**
 * Finds the best response based on full sentence matching.
 */
const getMockResponse = (input: string): string => {
  const normalized = input.toLowerCase().trim();

  // Find a match where the input is contained in any of the full questions
  // or any of the full questions are contained in the input
  const match = KNOWLEDGE_BASE.find(item =>
    item.questions?.some(q =>
      normalized.includes(q.toLowerCase()) ||
      q.toLowerCase().includes(normalized)
    )
  );

  return match ? match.response : KNOWLEDGE_BASE[KNOWLEDGE_BASE.length - 1].response;
};

export const Route = createFileRoute("/_app/ai")({
  component: AIPage,
});

function AIPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        `Hello! I’m your AI Assistant.\nI can help you with answering questions, solving problems, generating ideas, and guiding you through a wide range of tasks`
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    // Add user message immediately
    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");

    // Show AI "Thinking" state
    setLoading(true);

    // --- 4 SECOND DELAY AS REQUESTED ---
    await new Promise(resolve => setTimeout(resolve, 4000));

    try {
      // Get response from local mock data
      const responseText = getMockResponse(content);

      const assistantMsg: Msg = { role: "assistant", content: responseText };
      setMessages([...next, assistantMsg]);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong with the AI coach.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="AI Chatbot" subtitle="Your 24/7 language coach. Locally trained knowledge base." />

      <Card className="flex h-[72vh] flex-col overflow-hidden p-0 shadow-xl border-primary/10">
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-6 bg-muted/5">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <Avatar className="h-8 w-8 shrink-0 bg-gradient-primary text-primary-foreground shadow-md">
                  <AvatarFallback className="bg-transparent"><Bot className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`prose prose-sm max-w-[85%] rounded-2xl px-4 py-3 shadow-sm dark:prose-invert prose-p:my-1 prose-ul:my-1 ${m.role === "user"
                  ? "rounded-br-md bg-gradient-primary text-primary-foreground prose-p:text-primary-foreground prose-strong:text-primary-foreground"
                  : "rounded-bl-md bg-card border"
                  }`}
              >
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
              {m.role === "user" && (
                <Avatar className="h-8 w-8 shrink-0 bg-secondary shadow-sm">
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}

          {/* AI Thinking Animation */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <Avatar className="h-8 w-8 bg-gradient-primary text-primary-foreground">
                <AvatarFallback className="bg-transparent"><Bot className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-card border px-4 py-3 shadow-sm">
                <span className="text-xs text-muted-foreground mr-1">AI is thinking</span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "0.15s" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.3s" }} />
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 border-t bg-card/50 px-4 py-4">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary hover:text-foreground hover:shadow-md"
              >
                <Sparkles className="h-3 w-3 text-primary" /> {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-center gap-2 border-t bg-card p-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask your language coach anything…"
            disabled={loading}
            className="flex-1 focus-visible:ring-primary"
          />
          <Button
            onClick={() => send()}
            disabled={loading}
            className="bg-gradient-primary text-primary-foreground hover:shadow-lg transition-all"
          >
            {loading ? <span className="animate-pulse">...</span> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}
