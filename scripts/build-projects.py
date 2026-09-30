"""Build static, independently addressable portfolio case studies."""
from pathlib import Path
from html import escape
import re

ROOT = Path(__file__).resolve().parent.parent
projects = [
 dict(slug='courselect', title='CourSelect', category='Agentic AI / Academic advising', tagline='A better path\nto your next course.', repo='CJP-Hackathon/Hackathon', stack=['Python','Flask','CockroachDB','Gemini','AWS S3'], scope='Full-stack AI advising',
 summary='An academic advisor that connects a student’s goals, course history, and enrollment rules to a searchable university catalog.',
 stats=[('8,983','courses in the catalog'),('242','academic departments'),('4','response fallback tiers')],
 challenge='Course discovery is only half the problem. A useful recommendation also needs to respect prerequisites, a student’s major, and their completed academic history.',
 solution='A Flask application brings course browsing, advising, and enrollment together. Semantic retrieval finds relevant courses; the advisor uses student context and eligibility checks to explain the recommendations.',
 flow=[('Student goal','Academic context + intent'),('Retrieval','Vectors + eligibility'),('Advisor','Gemini → local → cloud'),('Persistence','CockroachDB + S3 reports')],
 features=[('Memory with a purpose','Five memory types keep conversations, student context, task state, vectors, and enrollment data together.'),('A response when models fail','The engine falls back from Gemini to Ollama, Mistral Cloud, and finally direct vector results.'),('Keep the slow work off the path','Parallel pre-fetching, two-level caching, and background S3 uploads reduce work on the response path.')],
 outcome='The repository documents a complete advising workflow: catalog exploration, contextual recommendations, enrollment, and protected historical records. Its search cache persists across application restarts.',
 reflection='The central engineering choice is graceful degradation: the catalog and retrieval layer remain useful even when a model provider is unavailable.',
 sources=[('README & architecture','README.md'),('Advisor engine','agent.py'),('System architecture PDF','ARCHITECTURE-3.pdf')]),
 dict(slug='hoosier-hub',title='Hoosier Hub',category='Backend / Campus community',tagline='A campus community,\nconnected by design.',repo='IU-HoosierHub/server',stack=['Java','Spring Boot','MongoDB','Docker','Maven'],scope='Social platform backend',
 summary='A REST API backend for an Indiana University social platform, connecting student profiles, posts, organizations, and conversations.',
 stats=[('REST','application API'),('JWT','authentication layer'),('MongoDB','document persistence')],
 challenge='A campus community needs more than a feed. Profiles, organizations, conversations, and post interactions need a coherent backend with clear responsibilities.',
 solution='Spring Boot controllers expose application features while services handle domain behavior and repositories manage MongoDB persistence. Separate models represent users, profiles, posts, pages, and messages.',
 flow=[('Clients','Student experiences'),('Controllers','Auth, feed, posts, chat'),('Services','Domain behavior'),('Repositories','MongoDB documents')],
 features=[('Community primitives','The code organizes posts, comments, likes, shares, profiles, and organization pages into dedicated features.'),('Authentication at the boundary','JWT authentication and authorization filters sit alongside the application security configuration.'),('A repeatable delivery path','Docker, Maven, and GitHub workflows provide build, test, and deployment structure.')],
 outcome='The public repository contains the backend foundation for a campus social network, including media services, search, feed APIs, and chat integration.',
 reflection='Clear controller, service, and repository boundaries make a growing social application easier to reason about as features multiply.',
 sources=[('Project overview','README.md'),('Application source','src/main/java/p566/hoosierhub/server'),('Build configuration','pom.xml')]),
 dict(slug='log-processing',title='Distributed Log Processing',category='Cloud / Event-driven systems',tagline='From noisy logs\nto queryable signals.',repo='nihal2405/CloudLogProcessing',stack=['Python','Azure Functions','Blob Storage','Azure SQL','pyodbc'],scope='Serverless log pipeline',
 summary='An event-driven Azure pipeline that splits uploaded log files, extracts errors from each chunk, and stores them for querying.',
 stats=[('2','Azure Functions'),('2','blob containers'),('SQL','structured error records')],
 challenge='Large log files are difficult to inspect as a single unit. Error records need to be separated from the raw text and stored in a form that can be queried.',
 solution='Uploading a file to the incoming container triggers a splitter. Each resulting chunk triggers a processor that parses log entries and inserts identified errors into Azure SQL.',
 flow=[('Incoming blob','Uploaded log file'),('Splitter','Create smaller chunks'),('Processor','Parse + identify errors'),('Azure SQL','Persist ErrorLogs')],
 features=[('Storage drives the workflow','Blob triggers connect incoming files to chunk creation, then chunk creation to processing.'),('Two focused functions','Splitting and parsing live in separate function directories so each step has a clear job.'),('A structured destination','The documented ErrorLogs schema stores a log identifier, original text, category, and creation time.')],
 outcome='The repository provides both functions, sample log files, a database schema, and Azure setup instructions for recreating the pipeline.',
 reflection='A storage event becomes a useful boundary: each stage works on a smaller artifact and hands the next stage a durable input.',
 sources=[('Pipeline documentation','README.md'),('Splitter function','splitter_function'),('Log processor','process_log_file')]),
 dict(slug='ipl-stories',title='Untold Stories of IPL',category='Data / Visual storytelling',tagline='Beyond the score.\nInto the story.',repo='nihal2405/IPL-STORY',stack=['Python','Pandas','Seaborn','Plotly','Matplotlib'],scope='Data analysis · Visualization · Report writing',
 summary='An exploratory study of IPL history that connects player consistency, playoff pressure, rivalry patterns, and franchise brand value.',
 stats=[('2008–2024','dataset coverage'),('7','visualization approaches'),('3','project contributors')],image='ipl-rivalries.png',alt='Two team-versus-opponent win percentage heatmaps from the published IPL report',caption='Rivalry heatmaps · Figures 13–14 from the published team report',
 challenge='Aggregate wins and title counts show what happened, but leave out the patterns behind long-term dominance, pressure, and fan loyalty.',
 solution='Match-level records, ball-by-ball data, and franchise brand values are explored through several visual forms. Each chart is chosen for a specific question rather than repeating the same ranking.',
 flow=[('Match data','Matches + deliveries'),('Preparation','Clean + align records'),('Analysis','Consistency + pressure'),('Storytelling','Charts + written report')],
 features=[('Consistency over time','Rose charts explore repeat top scorers; retention visualizations place continuity alongside team success.'),('Pressure and rivalries','Box plots compare league and playoff scoring, while heatmaps and chord diagrams reveal head-to-head patterns.'),('Performance and popularity','Line and bubble charts place brand value alongside competitive results without treating correlation as causation.')],
 outcome='The project publishes a Jupyter notebook and a detailed report. Sai Nihal’s credited contributions are data analysis, visualization, and report writing.',
 reflection='The project’s strongest shift is from leaderboard reporting to question-led analysis: a rivalry, a pressure situation, or a consistency pattern gives the data a narrative.',
 sources=[('Project overview & contributors','README.md'),('Published analysis report','DataVisualizationReport-Group7.pdf'),('Analysis notebook','FINAL DATAVIZ PRESENTATION-9.ipynb')]),
 dict(slug='bike-sales',title='Bike Sales Analysis',category='Dashboard / Excel',tagline='The patterns behind\na purchase.',repo='nihal2405/BIKE-SALES-DASHBOARD----EXCEL',stack=['Excel','Pivot charts','Slicers'],scope='Sales dashboard',
 summary='An Excel dashboard exploring bike purchases across demographic groups, income, commute distance, and regional filters.',
 stats=[('Excel','dashboard workspace'),('4','comparison views'),('3','slicer categories')],image='bike-sales.webp',alt='Published Excel bike sales dashboard with commute distance, income, age, and purchase comparisons',caption='Original dashboard screenshot published in the project README',
 challenge='Sales totals alone do not explain which groups purchase bikes or how commuting and income relate to demand.',
 solution='The workbook puts purchase comparisons in one place, with views for commute distance, average income, age brackets, and individual ages. Slicers narrow the view by marital status, education, and region.',
 flow=[('Sales records','Purchase + demographics'),('Pivot views','Group + compare'),('Slicers','Select a segment'),('Dashboard','Read demand patterns')],
 features=[('Compare buyers and non-buyers','Charts preserve the distinction between purchase outcomes across demographic dimensions.'),('Bring context into the view','Commute distance and average income sit beside age-based comparisons.'),('Explore a selected segment','Regional, education, and marital-status slicers support a narrower reading of the workbook.')],
 outcome='The GitHub README publishes both a dashboard preview and the Excel workbook, making the analysis available for further exploration.',
 reflection='The useful unit is a comparison: a dashboard becomes more informative when a visitor can compare purchase behavior within a specific segment.',
 extra=('Open Excel workbook','https://github.com/nihal2405/BIKE-SALES-DASHBOARD----EXCEL/files/13797878/Bike.sales.dashboard.xlsx'),sources=[('Dashboard & workbook','README.md')]),
 dict(slug='data-survey',title='Data Professional Survey',category='Dashboard / Power BI',tagline='The people\nbehind the data.',repo='nihal2405/DATA-PROFESSIONAL-SURVEY-DASHBOARD',stack=['Power BI','Survey analysis','Interactive reporting'],scope='Survey dashboard',
 summary='A Power BI view of data professionals’ careers, compensation, preferred languages, and satisfaction with work.',
 stats=[('630','survey respondents'),('29.87','average respondent age'),('Power BI','reporting platform')],image='data-survey.webp',alt='Published Data Professional Survey Breakdown dashboard showing salary, country, languages, and satisfaction',caption='Original Power BI screenshot · values reflect the published report view',
 challenge='Survey responses span roles, countries, preferences, and personal experiences. A useful overview must make these different dimensions easy to compare.',
 solution='The dashboard brings salary by job title, respondent geography, favorite programming languages, and difficulty entering the field into a single view, alongside work-life and salary satisfaction.',
 flow=[('Responses','Career survey data'),('Grouping','Role + country + language'),('Comparison','Pay + entry difficulty'),('Power BI','Interactive report')],
 features=[('Career comparisons','Job-title salary bars and language preferences give the career data an immediate reading order.'),('Who is represented','A country treemap and respondent count provide context for the survey population.'),('The experience of working in data','Satisfaction gauges and an entry-difficulty breakdown complement compensation figures.')],
 outcome='The project publishes the report link and a dashboard screenshot. The published view includes 630 respondents with an average age of 29.87.',
 reflection='Compensation is only one dimension of a career. Placing it beside satisfaction and entry difficulty makes the survey more useful to someone exploring the field.',
 extra=('Open Power BI report','https://app.powerbi.com/reportEmbed?reportId=94c4a5b8-2525-481c-ab64-9afcbfd1e733&autoAuth=true&ctid=b8593818-1c51-461d-ac9a-c1192e67c2dd'),sources=[('Dashboard & report link','README.md')]),
 dict(slug='airbnb',title='Airbnb Market Dashboard',category='Dashboard / Tableau',tagline='A market viewed\nfrom every angle.',repo='nihal2405/AIRBNB-DASHBOARD-USING-TABLEAU',stack=['Tableau','Geographic analysis','Dashboard design'],scope='Listing and pricing dashboard',
 summary='A Tableau dashboard bringing together bedroom pricing, listing counts, geographic differences, and a calendar-based revenue view.',
 stats=[('Tableau','visual analysis'),('ZIP codes','geographic comparison'),('2016','calendar view')],image='airbnb.png',alt='Published Tableau dashboard showing bedroom prices, Seattle ZIP codes, listing counts, and revenue over time',caption='Original Tableau dashboard screenshot published in the project README',
 challenge='A single average price hides the differences between property size, location, and time. Those dimensions need to be visible together.',
 solution='The dashboard pairs average price by bedroom count with a ZIP-code map and ranking. A listing-count view and annual revenue chart add supply and calendar context.',
 flow=[('Listings','Property + calendar data'),('Dimensions','Bedrooms + ZIP codes'),('Views','Price + supply + time'),('Tableau','Published dashboard')],
 features=[('Price by property size','Bedroom categories make it possible to compare different listing sizes.'),('Location at two scales','The map shows where ZIP codes sit; the ranking makes price differences easier to compare.'),('Add calendar context','The published revenue view traces changes across the year alongside the listing comparisons.')],
 outcome='The repository shares a dashboard screenshot and a Tableau Public link so visitors can continue exploring the original visual analysis.',
 reflection='Maps help orient a visitor, while ordered charts help compare values. Using both gives geography a practical role in the dashboard.',
 extra=('Open Tableau dashboard','https://public.tableau.com/views/Airbnbfullproject_17025714874480/Dashboard1'),sources=[('Dashboard & Tableau link','README.md')])
]

