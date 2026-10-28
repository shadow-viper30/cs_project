const profiles = {
  quick: [[21,'FTP'],[22,'SSH'],[23,'Telnet'],[80,'HTTP'],[443,'HTTPS'],[3306,'MySQL'],[5432,'PostgreSQL'],[8080,'HTTP Proxy']],
  web: [[80,'HTTP'],[443,'HTTPS'],[3000,'Node.js'],[4200,'Angular'],[5000,'Flask'],[8080,'HTTP Proxy']],
  full: [[21,'FTP'],[22,'SSH'],[23,'Telnet'],[25,'SMTP'],[53,'DNS'],[80,'HTTP'],[110,'POP3'],[143,'IMAP'],[443,'HTTPS'],[445,'SMB'],[3306,'MySQL'],[3389,'RDP'],[5432,'PostgreSQL'],[8080,'HTTP Proxy']]
};
const target = document.querySelector('#target');
const profile = document.querySelector('#profile');
const button = document.querySelector('#scanBtn');
const empty = document.querySelector('#emptyState');
const content = document.querySelector('#resultsContent');
const status = document.querySelector('#scanStatus');
const title = document.querySelector('#resultTitle');

function safeHost(value) { return value.trim().replace(/^https?:\/\//,'').replace(/\/.*$/,''); }
function hash(text) { return [...text].reduce((n,c) => ((n << 5) - n + c.charCodeAt(0)) | 0, 7); }
function scan() {
  const host = safeHost(target.value);
  if (!host) { target.focus(); target.placeholder = 'A target is required'; return; }
  const ports = profiles[profile.value];
  button.disabled = true; button.innerHTML = '<span class="scan-icon">◌</span> Scanning…';
  status.className = 'status scanning'; status.textContent = 'SCANNING';
  title.textContent = `Inspecting ${host}`;
  empty.hidden = false; content.hidden = true;
  setTimeout(() => {
    const seed = Math.abs(hash(host));
    const rows = ports.map(([port, service], i) => {
      const open = (seed + port * 13 + i) % 5 === 0 || (port === 443 && seed % 2 === 0);
      return `<tr><td>${port}</td><td>${service}</td><td>TCP</td><td><span class="state ${open ? 'open' : 'closed'}">${open ? 'OPEN' : 'CLOSED'}</span></td></tr>`;
    });
    const open = rows.filter((_,i) => (seed + ports[i][0] * 13 + i) % 5 === 0 || (ports[i][0] === 443 && seed % 2 === 0)).length;
    document.querySelector('#portRows').innerHTML = rows.join('');
    document.querySelector('#hostValue').textContent = host;
    document.querySelector('#openCount').textContent = open;
    document.querySelector('#checkedCount').textContent = ports.length;
    document.querySelector('#elapsed').textContent = `${(0.4 + ports.length * .09).toFixed(1)}s`;
    empty.hidden = true; content.hidden = false;
    status.className = 'status complete'; status.textContent = 'COMPLETE';
    title.textContent = `Results for ${host}`;
    button.disabled = false; button.innerHTML = '<span class="scan-icon">⌁</span> Start scan';
  }, 850);
}
button.addEventListener('click', scan);
target.addEventListener('keydown', e => { if (e.key === 'Enter') scan(); });
