const SkillAssessment = require("../models/SkillAssessment");



const makeQuestion = (question, options, correctAnswer, explanation) => ({
  question,
  options,
  correctAnswer,
  explanation,
});

const generalQuestions = [
  makeQuestion("What does OOP stand for?", ["Object-Oriented Programming", "Open Operating Process", "Object Order Protocol", "Online Object Processing"], "Object-Oriented Programming", "OOP organizes software around objects and classes."),
  makeQuestion("Which data structure follows FIFO?", ["Stack", "Queue", "Tree", "Graph"], "Queue", "FIFO means First In, First Out."),
  makeQuestion("Which protocol is commonly used for secure web communication?", ["HTTP", "FTP", "HTTPS", "SMTP"], "HTTPS", "HTTPS protects HTTP traffic using TLS."),
  makeQuestion("What does an SQL JOIN do?", ["Deletes a table", "Combines related rows", "Creates a user", "Encrypts a database"], "Combines related rows", "JOIN combines rows using related columns."),
  makeQuestion("What is Git primarily used for?", ["Version control", "Image editing", "Database hosting", "Operating systems"], "Version control", "Git tracks changes to source code."),
  makeQuestion("Which status code usually means unauthorized?", ["200", "301", "401", "500"], "401", "HTTP 401 indicates missing or invalid authentication credentials."),
  makeQuestion("What is an API?", ["A communication interface between software", "A programming language", "A database table", "A hardware cable"], "A communication interface between software", "APIs define how software components communicate."),
  makeQuestion("Which structure follows LIFO?", ["Queue", "Stack", "Linked queue", "Graph"], "Stack", "LIFO means Last In, First Out."),
  makeQuestion("Why is input validation important?", ["It improves data quality and security", "It replaces backups", "It removes all bugs", "It eliminates authentication"], "It improves data quality and security", "Validation rejects malformed or unexpected input."),
  makeQuestion("What is the purpose of testing software?", ["To identify defects and verify behavior", "To increase file size", "To remove documentation", "To avoid requirements"], "To identify defects and verify behavior", "Testing checks whether software behaves as expected."),
];

