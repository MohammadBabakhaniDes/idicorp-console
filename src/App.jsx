
// import { useEffect, useMemo, useState } from "react";
// import {
//   Activity,
//   ArrowDownRight,
//   ArrowRight,
//   ArrowUpRight,
//   Bell,
//   Calculator,
//   Check,
//   CheckCircle2,
//   ChevronDown,
//   CircleHelp,
//   Clock3,
//   Code2,
//   Command,
//   FileText,
//   Filter,
//   LayoutDashboard,
//   LogOut,
//   Menu,
//   MessageSquare,
//   MoreHorizontal,
//   Plus,
//   Radio,
//   Search,
//   Send,
//   Settings,
//   ShieldCheck,
//   Sparkles,
//   Trash2,
//   X,
//   Zap,
// } from "lucide-react";
// import "./index.css";

// const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://ts.idicorp.ir").replace(/\/$/, "");

// async function apiRequest(path, options = {}) {
//   const token = sessionStorage.getItem("access_token");
//   const headers = { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(options.headers || {}) };
//   if (token) headers.Authorization = `Bearer ${token}`;
//   const response = await fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers,
//     credentials: "include",
//   });
//   if (!response.ok) {
//     let detail = `Request failed (${response.status})`;
//     try {
//       const body = await response.json();
//       detail = body.detail || body.message || detail;
//     } catch { /* response was not JSON */ }
//     throw new Error(detail);
//   }
//   if (response.status === 204) return null;
//   return response.json();
// }

// const navigation = [
//   { label: "Overview", icon: LayoutDashboard },
//   { label: "Tasks", icon: CheckCircle2 },
//   { label: "Calculator", icon: Calculator },
//   { label: "Text Echo", icon: MessageSquare },
//   { label: "Stream Echo", icon: Radio },
// ];

// function IconButton({ children, label, onClick }) {
//   return (
//     <button
//       type="button"
//       className="icon-button"
//       aria-label={label}
//       title={label}
//       onClick={onClick}
//     >
//       {children}
//     </button>
//   );
// }

// function SectionTitle({ eyebrow, title, description, action }) {
//   return (
//     <div className="section-title">
//       <div>
//         <div className="eyebrow">{eyebrow}</div>
//         <h1>{title}</h1>
//         <p>{description}</p>
//       </div>
//       {action}
//     </div>
//   );
// }

// function App() {
//   const [activePage, setActivePage] = useState("Overview");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [tasks, setTasks] = useState([]);
//   const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem("access_token") || "");
//   const [captcha, setCaptcha] = useState("");
//   const [salt, setSalt] = useState("");
//   const [captchaAnswer, setCaptchaAnswer] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [authLoading, setAuthLoading] = useState(false);
//   const [tasksLoading, setTasksLoading] = useState(false);
//   const [authError, setAuthError] = useState("");
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [showTaskForm, setShowTaskForm] = useState(false);
//   const [editingTask, setEditingTask] = useState(null);
//   const [taskTitle, setTaskTitle] = useState("");
//   const [taskDescription, setTaskDescription] = useState("");
//   const [notice, setNotice] = useState("");
//   const [operation, setOperation] = useState("add");
//   const [numbers, setNumbers] = useState("10, 20");
//   const [calculatorResult, setCalculatorResult] = useState(null);
//   const [echoInput, setEchoInput] = useState("");
//   const [echoMessages, setEchoMessages] = useState([]);
//   const [streamInput, setStreamInput] = useState("");
//   const [streamResult, setStreamResult] = useState("");
//   const [streamLoading, setStreamLoading] = useState(false);

//   async function loadCaptcha() {
//     setAuthError("");
//     try {
//       const response = await fetch(`${API_BASE}/api/auth/login`, { credentials: "include" });
//       if (!response.ok) throw new Error(`Could not load CAPTCHA (${response.status})`);
//       const data = await response.json();
//       setCaptcha(data.captcha || "");
//       setSalt(data.salt || "");
//     } catch (error) {
//       setAuthError(`${error.message}. Check your connection and try refreshing the CAPTCHA.`);
//     }
//   }

