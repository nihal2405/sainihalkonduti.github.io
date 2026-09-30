const experiences = [
  {date:"June 2026 — Present",place:"Irvine, CA · Remote",role:"Software Engineer (AI)",company:"Infoswift Corp.",summary:"Built a secure, full-stack insurance quote portal for real-time visibility into RPA workflows across multiple carriers.",detail:"Centralized operations for 100+ agents, reduced manual status inquiries by 80%, implemented a Backend-for-Frontend identity architecture with Entra External ID and MSAL-Node, and automated zero-downtime user provisioning with Azure Cosmos DB.",metric:"80%",metricLabel:"fewer inquiries"},
  {date:"Jan 2026 — May 2026",place:"Bloomington, Indiana",role:"Research Assistant",company:"Indiana University Bloomington",summary:"Engineered an obstetric triage classifier with 94.0% clinical safety accuracy and 93.5% F1.",detail:"Built a gated RAG architecture, curated 788 patient scenarios, and deployed a private 4-bit quantized Llama 3 8B model on HPC clusters using LoRA.",metric:"94.0%",metricLabel:"clinical safety"},
  {date:"Sep 2025 — Dec 2025",place:"Irvine, CA · Remote",role:"Software Engineer (AI)",company:"Infoswift Corp.",summary:"Built an asynchronous Azure ETL pipeline to parallelize Gemini inference across 20,000+ files.",detail:"Secured data isolation for 100+ tenants, maintained 99.9% uptime, and reached 90% extraction accuracy while cutting processing latency from 15 minutes to 30 seconds.",metric:"98%",metricLabel:"less latency"},
  {date:"Jun 2025 — Aug 2025",place:"Glenview, IL · On-site",role:"AI Engineer",company:"Zion Cloud Solutions (ZionAI)",summary:"Deployed distributed systems on Vertex AI to improve Q&A reasoning and reduce review latency.",detail:"Benchmarked prompts across 50+ repositories, fine-tuned Llama 3 8B with LoRA, and built type-safe validation for more than 10,000 concurrent records.",metric:"30%",metricLabel:"faster review"},
  {date:"May 2023 — Jun 2024",place:"Hyderabad, India · On-site",role:"Software Engineer (AWS)",company:"Infoswift Corp.",summary:"Moved manual releases to automated CI/CD with AWS CodePipeline and GitHub Actions.",detail:"Reduced build times from 20 minutes to under two, cut cloud costs by 20%, improved incident response by 50%, and monitored 15+ production servers.",metric:"90%",metricLabel:"faster releases"}
];

const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
let reduceMotion = motionPreference.matches;
document.body.classList.toggle("motion-enabled", !reduceMotion);

const detail = {
  date: document.querySelector("#exp-date"), place: document.querySelector("#exp-place"), role: document.querySelector("#exp-role"), company: document.querySelector("#exp-company"), summary: document.querySelector("#exp-summary"), body: document.querySelector("#exp-detail"), metric: document.querySelector("#exp-metric"), metricLabel: document.querySelector("#exp-metric-label")
};
function showExperience(index) {
  const item = experiences[index]; if (!item) return;
  detail.date.textContent=item.date; detail.place.textContent=item.place; detail.role.textContent=item.role; detail.company.textContent=item.company; detail.summary.textContent=item.summary; detail.body.textContent=item.detail; detail.metric.textContent=item.metric; detail.metricLabel.textContent=item.metricLabel;
  document.querySelectorAll("[data-experience]").forEach((button,i)=>{button.classList.toggle("is-active",i===index);button.setAttribute("aria-selected",String(i===index));});
  const card=document.querySelector(".experience-detail");
  if (!reduceMotion) card.animate([{opacity:.35,transform:"translateX(14px)"},{opacity:1,transform:"none"}],{duration:350,easing:"ease-out"});
}
document.querySelectorAll("[data-experience]").forEach(button=>button.addEventListener("click",()=>showExperience(Number(button.dataset.experience)))); showExperience(0);