const specialtyQuestions = {
  "Frontend Developer": [
    makeQuestion("Which HTML element creates a hyperlink?", ["<link>", "<a>", "<href>", "<url>"], "<a>", "The anchor element creates hyperlinks."),
    makeQuestion("Which React hook manages component state?", ["useEffect", "useState", "useMemo", "useRoute"], "useState", "useState manages local component state."),
    makeQuestion("Which CSS layout is designed primarily for one-dimensional layouts?", ["Flexbox", "SQL", "Mongoose", "Express"], "Flexbox", "Flexbox arranges items along a row or column."),
    makeQuestion("Which method transforms each item into a new array?", ["map()", "find()", "push()", "pop()"], "map()", "map() returns a new array of transformed items."),
    makeQuestion("What does responsive design achieve?", ["Adapts layouts to different screens", "Runs only on desktops", "Replaces JavaScript", "Creates databases"], "Adapts layouts to different screens", "Responsive interfaces adapt to screen sizes."),
    makeQuestion("Which React prop helps identify list items?", ["key", "class", "style", "route"], "key", "React uses keys to identify list elements."),
    makeQuestion("What does JSON.parse() do?", ["Converts JSON text into a value", "Converts an object to JSON text", "Sends an HTTP request", "Creates a component"], "Converts JSON text into a value", "JSON.parse parses JSON-formatted text."),
    makeQuestion("Which CSS property changes text size?", ["font-size", "font-style", "text-align", "text-decoration"], "font-size", "font-size sets the text size."),
    makeQuestion("What is the virtual DOM used for in React?", ["Efficiently determining UI updates", "Storing passwords", "Managing SQL tables", "Routing network packets"], "Efficiently determining UI updates", "React compares UI representations to determine changes."),
    makeQuestion("Which attribute provides alternative text for an image?", ["alt", "href", "srcset only", "target"], "alt", "The alt attribute provides a text alternative for an image."),
  ],

  "Backend Developer": [
    makeQuestion("Which Express method handles GET requests?", ["app.fetch()", "app.get()", "app.read()", "app.select()"], "app.get()", "app.get registers a GET route handler."),
    makeQuestion("Which Node.js mechanism coordinates asynchronous callbacks?", ["Event loop", "CSS engine", "DOM tree", "HTML parser"], "Event loop", "The event loop coordinates asynchronous work."),
    makeQuestion("Which HTTP method is commonly used to create a resource?", ["GET", "POST", "HEAD", "OPTIONS"], "POST", "POST commonly submits data to create a resource."),
    makeQuestion("What does middleware do in Express?", ["Processes requests and responses", "Styles HTML", "Creates CSS selectors", "Compiles Java classes"], "Processes requests and responses", "Middleware can inspect requests and responses."),
    makeQuestion("What does JWT stand for?", ["Java Web Transfer", "JSON Web Token", "Joined Web Table", "JavaScript Work Tool"], "JSON Web Token", "JWT is a token format for carrying claims."),
    makeQuestion("Which status code indicates a missing resource?", ["201", "301", "404", "503"], "404", "HTTP 404 means the requested resource was not found."),
    makeQuestion("Why hash passwords before storing them?", ["To protect stored credentials", "To make them reversible", "To remove authorization", "To increase response size"], "To protect stored credentials", "Password hashes avoid storing plaintext passwords."),
    makeQuestion("What is environment configuration commonly used for?", ["Keeping settings outside source code", "Replacing all tests", "Rendering CSS", "Sorting arrays only"], "Keeping settings outside source code", "Environment variables hold deployment-specific settings and secrets."),
    makeQuestion("What does REST commonly organize around?", ["Resources and HTTP operations", "CSS classes", "CPU registers", "Image pixels"], "Resources and HTTP operations", "REST APIs expose resources through representations and operations."),
    makeQuestion("Which status code indicates successful resource creation?", ["200", "201", "401", "500"], "201", "HTTP 201 Created indicates a resource was created."),
  ],

  "Full Stack Developer": [
    makeQuestion("Which technology structures web page content?", ["HTML", "MongoDB", "Node.js", "Express"], "HTML", "HTML defines page structure."),
    makeQuestion("Which React hook is commonly used for side effects?", ["useState", "useEffect", "useKey", "useStyle"], "useEffect", "useEffect handles side effects such as data fetching."),
    makeQuestion("Which database does Mongoose support?", ["MongoDB", "Redis only", "Excel", "Oracle Forms"], "MongoDB", "Mongoose is an ODM for MongoDB."),
    makeQuestion("Which command installs npm dependencies?", ["npm start", "npm install", "node install", "npm build"], "npm install", "npm install installs project dependencies."),
    makeQuestion("What does CRUD mean?", ["Create, Read, Update, Delete", "Copy, Run, Upload, Download", "Create, Render, Use, Deploy", "Connect, Route, Update, Design"], "Create, Read, Update, Delete", "CRUD describes common data operations."),
    makeQuestion("Which HTTP method retrieves data?", ["POST", "GET", "PATCH", "DELETE"], "GET", "GET requests retrieve a resource."),
    makeQuestion("What is Tailwind CSS?", ["A utility-first CSS framework", "A database", "A server runtime", "A testing language"], "A utility-first CSS framework", "Tailwind provides utility classes for styling."),
    makeQuestion("What is the purpose of CORS?", ["Controls cross-origin browser requests", "Encrypts database files", "Compiles React", "Hashes passwords"], "Controls cross-origin browser requests", "CORS lets servers specify permitted cross-origin access."),
    makeQuestion("What does a database index usually improve?", ["Query performance", "Password reversibility", "Image quality", "HTML structure"], "Query performance", "Indexes can speed up lookups at storage and write costs."),
    makeQuestion("Why use environment variables for API secrets?", ["To avoid hardcoding secrets in source code", "To expose secrets publicly", "To replace HTTPS", "To remove authentication"], "To avoid hardcoding secrets in source code", "Secrets should be kept out of committed source files."),
  ],

  "Java Developer": [
    makeQuestion("Which concept allows a class to inherit another class?", ["Inheritance", "Compilation", "Serialization", "Casting"], "Inheritance", "Inheritance lets a class derive behavior from another class."),
    makeQuestion("Which collection does not allow duplicate elements?", ["ArrayList", "HashSet", "LinkedList", "Vector"], "HashSet", "HashSet stores unique elements."),
    makeQuestion("Which keyword prevents a method from being overridden?", ["static", "final", "volatile", "transient"], "final", "A final method cannot be overridden."),
    makeQuestion("Which block handles an exception?", ["catch", "finalize", "import", "package"], "catch", "A catch block handles matching exceptions."),
    makeQuestion("Which type stores true or false?", ["boolean", "char", "String", "float"], "boolean", "boolean represents true or false."),
    makeQuestion("Which interface is commonly used to sort objects by a natural order?", ["Comparable", "Runnable", "Serializable", "Cloneable"], "Comparable", "Comparable defines compareTo for natural ordering."),
    makeQuestion("What does JVM stand for?", ["Java Virtual Machine", "Java Variable Method", "Joint Version Manager", "Java Verified Module"], "Java Virtual Machine", "The JVM executes Java bytecode."),
    makeQuestion("Which keyword refers to the current object?", ["this", "super", "static", "new"], "this", "this refers to the current instance."),
    makeQuestion("Which construct repeats while a condition is true?", ["while", "switch", "throw", "package"], "while", "A while loop repeats while its condition is true."),
    makeQuestion("What is method overloading?", ["Same method name with different parameter lists", "Replacing a parent method only", "Deleting a method", "Making a method private"], "Same method name with different parameter lists", "Overloading uses different parameter lists."),
  ],

  "Python Developer": [
    makeQuestion("Which Python type is immutable?", ["list", "dict", "tuple", "set"], "tuple", "Tuples cannot be modified after creation."),
    makeQuestion("Which keyword defines a function?", ["func", "define", "def", "method"], "def", "Python functions are declared using def."),
    makeQuestion("What does len() return?", ["Number of items", "Memory address", "Data type only", "Sorted items"], "Number of items", "len returns the length of an object."),
    makeQuestion("Which structure stores key-value pairs?", ["list", "tuple", "dict", "set"], "dict", "Dictionaries map keys to values."),
    makeQuestion("Which keyword handles an exception?", ["except", "error", "catch", "handle"], "except", "except handles exceptions raised in a try block."),
    makeQuestion("What does range(5) produce when iterated?", ["0 through 4", "1 through 5", "0 through 5", "5 through 10"], "0 through 4", "The stop value is excluded."),
    makeQuestion("Which operator performs exponentiation?", ["^", "**", "//", "%%"], "**", "** raises a number to a power."),
    makeQuestion("What is a Python list comprehension used for?", ["Building lists concisely", "Creating a class only", "Handling network ports", "Installing packages"], "Building lists concisely", "Comprehensions construct lists from iterable expressions."),
    makeQuestion("Which keyword creates a class?", ["object", "class", "struct", "typeclass"], "class", "Python classes are declared with class."),
    makeQuestion("Which package manager is commonly used for Python packages?", ["pip", "npm", "cargo", "maven"], "pip", "pip installs Python packages."),
  ],

  "SQL Developer": [
    makeQuestion("Which clause filters rows before grouping?", ["WHERE", "HAVING", "ORDER BY", "DISTINCT"], "WHERE", "WHERE filters rows before grouping."),
    makeQuestion("Which clause filters grouped results?", ["WHERE", "HAVING", "FROM", "LIMIT"], "HAVING", "HAVING filters groups after aggregation."),
    makeQuestion("Which JOIN returns matching rows from both tables?", ["INNER JOIN", "CROSS JOIN", "FULL JOIN", "SELF JOIN only"], "INNER JOIN", "INNER JOIN returns rows with matching join conditions."),
    makeQuestion("Which function counts rows?", ["SUM()", "COUNT()", "AVG()", "ROUND()"], "COUNT()", "COUNT counts rows or non-NULL values, depending on its argument."),
    makeQuestion("Which command changes existing rows?", ["UPDATE", "ALTER", "CREATE", "GRANT"], "UPDATE", "UPDATE modifies existing table rows."),
    makeQuestion("Which constraint uniquely identifies each row?", ["PRIMARY KEY", "DEFAULT", "CHECK only", "INDEX name"], "PRIMARY KEY", "A primary key uniquely identifies each row."),
    makeQuestion("What does GROUP BY do?", ["Groups rows for aggregation", "Deletes duplicates from storage", "Creates a database", "Encrypts a column"], "Groups rows for aggregation", "GROUP BY forms groups for aggregate calculations."),
    makeQuestion("Which operator tests for NULL values?", ["= NULL", "IS NULL", "== NULL", "EQUALS NULL"], "IS NULL", "Use IS NULL to test for NULL values."),
    makeQuestion("Which command removes table rows while keeping the table?", ["DROP TABLE", "TRUNCATE TABLE", "DROP DATABASE", "CREATE TABLE"], "TRUNCATE TABLE", "TRUNCATE removes rows while preserving the table definition."),
    makeQuestion("What is a foreign key used for?", ["Referential integrity", "Sorting results", "Compressing files", "Creating passwords"], "Referential integrity", "A foreign key links records across related tables."),
  ],

  "Data Analyst": [
    makeQuestion("Which measure is the arithmetic average?", ["Mean", "Median", "Mode", "Range"], "Mean", "The mean is the sum divided by the number of values."),
    makeQuestion("Which chart is useful for comparing categories?", ["Bar chart", "Scatter plot only", "Network graph only", "Gantt chart only"], "Bar chart", "Bar charts compare values across categories."),
    makeQuestion("What does a NULL value commonly represent in a dataset?", ["Missing or unknown information", "Always zero", "Always false", "A duplicate row"], "Missing or unknown information", "NULL represents an absent or unknown value."),
    makeQuestion("What does data cleaning address?", ["Errors and inconsistencies", "Only chart colors", "Only file names", "CPU scheduling"], "Errors and inconsistencies", "Cleaning improves data quality."),
    makeQuestion("Which SQL clause sorts query results?", ["ORDER BY", "GROUP BY", "WHERE", "VALUES"], "ORDER BY", "ORDER BY sorts the result set."),
    makeQuestion("What does correlation measure?", ["Association between variables", "Proof of causation", "Database size", "Number of files"], "Association between variables", "Correlation describes how variables vary together, not necessarily causation."),
    makeQuestion("Which measure is less affected by extreme outliers?", ["Median", "Mean", "Sum", "Maximum"], "Median", "The median is resistant to extreme values."),
    makeQuestion("What is a KPI?", ["Key Performance Indicator", "Kernel Processing Interface", "Known Program Input", "Key Protocol Index"], "Key Performance Indicator", "A KPI measures progress toward an objective."),
    makeQuestion("What is a pivot table useful for?", ["Summarizing and aggregating data", "Encrypting files", "Compiling code", "Routing requests"], "Summarizing and aggregating data", "Pivot tables summarize data across categories."),
    makeQuestion("Why split data into training and test sets?", ["To evaluate generalization on unseen data", "To increase duplicate rows", "To remove all features", "To avoid measurement"], "To evaluate generalization on unseen data", "A test set evaluates performance on unseen examples."),
  ],

  "QA Engineer": [
    makeQuestion("What is regression testing?", ["Checking existing functionality after changes", "Testing only new hardware", "Deleting old tests", "Reviewing CSS colors"], "Checking existing functionality after changes", "Regression testing looks for unintended side effects."),
    makeQuestion("What is a test case?", ["Steps, inputs, and expected results", "A database server", "A CSS selector", "A release certificate only"], "Steps, inputs, and expected results", "A test case describes how to verify behavior."),
    makeQuestion("What is the purpose of smoke testing?", ["Check critical functions quickly", "Test every possible input", "Replace all integration tests", "Measure only network speed"], "Check critical functions quickly", "Smoke tests verify basic stability after a build."),
    makeQuestion("Which tool is commonly used for browser automation?", ["Selenium", "MongoDB", "Figma", "PostgreSQL"], "Selenium", "Selenium automates browser interactions."),
    makeQuestion("What is an assertion in a test?", ["A check against an expected condition", "A deployment server", "A database index", "A design mockup"], "A check against an expected condition", "Assertions compare actual behavior with expectations."),
    makeQuestion("What does API testing verify?", ["API behavior and responses", "Only page colors", "Only CPU temperature", "Only keyboard layout"], "API behavior and responses", "API tests verify status codes, data, and behavior."),
    makeQuestion("What is a bug reproduction step?", ["An action that helps trigger the defect", "A release budget", "A CSS theme", "A database backup only"], "An action that helps trigger the defect", "Reproduction steps help others observe a defect."),
    makeQuestion("What is boundary-value analysis?", ["Testing values near input limits", "Testing only average values", "Testing without requirements", "Testing only screen resolution"], "Testing values near input limits", "Boundary testing focuses on edges of valid ranges."),
    makeQuestion("What is integration testing?", ["Testing interactions between components", "Testing only individual functions", "Testing user opinions", "Testing hardware packaging"], "Testing interactions between components", "Integration tests verify components working together."),
    makeQuestion("What does CI commonly stand for?", ["Continuous Integration", "Code Inspection only", "Central Installation", "Component Index"], "Continuous Integration", "CI regularly integrates and validates code changes."),
  ],

  "DevOps Engineer": [
    makeQuestion("What does CI/CD commonly automate?", ["Building, testing, and delivery", "Only CSS formatting", "Only database design", "Manual typing"], "Building, testing, and delivery", "CI/CD automates parts of software delivery."),
    makeQuestion("What is Docker primarily used for?", ["Packaging applications into containers", "Creating SQL joins", "Editing photos", "Writing CSS"], "Packaging applications into containers", "Containers package applications and their dependencies."),
    makeQuestion("Which command lists files in a typical Linux shell?", ["ls", "pwd", "cd", "mkdir"], "ls", "ls lists directory contents."),
    makeQuestion("What does Kubernetes orchestrate?", ["Containers", "SQL queries only", "HTML elements", "Spreadsheet formulas"], "Containers", "Kubernetes manages containerized workloads."),
    makeQuestion("What does SSH provide?", ["Secure remote access", "Image compression", "Database normalization", "CSS compilation"], "Secure remote access", "SSH provides encrypted remote login and communication."),
    makeQuestion("What is infrastructure as code?", ["Managing infrastructure using versioned configuration", "Manually changing every server", "Writing only HTML", "Disabling automation"], "Managing infrastructure using versioned configuration", "Infrastructure as code describes infrastructure declaratively or programmatically."),
    makeQuestion("Which command shows the current directory in Linux?", ["pwd", "ls", "cat", "touch"], "pwd", "pwd prints the working directory."),
    makeQuestion("What is a container image?", ["A packaged template used to create containers", "A screenshot of a server", "A network cable", "A database row"], "A packaged template used to create containers", "Container images hold application files and dependencies."),
    makeQuestion("What is monitoring used for?", ["Observing system health and performance", "Replacing backups", "Writing source code only", "Removing logs"], "Observing system health and performance", "Monitoring helps detect failures and performance issues."),
    makeQuestion("Why use version control for deployment configuration?", ["To track changes and enable review", "To hide every change", "To disable rollback", "To increase server temperature"], "To track changes and enable review", "Version control supports auditing and rollback."),
  ],

  "AI/ML Engineer": [
    makeQuestion("What is supervised learning?", ["Learning from labeled examples", "Learning without any data", "Manually writing every prediction", "Only compressing files"], "Learning from labeled examples", "Supervised learning trains on examples with target labels."),
    makeQuestion("What is overfitting?", ["Performing well on training data but poorly on unseen data", "Having no training data", "Using too little storage", "Removing labels from all data"], "Performing well on training data but poorly on unseen data", "Overfit models fail to generalize well."),
    makeQuestion("What is a feature in machine learning?", ["An input variable used by a model", "A server password", "A database backup", "A deployment pipeline"], "An input variable used by a model", "Features provide information used to make predictions."),
    makeQuestion("What is classification?", ["Predicting a category or class", "Predicting only a continuous number", "Sorting files by name", "Compressing images"], "Predicting a category or class", "Classification predicts discrete labels."),
    makeQuestion("What is regression commonly used to predict?", ["A numerical value", "A class label only", "A file extension", "A network route"], "A numerical value", "Regression models predict continuous numerical targets."),
    makeQuestion("Why use a validation set?", ["To tune models during development", "To store user passwords", "To replace all training data", "To encrypt features"], "To tune models during development", "Validation data helps compare models and tune hyperparameters."),
    makeQuestion("What is a confusion matrix used for?", ["Summarizing classification predictions", "Compiling a model", "Creating a database", "Deploying a website"], "Summarizing classification predictions", "It counts correct and incorrect predictions by class."),
    makeQuestion("What does precision measure?", ["The fraction of predicted positives that are correct", "The number of training rows only", "The model file size", "The speed of a network"], "The fraction of predicted positives that are correct", "Precision is true positives divided by predicted positives."),
    makeQuestion("What is feature scaling?", ["Adjusting numerical features to comparable scales", "Deleting all features", "Adding random labels", "Compressing model files"], "Adjusting numerical features to comparable scales", "Scaling prevents features with large magnitudes from dominating some algorithms."),
    makeQuestion("What is an epoch in model training?", ["One pass through the training dataset", "One database query", "A server restart", "A test case"], "One pass through the training dataset", "An epoch processes the training dataset once."),
  ],

  "Android Developer": [
    makeQuestion("Which language is officially supported for Android development?", ["Kotlin", "SQL", "CSS", "Bash only"], "Kotlin", "Kotlin is a first-class Android development language."),
    makeQuestion("What is an Activity in Android?", ["A component representing a user-facing screen", "A database index", "A network protocol", "A CSS property"], "A component representing a user-facing screen", "An Activity is an Android application component."),
    makeQuestion("What does an Android manifest describe?", ["App components and configuration", "Only image colors", "Only database rows", "Git history"], "App components and configuration", "The manifest declares components and app-level configuration."),
    makeQuestion("What is an Intent used for?", ["Requesting an action from another component", "Styling text", "Creating SQL indexes", "Compiling CSS"], "Requesting an action from another component", "Intents facilitate communication between Android components."),
    makeQuestion("What is a RecyclerView commonly used for?", ["Displaying efficient scrolling lists", "Storing passwords", "Creating network routes", "Editing audio"], "Displaying efficient scrolling lists", "RecyclerView efficiently displays large or dynamic lists."),
    makeQuestion("What is the Android UI thread responsible for?", ["Handling UI interactions and rendering work", "Running all database servers", "Compiling every app", "Replacing background work"], "Handling UI interactions and rendering work", "Long operations should not block the UI thread."),
    makeQuestion("What is an emulator?", ["A virtual device for testing", "A database schema", "A release note", "A CSS preprocessor"], "A virtual device for testing", "An emulator simulates a device environment."),
    makeQuestion("Why request runtime permissions?", ["To access protected capabilities with user consent", "To avoid app signing", "To remove testing", "To change the programming language"], "To access protected capabilities with user consent", "Sensitive permissions require appropriate user authorization."),
    makeQuestion("What is a foreground service commonly used for?", ["Ongoing work noticeable to the user", "Rendering HTML only", "Sorting database tables", "Replacing all activities"], "Ongoing work noticeable to the user", "Foreground services support user-noticeable ongoing tasks."),
    makeQuestion("What is APK?", ["Android application package", "Advanced Python kernel", "App protocol key", "Automatic process kit"], "Android application package", "An APK is an Android app installation package."),
  ],

  "Cybersecurity Analyst": [
    makeQuestion("What is phishing?", ["A deceptive attempt to steal information", "A database join", "A code formatting style", "A backup process"], "A deceptive attempt to steal information", "Phishing tricks people into revealing information or opening harmful content."),
    makeQuestion("What does MFA stand for?", ["Multi-Factor Authentication", "Managed File Access", "Main Firewall Application", "Multiple Format Archive"], "Multi-Factor Authentication", "MFA uses more than one authentication factor."),
    makeQuestion("What is the principle of least privilege?", ["Grant only the access necessary for a task", "Give everyone administrator access", "Disable all passwords", "Share all credentials"], "Grant only the access necessary for a task", "Least privilege limits unnecessary permissions."),
    makeQuestion("What does encryption do?", ["Transforms data to protect confidentiality", "Deletes all data", "Improves CSS layout", "Creates duplicate users"], "Transforms data to protect confidentiality", "Encryption protects data from unauthorized reading."),
    makeQuestion("What is a firewall used for?", ["Filtering network traffic", "Designing mobile screens", "Writing SQL joins", "Compiling Java"], "Filtering network traffic", "Firewalls enforce traffic rules."),
    makeQuestion("What is a vulnerability?", ["A weakness that could be exploited", "A completed backup", "A valid password only", "A UI component"], "A weakness that could be exploited", "Vulnerabilities can allow unauthorized access or impact."),
    makeQuestion("Why apply security patches?", ["To fix known vulnerabilities and defects", "To disable updates", "To publish passwords", "To remove logs"], "To fix known vulnerabilities and defects", "Patches can correct security weaknesses."),
    makeQuestion("What does HTTPS help protect?", ["Data in transit", "All endpoint devices automatically", "All stored files automatically", "Physical server access"], "Data in transit", "HTTPS protects communication between client and server."),
    makeQuestion("What is a brute-force attack?", ["Repeatedly trying possible credentials", "Compressing a database", "Running a backup", "Testing CSS layouts"], "Repeatedly trying possible credentials", "Brute-force attacks try many candidate credentials or keys."),
    makeQuestion("What is log monitoring useful for?", ["Detecting suspicious activity", "Replacing access control", "Making passwords public", "Disabling alerts"], "Detecting suspicious activity", "Logs can reveal unusual or malicious activity."),
  ],

  "Network Engineer": [
    makeQuestion("What does DNS do?", ["Maps domain names to records such as IP addresses", "Encrypts every file", "Compiles code", "Creates HTML elements"], "Maps domain names to records such as IP addresses", "DNS resolves names to resource records."),
    makeQuestion("What does DHCP commonly provide?", ["Automatic IP configuration", "Website styling", "Database indexing", "Password hashing"], "Automatic IP configuration", "DHCP leases network configuration to clients."),
    makeQuestion("Which device commonly forwards packets between networks?", ["Router", "Keyboard", "Monitor", "Printer"], "Router", "Routers forward packets between networks."),
    makeQuestion("Which protocol provides reliable, ordered delivery?", ["TCP", "UDP", "ARP only", "ICMP only"], "TCP", "TCP provides a reliable ordered byte stream."),
    makeQuestion("Which protocol is connectionless?", ["UDP", "TCP", "SSH", "HTTPS"], "UDP", "UDP sends datagrams without establishing a connection."),
    makeQuestion("What is an IP address used for?", ["Identifying a network interface logically", "Styling a webpage", "Hashing a password", "Creating a database"], "Identifying a network interface logically", "IP addresses support network-layer addressing."),
    makeQuestion("What does a subnet mask identify?", ["Network and host portions of an IPv4 address", "A user password", "A website theme", "A database table"], "Network and host portions of an IPv4 address", "A subnet mask separates network and host bits."),
    makeQuestion("What is latency?", ["Time taken for data to travel or be processed", "Number of database tables", "Image resolution", "Password length"], "Time taken for data to travel or be processed", "Latency measures delay."),
    makeQuestion("Which tool is commonly used to test reachability with ICMP echo?", ["ping", "mkdir", "git", "npm"], "ping", "ping tests reachability using echo requests where permitted."),
    makeQuestion("What is a VPN commonly used for?", ["Creating an encrypted tunnel over a network", "Replacing every firewall", "Writing HTML", "Deleting network routes"], "Creating an encrypted tunnel over a network", "VPNs can protect traffic across untrusted networks."),
  ],
};