//   async function handleLogin(event) {
//     event.preventDefault();
//     setAuthLoading(true);
//     setAuthError("");
//     try {
//       const response = await fetch(`${API_BASE}/api/auth/login`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username: username.trim(), password, salt, captcha_answer: captchaAnswer.trim() }),
//       });
//       const data = await response.json().catch(() => ({}));
//       if (!response.ok) throw new Error(data.detail || data.message || `Sign in failed (${response.status})`);
//       if (!data.access_token) throw new Error("The server did not return an access token.");
//       sessionStorage.setItem("access_token", data.access_token);
//       setAccessToken(data.access_token);
//       setPassword("");
//       setCaptchaAnswer("");
//       setNotice("Signed in successfully.");
//     } catch (error) {
//       setAuthError(error.message);
//       await loadCaptcha();
//     } finally {
//       setAuthLoading(false);
//     }
//   }

//   function handleLogout() {
//     sessionStorage.removeItem("access_token");
//     setAccessToken("");
//     setTasks([]);
//     setPassword("");
//     setNotice("Signed out.");
//     loadCaptcha();
//   }

//   async function loadTasks() {
//     setTasksLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (filter === "completed") params.set("completed", "true");
//       if (filter === "pending") params.set("completed", "false");
//       if (search.trim()) params.set("q", search.trim());
//       const data = await apiRequest(`/api/tasks${params.size ? `?${params.toString()}` : ""}`);
//       setTasks(Array.isArray(data) ? data : data.tasks || []);
//     } catch (error) {
//       if (error.message.includes("401") || error.message.toLowerCase().includes("unauthorized")) handleLogout();
//       showNotice(`Could not load tasks: ${error.message}`);
//     } finally {
//       setTasksLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (accessToken) loadTasks();
//     else loadCaptcha();
//     // Load when authentication state changes.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [accessToken]);

//   useEffect(() => {
//     if (!accessToken) return;
//     const timer = window.setTimeout(() => loadTasks(), 250);
//     return () => window.clearTimeout(timer);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search, filter, accessToken]);

//   const completedCount = tasks.filter((task) => task.completed).length;
//   const pendingCount = tasks.length - completedCount;

//   const filteredTasks = useMemo(() => {
//     return tasks.filter((task) => {
//       const query = search.toLowerCase().trim();
//       const matchesSearch =
//         task.title.toLowerCase().includes(query) ||
//         task.description.toLowerCase().includes(query);

//       const matchesFilter =
//         filter === "all" ||
//         (filter === "completed" && task.completed) ||
//         (filter === "pending" && !task.completed);

//       return matchesSearch && matchesFilter;
//     });
//   }, [tasks, search, filter]);

//   function showNotice(message) {
//     setNotice(message);
//     window.setTimeout(() => setNotice(""), 3000);
//   }

//   function openNewTask() {
//     setEditingTask(null);
//     setTaskTitle("");
//     setTaskDescription("");
//     setShowTaskForm(true);
//   }

//   function openEditTask(task) {
//     setEditingTask(task);
//     setTaskTitle(task.title);
//     setTaskDescription(task.description);
//     setShowTaskForm(true);
//   }

//   async function saveTask(event) {
//     event.preventDefault();
//     if (!taskTitle.trim()) { showNotice("Please enter a task title."); return; }
//     if (taskTitle.trim().length > 120) { showNotice("Title cannot exceed 120 characters."); return; }
//     if (taskDescription.length > 2000) { showNotice("Description cannot exceed 2000 characters."); return; }
//     const payload = { title: taskTitle.trim(), description: taskDescription.trim() };
//     try {
//       if (editingTask) {
//         await apiRequest(`/api/tasks/${editingTask.id}`, { method: "PATCH", body: JSON.stringify(payload) });
//         showNotice("Task updated.");
//       } else {
//         await apiRequest("/api/tasks", { method: "POST", body: JSON.stringify({ ...payload, completed: false }) });
//         showNotice("Task created.");
//       }
//       setShowTaskForm(false);
//       await loadTasks();
//     } catch (error) {
//       showNotice(`Could not save task: ${error.message}`);
//     }
//   }

//   async function toggleTask(id) {
//     const task = tasks.find((item) => item.id === id);
//     if (!task) return;
//     try {
//       await apiRequest(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ completed: !task.completed }) });
//       await loadTasks();
//     } catch (error) { showNotice(`Could not update task: ${error.message}`); }
//   }