const menuButton=document.querySelector(".menu-button"), nav=document.querySelector(".site-nav");
menuButton?.addEventListener("click",()=>{const open=nav.classList.toggle("is-open");menuButton.setAttribute("aria-expanded",String(open));});
nav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("is-open");menuButton?.setAttribute("aria-expanded","false");}));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll(".reveal:not(.visible)").forEach(item=>revealObserver.observe(item));

// Cursor has a native fallback and only animates while it is moving.
const finePointer = matchMedia("(pointer: fine)");
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, cursorFrame = 0;
const canAnimate = () => finePointer.matches && !reduceMotion;
function renderCursor() {
  ringX += (mouseX - ringX) * .2;
  ringY += (mouseY - ringY) * .2;
  ring.style.transform = `translate3d(${ringX}px,${ringY}px,0) translate(-50%,-50%)`;
  cursorFrame = Math.abs(mouseX-ringX) + Math.abs(mouseY-ringY) > .1 ? requestAnimationFrame(renderCursor) : 0;
}
document.addEventListener("pointermove", event => {
  if (!canAnimate() || event.pointerType === "touch") return;
  mouseX = event.clientX; mouseY = event.clientY;
  if (!document.body.classList.contains("cursor-ready")) { ringX = mouseX; ringY = mouseY; }
  document.body.classList.add("cursor-ready");
  dot.style.transform = `translate3d(${mouseX}px,${mouseY}px,0) translate(-50%,-50%)`;
  if (!cursorFrame) cursorFrame = requestAnimationFrame(renderCursor);
}, {passive:true});
function hideCursor() { document.body.classList.remove("cursor-ready"); cancelAnimationFrame(cursorFrame); cursorFrame = 0; }
document.documentElement.addEventListener("pointerleave", hideCursor);
addEventListener("blur", hideCursor);
document.addEventListener("keydown", event => { if (event.key === "Tab") hideCursor(); });
document.querySelectorAll("a,button,[data-tilt]").forEach(item => {
  item.addEventListener("pointerenter", () => {
    ring.classList.add("is-hovering");
    const project = item.matches(".project-panel,.dashboard-card");
    ring.classList.toggle("is-project", project); dot.classList.toggle("is-project", project);
  });
  item.addEventListener("pointerleave", () => { ring.classList.remove("is-hovering","is-project"); dot.classList.remove("is-project"); });
});

// Floating photo and magnetic calls to action, always anchored to their layout.
document.querySelectorAll("[data-tilt]").forEach(card => {
  card.addEventListener("pointermove", event => {
    if (!canAnimate()) return;
    const rect = card.parentElement.getBoundingClientRect();
    const x = Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));
    const y = Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1));
    card.style.transform = `rotate(2deg) rotateX(${-y*6}deg) rotateY(${x*8}deg) translateY(-7px)`;
  });
  card.addEventListener("pointerleave", () => card.style.removeProperty("transform"));
});
document.querySelectorAll("[data-magnetic]").forEach(button => {
  button.addEventListener("pointermove", event => {
    if (!canAnimate()) return;
    const rect = button.getBoundingClientRect();
    button.style.transform = `translate(${(event.clientX-rect.left-rect.width/2)*.12}px,${(event.clientY-rect.top-rect.height/2)*.2}px)`;
  });
  button.addEventListener("pointerleave", () => button.style.removeProperty("transform"));
});

// One scroll update per frame, with a progress line and active section links.
const header = document.querySelector(".site-header");
let scrollFrame = 0;
function updateScroll() {
  const max = document.documentElement.scrollHeight-innerHeight;
  header.style.setProperty("--scroll-progress", max > 0 ? scrollY/max : 0);
  header.classList.toggle("is-scrolled", scrollY > 30);
  scrollFrame = 0;
}
addEventListener("scroll", () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); },{passive:true});
addEventListener("resize", updateScroll); updateScroll();
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) {
    nav.querySelectorAll('a[href^="#"]').forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current","location");
      else link.removeAttribute("aria-current");
    });
  }});
}, {rootMargin:"-15% 0px -65% 0px"});
document.querySelectorAll("main > section[id]").forEach(section=>sectionObserver.observe(section));