const roleToSpecialty = {
  "Frontend Developer": "Frontend Developer",
  "JavaScript Developer": "Frontend Developer",
  "Backend Developer": "Backend Developer",
  "Full Stack Developer": "Full Stack Developer",
  "Software Engineer": "Full Stack Developer",
  "Java Developer": "Java Developer",
  "Python Developer": "Python Developer",
  "SQL Developer": "SQL Developer",
  "Data Engineer": "SQL Developer",
  "Data Analyst": "Data Analyst",
  "Data Scientist": "AI/ML Engineer",
  "AI/ML Engineer": "AI/ML Engineer",
  "QA Engineer": "QA Engineer",
  "Software Tester": "QA Engineer",
  "Automation Test Engineer": "QA Engineer",
  "DevOps Engineer": "DevOps Engineer",
  "Cloud Engineer": "DevOps Engineer",
  "Android Developer": "Android Developer",
  "Mobile Developer": "Android Developer",
  "Cybersecurity Analyst": "Cybersecurity Analyst",
  "Security Engineer": "Cybersecurity Analyst",
  "Network Engineer": "Network Engineer",
  "System Administrator": "Network Engineer",
  "DSA / Problem-Solving": "Java Developer",
};

const startAssessment = async (req, res) => {
  try {
    const StudentProfile = require("../models/StudentProfile");

    const { role } = req.body;

    if (!role || !roleToSpecialty[role]) {
      return res.status(400).json({
        message: "Invalid role. Please select a supported IT role.",
        supportedRoles: Object.keys(roleToSpecialty),
      });
    }

    const student = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found.",
      });
    }

    const specialty = roleToSpecialty[role];

    const questions = [
      ...generalQuestions,
      ...specialtyQuestions[specialty],
    ].map((question) => ({
      ...question,
      options: [...question.options].sort(() => Math.random() - 0.5),
    }));

    const assessment = await SkillAssessment.create({
      student: student._id,
      role,
      questions,
      totalQuestions: questions.length,
    });

    return res.status(201).json({
      message: "Assessment started successfully.",
      assessmentId: assessment._id,
      role: assessment.role,
      totalQuestions: assessment.totalQuestions,
      questions: assessment.questions.map((question) => ({
        _id: question._id,
        question: question.question,
        options: question.options,
      })),
    });
  } catch (error) {
    console.error("Start assessment error:", error);

    return res.status(500).json({
      message: "Failed to start assessment.",
    });
  }
};