//   async function deleteTask(id) {
//     if (!window.confirm("Delete this task?")) return;
//     try {
//       await apiRequest(`/api/tasks/${id}`, { method: "DELETE" });
//       showNotice("Task deleted.");
//       await loadTasks();
//     } catch (error) { showNotice(`Could not delete task: ${error.message}`); }
//   }

//   function calculate(event) {
//     event.preventDefault();

//     const values = numbers
//       .split(",")
//       .map((value) => value.trim())
//       .filter(Boolean)
//       .map(Number);

//     if (
//       values.length < 1 ||
//       values.length > 100 ||
//       values.some(
//         (value) =>
//           !Number.isFinite(value) || Math.abs(value) > 1_000_000_000_000
//       )
//     ) {
//       setCalculatorResult({ error: "Enter 1–100 valid numbers." });
//       return;
//     }

//     if (operation === "divide" && values.slice(1).some((n) => n === 0)) {
//       setCalculatorResult({ error: "Division by zero is not allowed." });
//       return;
//     }

//     let result;

//     switch (operation) {
//       case "subtract":
//         result = values.slice(1).reduce((a, b) => a - b, values[0]);
//         break;
//       case "multiply":
//         result = values.reduce((a, b) => a * b, 1);
//         break;
//       case "divide":
//         result = values.slice(1).reduce((a, b) => a / b, values[0]);
//         break;
//       default:
//         result = values.reduce((a, b) => a + b, 0);
//     }

//     setCalculatorResult(
//       Number.isFinite(result)
//         ? { value: result }
//         : { error: "The result is outside the supported numeric range." }
//     );
//   }

//   function sendEcho(event) {
//     event.preventDefault();
//     if (!echoInput.trim()) return;

//     const message = echoInput;
//     setEchoMessages((current) => [
//       ...current,
//       { text: message, sentAt: new Date().toLocaleTimeString() },
//     ]);
//     setEchoInput("");
//   }

//   async function sendStream(event) {
//     event.preventDefault();
//     if (!streamInput) return;

//     setStreamLoading(true);
//     setStreamResult("");

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_BASE_URL || "https://ts.idicorp.ir"}/api/echo/stream`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             Authorization: `Bearer ${sessionStorage.getItem("access_token") || ""}`,
//             "Content-Type": "text/plain;charset=UTF-8",
//           },
//           body: streamInput,
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Request failed (${response.status})`);
//       }

//       if (!response.body) {
//         setStreamResult(await response.text());
//         return;
//       }

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         setStreamResult((current) => current + decoder.decode(value, { stream: true }));
//       }

//       setStreamResult((current) => current + decoder.decode());
//     } catch (error) {
//       setStreamResult(`Error: ${error.message}`);
//     } finally {
//       setStreamLoading(false);
//     }
//   }

//   function navigate(page) {
//     setActivePage(page);
//     setSidebarOpen(false);
//     setNotice("");
//   }

//   function renderOverview() {
//     return (
//       <>
//         <SectionTitle
//           eyebrow="WORKSPACE / OVERVIEW"
//           title="Good to see you."
//           description="Here's what's happening in your service console."
//           action={
//             <button className="button button-primary" onClick={openNewTask}>
//               <Plus size={17} /> New task
//             </button>
//           }
//         />

//         <div className="welcome-card">
//           <div className="welcome-content">
//             <div className="welcome-tag">
//               <Sparkles size={14} /> YOUR WORKSPACE
//             </div>
//             <h2>Everything in one place.</h2>
//             <p>
//               Manage your tasks and explore the capabilities of the IDICorp
//               service.
//             </p>
//             <button
//               className="button button-light"
//               onClick={() => navigate("Tasks")}
//             >
//               Explore your tasks <ArrowRight size={16} />
//             </button>
//           </div>
//           <div className="welcome-art" aria-hidden="true">
//             <div className="art-orbit orbit-one" />
//             <div className="art-orbit orbit-two" />
//             <div className="art-core">
//               <Zap size={34} />
//             </div>
//             <div className="art-node node-one"><Check size={15} /></div>
//             <div className="art-node node-two"><Code2 size={17} /></div>
//             <div className="art-node node-three"><Activity size={17} /></div>
//           </div>
//         </div>

