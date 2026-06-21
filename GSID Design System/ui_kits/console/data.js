// GSID console — sample data (plain globals; no build step)
window.GSID_DATA = {
  regions: ['Africa', 'Asia', 'Latin America'],
  sources: [
    { name: 'OpenAlex', type: 'api', health: 'online', count: '8,902', desc: 'Open API · primary author discovery' },
    { name: 'DOAJ', type: 'api', health: 'online', count: '1,205', desc: 'Open API · open-access journal metadata' },
    { name: 'Zenodo', type: 'api', health: 'online', count: '640', desc: 'Open API · datasets & preprints' },
    { name: 'AJOL', type: 'scrape', health: 'degraded', count: '2,140', desc: 'Ethical scrape · African Journals OnLine' },
    { name: 'NJOL', type: 'scrape', health: 'offline', count: '0', desc: 'Ethical scrape · Nigerian Journals OnLine' },
  ],
  agents: [
    { name: 'API Harvester', role: 'OpenAlex · Zenodo · DOAJ', icon: 'bot', state: 'done', detail: '10,747 records', progress: 100 },
    { name: 'Ethical Scraper', role: 'AJOL · NJOL', icon: 'globe', state: 'running', detail: 'page 14 / 60 · 3s delay', progress: 42 },
    { name: 'Data Synthesizer', role: 'Standardise → dedupe → CSV', icon: 'file-spreadsheet', state: 'idle', detail: 'waiting for upstream', progress: null },
  ],
  runs: [
    { id: 'r-2061', region: 'Africa', disciplines: 'Public health', status: 'running', profiles: '4,210', started: '12 min ago', source: 'All sources' },
    { id: 'r-2060', region: 'Latin America', disciplines: 'Climate science', status: 'done', profiles: '3,118', started: 'Today, 09:14', source: 'API only' },
    { id: 'r-2059', region: 'Asia', disciplines: 'Agronomy', status: 'done', profiles: '5,519', started: 'Yesterday', source: 'All sources' },
    { id: 'r-2058', region: 'Africa', disciplines: 'All disciplines', status: 'failed', profiles: '—', started: 'Yesterday', source: 'AJOL only' },
  ],
  researchers: [
    { name: 'Amina Okeke', email: 'a.okeke@unilag.edu.ng', inst: 'University of Lagos', region: 'Africa', country: 'Nigeria', field: 'Public health', source: 'OpenAlex', verified: true },
    { name: 'Luis Mendoza', email: 'lmendoza@usp.br', inst: 'Universidade de São Paulo', region: 'Latin America', country: 'Brazil', field: 'Climate science', source: 'OpenAlex', verified: true },
    { name: 'Priya Nair', email: 'priya.nair@iisc.ac.in', inst: 'Indian Institute of Science', region: 'Asia', country: 'India', field: 'Agronomy', source: 'DOAJ', verified: true },
    { name: 'Kwame Mensah', email: 'kmensah@ug.edu.gh', inst: 'University of Ghana', region: 'Africa', country: 'Ghana', field: 'Public health', source: 'AJOL', verified: false },
    { name: 'Fatima Zahra', email: 'f.zahra@um5.ac.ma', inst: 'Mohammed V University', region: 'Africa', country: 'Morocco', field: 'Climate science', source: 'OpenAlex', verified: true },
    { name: 'Carlos Rivera', email: 'crivera@unam.mx', inst: 'UNAM', region: 'Latin America', country: 'Mexico', field: 'Agronomy', source: 'Zenodo', verified: true },
    { name: 'Thandiwe Dlamini', email: 't.dlamini@wits.ac.za', inst: 'University of the Witwatersrand', region: 'Africa', country: 'South Africa', field: 'Public health', source: 'OpenAlex', verified: true },
    { name: 'Anh Nguyen', email: 'anh.nguyen@vnu.edu.vn', inst: 'Vietnam National University', region: 'Asia', country: 'Vietnam', field: 'Climate science', source: 'DOAJ', verified: false },
    { name: 'Ngozi Eze', email: 'ngozi.eze@unn.edu.ng', inst: 'University of Nigeria', region: 'Africa', country: 'Nigeria', field: 'Agronomy', source: 'AJOL', verified: true },
    { name: 'Sofía Castro', email: 'scastro@uchile.cl', inst: 'Universidad de Chile', region: 'Latin America', country: 'Chile', field: 'Public health', source: 'OpenAlex', verified: true },
  ],
  disciplines: ['All disciplines', 'Public health', 'Agronomy', 'Climate science', 'Economics', 'Engineering'],
};