const submitAssessment = async (req, res) => {
  try {
    const StudentProfile = require("../models/StudentProfile");

    const { assessmentId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers must be provided as an array.",
      });
    }

    const student = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found.",
      });
    }

    const assessment = await SkillAssessment.findOne({
      _id: assessmentId,
      student: student._id,
    });

    if (!assessment) {
      return res.status(404).json({
        message: "Assessment not found.",
      });
    }

    if (assessment.completed) {
      return res.status(400).json({
        message: "This assessment has already been submitted.",
      });
    }

    const submittedIds = answers.map((answer) =>
      String(answer.questionId)
    );

    if (new Set(submittedIds).size !== submittedIds.length) {
      return res.status(400).json({
        message: "Duplicate answers are not allowed.",
      });
    }

    const questionIds = new Set(
      assessment.questions.map((question) => String(question._id))
    );

    if (answers.some((answer) => !questionIds.has(String(answer.questionId)))) {
      return res.status(400).json({
        message: "An answer contains an invalid question ID.",
      });
    }

    let correctCount = 0;

    assessment.questions.forEach((question) => {
      const submittedAnswer = answers.find(
        (answer) => String(answer.questionId) === String(question._id)
      );

      question.selectedAnswer = submittedAnswer
        ? submittedAnswer.selectedAnswer
        : "";

      if (
        submittedAnswer &&
        submittedAnswer.selectedAnswer === question.correctAnswer
      ) {
        correctCount++;
      }
    });

    const totalQuestions = assessment.questions.length;
    const score =
      totalQuestions === 0
        ? 0
        : Math.round((correctCount / totalQuestions) * 100);

    assessment.score = score;
    assessment.totalQuestions = totalQuestions;
    assessment.feedback =
      score >= 80
        ? "Excellent work! You have a strong understanding of this role."
        : score >= 60
          ? "Good effort! Review the incorrect answers to improve."
          : "Keep practicing. Review the explanations and try again with a new assessment.";
    assessment.completed = true;

    await assessment.save();

    return res.status(200).json({
      message: "Assessment submitted successfully.",
      assessmentId: assessment._id,
      role: assessment.role,
      score: assessment.score,
      correctAnswers: correctCount,
      totalQuestions,
      feedback: assessment.feedback,
      results: assessment.questions.map((question) => ({
        questionId: question._id,
        question: question.question,
        selectedAnswer: question.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: question.selectedAnswer === question.correctAnswer,
        explanation: question.explanation,
      })),
    });
  } catch (error) {
    console.error("Submit assessment error:", error);

    return res.status(500).json({
      message: "Failed to submit assessment.",
    });
  }
};

module.exports = {
  startAssessment,
  submitAssessment,
};