//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-top">
//               <span>Total tasks</span>
//               <span className="stat-icon violet"><FileText size={19} /></span>
//             </div>
//             <div className="stat-number">{tasks.length}</div>
//             <div className="stat-foot">Across your current workspace</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-top">
//               <span>Completed</span>
//               <span className="stat-icon green"><CheckCircle2 size={19} /></span>
//             </div>
//             <div className="stat-number">{completedCount}</div>
//             <div className="stat-foot"><ArrowUpRight size={14} /> Tasks marked as done</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-top">
//               <span>In progress</span>
//               <span className="stat-icon orange"><Clock3 size={19} /></span>
//             </div>
//             <div className="stat-number">{pendingCount}</div>
//             <div className="stat-foot"><ArrowDownRight size={14} /> Waiting for your attention</div>
//           </div>
//         </div>

//         <div className="content-card">
//           <div className="card-heading">
//             <div>
//               <h3>Recent tasks</h3>
//               <p>Your latest work at a glance.</p>
//             </div>
//             <button className="text-button" onClick={() => navigate("Tasks")}>
//               View all <ArrowRight size={15} />
//             </button>
//           </div>
//           <TaskList
//             tasks={tasks.slice(0, 4)}
//             onToggle={toggleTask}
//             onEdit={openEditTask}
//             onDelete={deleteTask}
//           />
//         </div>

//         <div className="section-heading">
//           <div>
//             <h2>Explore service tools</h2>
//             <p>Try out the available API capabilities.</p>
//           </div>
//         </div>

//         <div className="tools-grid">
//           <ToolCard
//             icon={<Calculator size={21} />}
//             color="violet"
//             title="Calculator"
//             description="Run arithmetic operations using the calculator service."
//             onClick={() => navigate("Calculator")}
//           />
//           <ToolCard
//             icon={<MessageSquare size={21} />}
//             color="blue"
//             title="Text Echo"
//             description="Send text messages and inspect the echoed responses."
//             onClick={() => navigate("Text Echo")}
//           />
//           <ToolCard
//             icon={<Radio size={21} />}
//             color="orange"
//             title="Stream Echo"
//             description="Send content and read the response as a stream."
//             onClick={() => navigate("Stream Echo")}
//           />
//         </div>
//       </>
//     );
//   }

//   function renderTasks() {
//     return (
//       <>
//         <SectionTitle
//           eyebrow="WORKSPACE / TASKS"
//           title="Your tasks"
//           description="Keep track of your work, one task at a time."
//           action={
//             <button className="button button-primary" onClick={openNewTask}>
//               <Plus size={17} /> Create task
//             </button>
//           }
//         />

//         <div className="task-summary-row">
//           <div className="summary-chip"><span className="dot dot-violet" /> {tasks.length} total</div>
//           <div className="summary-chip"><span className="dot dot-green" /> {completedCount} completed</div>
//           <div className="summary-chip"><span className="dot dot-orange" /> {pendingCount} pending</div>
//         </div>

//         <div className="content-card task-manager">
//           <div className="task-toolbar">
//             <div className="search-box">
//               <Search size={17} />
//               <input
//                 value={search}
//                 onChange={(event) => setSearch(event.target.value)}
//                 placeholder="Search tasks..."
//                 aria-label="Search tasks"
//               />
//               {search && <IconButton label="Clear search" onClick={() => setSearch("")}><X size={15} /></IconButton>}
//             </div>
//             <div className="filter-control">
//               <Filter size={16} />
//               <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter tasks">
//                 <option value="all">All tasks</option>
//                 <option value="pending">In progress</option>
//                 <option value="completed">Completed</option>
//               </select>
//             </div>
//           </div>
//           {tasksLoading && <p className="field-hint" role="status">Loading tasks…</p>}
//           <TaskList
//             tasks={filteredTasks}
//             onToggle={toggleTask}
//             onEdit={openEditTask}
//             onDelete={deleteTask}
//           />
//           <div className="table-footer">
//             Showing {filteredTasks.length} of {tasks.length} tasks
//           </div>
//         </div>
//       </>
//     );
//   }

