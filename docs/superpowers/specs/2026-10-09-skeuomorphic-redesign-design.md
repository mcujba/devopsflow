# DevOpsFlow — redesign skeuomorfic „rack din email crem” (spec de design)

Data: 2026-10-09 · Branch: `feat/skeuomorphic` (pornit din `fix/contact-captcha`) · Stare: în așteptarea revizuirii

Referință vizuală aprobată: `docs/superpowers/specs/2026-10-09-skeuomorphic-mockup.html` (se deschide direct în browser).

## 1. Scop

Înlocuiește stratul vizual, layout-ul și o parte din texte, astfel încât site-ul să arate ca un obiect real, făcut cu intenție, nu ca un șablon generat.

- **Obiectul**: un rack cu module stivuite. Fiecare secțiune a paginii este un modul.
- **Materialul**: email crem, text în relief (letterpress), negru de cerneală, un singur accent roșu. Fundalul din spatele modulelor e închis.
- **Realism**: complet pe rame, antet, afișaj, porturi, taste și butoane. Zonele de citit rămân plate.

Rămân neschimbate: URL-urile, redirecturile, SEO-ul tehnic (`src/lib/seo.ts`, sitemap, robots, JSON-LD), acțiunea de server a formularului, logica de captcha, `src/lib/blog.ts`, pipeline-ul de deploy.

## 2. Ce se elimină din designul actual

Gradientul roz-violet și textul în gradient, strălucirea din hero, fereastra de cod, bara verticală de navigare, butoanele tip pastilă, grilele de carduri identice, fontul Inter Tight, comutatorul light/dark.

**Interzis și în noul design**: text în gradient, glassmorphism, strălucire difuză pe carduri, emoji ca iconițe, mai mult de un accent de culoare.

## 3. Sistem vizual

### Culori (o singură temă)

| Token | Valoare | Folosire |
|---|---|---|
| `desk` | `#23282b` | Fundalul paginii, cu zgomot fin |
| `enamel` | `#ece5d5` (gradient `#f3eddf → #e4dccb`) | Suprafața modulelor |
| `paper` | `#fbf8f0` | Fișe, zone de citit |
| `well` | `#d7cfbd` | Adâncituri (tava de fișe, câmpuri) |
| `ink` | `#2b2722` | Text principal |
| `ink-muted` | `#5f574b` | Etichete, text secundar |
| `red` | `#b5391f` | Singurul accent: un cuvânt din titlu, etichete de secțiune, LED-uri, tasta de contact |
| `lcd` | `#c9cdb6` cu text `#1f2318` | Afișajul |
| `socket` | `#121416` | Porturi, găuri de montaj |

Tot textul respectă contrast AA (4.5:1) față de suprafața pe care stă.

### Tipografie

| Rol | Font | Unde |
|---|---|---|
| Titluri | Playfair Display 700 (italic 500 pentru accent) | H1, H2, titluri de fișe |
| Text și etichete | Jost 400/500/600 | Paragrafe, etichete cu majuscule spațiate |
| Tehnic | IBM Plex Mono 400/500 | Afișaj LCD, taste, date, cod |

Toate trei au diacritice românești și chirilice. Se încarcă prin `next/font/google`; se preîncarcă doar subsetul latin al fontului de titluri.

### Reguli de material

- **Relief**: textul pe email are o umbră deschisă de 1px dedesubt (`0 1px 0 rgba(255,255,255,.8)`).
- **Ridicat** (taste, sloturi, fișe): muchie luminată sus, umbră scurtă jos.
- **Adâncit** (LCD, porturi, câmpuri, tava): umbră interioară sus.
- **Apăsare**: elementele apăsabile coboară 2px și își pierd umbra de jos la `:active`.
- **Focus**: contur de 2px în `ink`, cu decalaj de 2px, pe toate elementele interactive.
- **Contur real**: fiecare control are și o bordură de 1px, ca să rămână vizibil în `forced-colors`.
- **Textură**: un singur zgomot SVG inline (sub 1 KB), în două intensități. Fără fișiere imagine pentru texturi.
- **Mișcare**: doar tranziții scurte la apăsare și hover; dezactivate sub `prefers-reduced-motion`.

Umbrele și suprafețele se definesc o singură dată, ca tokenuri și clase în `globals.css` (`unit`, `raised`, `inset`, `key`, `key-red`, `lcd`, `socket`, `led`, `engraved`, `label-red`).

## 4. Layout

Pagina e o coloană de module cu lățime maximă de 1100px, pe fundalul `desk`. Pe ecrane late, fiecare modul are urechi de montaj cu câte două găuri; sub 1024px urechile dispar.

### Antetul (în primul modul al fiecărei pagini)

O bandă cu: marca „DevOpsFlow” gravată, patru linkuri de navigare cu LED (Services, About, Blog, Contact) și trei taste de limbă (EN, RO, RU), cea activă apăsată. LED-ul unui link se aprinde la hover și focus. Pe telefon, linkurile trec pe un al doilea rând; nu mai există meniu lateral.

### Home — șase module

1. **Panoul frontal**: rolul și numele, H1 cu un cuvânt în roșu, o frază, afișajul LCD cu cele patru cifre, rândul de opt porturi (linkuri spre servicii) și tasta roșie de contact.
2. **Servicii** (`#services`): panou de patch, opt sloturi cu port, titlu și o frază; fiecare slot e link spre pagina serviciului.
3. **Despre** (`#about`): fotografia într-o ramă de ecuson, textul și parcursul prescurtat ca rânduri de registru.
4. **Proces** (`#process`): patru pași numerotați, ca etichete ștanțate.
5. **Blog** (`#blog`): tava cu cele mai recente trei articole în limba curentă, ca fișe; link spre toate articolele. Dacă nu există articole în acea limbă, modulul nu se afișează.
6. **Contact** (`#contact`): datele de contact și formularul. Câmpurile sunt adâncituri, butonul de trimitere e tasta roșie, captcha rămâne cum e.