// Count each metric once as it enters the viewport.
const countObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  countObserver.unobserve(entry.target);
  const node = entry.target, end = Number(node.dataset.count), suffix = node.dataset.suffix || "";
  if (reduceMotion) return;
  const start = performance.now();
  function count(now) {
    const progress = Math.min(1,(now-start)/1100);
    node.textContent = `${Math.round(end*(1-Math.pow(1-progress,3)))}${suffix}`;
    if (progress < 1 && !reduceMotion) requestAnimationFrame(count);
    else node.textContent = `${end}${suffix}`;
  }
  requestAnimationFrame(count);
}),{threshold:.7});
document.querySelectorAll("[data-count]").forEach(node=>countObserver.observe(node));

// Complete keyboard semantics for the experience tabs.
const experienceTabs = [...document.querySelectorAll("[data-experience]")];
const experiencePanel = document.querySelector(".experience-detail");
experiencePanel.id = "experience-panel"; experiencePanel.setAttribute("role","tabpanel");
experiencePanel.tabIndex = 0;
experienceTabs.forEach((tab,index) => {
  tab.id = `experience-tab-${index}`; tab.setAttribute("aria-controls","experience-panel");
  tab.tabIndex = index === 0 ? 0 : -1;
  tab.addEventListener("click",()=>syncTabs(index));
  tab.addEventListener("keydown",event=>{
    let next;
    if (["ArrowDown","ArrowRight"].includes(event.key)) next = (index+1)%experienceTabs.length;
    if (["ArrowUp","ArrowLeft"].includes(event.key)) next = (index-1+experienceTabs.length)%experienceTabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = experienceTabs.length-1;
    if (next !== undefined) { event.preventDefault(); showExperience(next); syncTabs(next); experienceTabs[next].focus(); }
  });
});
function syncTabs(index) {
  experienceTabs.forEach((tab,i)=>tab.tabIndex=i===index?0:-1);
  experiencePanel.setAttribute("aria-labelledby",`experience-tab-${index}`);
}
syncTabs(0);
document.addEventListener("keydown",event=>{
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    nav.classList.remove("is-open"); menuButton.setAttribute("aria-expanded","false"); menuButton.focus();
  }
});
motionPreference.addEventListener("change",event=>{
  reduceMotion=event.matches; document.body.classList.toggle("motion-enabled",!reduceMotion);
  if (reduceMotion) { hideCursor(); document.querySelectorAll("[data-tilt],[data-magnetic]").forEach(item=>item.style.removeProperty("transform")); }
});

// Restore the original orbital field, using its stable wrapper for pointer coordinates.
const orbitalField = document.querySelector(".orbital-field");
const orbitalSystem = orbitalField?.querySelector(".system-object");
let orbitX = 0, orbitY = 0, orbitTargetX = 0, orbitTargetY = 0, orbitFrame = 0;
function animateOrbitField() {
  orbitX += (orbitTargetX-orbitX)*.12;
  orbitY += (orbitTargetY-orbitY)*.12;
  orbitalSystem.style.transform = `translate3d(${orbitX}px,${orbitY}px,0)`;
  orbitFrame = Math.abs(orbitTargetX-orbitX)+Math.abs(orbitTargetY-orbitY) > .1 ? requestAnimationFrame(animateOrbitField) : 0;
}
orbitalField?.addEventListener("pointermove",event=>{
  if (!canAnimate() || event.pointerType === "touch") return;
  const rect = orbitalField.getBoundingClientRect();
  orbitTargetX = (event.clientX-rect.left-rect.width/2)*.12;
  orbitTargetY = (event.clientY-rect.top-rect.height/2)*.12;
  if (!orbitFrame) orbitFrame = requestAnimationFrame(animateOrbitField);
});
orbitalField?.addEventListener("pointerleave",()=>{
  orbitTargetX = orbitTargetY = 0;
  if (!orbitFrame && !reduceMotion) orbitFrame = requestAnimationFrame(animateOrbitField);
});
motionPreference.addEventListener("change",()=>{
  if (reduceMotion && orbitalSystem) {
    cancelAnimationFrame(orbitFrame); orbitFrame = 0;
    orbitX = orbitY = orbitTargetX = orbitTargetY = 0;
    orbitalSystem.style.removeProperty("transform");
  }
});