//   function renderCalculator() {
//     return (
//       <>
//         <SectionTitle
//           eyebrow="SERVICE TOOLS / CALCULATOR"
//           title="Calculator"
//           description="Perform arithmetic operations with the calculator service."
//         />
//         <div className="tool-layout">
//           <div className="content-card tool-main-card">
//             <div className="tool-card-title">
//               <span className="large-tool-icon violet"><Calculator size={23} /></span>
//               <div><h3>Arithmetic operations</h3><p>Enter numbers separated by commas.</p></div>
//             </div>
//             <form onSubmit={calculate} className="form-stack">
//               <label className="field-label" htmlFor="calc-operation">Operation</label>
//               <select id="calc-operation" value={operation} onChange={(event) => setOperation(event.target.value)} className="form-control">
//                 <option value="add">Addition (+)</option>
//                 <option value="subtract">Subtraction (−)</option>
//                 <option value="multiply">Multiplication (×)</option>
//                 <option value="divide">Division (÷)</option>
//               </select>
//               <label className="field-label" htmlFor="calc-numbers">Numbers</label>
//               <input id="calc-numbers" className="form-control" value={numbers} onChange={(event) => setNumbers(event.target.value)} placeholder="e.g. 10, 20, 30" />
//               <p className="field-hint">Enter 1–100 finite numbers. Maximum absolute value: 1 trillion.</p>
//               <button className="button button-primary" type="submit"><Zap size={16} /> Calculate</button>
//             </form>
//             {calculatorResult && (
//               <div className={`result-panel ${calculatorResult.error ? "result-error" : ""}`}>
//                 <div className="result-label">{calculatorResult.error ? "Request error" : "Result"}</div>
//                 <div className="result-value">{calculatorResult.error || String(calculatorResult.value)}</div>
//               </div>
//             )}
//             <div className="demo-notice">Preview mode: calculations currently run in your browser. API connection is not yet enabled.</div>
//           </div>
//           <div className="content-card info-card">
//             <h3>Supported operations</h3>
//             {[
//               ["+", "Addition", "Adds all numbers together."],
//               ["−", "Subtraction", "Subtracts each following number from the first."],
//               ["×", "Multiplication", "Multiplies all numbers together."],
//               ["÷", "Division", "Divides the first number by each following number."],
//             ].map(([symbol, title, description]) => (
//               <div className="operation-row" key={title}>
//                 <span className="operation-symbol">{symbol}</span>
//                 <div><strong>{title}</strong><p>{description}</p></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </>
//     );
//   }

//   function renderEcho() {
//     return (
//       <>
//         <SectionTitle
//           eyebrow="SERVICE TOOLS / TEXT ECHO"
//           title="Text Echo"
//           description="Send messages and inspect responses from the echo service."
//         />
//         <div className="content-card chat-card">
//           <div className="chat-header">
//             <div className="tool-card-title">
//               <span className="large-tool-icon blue"><MessageSquare size={22} /></span>
//               <div><h3>Echo terminal</h3><p>Messages sent in this preview are echoed locally.</p></div>
//             </div>
//             <span className="status-pill status-idle"><span className="status-dot" /> Preview mode</span>
//           </div>
//           <div className="chat-messages">
//             {echoMessages.length === 0 ? (
//               <div className="empty-state">
//                 <div className="empty-icon"><MessageSquare size={24} /></div>
//                 <h3>No messages yet</h3>
//                 <p>Send your first message to get started.</p>
//               </div>
//             ) : echoMessages.map((message, index) => (
//               <div className="message-pair" key={`${message.sentAt}-${index}`}>
//                 <div className="message-bubble message-sent"><span>You</span><p>{message.text}</p><time>{message.sentAt}</time></div>
//                 <div className="message-bubble message-received"><span>Echo response · Preview</span><p>{message.text}</p><time>{message.sentAt}</time></div>
//               </div>
//             ))}
//           </div>
//           <form className="chat-composer" onSubmit={sendEcho}>
//             <input value={echoInput} onChange={(event) => setEchoInput(event.target.value)} placeholder="Type a message..." aria-label="Message to echo" />
//             <button className="button button-primary" type="submit" disabled={!echoInput.trim()}><Send size={16} /> Send</button>
//           </form>
//           <div className="demo-notice">Preview mode: messages are echoed locally. WebSocket authentication and live connection will be added next.</div>
//         </div>
//       </>
//     );
//   }