Sub module: subsolul, direct pe `desk`, cu text crem.

### Pagini interioare

- **Serviciu**: antet compact, apoi un modul cu portul serviciului, titlu, descriere, cele patru funcții ca listă și uneltele ca etichete; la final trei sloturi spre alte servicii și tasta de contact.
- **About**: aceleași secțiuni ca acum, fiecare într-un modul; textul lung stă pe `paper`.
- **Blog (listă)**: tava cu toate fișele.
- **Articol**: un modul cu titlu și date, apoi o foaie `paper` plată, lată de cel mult 70 de caractere, pentru text. Blocurile de cod au fundal închis (`socket`).
- **404**: un modul cu LCD-ul afișând „404” și tasta spre Home.

## 5. Texte

Se rescriu în EN, RO și RU:

- **Hero**: „Infrastructure that stays up, deploys that ship *faster*.”, cu rolul și numele deasupra.
- **Etichetele afișajului**: UPTIME SLA, REQ / DAY, YEARS, DEPLOY TIME (traduse; în RU cu chirilice).
- **Etichetele porturilor**: forme scurte ale celor opt servicii.
- **Titlurile de secțiune**, trecute la persoana întâi, ca să se potrivească cu „un inginer senior, nu o agenție”: „What I do”, „How I work”, „From the blog”.
- **Texte noi** pentru modulul de blog și pentru antet.

Cifrele rămân exact cele patru confirmate: 10+, 10M+, 60%, 99.9%. „DEPLOY TIME −60 %” este aceeași cifră ca „60% faster deployments”. Nu se adaugă clienți, testimoniale sau alte cifre. Restul textelor (About, descrierile lungi de servicii, articolele) rămân.

## 6. Blog, pentru trafic

- Modulul de pe Home aduce articolele în prima pagină; sitemap-ul le include deja automat.
- Se adaugă `docs/blog-authoring.md`: cum se adaugă un articol (numele fișierului `{slug}.{limbă}.mdx`, câmpurile din antet, cum se verifică local, ce se întâmplă dacă lipsește o limbă).

În afara scopului: panou de administrare, CMS, RSS, articole noi.

## 7. Arhitectură tehnică

- Stack neschimbat. **Dependențe noi: niciuna.**
- **Se elimină**: `next-themes` (o singură temă), `theme-provider.tsx`, `theme-toggle.tsx`, `side-rail.tsx`, `top-bar.tsx`, `ui/sheet.tsx`, `sections/code-window.tsx`, `sections/proof.tsx` (cifrele trec în afișaj), `tw-animate-css` dacă nu mai e folosit de nimic.
- **Componente client rămase**: comutatorul de limbă și formularul de contact.
- **Unități noi**:

| Unitate | Rol |
|---|---|
| `components/rack/unit.tsx` | Rama unui modul, cu urechi; primește `id` și conținut |
| `components/rack/faceplate-strip.tsx` | Antetul: marcă, navigare cu LED, taste de limbă |
| `components/rack/lcd.tsx` | Afișajul cu perechi etichetă–valoare |
| `components/rack/port.tsx` | Un port, simplu sau ca link etichetat |
| `components/sections/blog-tray.tsx` | Fișele celor mai recente articole |

- Secțiunile existente (`hero`, `services`, `about-teaser`, `process`, `contact`, `cta-band`, componentele de serviciu, About, blog, 404) se rescriu peste aceste unități.
- Evidențierea de cod Shiki trece pe o singură temă închisă.
- Imaginea Open Graph se redesenează în noul stil (crem, serif, roșu).

## 8. Accesibilitate

- Porturile, LED-urile, găurile și zgomotul sunt decorative (`aria-hidden`); linkurile au text vizibil.
- Afișajul LCD e o listă de descriere (`dl`) reală, citibilă de cititoare de ecran.
- Un singur `h1` pe pagină; modulele au `h2`.
- Ținte de atingere de cel puțin 44px pentru taste și linkurile din antet.
- Etichetele de navigare și de limbă rămân traduse.

## 9. Criterii de acceptare

- `npm run type-check`, `npm run lint`, `npm test` trec; testele sunt actualizate pentru noile componente.
- Lighthouse mobil pe build de producție local: Accessibility 100; Performance cel puțin 91 pe Home, About și o pagină de serviciu; CLS sub 0.05.
- Fără derulare orizontală la 360px lățime, în EN, RO și RU.
- Conținutul Home e complet în HTML fără JavaScript.
- Formularul trimite și captcha apare la încărcare directă și după navigare în site.
- Sub `forced-colors: active`, butoanele și câmpurile au contur vizibil.
- Build Docker reușit; scanarea Trivy fără probleme HIGH/CRITICAL.
- În cod nu mai apare niciun element din lista „interzis” (secțiunea 2).

## 10. În afara scopului

Temă light/dark, starea „pagină activă” în navigare, CMS sau panou de administrare, RSS, articole noi, schimbări la SEO tehnic, la pipeline sau la acțiunea de server a formularului.

## 11. Livrare

Totul pe `feat/skeuomorphic`, cu Pull Request spre `main`. Branch-ul pornește din `fix/contact-captcha` (PR #3, încă deschis), deci PR-ul nou îl include; dacă #3 e unit între timp, se face rebase pe `main`. Fără merge și fără deploy fără confirmarea proprietarului.