def e(value): return escape(str(value), quote=True)
def link(repo,path):
 return 'https://github.com/'+repo+('/blob/HEAD/' if '.' in path.rsplit('/',1)[-1] else '/tree/HEAD/')+path.replace(' ','%20')
def flow_markup(p):
 return '<div class="system-map" role="img" aria-label="'+e(' → '.join(x[0] for x in p['flow']))+'"><div class="map-label"><span>SYSTEM / '+e(p['slug'].upper())+'</span><span>01 → 04</span></div><div class="map-path">'+''.join('<div class="map-node"><small>0'+str(i+1)+'</small><strong>'+e(a)+'</strong><span>'+e(b)+'</span></div>' for i,(a,b) in enumerate(p['flow']))+'</div><div class="map-footer"><span>INPUT</span><i></i><span>OUTCOME</span></div></div>'

for idx,p in enumerate(projects):
 next_projects=[projects[(idx+1)%len(projects)], projects[(idx+2)%len(projects)]]
 media=('<figure class="case-media"><a href="../assets/projects/'+p['image']+'" target="_blank" aria-label="View full-size project image"><img src="../assets/projects/'+p['image']+'" alt="'+e(p['alt'])+'" fetchpriority="high"></a><figcaption>'+e(p['caption'])+' <span>View full size ↗</span></figcaption></figure>') if p.get('image') else flow_markup(p)
 stats=''.join('<div><strong>'+e(v)+'</strong><span>'+e(label)+'</span></div>' for v,label in p['stats'])
 features=''.join('<article><small>0'+str(i+1)+'</small><h3>'+e(a)+'</h3><p>'+e(b)+'</p></article>' for i,(a,b) in enumerate(p['features']))
 sources=''.join('<a href="'+e(link(p['repo'],path))+'" target="_blank" rel="noreferrer">'+e(label)+' ↗</a>' for label,path in p['sources'])
 extra=('<a class="case-button secondary" href="'+e(p['extra'][1])+'" target="_blank" rel="noreferrer">'+e(p['extra'][0])+' ↗</a>') if p.get('extra') else ''
 related=''.join('<a class="related-card" data-page-transition href="'+q['slug']+'.html"><span>'+e(q['category'])+'</span><h3>'+e(q['title'])+'</h3><p>'+e(q['tagline'].replace('\n',' '))+'</p><b aria-hidden="true">↗</b></a>' for q in next_projects)
 sections=[('overview','Overview'),('challenge','Challenge'),('solution','Solution'),('engineering','Build details'),('outcome','Outcome'),('reflection','Reflection')]
 nav=''.join('<a href="#'+id+'">'+label+'</a>' for id,label in sections)
 html=f'''<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="{e(p['summary'])}"><title>{e(p['title'])} — Sai Nihal Konduti</title><link rel="icon" href="../favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="../project.css?v=4"><script src="../transitions.js?v=1"></script><link rel="stylesheet" href="../theme.css?v=4"><script src="../theme.js?v=1"></script></head>
<body><div class="paper-grain" aria-hidden="true"></div><a class="skip-link" href="#case-main">Skip to project</a><div class="page-wipe" aria-hidden="true"><span>SN <i>Selected work</i></span></div>
<header class="case-header"><a class="case-wordmark" data-page-transition href="../index.html#work" aria-label="Back to Sai Nihal’s portfolio">SN</a><span>SAI NIHAL KONDUTI</span><a data-page-transition href="../index.html#contact">Let’s talk ↗</a><button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark mode" aria-pressed="false">☾</button></header>
<div class="case-layout"><aside class="case-sidebar"><a class="back-link" data-page-transition href="../index.html#work">← All projects</a><p>CASE STUDY / {idx+1:02d}</p><nav aria-label="Case study sections">{nav}</nav><a class="source-link" href="https://github.com/{e(p['repo'])}" target="_blank" rel="noreferrer">View repository ↗</a></aside>
<main id="case-main"><section id="overview" class="case-overview"><p class="eyebrow">{e(p['category'])}</p><h1>{e(p['title'])}</h1><p class="case-tagline">{e(p['tagline']).replace(chr(10),'<br>')}</p><div class="case-meta"><div><small>FOCUS</small><span>{e(p['scope'])}</span></div><div><small>STACK</small><span>{e(' · '.join(p['stack']))}</span></div><div><small>PROJECT</small><span>Public GitHub repository</span></div></div>{media}<div class="case-stats">{stats}</div><p class="case-lead">{e(p['summary'])}</p></section>
<section id="challenge" class="case-section"><span class="section-no">01 / THE CHALLENGE</span><h2>{e(['Recommendations need context.','A community is more than a feed.','Make large logs manageable.','The scoreboard is only the beginning.','Understand who buys, and why.','Make a broad survey readable.','One average cannot explain a market.'][idx])}</h2><p>{e(p['challenge'])}</p></section>
<section id="solution" class="case-section"><span class="section-no">02 / THE SOLUTION</span><h2>A deliberate path through the problem.</h2><p>{e(p['solution'])}</p>{flow_markup(p) if p.get('image') else '<div class="stack-chips">'+''.join('<span>'+e(t)+'</span>' for t in p['stack'])+'</div>'}</section>
<section id="engineering" class="case-section"><span class="section-no">03 / BUILD DETAILS</span><h2>The choices that shape the work.</h2><div class="feature-grid">{features}</div></section>
<section id="outcome" class="case-section"><span class="section-no">04 / OUTCOME</span><h2>What the project delivers.</h2><p>{e(p['outcome'])}</p><div class="case-actions"><a class="case-button" href="https://github.com/{e(p['repo'])}" target="_blank" rel="noreferrer">Explore the project ↗</a>{extra}</div><div class="case-sources"><small>FROM THE REPOSITORY</small>{sources}</div></section>
<section id="reflection" class="case-section case-reflection"><span class="section-no">05 / DESIGN &amp; ENGINEERING TAKEAWAY</span><h2>{e(['Resilience is part of the product.','Boundaries make room for growth.','Let events carry the work.','Start with a better question.','Give each segment a voice.','A career is more than a salary.','Orient first. Compare second.'][idx])}</h2><p>{e(p['reflection'])}</p></section>
<section class="related-section"><span class="section-no">KEEP EXPLORING</span><div class="related-grid">{related}</div></section><footer class="case-footer"><span>© 2026 Sai Nihal Konduti</span><a data-page-transition href="../index.html#work">Back to selected work ↑</a></footer></main></div></body></html>'''
 (ROOT/'projects'/f"{p['slug']}.html").write_text(html)

# Change only project destinations; homepage design and content stay intact.
path=ROOT/'index.html'; html=path.read_text()
for p in projects:
 url='https://github.com/'+p['repo']
 html=html.replace('href="'+url+'" target="_blank" rel="noreferrer"','href="projects/'+p['slug']+'.html" data-page-transition')
html=html.replace('</head>','<link rel="stylesheet" href="transitions.css?v=1"><script src="transitions.js?v=1"></script></head>') if 'transitions.css' not in html else html
if 'class="page-wipe"' not in html:
 html=html.replace('<body>', '<body><div class="page-wipe" aria-hidden="true"><span>SN <i>Selected work</i></span></div>', 1)
path.write_text(html)