//   function renderStream() {
//     return (
//       <>
//         <SectionTitle
//           eyebrow="SERVICE TOOLS / STREAM ECHO"
//           title="Stream Echo"
//           description="Send content to the streaming endpoint and inspect the returned data."
//         />
//         <div className="tool-layout">
//           <div className="content-card tool-main-card">
//             <div className="tool-card-title">
//               <span className="large-tool-icon orange"><Radio size={22} /></span>
//               <div><h3>Streaming request</h3><p>Send text content as an HTTP POST request.</p></div>
//             </div>
//             <form className="form-stack" onSubmit={sendStream}>
//               <label className="field-label" htmlFor="stream-input">Request body</label>
//               <textarea id="stream-input" className="form-control textarea-control" value={streamInput} onChange={(event) => setStreamInput(event.target.value)} placeholder="Enter the content you want to send..." rows={6} />
//               <button className="button button-primary" type="submit" disabled={!streamInput || streamLoading}>
//                 <Radio size={16} /> {streamLoading ? "Receiving stream..." : "Send stream request"}
//               </button>
//             </form>
//             <div className="result-panel">
//               <div className="result-label">Response body</div>
//               <pre className="stream-output">{streamResult || "Your streamed response will appear here..."}</pre>
//             </div>
//             <div className="demo-notice">Requires a valid signed-in session. Responses are read incrementally when the server streams them.</div>
//           </div>
//           <div className="content-card info-card">
//             <h3>How streaming works</h3>
//             <div className="info-step"><span>01</span><div><strong>Send your content</strong><p>Your text is submitted in an authenticated HTTP POST request.</p></div></div>
//             <div className="info-step"><span>02</span><div><strong>Read the response</strong><p>The client reads the response body as chunks arrive.</p></div></div>
//             <div className="info-step"><span>03</span><div><strong>Inspect the output</strong><p>The returned content is displayed as it is received.</p></div></div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   if (!accessToken) {
//     return (
//       <div className="app-shell" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
//         <div className="content-card" style={{ width: "min(100%, 440px)", padding: 28 }}>
//           <div className="brand" style={{ marginBottom: 24 }}>
//             <div className="brand-mark"><Command size={22} strokeWidth={2.5} /></div>
//             <div className="brand-copy"><strong>idi<span>corp</span></strong><small>SERVICE CONSOLE</small></div>
//           </div>
//           <div className="eyebrow">SECURE WORKSPACE</div>
//           <h1 style={{ marginTop: 8 }}>Sign in</h1>
//           <p style={{ marginBottom: 24 }}>Sign in to access your task workspace and service tools.</p>
//           <form className="form-stack" onSubmit={handleLogin}>
//             <label className="field-label" htmlFor="login-username">Username</label>
//             <input id="login-username" className="form-control" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
//             <label className="field-label" htmlFor="login-password">Password</label>
//             <input id="login-password" className="form-control" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//             <label className="field-label" htmlFor="captcha-answer">CAPTCHA</label>
//             {captcha ? <img src={captcha.startsWith("data:") ? captcha : `data:image/jpeg;base64,${captcha}`} alt="CAPTCHA challenge" style={{ maxWidth: "100%", minHeight: 64, objectFit: "contain", alignSelf: "start", borderRadius: 8, border: "1px solid #e5e7eb" }} /> : <p>Loading CAPTCHA…</p>}
//             <div style={{ display: "flex", gap: 8 }}>
//               <input id="captcha-answer" className="form-control" value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)} placeholder="Enter CAPTCHA text" required />
//               <button type="button" className="button button-secondary" onClick={loadCaptcha}>Refresh</button>
//             </div>
//             {authError && <p role="alert" style={{ color: "#b42318" }}>{authError}</p>}
//             <button className="button button-primary" type="submit" disabled={authLoading || !captcha || !salt}>{authLoading ? "Signing in…" : "Sign in"}</button>
//           </form>
//           <p className="field-hint" style={{ marginTop: 18 }}>Your task data is scoped to this signed-in session.</p>
//         </div>
//       </div>
//     );
//   }

//   function renderPage() {
//     switch (activePage) {
//       case "Tasks": return renderTasks();
//       case "Calculator": return renderCalculator();
//       case "Text Echo": return renderEcho();
//       case "Stream Echo": return renderStream();
//       default: return renderOverview();
//     }
//   }

//   return (
//     <div className="app-shell">
//       {sidebarOpen && <button className="mobile-overlay" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
//       <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
//         <div className="brand">
//           <div className="brand-mark"><Command size={22} strokeWidth={2.5} /></div>
//           <div className="brand-copy"><strong>idi<span>corp</span></strong><small>SERVICE CONSOLE</small></div>
//           <IconButton label="Close navigation" onClick={() => setSidebarOpen(false)}><X size={18} /></IconButton>
//         </div>

//         <div className="workspace-switcher">
//           <div className="workspace-avatar">I</div>
//           <div className="workspace-copy"><strong>Internal workspace</strong><span>Development environment</span></div>
//           <ChevronDown size={15} />
//         </div>

//         <div className="nav-label">WORKSPACE</div>
//         <nav className="sidebar-nav" aria-label="Main navigation">
//           {navigation.map(({ label, icon: Icon }) => (
//             <button key={label} className={`nav-item ${activePage === label ? "nav-active" : ""}`} onClick={() => navigate(label)}>
//               <Icon size={18} strokeWidth={1.8} />
//               <span>{label}</span>
//               {label === "Tasks" && <span className="nav-count">{tasks.length}</span>}
//               {activePage === label && <span className="active-indicator" />}
//             </button>
//           ))}
//         </nav>

//         <div className="nav-label nav-label-spaced">PREFERENCES</div>
//         <nav className="sidebar-nav">
//           <button className="nav-item" onClick={() => showNotice("Settings will be available in a future update.")}><Settings size={18} /><span>Settings</span></button>
//           <button className="nav-item" onClick={() => showNotice("Contact your service administrator for support.")}><CircleHelp size={18} /><span>Help & support</span></button>
//         </nav>

//         <div className="sidebar-spacer" />
//         <div className="sidebar-status">
//           <div className="status-line"><span className="status-dot" /> <strong>Console ready</strong></div>
//           <p>{tasksLoading ? "Syncing tasks…" : "Connected to IDICorp API"}</p>
//         </div>
//         <div className="sidebar-profile">
//           <div className="profile-avatar">AD</div>
//           <div className="profile-copy"><strong>{username || "Workspace user"}</strong><span>Signed in</span></div>
//           <IconButton label="Account options" onClick={handleLogout}><LogOut size={17} /></IconButton>
//         </div>
//       </aside>

//       <main className="main-panel">
//         <header className="topbar">
//           <div className="topbar-left">
//             <IconButton label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={21} /></IconButton>
//             <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{activePage}</strong></div>
//           </div>
//           <div className="topbar-right">
//             <div className="environment-badge"><span /> API CONNECTED</div>
//             <IconButton label="Notifications" onClick={() => showNotice("You're all caught up.")}><Bell size={19} /></IconButton>
//             <div className="topbar-avatar">AD</div>
//           </div>
//         </header>

//         <div className="page-content">
//           {renderPage()}
//           <footer className="page-footer">
//             <span>© 2026 IDICorp Service Console</span>
//             <span><ShieldCheck size={14} /> Internal tools · Secure workspace</span>
//           </footer>
//         </div>
//       </main>

//       {notice && (
//         <div className="toast" role="status"><CheckCircle2 size={18} /><span>{notice}</span><button aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={16} /></button></div>
//       )}

//       {showTaskForm && (
//         <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowTaskForm(false); }}>
//           <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
//             <div className="modal-heading">
//               <div><div className="eyebrow">TASK MANAGEMENT</div><h2 id="task-modal-title">{editingTask ? "Edit task" : "Create a task"}</h2></div>
//               <IconButton label="Close dialog" onClick={() => setShowTaskForm(false)}><X size={19} /></IconButton>
//             </div>
//             <form className="form-stack" onSubmit={saveTask}>
//               <label className="field-label" htmlFor="task-title">Title <span className="required-mark">*</span></label>
//               <input id="task-title" className="form-control" maxLength={120} value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="What needs to get done?" required autoFocus />
//               <div className="character-count">{taskTitle.length}/120 characters</div>
//               <label className="field-label" htmlFor="task-description">Description</label>
//               <textarea id="task-description" className="form-control textarea-control" maxLength={2000} rows={4} value={taskDescription} onChange={(event) => setTaskDescription(event.target.value)} placeholder="Add a few details (optional)" />
//               <div className="character-count">{taskDescription.length}/2000 characters</div>
//               <div className="modal-actions">
//                 <button type="button" className="button button-secondary" onClick={() => setShowTaskForm(false)}>Cancel</button>
//                 <button type="submit" className="button button-primary">{editingTask ? "Save changes" : "Create task"}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function ToolCard({ icon, color, title, description, onClick }) {
//   return (
//     <button className="tool-card" onClick={onClick}>
//       <div className={`large-tool-icon ${color}`}>{icon}</div>
//       <div className="tool-card-body"><h3>{title}</h3><p>{description}</p></div>
//       <div className="tool-card-arrow"><ArrowRight size={17} /></div>
//     </button>
//   );
// }

// function TaskList({ tasks, onToggle, onEdit, onDelete }) {
//   if (!tasks.length) {
//     return (
//       <div className="empty-state task-empty">
//         <div className="empty-icon"><Search size={23} /></div>
//         <h3>No tasks found</h3>
//         <p>Try changing your search or filter, or create a new task.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="task-list">
//       {tasks.map((task) => (
//         <div className="task-row" key={task.id}>
//           <button
//             type="button"
//             className={`task-checkbox ${task.completed ? "task-checkbox-checked" : ""}`}
//             aria-label={task.completed ? "Mark task as incomplete" : "Mark task as completed"}
//             aria-pressed={task.completed}
//             onClick={() => onToggle(task.id)}
//           >
//             {task.completed && <Check size={14} />}
//           </button>
//           <div className="task-main">
//             <div className={`task-name ${task.completed ? "task-name-completed" : ""}`}>{task.title}</div>
//             {task.description && <div className="task-description">{task.description}</div>}
//           </div>
//           <span className={`task-status ${task.completed ? "task-status-done" : "task-status-pending"}`}>
//             <span />{task.completed ? "Completed" : "In progress"}
//           </span>
//           <div className="task-actions">
//             <IconButton label="Edit task" onClick={() => onEdit(task)}><MoreHorizontal size={19} /></IconButton>
//             <IconButton label="Delete task" onClick={() => onDelete(task.id)}><Trash2 size={16} /></IconButton>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default App;

















import { useCallback, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

import LoginPage from "./pages/LoginPage.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import CalculatorPage from "./pages/CalculatorPage.jsx";
import EchoPage from "./pages/EchoPage.jsx";
import StreamEchoPage from "./pages/StreamEchoPage.jsx";

import DashboardLayout from "./layouts/DashboardLayout.jsx";
import { logout } from "./services/authService.js";

export default function App() {
  const [authenticated, setAuthenticated] = useState(
    Boolean(sessionStorage.getItem("access_token"))
  );

  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  const showNotice = useCallback((message, type = "error") => {
    setNotice(message);
    setNoticeType(type);
  }, []);

  function handleLogin() {
    setAuthenticated(true);
    setActivePage("overview");
    showNotice("Signed in successfully.", "success");
  }

  function handleLogout() {
    logout();
    setAuthenticated(false);
    setActivePage("overview");
    setSidebarOpen(false);
    setNotice("");
  }

  function handleNavigate(page) {
    setActivePage(page);
    setNotice("");
  }

  if (!authenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  let pageContent;

  switch (activePage) {
    case "tasks":
      pageContent = <TasksPage onNotice={showNotice} />;
      break;

    case "calculator":
      pageContent = <CalculatorPage onNotice={showNotice} />;
      break;

    case "echo":
      pageContent = <EchoPage onNotice={showNotice} />;
      break;

    case "stream":
      pageContent = <StreamEchoPage />;
      break;

    case "overview":
    default:
      pageContent = (
        <OverviewPage
          onNavigate={handleNavigate}
          onNotice={showNotice}
        />
      );
      break;
  }

  return (
    <>
      <DashboardLayout
        activePage={activePage}
        tasksCount={0}
        sidebarOpen={sidebarOpen}
        onNavigate={handleNavigate}
        onOpenNavigation={() => setSidebarOpen(true)}
        onCloseNavigation={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        onNotice={showNotice}
      >
        {pageContent}
      </DashboardLayout>

      {notice && (
        <div
          className={`app-notice ${noticeType === "error" ? "notice-error" : "notice-success"}`}
          role="status"
        >
          {noticeType === "success" && <CheckCircle2 size={18} />}
          <span>{notice}</span>
          <button
            type="button"
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
